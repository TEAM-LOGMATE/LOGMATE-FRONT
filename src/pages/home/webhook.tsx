import { useState } from 'react';
import { api } from '../../api/axiosInstance';
import ErrorToast from '../../components/text/error-toast';

export default function WebhookManager() {
  const [type, setType] = useState('SLACK');
  const [url, setUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorTrigger, setErrorTrigger] = useState(0);

  // URL 검증 함수
  const validateUrl = (type: string, url: string) => {
    if (type === 'SLACK' && !url.startsWith('https://hooks.slack.com/')) {
      return 'Slack Webhook URL은 https://hooks.slack.com/ 으로 시작해야 합니다.';
    }
    if (type === 'DISCORD' && !url.startsWith('https://discord.com/api/webhooks/')) {
      return 'Discord Webhook URL은 https://discord.com/api/webhooks/ 으로 시작해야 합니다.';
    }
    if (type === 'CUSTOM' && !/^https?:\/\//.test(url)) {
      return 'Custom Webhook URL은 http:// 또는 https:// 로 시작해야 합니다.';
    }
    return null;
  };

  const handleAddWebhook = async () => {
    if (!url.trim()) return;

    const validationError = validateUrl(type, url);
    if (validationError) {
      setErrorMessage(validationError);
      setErrorTrigger((t) => t + 1);
      return;
    }

    try {
      const res = await api.post('/api/webhooks', { type, url });
      setErrorMessage(res.data.message || 'Webhook 등록 성공');
      setErrorTrigger((t) => t + 1);
      setUrl('');
    } catch (e: any) {
      setErrorMessage(e.response?.data?.message || 'Webhook 등록 실패');
      setErrorTrigger((t) => t + 1);
    }
  };

  const handleTestWebhook = async () => {
    if (!url.trim()) return;

    const validationError = validateUrl(type, url);
    if (validationError) {
      setErrorMessage(validationError);
      setErrorTrigger((t) => t + 1);
      return;
    }

    try {
      const res = await api.post(
        `/api/webhooks/test?url=${encodeURIComponent(url)}`
      );
      setErrorMessage(res.data.message || '테스트 메시지 전송 성공');
      setErrorTrigger((t) => t + 1);
    } catch (e: any) {
      setErrorMessage(e.response?.data?.message || '테스트 실패');
      setErrorTrigger((t) => t + 1);
    }
  };

  return (
    <div className="w-full flex flex-col gap-[16px] border-t border-[#222] pt-[32px]">
      <h2 className="text-[#F2F2F2] text-[20px] font-semibold">Webhook 알림</h2>

      <div className="flex gap-[12px]">
        <select
          className="px-3 py-2 bg-[#111] border border-[#333] rounded-[8px] text-[14px] text-white"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="SLACK">Slack</option>
          <option value="DISCORD">Discord</option>
          <option value="CUSTOM">Custom</option>
        </select>

        <input
          className="flex-1 px-3 py-2 bg-[#111] border border-[#333] rounded-[8px] text-[14px] text-white"
          placeholder="Webhook URL 입력"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <button
          type="button"
          onClick={handleAddWebhook}
          className="px-4 py-2 bg-[#4FE75E] text-black rounded-[8px] font-medium"
        >
          등록
        </button>

        <button
          type="button"
          onClick={handleTestWebhook}
          className="px-4 py-2 bg-[#333] text-white rounded-[8px] font-medium"
        >
          테스트
        </button>
      </div>

      {errorMessage && (
        <ErrorToast message={errorMessage} trigger={errorTrigger} />
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import ErrorToast from '../../components/text/error-toast';
import {
  getWebhooks,
  addWebhook,
  testWebhook,
  deleteWebhook,
  triggerWebhook,
} from '../../api/webhook';

export default function WebhookManager() {
  const [type, setType] = useState('SLACK');
  const [url, setUrl] = useState('');
  const [webhooks, setWebhooks] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorTrigger, setErrorTrigger] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchWebhooks = async () => {
    try {
      const data = await getWebhooks();
      setWebhooks(data || []);
    } catch (e: any) {
      setErrorMessage('웹훅 목록을 불러오지 못했습니다.');
      setErrorTrigger((t) => t + 1);
    }
  };

  useEffect(() => {
    fetchWebhooks();
  }, []);

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
      setLoading(true);
      const res = await addWebhook(type, url);
      setErrorMessage(res.message || 'Webhook 등록 성공');
      setErrorTrigger((t) => t + 1);
      setUrl('');
      fetchWebhooks();
    } catch (e: any) {
      setErrorMessage(e.response?.data?.message || 'Webhook 등록 실패');
      setErrorTrigger((t) => t + 1);
    } finally {
      setLoading(false);
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
      const res = await testWebhook(url);
      setErrorMessage(res.message || '테스트 메시지 전송 성공');
      setErrorTrigger((t) => t + 1);
    } catch (e: any) {
      setErrorMessage(e.response?.data?.message || '테스트 실패');
      setErrorTrigger((t) => t + 1);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteWebhook(id);
      setErrorMessage('Webhook 삭제 성공');
      setErrorTrigger((t) => t + 1);
      fetchWebhooks();
    } catch (e: any) {
      setErrorMessage(e.response?.data?.message || '삭제 실패');
      setErrorTrigger((t) => t + 1);
    }
  };

  const handleTriggerAll = async () => {
    try {
      const res = await triggerWebhook('테스트 이벤트 트리거');
      setErrorMessage(res.message || '이벤트 트리거 성공');
      setErrorTrigger((t) => t + 1);
    } catch (e: any) {
      setErrorMessage(e.response?.data?.message || '이벤트 트리거 실패');
      setErrorTrigger((t) => t + 1);
    }
  };

  return (
    <div className="w-full flex flex-col gap-[16px] border-t border-[#222] pt-[32px]">
      <h2 className="text-[#F2F2F2] text-[20px] font-semibold">Webhook 알림</h2>

      {/* 입력 영역 */}
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
          disabled={loading}
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

      {/* 웹훅 목록 */}
      <div className="flex flex-col gap-[8px] mt-[12px]">
        {webhooks.length === 0 ? (
          <div className="text-[#888] text-[14px]">등록된 Webhook이 없습니다.</div>
        ) : (
          webhooks.map((w) => (
            <div
              key={w.id}
              className="flex items-center justify-between border border-[#333] rounded-[8px] px-3 py-2 text-[14px]"
            >
              <div className="flex flex-col">
                <span className="text-[#4FE75E] font-medium">{w.type}</span>
                <span className="text-[#ccc] truncate max-w-[320px]">{w.url}</span>
              </div>
              <button
                onClick={() => handleDelete(w.id)}
                className="px-3 py-1 text-[13px] bg-[#D46F6F] text-white rounded-[6px]"
              >
                삭제
              </button>
            </div>
          ))
        )}
      </div>

      {/* 트리거 버튼 */}
      {webhooks.length > 0 && (
        <button
          type="button"
          onClick={handleTriggerAll}
          className="mt-[16px] px-4 py-2 bg-[#4FE75E] text-black rounded-[8px] font-medium self-start"
        >
          전체 트리거
        </button>
      )}

      {errorMessage && <ErrorToast message={errorMessage} trigger={errorTrigger} />}
    </div>
  );
}

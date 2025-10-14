import { api } from './axiosInstance';

export const getWebhooks = async () => {
  const res = await api.get('/api/webhooks');
  return res.data.data;
};

export const addWebhook = async (type: string, url: string) => {
  const res = await api.post('/api/webhooks', { type, url });
  return res.data;
};

export const testWebhook = async (url: string) => {
  const res = await api.post(`/api/webhooks/test?url=${encodeURIComponent(url)}`);
  return res.data;
};

export const triggerWebhook = async (message: string) => {
  const res = await api.post(`/api/webhooks/trigger?message=${encodeURIComponent(message)}`);
  return res.data;
};

export const deleteWebhook = async (id: number) => {
  const res = await api.delete(`/api/webhooks/${id}`);
  return res.data;
};

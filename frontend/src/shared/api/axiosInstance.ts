import axios, { AxiosError } from 'axios';
import { useAuthStore } from '@/store/authStore';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1',
  withCredentials: true,
  timeout: 15000,
});

api.interceptors.response.use(response => response, (error: AxiosError<{ detail?: string }>) => {
  const url = error.config?.url ?? '';
  const forbidden = error.response?.status === 401 && !url.includes('/auth/token') && !url.includes('/auth/me');
  const disabled = error.response?.status === 400 && error.response?.data?.detail === 'Cuenta de usuario desactivada';
  if (forbidden || disabled) {
    useAuthStore.getState().clearSession();
  }
  return Promise.reject(error);
});

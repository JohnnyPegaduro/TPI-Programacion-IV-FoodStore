import axios from 'axios';

export function handleApiError(error: unknown): string {
  if (axios.isAxiosError<{ detail?: string | { msg: string }[] }>(error)) {
    const detail = error.response?.data?.detail;
    if (typeof detail === 'string') return detail;
    if (Array.isArray(detail)) return detail.map(item => item.msg).join('; ');
    if (error.code === 'ERR_NETWORK') return 'No se pudo conectar con el servidor. Revisá el backend.';
  }
  return error instanceof Error ? error.message : 'Ocurrió un error inesperado';
}

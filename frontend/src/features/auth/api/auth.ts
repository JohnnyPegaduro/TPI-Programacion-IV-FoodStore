import { api } from '@/shared/api/axiosInstance';
import type { UserCreate,UserPublic } from '../types/auth';
export const authApi={
  register:async (payload:UserCreate)=>(await api.post<UserPublic>('/auth/register',payload)).data,
};

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@/shared/api/axiosInstance';
import type { UserPublic } from '@/features/auth';

type AuthState = {
  usuario: UserPublic | null;
  cargando: boolean;
  verificado: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
  clearSession: () => void;
};

export const useAuthStore = create<AuthState>()(persist((set) => ({
  usuario: null,
  cargando: true,
  verificado: false,
  login: async (username, password) => {
    const params = new URLSearchParams({username, password});
    await api.post('/auth/token', params, {headers:{'Content-Type':'application/x-www-form-urlencoded'}});
    const { data } = await api.get<UserPublic>('/auth/me');
    set({usuario:data,cargando:false,verificado:true});
  },
  logout: async () => {
    try { await api.post('/auth/logout'); }
    finally { set({usuario:null,cargando:false,verificado:true}); }
  },
  checkSession: async () => {
    set({cargando:true});
    try {
      const { data } = await api.get<UserPublic>('/auth/me');
      set({usuario:data,cargando:false,verificado:true});
    } catch { set({usuario:null,cargando:false,verificado:true}); }
  },
  clearSession: () => set({usuario:null,cargando:false,verificado:true}),
}), {name:'food-store-auth',partialize:(state)=>({usuario:state.usuario})}));

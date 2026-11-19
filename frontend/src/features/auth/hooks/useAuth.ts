import {useAuthStore} from '@/store/authStore';
export function useAuth(){
  const usuario=useAuthStore(s=>s.usuario);
  const cargando=useAuthStore(s=>s.cargando);
  const login=useAuthStore(s=>s.login);
  const logout=useAuthStore(s=>s.logout);
  return {usuario,cargando,login,logout};
}

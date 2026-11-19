import {Navigate,Outlet,useLocation} from 'react-router-dom';
import {useAuthStore} from '@/store/authStore';
export function ProtectedRoute({allowedRoles}:{allowedRoles?:Array<'user'|'admin'>}){
  const usuario=useAuthStore(s=>s.usuario);
  const cargando=useAuthStore(s=>s.cargando);
  const verificado=useAuthStore(s=>s.verificado);
  const location=useLocation();
  if(cargando||!verificado) return <div className="flex min-h-[40vh] items-center justify-center" role="status"><div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500"/><span className="ml-3">Verificando sesión...</span></div>;
  if(!usuario) return <Navigate to="/login" replace state={{from:location}}/>;
  if(allowedRoles&&!allowedRoles.includes(usuario.role)) return <Navigate to="/unauthorized" replace/>;
  return <Outlet/>;
}

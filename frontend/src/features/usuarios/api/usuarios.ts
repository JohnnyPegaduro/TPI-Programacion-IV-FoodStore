import { api } from '@/shared/api/axiosInstance';
import type {UserPublic} from '../types/usuarios';
export const usuariosApi={
  listar:async ()=>(await api.get<UserPublic[]>('/admin/usuarios')).data,
  estado:async (id:number,accion:'activar'|'desactivar')=>(await api.post<UserPublic>(`/admin/usuarios/${id}/${accion}`)).data,
};

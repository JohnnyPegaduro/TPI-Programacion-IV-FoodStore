import {useMutation,useQuery,useQueryClient} from '@tanstack/react-query';
import {usuariosApi} from '../api/usuarios';
export const useUsuarios=()=>useQuery({queryKey:['usuarios'],queryFn:usuariosApi.listar});
export function useMutarUsuario(){const qc=useQueryClient();return useMutation({mutationFn:({id,accion}:{id:number;accion:'activar'|'desactivar'})=>usuariosApi.estado(id,accion),onSuccess:()=>{void qc.invalidateQueries({queryKey:['usuarios']});}});}

import {useMutation,useQuery,useQueryClient} from '@tanstack/react-query';
import {categoriasApi} from '../api/categorias';
export const useCategorias=()=>useQuery({queryKey:['categorias'],queryFn:categoriasApi.listar});
export function useMutarCategoria(){
  const qc=useQueryClient();
  const after=()=>{void qc.invalidateQueries({queryKey:['categorias']});void qc.invalidateQueries({queryKey:['productos']});};
  return {crear:useMutation({mutationFn:categoriasApi.crear,onSuccess:after}),
          editar:useMutation({mutationFn:({id,data}:{id:number;data:Parameters<typeof categoriasApi.editar>[1]})=>categoriasApi.editar(id,data),onSuccess:after}),
          eliminar:useMutation({mutationFn:categoriasApi.eliminar,onSuccess:after})};
}

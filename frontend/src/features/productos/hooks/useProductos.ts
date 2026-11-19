import {useMutation,useQuery,useQueryClient} from '@tanstack/react-query';
import {productosApi} from '../api/productos';
import type {ProductoFiltros,ProductoUpdate} from '../types/productos';
export const useProductos=(filtros:ProductoFiltros)=>useQuery({queryKey:['productos',filtros],queryFn:()=>productosApi.listar(filtros)});
export function useMutarProducto(){
  const qc=useQueryClient();
  const after=()=>{void qc.invalidateQueries({queryKey:['productos']});void qc.invalidateQueries({queryKey:['pedidos']});};
  return {crear:useMutation({mutationFn:productosApi.crear,onSuccess:after}),
          editar:useMutation({mutationFn:({id,data}:{id:number;data:ProductoUpdate})=>productosApi.editar(id,data),onSuccess:after}),
          stock:useMutation({mutationFn:({id,data}:{id:number;data:{stock?:number;disponible?:boolean}})=>productosApi.stock(id,data),onSuccess:after}),
          eliminar:useMutation({mutationFn:productosApi.eliminar,onSuccess:after})};
}

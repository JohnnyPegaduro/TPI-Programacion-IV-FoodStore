import {useMutation,useQuery,useQueryClient} from '@tanstack/react-query';
import {pedidosApi} from '../api/pedidos';
import type {EstadoPedido} from '../types/pedidos';
export const usePedidos=(params:{skip:number;limit:number;estado?:EstadoPedido})=>useQuery({queryKey:['pedidos',params],queryFn:()=>pedidosApi.listar(params)});
export const useResumenPedidos=()=>useQuery({queryKey:['pedidos','resumen'],queryFn:pedidosApi.resumen});
export function useMutarPedido(){
  const qc=useQueryClient();
  const after=()=>{void qc.invalidateQueries({queryKey:['pedidos']});void qc.invalidateQueries({queryKey:['productos']});};
  return {crear:useMutation({mutationFn:pedidosApi.crear,onSuccess:after}),
    cancelar:useMutation({mutationFn:pedidosApi.cancelar,onSuccess:after}),
    estado:useMutation({mutationFn:({id,estado}:{id:number;estado:EstadoPedido})=>pedidosApi.cambiarEstado(id,estado),onSuccess:after})};
}

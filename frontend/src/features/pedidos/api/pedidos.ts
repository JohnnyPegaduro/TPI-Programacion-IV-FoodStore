import { api } from '@/shared/api/axiosInstance';
import type { EstadoPedido,Pedido,PedidoCreate,PedidosPaginados,ResumenPedidos } from '../types/pedidos';
export const pedidosApi={
  crear:async (payload:PedidoCreate)=>(await api.post<Pedido>('/pedidos',payload)).data,
  listar:async (params:{skip:number;limit:number;estado?:EstadoPedido})=>(await api.get<PedidosPaginados>('/pedidos',{params})).data,
  detalle:async (id:number)=>(await api.get<Pedido>(`/pedidos/${id}`)).data,
  cancelar:async (id:number)=>(await api.patch<Pedido>(`/pedidos/${id}/cancelar`)).data,
  cambiarEstado:async (id:number,estado:EstadoPedido)=>(await api.patch<Pedido>(`/pedidos/${id}/estado`,{estado})).data,
  resumen:async ()=>(await api.get<ResumenPedidos>('/pedidos/resumen')).data,
};

import { api } from '@/shared/api/axiosInstance';
import type { Producto,ProductoCreate,ProductoUpdate,ProductosPaginados,ProductoFiltros } from '../types/productos';
export const productosApi={
  listar:async (params:ProductoFiltros)=>(await api.get<ProductosPaginados>('/productos',{params})).data,
  detalle:async (id:number)=>(await api.get<Producto>(`/productos/${id}`)).data,
  crear:async (payload:ProductoCreate)=>(await api.post<Producto>('/productos',payload)).data,
  editar:async (id:number,payload:ProductoUpdate)=>(await api.put<Producto>(`/productos/${id}`,payload)).data,
  stock:async (id:number,payload:{stock?:number;disponible?:boolean})=>(await api.patch<Producto>(`/productos/${id}/stock`,payload)).data,
  eliminar:async (id:number)=>{await api.delete(`/productos/${id}`);},
};

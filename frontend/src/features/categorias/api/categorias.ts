import { api } from '@/shared/api/axiosInstance';
import type { Categoria,CategoriaCreate,CategoriaUpdate } from '../types/categorias';
export const categoriasApi={
  listar:async ()=>(await api.get<Categoria[]>('/categorias')).data,
  crear:async (payload:CategoriaCreate)=>(await api.post<Categoria>('/categorias',payload)).data,
  editar:async (id:number,payload:CategoriaUpdate)=>(await api.put<Categoria>(`/categorias/${id}`,payload)).data,
  eliminar:async (id:number)=>{await api.delete(`/categorias/${id}`);},
};

import type {Categoria} from '@/features/categorias';
export type Producto={id:number;categoria_id:number;nombre:string;descripcion:string;precio_base:number;imagen_url:string;stock:number;disponible:boolean;activo:boolean;categoria:Categoria};
export type ProductoCreate={categoria_id:number;nombre:string;descripcion:string;precio_base:number;imagen_url:string;stock:number;disponible:boolean};
export type ProductoUpdate=Partial<ProductoCreate>;
export type ProductosPaginados={total:number;items:Producto[]};
export type ProductoFiltros={skip?:number;limit?:number;search?:string;categoria_id?:number;disponible?:boolean};

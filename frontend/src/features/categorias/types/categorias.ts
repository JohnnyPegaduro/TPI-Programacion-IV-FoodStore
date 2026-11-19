export type Categoria={id:number;nombre:string;descripcion:string;activo:boolean};
export type CategoriaCreate={nombre:string;descripcion:string};
export type CategoriaUpdate=Partial<CategoriaCreate>;

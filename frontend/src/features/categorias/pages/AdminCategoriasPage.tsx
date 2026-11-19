import {useState} from 'react';
import type {ColumnDef} from '@tanstack/react-table';
import {useCategorias,useMutarCategoria} from '../hooks/useCategorias';
import {CategoriaForm} from '../components/CategoriaForm';
import type {Categoria} from '../types/categorias';
import {AdminNav} from '@/shared/layout/AdminNav';
import {DataTable} from '@/shared/ui/DataTable';
import {Button,Card,ErrorBox,PageHeader} from '@/shared/ui/Primitives';
import {handleApiError} from '@/shared/api/handleApiError';
export function AdminCategoriasPage(){
  const categories=useCategorias();const {eliminar}=useMutarCategoria();
  const [edit,setEdit]=useState<Categoria|null>(null);const [show,setShow]=useState(false);const [error,setError]=useState('');
  const remove=async(id:number)=>{if(!window.confirm('¿Dar de baja esta categoría? Sus productos no se darán de baja automáticamente.'))return;setError('');try{await eliminar.mutateAsync(id);}catch(e){setError(handleApiError(e));}};
  const columns:ColumnDef<Categoria,unknown>[]=[{accessorKey:'id',header:'ID'},{accessorKey:'nombre',header:'Categoría'},{accessorKey:'descripcion',header:'Descripción'},
  {id:'acciones',header:'Acciones',cell:({row})=><div className="flex gap-2"><Button variant="secondary" className="px-3 py-1.5 text-xs" onClick={()=>{setEdit(row.original);setShow(true);}}>Editar</Button><Button variant="danger" className="px-3 py-1.5 text-xs" onClick={()=>void remove(row.original.id)}>Eliminar</Button></div>}];
  return <div><AdminNav/><PageHeader title="Categorías" subtitle="Administrá el catálogo con baja lógica." action={<Button onClick={()=>{setEdit(null);setShow(true);}}>+ Nueva categoría</Button>}/>{error&&<div className="mb-4"><ErrorBox message={error}/></div>}
    {show&&<Card className="mb-5"><h2 className="mb-5 text-xl font-black">{edit?'Editar categoría':'Nueva categoría'}</h2><CategoriaForm key={edit?.id??'new'} actual={edit} close={()=>setShow(false)}/></Card>}
    {categories.isPending?<p>Cargando categorías...</p>:categories.isError?<ErrorBox message="No se pudieron cargar las categorías"/>:<DataTable data={categories.data} columns={columns}/>}</div>;
}

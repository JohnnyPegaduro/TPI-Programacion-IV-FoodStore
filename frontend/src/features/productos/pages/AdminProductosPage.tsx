import {useState} from 'react';
import type {ColumnDef} from '@tanstack/react-table';
import {AdminNav} from '@/shared/layout/AdminNav';
import {DataTable} from '@/shared/ui/DataTable';
import {Button,Card,ErrorBox,Input,money,PageHeader,Select} from '@/shared/ui/Primitives';
import {EstadoError} from '@/shared/components/Estados';
import {useCategorias} from '@/features/categorias';
import {useProductos,useMutarProducto} from '../hooks/useProductos';
import {ProductoForm} from '../components/ProductoForm';
import {ProductoStockForm} from '../components/ProductoStockForm';
import type {Producto} from '../types/productos';
import {handleApiError} from '@/shared/api/handleApiError';
export function AdminProductosPage(){
  const [search,setSearch]=useState('');const [categoria,setCategoria]=useState('');const [edit,setEdit]=useState<Producto|null>(null);
  const [stockEdit,setStockEdit]=useState<Producto|null>(null);const [show,setShow]=useState(false);const [error,setError]=useState('');
  const products=useProductos({skip:0,limit:100,search:search||undefined,categoria_id:categoria?Number(categoria):undefined});
  const categories=useCategorias();const {eliminar}=useMutarProducto();
  const remove=async(id:number)=>{if(!window.confirm('¿Dar de baja este producto?'))return;setError('');try{await eliminar.mutateAsync(id);}catch(e){setError(handleApiError(e));}};
  const columns:ColumnDef<Producto,unknown>[]=[
    {accessorKey:'id',header:'ID'},{accessorKey:'nombre',header:'Producto'},
    {id:'categoria',header:'Categoría',cell:({row})=>row.original.categoria.nombre},
    {id:'precio',header:'Precio',cell:({row})=>money(row.original.precio_base)},
    {id:'stock',header:'Stock',cell:({row})=><span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${row.original.stock > 0 ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300'}`}>{row.original.stock} {row.original.stock === 1 ? 'unidad' : 'unidades'}</span>},
    {id:'estado',header:'Disponible',cell:({row})=><span className={row.original.disponible&&row.original.stock>0?'font-semibold text-green-600':'font-semibold text-red-500'}>{row.original.disponible&&row.original.stock>0?'Sí':'No'}</span>},
    {id:'acciones',header:'Acciones',cell:({row})=><div className="flex flex-wrap gap-1"><Button className="px-2 py-1.5 text-xs" variant="secondary" onClick={()=>{setEdit(row.original);setShow(true);setStockEdit(null);}}>Editar</Button><Button className="px-2 py-1.5 text-xs" variant="secondary" onClick={()=>{setStockEdit(row.original);setShow(false);}}>Stock</Button><Button className="px-2 py-1.5 text-xs" variant="danger" onClick={()=>void remove(row.original.id)}>Eliminar</Button></div>},
  ];
  return <div><AdminNav/><PageHeader title="Productos" subtitle="Gestioná precios, imágenes, disponibilidad y stock." action={<Button onClick={()=>{setEdit(null);setStockEdit(null);setShow(true);}}>+ Nuevo producto</Button>}/>
    <div className="mb-5 grid gap-3 sm:grid-cols-2"><Input placeholder="Buscar por nombre" value={search} onChange={e=>setSearch(e.target.value)}/><Select value={categoria} onChange={e=>setCategoria(e.target.value)}><option value="">Todas las categorías</option>{categories.data?.map(c=><option key={c.id} value={c.id}>{c.nombre}</option>)}</Select></div>
    {error&&<div className="mb-4"><ErrorBox message={error}/></div>}
    {show&&<Card className="mb-5"><h2 className="mb-5 text-xl font-black">{edit?'Editar producto':'Nuevo producto'}</h2><ProductoForm key={edit?.id??'new'} actual={edit} close={()=>setShow(false)}/></Card>}
    {stockEdit&&<Card className="mb-5"><h2 className="mb-5 text-xl font-black">Cambiar stock y disponibilidad</h2><ProductoStockForm key={stockEdit.id} producto={stockEdit} close={()=>setStockEdit(null)}/></Card>}
    {products.isPending?<p>Cargando productos...</p>:products.isError?<EstadoError mensaje="Error al cargar productos" reset={()=>void products.refetch()}/>:<><DataTable data={products.data.items} columns={columns}/>{products.data.total>100&&<p className="mt-3 text-sm text-orange-600">El listado muestra los primeros 100 productos; usá la búsqueda para acotar los resultados.</p>}</>}
  </div>;
}

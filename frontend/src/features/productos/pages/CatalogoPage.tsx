import {useState} from 'react';
import {useCategorias} from '@/features/categorias';
import {ProductoCard} from '../components/ProductoCard';
import {useProductos} from '../hooks/useProductos';
import {EstadoError,EstadoVacio,Paginacion,Skeleton} from '@/shared/components/Estados';
import {Input,PageHeader,Select} from '@/shared/ui/Primitives';

const LIMIT=9;
export function CatalogoPage(){
  const [search,setSearch]=useState('');const [categoria,setCategoria]=useState('');const [pagina,setPagina]=useState(0);
  const categorias=useCategorias();
  const productos=useProductos({skip:pagina*LIMIT,limit:LIMIT,search:search.trim()||undefined,categoria_id:categoria?Number(categoria):undefined});
  const totalPaginas=Math.ceil((productos.data?.total??0)/LIMIT);
  return <div><section className="relative mb-9 overflow-hidden rounded-3xl bg-slate-900 p-8 text-white sm:p-12"><div className="absolute -right-10 -top-20 h-72 w-72 rounded-full bg-orange-500/20 blur-3xl"/><div className="relative max-w-2xl"><span className="text-sm font-bold uppercase tracking-[.25em] text-orange-300">Pedido fresco, experiencia simple</span><h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Tu próximo antojo <span className="text-orange-400">está acá.</span></h1><p className="mt-4 text-lg text-slate-300">Elegí tus favoritos, armá el carrito y pedí en pocos pasos.</p></div></section>
    <PageHeader title="Nuestro menú" subtitle="Buscá, filtrá por categoría y agregá lo que más te guste."/>
    <div className="mb-6 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900 md:grid-cols-[2fr_1fr]"><div><label className="mb-1.5 block text-sm font-semibold" htmlFor="buscar">Buscar productos</label><Input id="buscar" placeholder="Ej.: pizza, hamburguesa..." value={search} onChange={e=>{setSearch(e.target.value);setPagina(0);}}/></div><div><label className="mb-1.5 block text-sm font-semibold" htmlFor="categoria">Categoría</label><Select id="categoria" value={categoria} onChange={e=>{setCategoria(e.target.value);setPagina(0);}}><option value="">Todas las categorías</option>{categorias.data?.map(c=><option key={c.id} value={c.id}>{c.nombre}</option>)}</Select></div></div>
    {productos.isPending?<Skeleton/>:productos.isError?<EstadoError mensaje="No se pudo cargar el catálogo" reset={()=>void productos.refetch()}/>:productos.data.items.length===0?<EstadoVacio mensaje="No encontramos productos para esos filtros"/>:<><p className="mb-4 text-sm text-slate-500">{productos.data.total} producto(s) encontrados</p><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{productos.data.items.map(p=><ProductoCard key={p.id} producto={p}/>)}</div><Paginacion pagina={pagina} total={totalPaginas} onChange={setPagina}/></>}
  </div>;
}

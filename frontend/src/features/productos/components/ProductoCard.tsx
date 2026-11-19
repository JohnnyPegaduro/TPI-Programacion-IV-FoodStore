import type {Producto} from '../types/productos';
import {money,Button} from '@/shared/ui/Primitives';
import {useCartStore} from '@/store/cartStore';
import {useState} from 'react';

export function ProductoCard({producto}:{producto:Producto}){
  const agregar=useCartStore(s=>s.agregar);
  const [added,setAdded]=useState(false);
  const agotado=producto.stock<1||!producto.disponible;
  const add=()=>{
    agregar({producto_id:producto.id,nombre:producto.nombre,precio_unitario:producto.precio_base,imagen_url:producto.imagen_url,stock_max:producto.stock});
    setAdded(true);window.setTimeout(()=>setAdded(false),1400);
  };
  return <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl dark:border-slate-700 dark:bg-slate-900 dark:hover:shadow-slate-900">
    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-amber-100 to-orange-200 dark:from-slate-800 dark:to-slate-700">
      {producto.imagen_url?<img className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" src={producto.imagen_url} alt={producto.nombre} loading="lazy" onError={e=>{e.currentTarget.style.display='none';}}/>:<div className="grid h-full place-items-center text-7xl">🍔</div>}
      <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-orange-600 shadow dark:bg-slate-800 dark:text-orange-300">{producto.categoria.nombre}</span>
      {agotado&&<span className="absolute right-3 top-3 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">Sin disponibilidad</span>}
    </div>
    <div className="flex min-h-48 flex-col p-5"><h3 className="text-xl font-bold">{producto.nombre}</h3><p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{producto.descripcion||'Preparado especialmente para vos.'}</p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${producto.stock > 0 ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300'}`}>
          Stock: {producto.stock} {producto.stock === 1 ? 'unidad' : 'unidades'}
        </span>
        {!producto.disponible && <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">Venta deshabilitada</span>}
      </div>
      <div className="mt-4 flex items-center justify-between gap-3"><span className="text-xl font-black text-orange-600 dark:text-orange-400">{money(producto.precio_base)}</span><Button disabled={agotado} onClick={add} className="text-sm">{added?'✓ Agregado':agotado?'Sin stock':'+ Agregar'}</Button></div></div>
  </article>;
}

import {Link} from 'react-router-dom';
import {useCartStore} from '@/store/cartStore';
import {useAuthStore} from '@/store/authStore';
import {Button,Card,money,PageHeader} from '@/shared/ui/Primitives';
import {EstadoVacio} from '@/shared/components/Estados';

export function CarritoPage(){
  const items=useCartStore(s=>s.items);
  const quitar=useCartStore(s=>s.quitar);
  const cantidad=useCartStore(s=>s.cambiarCantidad);
  const total=items.reduce((sum,item)=>sum+item.precio_unitario*item.cantidad,0);
  const user=useAuthStore(s=>s.usuario);
  return <div><PageHeader title="Tu carrito" subtitle="Revisá cantidades antes de confirmar tu pedido."/>
    {items.length===0?<div className="space-y-4"><EstadoVacio mensaje="Tu carrito todavía está vacío"/><Link className="font-semibold text-orange-600" to="/">Explorar menú</Link></div>:<div className="grid gap-6 lg:grid-cols-[2fr_1fr]"><div className="space-y-3">{items.map(item=><Card key={item.producto_id} className="flex flex-wrap items-center gap-4"><div className="grid h-20 w-20 place-items-center overflow-hidden rounded-xl bg-orange-100 text-3xl">{item.imagen_url?<img src={item.imagen_url} alt="" className="h-full w-full object-cover" onError={e=>{e.currentTarget.style.display='none';}}/>:'🍔'}</div><div className="min-w-0 flex-1"><h3 className="font-bold">{item.nombre}</h3><p className="text-sm text-slate-500">{money(item.precio_unitario)} c/u</p><button className="mt-1 text-xs font-semibold text-red-600 hover:underline" onClick={()=>quitar(item.producto_id)}>Quitar</button></div><div className="flex items-center gap-2"><Button variant="secondary" className="px-3" disabled={item.cantidad<=1} onClick={()=>cantidad(item.producto_id,item.cantidad-1)}>−</Button><span className="w-7 text-center font-bold">{item.cantidad}</span><Button variant="secondary" className="px-3" disabled={item.cantidad>=item.stock_max} onClick={()=>cantidad(item.producto_id,item.cantidad+1)}>+</Button></div><div className="min-w-28 text-right font-bold">{money(item.precio_unitario*item.cantidad)}</div></Card>)}</div>
    <Card className="h-fit space-y-5"><h2 className="text-xl font-black">Resumen</h2><div className="flex justify-between text-slate-600 dark:text-slate-300"><span>Productos</span><span>{items.reduce((n,i)=>n+i.cantidad,0)}</span></div><div className="flex justify-between border-t border-slate-200 pt-4 text-xl font-black dark:border-slate-700"><span>Total estimado</span><span className="text-orange-600">{money(total)}</span></div><p className="text-xs text-slate-500">El servidor calculará el total definitivo con los precios vigentes.</p><Link className="block" to={user?'/checkout':'/login'}><Button className="w-full">{user?'Confirmar pedido':'Ingresar para comprar'}</Button></Link></Card></div>}
  </div>;
}

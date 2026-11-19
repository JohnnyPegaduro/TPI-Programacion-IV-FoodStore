import {useState} from 'react';
import {useForm} from '@tanstack/react-form';
import {Link,useNavigate} from 'react-router-dom';
import {useCartStore} from '@/store/cartStore';
import {useMutarPedido} from '../hooks/usePedidos';
import type {FormaPago} from '../types/pedidos';
import {handleApiError} from '@/shared/api/handleApiError';
import {Button,Card,ErrorBox,FieldError,Input,Label,money,PageHeader,Select,Textarea} from '@/shared/ui/Primitives';

export function CheckoutPage(){
  const navigate=useNavigate();const items=useCartStore(s=>s.items);const vaciar=useCartStore(s=>s.vaciar);
  const pedido=useMutarPedido().crear;const [error,setError]=useState('');
  const total=items.reduce((sum,i)=>sum+i.precio_unitario*i.cantidad,0);
  const form=useForm({defaultValues:{direccion_entrega:'',forma_pago:'EFECTIVO' as FormaPago,notas:''},onSubmit:async({value})=>{
    if(items.length<1){setError('El carrito está vacío');return;}
    setError('');try{await pedido.mutateAsync({items:items.map(i=>({producto_id:i.producto_id,cantidad:i.cantidad})),
      direccion_entrega:value.direccion_entrega,forma_pago:value.forma_pago,notas:value.notas||null});vaciar();navigate('/mis-pedidos',{state:{exito:'¡Pedido confirmado!'}});}catch(e){setError(handleApiError(e));}
  }});
  return <div><PageHeader title="Confirmar pedido" subtitle="Completá los datos de entrega. El pago se coordina de forma manual."/>
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]"><Card className="p-7"><form className="space-y-5" onSubmit={e=>{e.preventDefault();e.stopPropagation();void form.handleSubmit();}}>
      <form.Field name="direccion_entrega" validators={{onBlur:({value})=>value.trim().length<5||value.length>200?'Ingresá una dirección de 5 a 200 caracteres':undefined}}>{field=><div><Label>Dirección de entrega *</Label><Input placeholder="Calle, número, barrio, piso..." value={field.state.value} onBlur={field.handleBlur} onChange={e=>field.handleChange(e.target.value)}/><FieldError errors={field.state.meta.errors}/></div>}</form.Field>
      <form.Field name="forma_pago">{field=><div><Label>Forma de pago *</Label><Select value={field.state.value} onChange={e=>field.handleChange(e.target.value as FormaPago)}><option value="EFECTIVO">Efectivo</option><option value="TRANSFERENCIA">Transferencia</option></Select><p className="mt-1 text-xs text-slate-500">Sin pasarela de pagos: el pago se coordina con el negocio.</p></div>}</form.Field>
      <form.Field name="notas">{field=><div><Label>Notas (opcional)</Label><Textarea rows={3} placeholder="Indicaciones para la entrega..." value={field.state.value} onChange={e=>field.handleChange(e.target.value)}/></div>}</form.Field>
      {error&&<ErrorBox message={error}/>}
      <form.Subscribe selector={s=>[s.canSubmit,s.isSubmitting]}>{([canSubmit,submitting])=><Button type="submit" disabled={!canSubmit||submitting||items.length===0} className="w-full">{submitting?'Registrando pedido...':'Realizar pedido'}</Button>}</form.Subscribe>
    </form></Card>
    <Card className="h-fit space-y-4"><h2 className="text-xl font-black">Tu pedido</h2>{items.map(item=><div key={item.producto_id} className="flex justify-between gap-3 text-sm"><span>{item.cantidad} × {item.nombre}</span><span className="font-semibold">{money(item.precio_unitario*item.cantidad)}</span></div>)}<div className="flex justify-between border-t pt-4 text-xl font-black dark:border-slate-700"><span>Total estimado</span><span className="text-orange-600">{money(total)}</span></div><Link className="block text-center text-sm font-semibold text-orange-600" to="/carrito">Modificar carrito</Link></Card></div></div>;
}

import {useState} from 'react';
import {useForm} from '@tanstack/react-form';
import type {Producto} from '../types/productos';
import {useMutarProducto} from '../hooks/useProductos';
import {handleApiError} from '@/shared/api/handleApiError';
import {Button,ErrorBox,Input,Label} from '@/shared/ui/Primitives';
export function ProductoStockForm({producto,close}:{producto:Producto;close:()=>void}){
  const {stock}=useMutarProducto();const [error,setError]=useState('');
  const form=useForm({defaultValues:{stock:producto.stock,disponible:producto.disponible},onSubmit:async({value})=>{
    setError('');try{await stock.mutateAsync({id:producto.id,data:value});close();}catch(e){setError(handleApiError(e));}
  }});
  return <form className="space-y-4" onSubmit={e=>{e.preventDefault();e.stopPropagation();void form.handleSubmit();}}>
    <p className="font-semibold">{producto.nombre}</p><form.Field name="stock">{field=><div><Label>Stock disponible</Label><Input type="number" min="0" step="1" value={field.state.value} onChange={e=>field.handleChange(Number(e.target.value))}/></div>}</form.Field>
    <form.Field name="disponible">{field=><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={field.state.value} onChange={e=>field.handleChange(e.target.checked)}/> Habilitado para venta</label>}</form.Field>
    {error&&<ErrorBox message={error}/>}<div className="flex gap-2"><form.Subscribe selector={s=>[s.canSubmit,s.isSubmitting]}>{([ok,busy])=><Button type="submit" disabled={!ok||busy}>{busy?'Guardando...':'Guardar stock'}</Button>}</form.Subscribe><Button type="button" variant="secondary" onClick={close}>Cerrar</Button></div>
  </form>;
}

import {useState} from 'react';
import {useForm} from '@tanstack/react-form';
import {useCategorias} from '@/features/categorias';
import {useMutarProducto} from '../hooks/useProductos';
import type {Producto} from '../types/productos';
import {handleApiError} from '@/shared/api/handleApiError';
import {Button,ErrorBox,FieldError,Input,Label,Select,Textarea} from '@/shared/ui/Primitives';
export function ProductoForm({actual,close}:{actual:Producto|null;close:()=>void}){
  const categories=useCategorias();const {crear,editar}=useMutarProducto();const [error,setError]=useState('');
  const form=useForm({defaultValues:{nombre:actual?.nombre??'',descripcion:actual?.descripcion??'',categoria_id:actual?.categoria_id??0,
    precio_base:actual?.precio_base??0,imagen_url:actual?.imagen_url??'',stock:actual?.stock??0,disponible:actual?.disponible??true},onSubmit:async({value})=>{
    setError('');try{if(!value.categoria_id)throw new Error('Elegí una categoría');
      if(actual)await editar.mutateAsync({id:actual.id,data:value});else await crear.mutateAsync(value);close();}catch(e){setError(handleApiError(e));}
  }});
  return <form className="space-y-4" onSubmit={e=>{e.preventDefault();e.stopPropagation();void form.handleSubmit();}}><div className="grid gap-4 md:grid-cols-2">
    <form.Field name="nombre" validators={{onBlur:({value})=>value.trim().length<2?'Nombre de al menos 2 caracteres':undefined}}>{field=><div><Label>Producto *</Label><Input value={field.state.value} onBlur={field.handleBlur} onChange={e=>field.handleChange(e.target.value)}/><FieldError errors={field.state.meta.errors}/></div>}</form.Field>
    <form.Field name="categoria_id" validators={{onChange:({value})=>value<1?'Seleccioná una categoría':undefined}}>{field=><div><Label>Categoría *</Label><Select value={field.state.value} onChange={e=>field.handleChange(Number(e.target.value))}><option value="0">Seleccionar...</option>{categories.data?.map(c=><option key={c.id} value={c.id}>{c.nombre}</option>)}</Select><FieldError errors={field.state.meta.errors}/></div>}</form.Field>
    <form.Field name="precio_base" validators={{onBlur:({value})=>value<0?'Precio no puede ser negativo':undefined}}>{field=><div><Label>Precio base (ARS) *</Label><Input type="number" min="0" step="0.01" value={field.state.value} onBlur={field.handleBlur} onChange={e=>field.handleChange(Number(e.target.value))}/><FieldError errors={field.state.meta.errors}/></div>}</form.Field>
    <form.Field name="stock" validators={{onBlur:({value})=>value<0||!Number.isInteger(value)?'Stock entero y no negativo':undefined}}>{field=><div><Label>Stock *</Label><Input type="number" min="0" step="1" value={field.state.value} onBlur={field.handleBlur} onChange={e=>field.handleChange(Number(e.target.value))}/><FieldError errors={field.state.meta.errors}/></div>}</form.Field>
    <form.Field name="imagen_url">{field=><div className="md:col-span-2"><Label>URL de imagen</Label><Input type="url" placeholder="https://..." value={field.state.value} onChange={e=>field.handleChange(e.target.value)}/></div>}</form.Field>
    <form.Field name="descripcion">{field=><div className="md:col-span-2"><Label>Descripción</Label><Textarea rows={3} value={field.state.value} onChange={e=>field.handleChange(e.target.value)}/></div>}</form.Field>
    <form.Field name="disponible">{field=><label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={field.state.value} onChange={e=>field.handleChange(e.target.checked)}/> Disponible para la venta</label>}</form.Field>
  </div>{error&&<ErrorBox message={error}/>}<div className="flex gap-2"><form.Subscribe selector={s=>[s.canSubmit,s.isSubmitting]}>{([ok,loading])=><Button type="submit" disabled={!ok||loading}>{loading?'Guardando...':actual?'Guardar cambios':'Crear producto'}</Button>}</form.Subscribe><Button type="button" variant="secondary" onClick={close}>Cancelar</Button></div></form>;
}

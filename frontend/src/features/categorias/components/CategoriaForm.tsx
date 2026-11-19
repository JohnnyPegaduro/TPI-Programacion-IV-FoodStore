import {useState} from 'react';
import {useForm} from '@tanstack/react-form';
import {useMutarCategoria} from '../hooks/useCategorias';
import type {Categoria} from '../types/categorias';
import {handleApiError} from '@/shared/api/handleApiError';
import {Button,ErrorBox,FieldError,Input,Label,Textarea} from '@/shared/ui/Primitives';
export function CategoriaForm({actual,close}:{actual:Categoria|null;close:()=>void}){
  const {crear,editar}=useMutarCategoria();const [error,setError]=useState('');
  const form=useForm({defaultValues:{nombre:actual?.nombre??'',descripcion:actual?.descripcion??''},onSubmit:async({value})=>{
    setError('');try{if(actual)await editar.mutateAsync({id:actual.id,data:value});else await crear.mutateAsync(value);close();}catch(e){setError(handleApiError(e));}
  }});
  return <form className="space-y-4" onSubmit={e=>{e.preventDefault();e.stopPropagation();void form.handleSubmit();}}><form.Field name="nombre" validators={{onBlur:({value})=>value.trim().length<2||value.length>100?'Nombre entre 2 y 100 caracteres':undefined}}>{field=><div><Label>Nombre *</Label><Input value={field.state.value} onBlur={field.handleBlur} onChange={e=>field.handleChange(e.target.value)}/><FieldError errors={field.state.meta.errors}/></div>}</form.Field>
    <form.Field name="descripcion">{field=><div><Label>Descripción</Label><Textarea rows={2} value={field.state.value} onChange={e=>field.handleChange(e.target.value)}/></div>}</form.Field>{error&&<ErrorBox message={error}/>}<div className="flex gap-2"><form.Subscribe selector={s=>[s.canSubmit,s.isSubmitting]}>{([ok,pending])=><Button type="submit" disabled={!ok||pending}>{pending?'Guardando...':actual?'Guardar cambios':'Crear categoría'}</Button>}</form.Subscribe><Button type="button" variant="secondary" onClick={close}>Cancelar</Button></div>
  </form>;
}

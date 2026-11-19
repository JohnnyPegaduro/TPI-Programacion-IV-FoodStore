import {useState} from 'react';
import {Link,useNavigate} from 'react-router-dom';
import {useForm} from '@tanstack/react-form';
import {authApi} from '../api/auth';
import {handleApiError} from '@/shared/api/handleApiError';
import {Button,Card,ErrorBox,FieldError,Input,Label} from '@/shared/ui/Primitives';
export function RegisterPage(){
  const navigate=useNavigate();const [error,setError]=useState('');
  const form=useForm({defaultValues:{full_name:'',username:'',email:'',password:''},onSubmit:async({value})=>{
    setError('');try{await authApi.register(value);navigate('/login',{state:null});}catch(e){setError(handleApiError(e));}
  }});
  return <div className="mx-auto max-w-lg pt-6"><Card className="p-8"><div className="mb-6 text-center"><span className="text-4xl">✨</span><h1 className="mt-3 text-3xl font-black">Crear una cuenta</h1><p className="mt-2 text-slate-500">Registrate y empezá a pedir</p></div>
    <form className="space-y-4" onSubmit={e=>{e.preventDefault();e.stopPropagation();void form.handleSubmit();}}>
      <form.Field name="full_name" validators={{onBlur:({value})=>value.trim().length<2?'Mínimo 2 caracteres':undefined}}>{field=><div><Label>Nombre completo</Label><Input value={field.state.value} onBlur={field.handleBlur} onChange={e=>field.handleChange(e.target.value)}/><FieldError errors={field.state.meta.errors}/></div>}</form.Field>
      <form.Field name="username" validators={{onBlur:({value})=>value.trim().length<3?'Mínimo 3 caracteres':undefined}}>{field=><div><Label>Nombre de usuario</Label><Input autoComplete="username" value={field.state.value} onBlur={field.handleBlur} onChange={e=>field.handleChange(e.target.value)}/><FieldError errors={field.state.meta.errors}/></div>}</form.Field>
      <form.Field name="email" validators={{onBlur:({value})=>!/^\S+@\S+\.\S+$/.test(value)?'Ingresá un correo válido':undefined}}>{field=><div><Label>Correo electrónico</Label><Input type="email" autoComplete="email" value={field.state.value} onBlur={field.handleBlur} onChange={e=>field.handleChange(e.target.value)}/><FieldError errors={field.state.meta.errors}/></div>}</form.Field>
      <form.Field name="password" validators={{onBlur:({value})=>value.length<8?'Mínimo 8 caracteres':undefined}}>{field=><div><Label>Contraseña</Label><Input type="password" autoComplete="new-password" value={field.state.value} onBlur={field.handleBlur} onChange={e=>field.handleChange(e.target.value)}/><FieldError errors={field.state.meta.errors}/></div>}</form.Field>
      {error&&<ErrorBox message={error}/>}
      <form.Subscribe selector={s=>[s.canSubmit,s.isSubmitting]}>{([canSubmit,loading])=><Button disabled={!canSubmit||loading} type="submit" className="w-full">{loading?'Registrando...':'Crear cuenta'}</Button>}</form.Subscribe>
    </form><p className="mt-5 text-center text-sm">¿Ya tenés cuenta? <Link to="/login" className="font-bold text-orange-500">Ingresar</Link></p></Card></div>;
}

import {useState} from 'react';
import {Link,useLocation,useNavigate} from 'react-router-dom';
import {useForm} from '@tanstack/react-form';
import {useAuthStore} from '@/store/authStore';
import {handleApiError} from '@/shared/api/handleApiError';
import {Button,Card,ErrorBox,FieldError,Input,Label} from '@/shared/ui/Primitives';

export function LoginPage(){
  const navigate=useNavigate();const location=useLocation();const login=useAuthStore(s=>s.login);
  const [error,setError]=useState('');
  const form=useForm({defaultValues:{username:'',password:''},onSubmit:async({value})=>{
    setError('');try{await login(value.username,value.password);const from=(location.state as {from?:{pathname?:string}}|null)?.from?.pathname;navigate(from??'/');}catch(e){setError(handleApiError(e));}
  }});
  return <div className="mx-auto max-w-md pt-8"><Card className="space-y-6 p-8"><div className="text-center"><span className="text-5xl">🍽️</span><h1 className="mt-3 text-3xl font-black">Bienvenido de nuevo</h1><p className="mt-1 text-sm text-slate-500">Ingresá para hacer tu pedido</p></div>
    <form onSubmit={e=>{e.preventDefault();e.stopPropagation();void form.handleSubmit();}} className="space-y-4">
      <form.Field name="username" validators={{onBlur:({value})=>value.trim().length<3?'Ingresá tu usuario':undefined}}>{field=><div><Label>Usuario</Label><Input autoComplete="username" value={field.state.value} onBlur={field.handleBlur} onChange={e=>field.handleChange(e.target.value)}/><FieldError errors={field.state.meta.errors}/></div>}</form.Field>
      <form.Field name="password" validators={{onBlur:({value})=>value.length<1?'Ingresá la contraseña':undefined}}>{field=><div><Label>Contraseña</Label><Input type="password" autoComplete="current-password" value={field.state.value} onBlur={field.handleBlur} onChange={e=>field.handleChange(e.target.value)}/><FieldError errors={field.state.meta.errors}/></div>}</form.Field>
      {error&&<ErrorBox message={error}/>}
      <form.Subscribe selector={state=>[state.canSubmit,state.isSubmitting]}>{([canSubmit,isSubmitting])=><Button type="submit" disabled={!canSubmit||isSubmitting} className="w-full">{isSubmitting?'Ingresando...':'Iniciar sesión'}</Button>}</form.Subscribe>
    </form><p className="text-center text-sm">¿Todavía no tenés cuenta? <Link to="/register" className="font-bold text-orange-500 hover:underline">Registrate</Link></p></Card></div>;
}

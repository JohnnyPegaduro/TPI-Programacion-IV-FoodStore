import {useState} from 'react';
import type {ColumnDef} from '@tanstack/react-table';
import {useAuthStore} from '@/store/authStore';
import {useUsuarios,useMutarUsuario} from '../hooks/useUsuarios';
import type {UserPublic} from '../types/usuarios';
import {AdminNav} from '@/shared/layout/AdminNav';
import {DataTable} from '@/shared/ui/DataTable';
import {Button,ErrorBox,PageHeader} from '@/shared/ui/Primitives';
import {handleApiError} from '@/shared/api/handleApiError';
export function AdminUsuariosPage(){
  const user=useAuthStore(s=>s.usuario);const users=useUsuarios();const mutacion=useMutarUsuario();const [error,setError]=useState('');
  const setStatus=async(id:number,accion:'activar'|'desactivar')=>{
    if(!window.confirm(`¿${accion==='activar'?'Activar':'Desactivar'} este usuario?`))return;
    setError('');try{await mutacion.mutateAsync({id,accion});}catch(e){setError(handleApiError(e));}
  };
  const columns:ColumnDef<UserPublic,unknown>[]=[
    {accessorKey:'id',header:'ID'},{accessorKey:'username',header:'Usuario'},{accessorKey:'full_name',header:'Nombre'},{accessorKey:'email',header:'Correo'},{accessorKey:'role',header:'Rol'},
    {id:'activo',header:'Estado',cell:({row})=><span className={row.original.disabled?'font-bold text-red-500':'font-bold text-green-600'}>{row.original.disabled?'Desactivado':'Activo'}</span>},
    {id:'acciones',header:'Acciones',cell:({row})=>row.original.disabled?<Button className="px-3 py-1.5 text-xs" disabled={mutacion.isPending} onClick={()=>void setStatus(row.original.id,'activar')}>Activar</Button>:row.original.id===user?.id?<span className="text-xs text-slate-500">Sesión actual</span>:<Button variant="danger" className="px-3 py-1.5 text-xs" disabled={mutacion.isPending} onClick={()=>void setStatus(row.original.id,'desactivar')}>Desactivar</Button>}
  ];
  return <div><AdminNav/><PageHeader title="Usuarios" subtitle="Activá y desactivá cuentas. No podés desactivar tu propia cuenta."/>
    {error&&<div className="mb-4"><ErrorBox message={error}/></div>}
    {users.isPending?<p>Cargando usuarios...</p>:users.isError?<ErrorBox message="No se pudo cargar el listado de usuarios"/>:<DataTable data={users.data} columns={columns}/>}
  </div>;
}

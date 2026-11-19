import {useState} from 'react';
import type {ColumnDef} from '@tanstack/react-table';
import {usePedidos,useMutarPedido} from '../hooks/usePedidos';
import type {EstadoPedido,Pedido} from '../types/pedidos';
import {PedidoDetalle} from '../components/PedidoDetalle';
import {AdminNav} from '@/shared/layout/AdminNav';
import {BadgeEstado} from '@/shared/ui/BadgeEstado';
import {DataTable} from '@/shared/ui/DataTable';
import {Button,ErrorBox,money,PageHeader,Select} from '@/shared/ui/Primitives';
import {handleApiError} from '@/shared/api/handleApiError';
export function AdminPedidosPage(){
  const [estado,setEstado]=useState<EstadoPedido|''>('');const [seleccionado,setSeleccionado]=useState<Pedido|null>(null);const [error,setError]=useState('');
  const orders=usePedidos({skip:0,limit:100,estado:estado||undefined});const cambiar=useMutarPedido().estado;
  const transition=async(id:number,next:EstadoPedido)=>{
    if(next==='CANCELADO'&&!window.confirm('¿Cancelar este pedido y restituir stock?'))return;
    setError('');try{const actualizado=await cambiar.mutateAsync({id,estado:next});setSeleccionado(actualizado);}catch(e){setError(handleApiError(e));}
  };
  const columns:ColumnDef<Pedido,unknown>[]=[
    {accessorKey:'id',header:'Pedido'},
    {accessorKey:'usuario_id',header:'Usuario ID'},
    {id:'fecha',header:'Fecha',cell:({row})=>new Date(row.original.created_at).toLocaleString('es-AR')},
    {id:'estado',header:'Estado',cell:({row})=><BadgeEstado estado={row.original.estado}/>},
    {id:'total',header:'Total',cell:({row})=>money(row.original.total)},
    {id:'acciones',header:'Gestión',cell:({row})=><div className="flex flex-wrap gap-1"><Button className="px-2 py-1.5 text-xs" variant="secondary" onClick={()=>setSeleccionado(row.original)}>Detalle</Button>
      {row.original.estado==='PENDIENTE'&&<Button className="px-2 py-1.5 text-xs" onClick={()=>void transition(row.original.id,'EN_PREPARACION')}>Preparar</Button>}
      {row.original.estado==='EN_PREPARACION'&&<Button className="px-2 py-1.5 text-xs" onClick={()=>void transition(row.original.id,'ENTREGADO')}>Entregar</Button>}
      {(row.original.estado==='PENDIENTE'||row.original.estado==='EN_PREPARACION')&&<Button variant="danger" className="px-2 py-1.5 text-xs" onClick={()=>void transition(row.original.id,'CANCELADO')}>Cancelar</Button>}
    </div>}
  ];
  return <div><AdminNav/><PageHeader title="Gestión de pedidos" subtitle="Avanzá pedidos por la máquina de estados o cancelalos con reposición de stock."/>
    <div className="mb-5 max-w-xs"><label className="mb-1 block text-sm font-semibold">Filtrar por estado</label><Select value={estado} onChange={e=>{setEstado(e.target.value as EstadoPedido|'');setSeleccionado(null);}}><option value="">Todos</option>{(['PENDIENTE','EN_PREPARACION','ENTREGADO','CANCELADO'] as const).map(s=><option key={s} value={s}>{s.replace('_',' ')}</option>)}</Select></div>
    {error&&<div className="mb-5"><ErrorBox message={error}/></div>}
    {orders.isPending?<p>Cargando pedidos...</p>:orders.isError?<ErrorBox message="No se pudieron cargar pedidos"/>:<><DataTable data={orders.data.items} columns={columns}/>{orders.data.total>100&&<p className="mt-3 text-xs text-orange-600">Mostrando hasta 100 pedidos. Usá los filtros para acotar.</p>}</>}
    {seleccionado&&<div className="mt-6"><div className="flex justify-between gap-3"><h2 className="text-xl font-black">Pedido seleccionado</h2><Button variant="secondary" onClick={()=>setSeleccionado(null)}>Cerrar detalle</Button></div><PedidoDetalle pedido={seleccionado}/></div>}
  </div>;
}

import {useState} from 'react';
import {useLocation} from 'react-router-dom';
import {usePedidos,useMutarPedido} from '../hooks/usePedidos';
import type {EstadoPedido} from '../types/pedidos';
import {PedidoDetalle} from '../components/PedidoDetalle';
import {EstadoError,EstadoVacio,Paginacion} from '@/shared/components/Estados';
import {BadgeEstado} from '@/shared/ui/BadgeEstado';
import {Button,Card,ErrorBox,money,PageHeader,Select} from '@/shared/ui/Primitives';
import {handleApiError} from '@/shared/api/handleApiError';
const LIMIT=10;
export function MisPedidosPage(){
  const [pagina,setPagina]=useState(0);const [estado,setEstado]=useState<EstadoPedido|''>('');
  const [open,setOpen]=useState<number|null>(null);const [error,setError]=useState('');
  const location=useLocation();const pedidos=usePedidos({skip:pagina*LIMIT,limit:LIMIT,estado:estado||undefined});const cancelar=useMutarPedido().cancelar;
  const cancel=async(id:number)=>{if(!window.confirm('¿Cancelar este pedido? Se restituirá el stock.'))return;setError('');try{await cancelar.mutateAsync(id);}catch(e){setError(handleApiError(e));}};
  return <div><PageHeader title="Mis pedidos" subtitle="Consultá su estado, revisá el detalle y cancelá mientras estén pendientes."/>
    {(location.state as {exito?:string}|null)?.exito&&<div role="status" className="mb-4 rounded-xl bg-green-100 p-4 font-semibold text-green-800">¡Pedido confirmado! Podés consultar el detalle a continuación.</div>}
    {error&&<div className="mb-4"><ErrorBox message={error}/></div>}
    <div className="mb-5 max-w-xs"><label className="mb-1 block text-sm font-semibold">Filtrar estado</label><Select value={estado} onChange={e=>{setEstado(e.target.value as EstadoPedido|'');setPagina(0);}}><option value="">Todos</option>{(['PENDIENTE','EN_PREPARACION','ENTREGADO','CANCELADO'] as const).map(s=><option key={s} value={s}>{s.replace('_',' ')}</option>)}</Select></div>
    {pedidos.isPending?<p>Cargando pedidos...</p>:pedidos.isError?<EstadoError mensaje="No se pudieron cargar los pedidos" reset={()=>void pedidos.refetch()}/>:pedidos.data.items.length===0?<EstadoVacio mensaje="Todavía no tenés pedidos en este estado"/>:<div className="space-y-3">{pedidos.data.items.map(p=><Card key={p.id} className="p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-lg font-black">Pedido #{p.id}</h2><p className="text-xs text-slate-500">{new Date(p.created_at).toLocaleString('es-AR')}</p></div><BadgeEstado estado={p.estado}/><strong>{money(p.total)}</strong><div className="flex gap-2"><Button variant="secondary" onClick={()=>setOpen(open===p.id?null:p.id)}>{open===p.id?'Ocultar':'Ver detalle'}</Button>{p.estado==='PENDIENTE'&&<Button variant="danger" disabled={cancelar.isPending} onClick={()=>void cancel(p.id)}>Cancelar</Button>}</div></div>{open===p.id&&<PedidoDetalle pedido={p}/>}</Card>)}<Paginacion pagina={pagina} total={Math.ceil(pedidos.data.total/LIMIT)} onChange={setPagina}/></div>}
  </div>;
}

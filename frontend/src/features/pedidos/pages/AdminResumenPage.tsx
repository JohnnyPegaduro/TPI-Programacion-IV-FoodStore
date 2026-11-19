import {Link} from 'react-router-dom';
import {useResumenPedidos} from '../hooks/usePedidos';
import {AdminNav} from '@/shared/layout/AdminNav';
import {Card,money,PageHeader} from '@/shared/ui/Primitives';
import {EstadoError} from '@/shared/components/Estados';

export function AdminResumenPage(){
  const resumen=useResumenPedidos();
  return <div><AdminNav/><PageHeader title="Resumen del negocio" subtitle="Indicadores calculados directamente desde los pedidos registrados."/>
    {resumen.isPending?<p>Cargando indicadores...</p>:resumen.isError?<EstadoError mensaje="No se pudo cargar el resumen" reset={()=>void resumen.refetch()}/>:<>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[
        {label:'Pendientes',count:resumen.data.pendientes,icon:'🕒'},
        {label:'En preparación',count:resumen.data.en_preparacion,icon:'👨‍🍳'},
        {label:'Entregados',count:resumen.data.entregados,icon:'✅'},
        {label:'Cancelados',count:resumen.data.cancelados,icon:'❌'},
        {label:'Pedidos de hoy',count:resumen.data.pedidos_hoy,icon:'📅'},
      ].map(item=><Card key={item.label} className="p-7"><div className="mb-4 text-3xl">{item.icon}</div><p className="text-sm text-slate-500 dark:text-slate-400">{item.label}</p><p className="mt-2 text-4xl font-black">{item.count}</p></Card>)}
      <Card className="border-orange-200 bg-orange-50 p-7 dark:border-orange-900 dark:bg-orange-950"><div className="mb-4 text-3xl">💰</div><p className="text-sm text-slate-600 dark:text-orange-200">Ingresos por pedidos entregados</p><p className="mt-2 text-3xl font-black text-orange-700 dark:text-orange-300">{money(resumen.data.ingresos_entregados)}</p></Card></div>
      <div className="mt-7"><Link className="font-semibold text-orange-600 hover:underline" to="/admin/pedidos">Ir a gestión de pedidos →</Link></div>
    </>}
  </div>;
}

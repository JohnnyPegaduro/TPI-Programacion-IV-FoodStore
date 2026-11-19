import type { EstadoPedido } from '@/features/pedidos';
const colors:Record<EstadoPedido,string>={
  PENDIENTE:'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
  EN_PREPARACION:'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
  ENTREGADO:'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300',
  CANCELADO:'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300',
};
export function BadgeEstado({estado}:{estado:EstadoPedido}){return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${colors[estado]}`}>{estado.replace('_',' ')}</span>;}

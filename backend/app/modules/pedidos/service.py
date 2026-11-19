from datetime import datetime, timedelta, timezone
from sqlalchemy import func
from sqlmodel import select
from app.core.exceptions import BusinessRule, Forbidden, NotFound
from .models import DetallePedido, Pedido
from .schemas import CambioEstado, EstadoPedido, PedidoCreate, PedidoRead, PedidosPaginados, ResumenPedidos
from .unit_of_work import PedidoUnitOfWork

TRANSICIONES = {
    EstadoPedido.PENDIENTE: {EstadoPedido.EN_PREPARACION, EstadoPedido.CANCELADO},
    EstadoPedido.EN_PREPARACION: {EstadoPedido.ENTREGADO, EstadoPedido.CANCELADO},
    EstadoPedido.ENTREGADO: set(),
    EstadoPedido.CANCELADO: set(),
}


class PedidoService:
    def __init__(self, uow: PedidoUnitOfWork | None = None):
        self.uow = uow or PedidoUnitOfWork()

    def crear(self, data: PedidoCreate, usuario_id: int) -> PedidoRead:
        with self.uow as uow:
            product_ids = [item.producto_id for item in data.items]
            if len(product_ids) != len(set(product_ids)):
                raise BusinessRule('No se puede repetir un producto en el mismo pedido')
            pedido = Pedido(usuario_id=usuario_id, estado=EstadoPedido.PENDIENTE.value,
                            forma_pago=data.forma_pago.value, direccion_entrega=data.direccion_entrega,
                            notas=data.notas, total=0)
            uow.pedidos.add(pedido)
            total = 0.0
            for item in data.items:
                producto = uow.productos.lock_by_id(item.producto_id)
                if producto is None or not producto.activo:
                    raise NotFound(f'Producto {item.producto_id} no encontrado')
                if not producto.disponible:
                    raise BusinessRule(f'Producto {producto.nombre} no disponible')
                if producto.stock < item.cantidad:
                    raise BusinessRule(f'Stock insuficiente para {producto.nombre}')
                producto.stock -= item.cantidad
                subtotal = round(producto.precio_base * item.cantidad, 2)
                detalle = DetallePedido(pedido_id=pedido.id, producto_id=producto.id,
                                        cantidad=item.cantidad, nombre_producto=producto.nombre,
                                        precio_unitario=producto.precio_base, subtotal=subtotal)
                detalle.pedido = pedido
                uow.session.add(producto)
                uow.session.add(detalle)
                total += subtotal
            pedido.total = round(total, 2)
            uow.session.add(pedido)
            uow.session.flush()
            return PedidoRead.model_validate(pedido)

    def listar(self, usuario_id: int | None, skip: int, limit: int,
               estado: EstadoPedido | None) -> PedidosPaginados:
        with self.uow as uow:
            total, result = uow.pedidos.list_by_usuario(usuario_id, skip, limit, estado.value if estado else None)
            return PedidosPaginados(total=total, items=[PedidoRead.model_validate(o) for o in result])

    @staticmethod
    def _buscar_pedido(uow, id: int) -> Pedido:
        pedido = uow.pedidos.get_detail(id)
        if pedido is None:
            raise NotFound('Pedido no encontrado')
        return pedido

    def detalle(self, id: int, usuario_id: int, es_admin: bool) -> PedidoRead:
        with self.uow as uow:
            pedido = self._buscar_pedido(uow, id)
            if not es_admin and pedido.usuario_id != usuario_id:
                raise Forbidden('Este pedido pertenece a otro usuario')
            return PedidoRead.model_validate(pedido)

    @staticmethod
    def _cambiar_estado(uow, pedido: Pedido, siguiente: EstadoPedido) -> PedidoRead:
        actual = EstadoPedido(pedido.estado)
        if siguiente not in TRANSICIONES[actual]:
            raise BusinessRule(f'Transición inválida: {actual.value} -> {siguiente.value}')
        if siguiente == EstadoPedido.CANCELADO:
            for detalle in pedido.items:
                producto = uow.productos.lock_by_id(detalle.producto_id)
                if producto is None:
                    raise NotFound('Producto asociado al pedido no encontrado')
                producto.stock += detalle.cantidad
                uow.session.add(producto)
        pedido.estado = siguiente.value
        pedido.updated_at = datetime.now(timezone.utc)
        uow.session.add(pedido)
        uow.session.flush()
        return PedidoRead.model_validate(pedido)

    def cambiar_estado(self, id: int, data: CambioEstado) -> PedidoRead:
        with self.uow as uow:
            pedido = self._buscar_pedido(uow, id)
            return self._cambiar_estado(uow, pedido, data.estado)

    def cancelar(self, id: int, usuario_id: int) -> PedidoRead:
        with self.uow as uow:
            pedido = self._buscar_pedido(uow, id)
            if pedido.usuario_id != usuario_id:
                raise Forbidden('Este pedido pertenece a otro usuario')
            if pedido.estado != EstadoPedido.PENDIENTE.value:
                raise BusinessRule('Solo se puede cancelar un pedido propio en PENDIENTE')
            return self._cambiar_estado(uow, pedido, EstadoPedido.CANCELADO)

    def resumen(self) -> ResumenPedidos:
        with self.uow as uow:
            now = datetime.now(timezone.utc)
            start = now.replace(hour=0, minute=0, second=0, microsecond=0)
            end = start + timedelta(days=1)
            count_today = uow.session.exec(select(func.count(Pedido.id)).where(
                Pedido.created_at >= start, Pedido.created_at < end)).one()
            revenue = uow.session.exec(select(func.coalesce(func.sum(Pedido.total), 0)).where(
                Pedido.estado == EstadoPedido.ENTREGADO.value)).one()
            return ResumenPedidos(
                pendientes=uow.pedidos.count_by_estado(EstadoPedido.PENDIENTE.value),
                en_preparacion=uow.pedidos.count_by_estado(EstadoPedido.EN_PREPARACION.value),
                entregados=uow.pedidos.count_by_estado(EstadoPedido.ENTREGADO.value),
                cancelados=uow.pedidos.count_by_estado(EstadoPedido.CANCELADO.value),
                pedidos_hoy=int(count_today), ingresos_entregados=float(revenue))

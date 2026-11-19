from typing import Callable, TypeVar
from fastapi import HTTPException
from app.core.exceptions import DomainError
from fastapi import APIRouter, Depends, Query, status
from app.core.deps import get_current_active_user, require_role
from app.modules.usuarios.models import Usuario
from .schemas import CambioEstado, EstadoPedido, PedidoCreate, PedidoRead, PedidosPaginados, ResumenPedidos
from .service import PedidoService


_Result = TypeVar('_Result')


def _http(action: Callable[[], _Result]) -> _Result:
    """Convierte la excepción de dominio del Service al código HTTP indicado en la consigna."""
    try:
        return action()
    except DomainError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.detail) from exc


router = APIRouter(prefix='/pedidos', tags=['Pedidos'])


def get_pedido_service() -> PedidoService:
    return PedidoService()


@router.post('', response_model=PedidoRead, status_code=status.HTTP_201_CREATED)
def crear(data: PedidoCreate, user: Usuario = Depends(get_current_active_user),
          service: PedidoService = Depends(get_pedido_service)):
    return _http(lambda: service.crear(data, user.id))


@router.get('', response_model=PedidosPaginados)
def listar(skip: int = Query(0, ge=0), limit: int = Query(20, ge=1, le=100),
           estado: EstadoPedido | None = None, user: Usuario = Depends(get_current_active_user),
           service: PedidoService = Depends(get_pedido_service)):
    return _http(lambda: service.listar(None if user.role == 'admin' else user.id, skip, limit, estado))


# La ruta estática /resumen debe declararse antes que /{id}.
@router.get('/resumen', response_model=ResumenPedidos)
def resumen(admin: Usuario = Depends(require_role(['admin'])),
            service: PedidoService = Depends(get_pedido_service)):
    return _http(lambda: service.resumen())


@router.get('/{id}', response_model=PedidoRead)
def detalle(id: int, user: Usuario = Depends(get_current_active_user),
            service: PedidoService = Depends(get_pedido_service)):
    return _http(lambda: service.detalle(id, user.id, user.role == 'admin'))


@router.patch('/{id}/estado', response_model=PedidoRead)
def cambiar_estado(id: int, data: CambioEstado, admin: Usuario = Depends(require_role(['admin'])),
                   service: PedidoService = Depends(get_pedido_service)):
    return _http(lambda: service.cambiar_estado(id, data))


@router.patch('/{id}/cancelar', response_model=PedidoRead)
def cancelar(id: int, user: Usuario = Depends(get_current_active_user),
             service: PedidoService = Depends(get_pedido_service)):
    return _http(lambda: service.cancelar(id, user.id))

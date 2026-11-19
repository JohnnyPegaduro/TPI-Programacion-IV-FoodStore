from typing import Callable, TypeVar
from fastapi import HTTPException
from app.core.exceptions import DomainError
from fastapi import APIRouter, Depends, Query, status
from app.core.deps import require_role
from app.modules.usuarios.models import Usuario
from .schemas import ProductoCreate, ProductoRead, ProductoUpdate, ProductoStockUpdate, ProductosPaginados
from .service import ProductoService


_Result = TypeVar('_Result')


def _http(action: Callable[[], _Result]) -> _Result:
    """Convierte la excepción de dominio del Service al código HTTP indicado en la consigna."""
    try:
        return action()
    except DomainError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.detail) from exc


router = APIRouter(prefix='/productos', tags=['Productos'])


def get_producto_service() -> ProductoService:
    return ProductoService()


@router.get('', response_model=ProductosPaginados)
def listar(skip: int = Query(0, ge=0), limit: int = Query(20, ge=1, le=100),
           search: str | None = None, categoria_id: int | None = None,
           disponible: bool | None = None, service: ProductoService = Depends(get_producto_service)):
    return _http(lambda: service.listar(skip, limit, search, categoria_id, disponible))


@router.get('/{id}', response_model=ProductoRead)
def detalle(id: int, service: ProductoService = Depends(get_producto_service)):
    return _http(lambda: service.detalle(id))


@router.post('', response_model=ProductoRead, status_code=status.HTTP_201_CREATED)
def crear(data: ProductoCreate, admin: Usuario = Depends(require_role(['admin'])),
          service: ProductoService = Depends(get_producto_service)):
    return _http(lambda: service.crear(data))


@router.put('/{id}', response_model=ProductoRead)
def actualizar(id: int, data: ProductoUpdate, admin: Usuario = Depends(require_role(['admin'])),
               service: ProductoService = Depends(get_producto_service)):
    return _http(lambda: service.actualizar(id, data))


@router.patch('/{id}/stock', response_model=ProductoRead)
def stock(id: int, data: ProductoStockUpdate, admin: Usuario = Depends(require_role(['admin'])),
          service: ProductoService = Depends(get_producto_service)):
    return _http(lambda: service.stock(id, data))


@router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
def eliminar(id: int, admin: Usuario = Depends(require_role(['admin'])),
             service: ProductoService = Depends(get_producto_service)):
    _http(lambda: service.eliminar(id))
    return None

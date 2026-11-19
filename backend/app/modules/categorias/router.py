from typing import Callable, TypeVar
from fastapi import HTTPException
from app.core.exceptions import DomainError
from fastapi import APIRouter, Depends, status
from app.core.deps import require_role
from app.modules.usuarios.models import Usuario
from .schemas import CategoriaCreate, CategoriaRead, CategoriaUpdate
from .service import CategoriaService


_Result = TypeVar('_Result')


def _http(action: Callable[[], _Result]) -> _Result:
    """Convierte la excepción de dominio del Service al código HTTP indicado en la consigna."""
    try:
        return action()
    except DomainError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.detail) from exc


router = APIRouter(prefix='/categorias', tags=['Categorías'])


def get_categoria_service() -> CategoriaService:
    return CategoriaService()


@router.get('', response_model=list[CategoriaRead])
def listar(service: CategoriaService = Depends(get_categoria_service)):
    return _http(lambda: service.listar())


@router.get('/{id}', response_model=CategoriaRead)
def detalle(id: int, service: CategoriaService = Depends(get_categoria_service)):
    return _http(lambda: service.detalle(id))


@router.post('', response_model=CategoriaRead, status_code=status.HTTP_201_CREATED)
def crear(data: CategoriaCreate, admin: Usuario = Depends(require_role(['admin'])),
          service: CategoriaService = Depends(get_categoria_service)):
    return _http(lambda: service.crear(data))


@router.put('/{id}', response_model=CategoriaRead)
def actualizar(id: int, data: CategoriaUpdate, admin: Usuario = Depends(require_role(['admin'])),
               service: CategoriaService = Depends(get_categoria_service)):
    return _http(lambda: service.actualizar(id, data))


@router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
def eliminar(id: int, admin: Usuario = Depends(require_role(['admin'])),
             service: CategoriaService = Depends(get_categoria_service)):
    _http(lambda: service.eliminar(id))
    return None

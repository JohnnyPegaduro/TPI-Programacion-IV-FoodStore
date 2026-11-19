from fastapi import APIRouter, Depends
from sqlmodel import Session
from app.core.database import get_session
from app.core.deps import require_role
from .models import Usuario
from .schemas import UserPublic
from .service import UsuarioService

router = APIRouter(prefix='/admin/usuarios', tags=['Administración de usuarios'])


@router.get('', response_model=list[UserPublic])
def listar(admin: Usuario = Depends(require_role(['admin'])), session: Session = Depends(get_session)):
    return UsuarioService().listar(session)


@router.post('/{id}/activar', response_model=UserPublic)
def activar(id: int, admin: Usuario = Depends(require_role(['admin'])),
            session: Session = Depends(get_session)):
    return UsuarioService().estado(session, id, False, admin.id)


@router.post('/{id}/desactivar', response_model=UserPublic)
def desactivar(id: int, admin: Usuario = Depends(require_role(['admin'])),
               session: Session = Depends(get_session)):
    return UsuarioService().estado(session, id, True, admin.id)

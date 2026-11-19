from collections.abc import Callable
from fastapi import Cookie, Depends, HTTPException, status
from sqlmodel import Session, select
from .database import get_session
from .security import decode_access_token
from app.modules.usuarios.models import Usuario


def get_current_user(
    access_token: str | None = Cookie(default=None),
    session: Session = Depends(get_session),
) -> Usuario:
    if not access_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Sesión requerida')
    try:
        username = decode_access_token(access_token)
    except ValueError as exc:
        raise HTTPException(status_code=401, detail=str(exc)) from exc
    user = session.exec(select(Usuario).where(Usuario.username == username)).first()
    if user is None:
        raise HTTPException(status_code=401, detail='Usuario de la sesión no encontrado')
    return user


def get_current_active_user(user: Usuario = Depends(get_current_user)) -> Usuario:
    if user.disabled:
        raise HTTPException(status_code=400, detail='Cuenta de usuario desactivada')
    return user


def require_role(roles: list[str]) -> Callable:
    def validate(user: Usuario = Depends(get_current_active_user)) -> Usuario:
        if user.role not in roles:
            raise HTTPException(status_code=403, detail='Acceso denegado: permisos insuficientes')
        return user
    return validate

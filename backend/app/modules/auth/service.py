from fastapi import HTTPException
from sqlmodel import Session
from app.core.security import verify_password
from app.modules.usuarios.repository import UsuarioRepository
from app.modules.usuarios.models import Usuario


class AuthService:
    def autenticar(self, session: Session, username: str, password: str) -> Usuario:
        user = UsuarioRepository(session).get_by_username(username)
        if user is None or not verify_password(password, user.hashed_password):
            raise HTTPException(status_code=401, detail='Usuario o contraseña incorrectos')
        if user.disabled:
            raise HTTPException(status_code=400, detail='Cuenta de usuario desactivada')
        return user

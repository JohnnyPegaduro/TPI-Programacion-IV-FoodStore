from sqlmodel import Session, select
from app.core.exceptions import BusinessRule, Conflict, NotFound
from app.core.security import hash_password
from .models import Usuario
from .schemas import UserCreate, UserPublic
from .repository import UsuarioRepository


class UsuarioService:
    def registrar(self, session: Session, data: UserCreate) -> UserPublic:
        repo = UsuarioRepository(session)
        if repo.get_by_username(data.username) or repo.get_by_email(data.email):
            raise Conflict('Nombre de usuario o correo electrónico duplicado')
        usuario = Usuario(username=data.username, full_name=data.full_name, email=data.email,
                          hashed_password=hash_password(data.password), role='user', disabled=False)
        repo.add(usuario)
        session.commit()
        session.refresh(usuario)
        return UserPublic.model_validate(usuario)

    def listar(self, session: Session) -> list[UserPublic]:
        return [UserPublic.model_validate(u) for u in session.exec(select(Usuario).order_by(Usuario.id)).all()]

    def estado(self, session: Session, id: int, disabled: bool, admin_id: int) -> UserPublic:
        usuario = session.get(Usuario, id)
        if not usuario:
            raise NotFound('Usuario no encontrado')
        if disabled and id == admin_id:
            raise BusinessRule('No podés desactivar tu propia cuenta de administrador')
        usuario.disabled = disabled
        session.add(usuario)
        session.commit()
        session.refresh(usuario)
        return UserPublic.model_validate(usuario)

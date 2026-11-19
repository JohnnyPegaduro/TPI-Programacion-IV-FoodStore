from fastapi import APIRouter, Depends, Response
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session
from app.core.config import settings
from app.core.database import get_session
from app.core.deps import get_current_active_user
from app.core.security import create_access_token
from app.modules.usuarios.models import Usuario
from app.modules.usuarios.schemas import UserCreate, UserPublic
from app.modules.usuarios.service import UsuarioService
from .service import AuthService
from .schemas import LoginResponse, LogoutResponse

router = APIRouter(prefix='/auth', tags=['Autenticación'])


@router.post('/register', response_model=UserPublic, status_code=201)
def register(data: UserCreate, session: Session = Depends(get_session)):
    return UsuarioService().registrar(session, data)


@router.post('/token', response_model=LoginResponse)
def login(response: Response, form: OAuth2PasswordRequestForm = Depends(),
          session: Session = Depends(get_session)):
    user = AuthService().autenticar(session, form.username, form.password)
    token = create_access_token(user.username)
    response.set_cookie('access_token', token, httponly=True, secure=False, samesite='lax',
                        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60, path='/')
    return LoginResponse()


@router.post('/logout', response_model=LogoutResponse)
def logout(response: Response):
    response.delete_cookie('access_token', path='/', samesite='lax')
    return LogoutResponse()


@router.get('/me', response_model=UserPublic)
def me(user: Usuario = Depends(get_current_active_user)):
    return UserPublic.model_validate(user)

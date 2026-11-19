from sqlmodel import SQLModel


class LoginResponse(SQLModel):
    message: str = 'Login exitoso'


class LogoutResponse(SQLModel):
    message: str = 'Sesión cerrada'

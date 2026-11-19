from functools import lru_cache
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file='.env', extra='ignore')
    DATABASE_URL: str = 'sqlite:///./foodstore.db'
    SECRET_KEY: str = Field(default='CAMBIAR_POR_UNA_CLAVE_SEGURA_DE_32_CARACTERES', min_length=32)
    ALGORITHM: str = 'HS256'
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    FRONTEND_ORIGIN: str = 'http://localhost:5173'
    SEED_ADMIN_USERNAME: str = 'admin'
    SEED_ADMIN_PASSWORD: str = 'Admin1234!'


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()

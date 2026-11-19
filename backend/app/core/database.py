from collections.abc import Generator
from sqlmodel import SQLModel, Session, create_engine
from .config import settings

connect_args = {'check_same_thread': False} if settings.DATABASE_URL.startswith('sqlite') else {}
engine = create_engine(settings.DATABASE_URL, connect_args=connect_args, pool_pre_ping=True)


def session_factory() -> Session:
    return Session(engine, expire_on_commit=False)


def get_session() -> Generator[Session, None, None]:
    with session_factory() as session:
        yield session


def create_all_tables() -> None:
    import app.db.models  # noqa: F401 - registra las cinco entidades antes de create_all
    SQLModel.metadata.create_all(engine)

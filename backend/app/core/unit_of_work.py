from collections.abc import Callable
from sqlmodel import Session
from .database import session_factory


class UnitOfWork:
    """Transacción por operación; único lugar de commit/rollback/close en módulos de negocio."""

    def __init__(self, factory: Callable[[], Session] = session_factory):
        self.factory = factory
        self.session: Session | None = None

    def __enter__(self):
        self.session = self.factory()
        self._init_repositories()
        return self

    def _init_repositories(self) -> None:
        pass

    def __exit__(self, exc_type, exc_val, exc_tb) -> bool:
        assert self.session is not None
        try:
            if exc_type is None:
                self.session.commit()
            else:
                self.session.rollback()
        except Exception:
            self.session.rollback()
            raise
        finally:
            self.session.close()
        return False

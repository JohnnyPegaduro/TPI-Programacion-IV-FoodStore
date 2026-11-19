from typing import Generic, TypeVar
from sqlmodel import SQLModel, Session, select

T = TypeVar('T', bound=SQLModel)


class BaseRepository(Generic[T]):
    def __init__(self, session: Session, model: type[T]):
        self.session = session
        self.model = model

    def get_by_id(self, identifier: int) -> T | None:
        return self.session.get(self.model, identifier)

    def get_all(self) -> list[T]:
        return list(self.session.exec(select(self.model)).all())

    def add(self, instance: T) -> T:
        self.session.add(instance)
        self.session.flush()
        return instance

    def delete(self, instance: T) -> None:
        self.session.delete(instance)

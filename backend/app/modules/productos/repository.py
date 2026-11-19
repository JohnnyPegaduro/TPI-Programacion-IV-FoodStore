from sqlalchemy import func
from sqlalchemy.orm import selectinload
from sqlmodel import select
from app.core.base_repository import BaseRepository
from .models import Producto


class ProductoRepository(BaseRepository[Producto]):
    def __init__(self, session):
        super().__init__(session, Producto)

    def get_detail(self, id: int) -> Producto | None:
        return self.session.exec(select(Producto).where(Producto.id == id).options(selectinload(Producto.categoria))).first()

    def search(self, skip: int = 0, limit: int = 20, search: str | None = None,
               categoria_id: int | None = None, disponible: bool | None = None) -> tuple[int, list[Producto]]:
        filters = [Producto.activo.is_(True)]
        if search:
            filters.append(Producto.nombre.ilike(f'%{search}%'))
        if categoria_id is not None:
            filters.append(Producto.categoria_id == categoria_id)
        if disponible is not None:
            filters.append(Producto.disponible == disponible)
        statement = select(Producto).where(*filters)
        count = self.session.exec(select(func.count(Producto.id)).where(*filters)).one()
        data = self.session.exec(statement.options(selectinload(Producto.categoria)).order_by(Producto.id).offset(skip).limit(limit)).all()
        return int(count), list(data)

    def lock_by_id(self, identifier: int) -> Producto | None:
        # FOR UPDATE tiene efecto en PostgreSQL y evita descuentos concurrentes de stock.
        return self.session.exec(select(Producto).where(Producto.id == identifier).with_for_update()).first()

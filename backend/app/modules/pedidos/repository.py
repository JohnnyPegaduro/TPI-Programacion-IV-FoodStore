from sqlalchemy import func
from sqlalchemy.orm import selectinload
from sqlmodel import select
from app.core.base_repository import BaseRepository
from .models import Pedido


class PedidoRepository(BaseRepository[Pedido]):
    def __init__(self, session):
        super().__init__(session, Pedido)

    def get_detail(self, id: int) -> Pedido | None:
        return self.session.exec(select(Pedido).where(Pedido.id == id).options(selectinload(Pedido.items))).first()

    def list_by_usuario(self, usuario_id: int | None, skip: int, limit: int, estado: str | None) -> tuple[int, list[Pedido]]:
        filters = []
        if usuario_id is not None:
            filters.append(Pedido.usuario_id == usuario_id)
        if estado:
            filters.append(Pedido.estado == estado)
        count = self.session.exec(select(func.count(Pedido.id)).where(*filters)).one()
        stmt = (select(Pedido).where(*filters).options(selectinload(Pedido.items))
                .order_by(Pedido.id.desc()).offset(skip).limit(limit))
        return int(count), list(self.session.exec(stmt).all())

    def count_by_estado(self, estado: str) -> int:
        return int(self.session.exec(select(func.count(Pedido.id)).where(Pedido.estado == estado)).one())

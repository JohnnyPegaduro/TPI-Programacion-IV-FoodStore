from datetime import datetime, timezone
from sqlmodel import Field, Relationship, SQLModel


class Pedido(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    usuario_id: int = Field(foreign_key='usuario.id', index=True)
    estado: str = Field(default='PENDIENTE', index=True)
    forma_pago: str
    direccion_entrega: str
    notas: str | None = Field(default=None)
    total: float = Field(default=0, ge=0)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    usuario: 'Usuario' = Relationship(back_populates='pedidos')
    items: list['DetallePedido'] = Relationship(back_populates='pedido')


class DetallePedido(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    pedido_id: int = Field(foreign_key='pedido.id', index=True)
    producto_id: int = Field(foreign_key='producto.id', index=True)
    cantidad: int = Field(ge=1)
    nombre_producto: str
    precio_unitario: float = Field(ge=0)
    subtotal: float = Field(ge=0)
    pedido: 'Pedido' = Relationship(back_populates='items')
    producto: 'Producto' = Relationship(back_populates='detalles')

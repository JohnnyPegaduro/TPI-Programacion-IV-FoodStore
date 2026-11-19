from sqlmodel import Field, Relationship, SQLModel


class Categoria(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    nombre: str = Field(index=True, unique=True)
    descripcion: str = Field(default='')
    activo: bool = Field(default=True)
    productos: list['Producto'] = Relationship(back_populates='categoria')

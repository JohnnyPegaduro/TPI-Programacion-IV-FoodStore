from app.core.exceptions import Conflict, NotFound
from .models import Categoria
from .schemas import CategoriaCreate, CategoriaRead, CategoriaUpdate
from .unit_of_work import CategoriaUnitOfWork


class CategoriaService:
    def __init__(self, uow: CategoriaUnitOfWork | None = None):
        self.uow = uow or CategoriaUnitOfWork()

    def listar(self) -> list[CategoriaRead]:
        with self.uow as uow:
            return [CategoriaRead.model_validate(c) for c in uow.categorias.list_active()]

    def detalle(self, identifier: int) -> CategoriaRead:
        with self.uow as uow:
            category = uow.categorias.get_by_id(identifier)
            if not category or not category.activo:
                raise NotFound('Categoría no encontrada')
            return CategoriaRead.model_validate(category)

    def crear(self, data: CategoriaCreate) -> CategoriaRead:
        with self.uow as uow:
            if uow.categorias.get_by_nombre(data.nombre):
                raise Conflict('El nombre de categoría ya existe')
            c = uow.categorias.add(Categoria(**data.model_dump()))
            return CategoriaRead.model_validate(c)

    def actualizar(self, identifier: int, data: CategoriaUpdate) -> CategoriaRead:
        with self.uow as uow:
            c = uow.categorias.get_by_id(identifier)
            if not c or not c.activo:
                raise NotFound('Categoría no encontrada')
            fields = data.model_dump(exclude_unset=True)
            if 'nombre' in fields and fields['nombre'] != c.nombre and uow.categorias.get_by_nombre(fields['nombre']):
                raise Conflict('El nombre de categoría ya existe')
            for k, v in fields.items():
                if v is not None:
                    setattr(c, k, v)
            uow.session.add(c)
            return CategoriaRead.model_validate(c)

    def eliminar(self, identifier: int) -> None:
        with self.uow as uow:
            c = uow.categorias.get_by_id(identifier)
            if not c or not c.activo:
                raise NotFound('Categoría no encontrada')
            c.activo = False
            uow.session.add(c)

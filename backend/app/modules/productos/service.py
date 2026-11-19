from app.core.exceptions import NotFound
from .models import Producto
from .schemas import ProductoCreate, ProductoRead, ProductoUpdate, ProductoStockUpdate, ProductosPaginados
from .unit_of_work import ProductoUnitOfWork


class ProductoService:
    def __init__(self, uow: ProductoUnitOfWork | None = None):
        self.uow = uow or ProductoUnitOfWork()

    @staticmethod
    def _ensure_category(uow, category_id: int):
        c = uow.categorias.get_by_id(category_id)
        if c is None or not c.activo:
            raise NotFound('Categoría no encontrada o inactiva')
        return c

    def listar(self, skip: int, limit: int, search: str | None, categoria_id: int | None,
               disponible: bool | None) -> ProductosPaginados:
        with self.uow as uow:
            count, products = uow.productos.search(skip, limit, search, categoria_id, disponible)
            return ProductosPaginados(total=count, items=[ProductoRead.model_validate(p) for p in products])

    def detalle(self, identifier: int) -> ProductoRead:
        with self.uow as uow:
            product = uow.productos.get_detail(identifier)
            if product is None or not product.activo:
                raise NotFound('Producto no encontrado')
            return ProductoRead.model_validate(product)

    def crear(self, data: ProductoCreate) -> ProductoRead:
        with self.uow as uow:
            category = self._ensure_category(uow, data.categoria_id)
            product = Producto(**data.model_dump())
            product.categoria = category
            uow.productos.add(product)
            return ProductoRead.model_validate(product)

    def actualizar(self, identifier: int, data: ProductoUpdate) -> ProductoRead:
        with self.uow as uow:
            product = uow.productos.get_detail(identifier)
            if product is None or not product.activo:
                raise NotFound('Producto no encontrado')
            fields = data.model_dump(exclude_unset=True)
            if 'categoria_id' in fields and fields['categoria_id'] is not None:
                product.categoria = self._ensure_category(uow, fields['categoria_id'])
            for k, v in fields.items():
                if v is not None and k != 'categoria_id':
                    setattr(product, k, v)
            uow.session.add(product)
            return ProductoRead.model_validate(product)

    def stock(self, identifier: int, data: ProductoStockUpdate) -> ProductoRead:
        with self.uow as uow:
            product = uow.productos.get_detail(identifier)
            if product is None or not product.activo:
                raise NotFound('Producto no encontrado')
            for k, v in data.model_dump(exclude_unset=True).items():
                if v is not None:
                    setattr(product, k, v)
            uow.session.add(product)
            return ProductoRead.model_validate(product)

    def eliminar(self, identifier: int) -> None:
        with self.uow as uow:
            product = uow.productos.get_by_id(identifier)
            if product is None or not product.activo:
                raise NotFound('Producto no encontrado')
            product.activo = False
            uow.session.add(product)

from app.core.unit_of_work import UnitOfWork
from .repository import CategoriaRepository


class CategoriaUnitOfWork(UnitOfWork):
    def _init_repositories(self):
        self.categorias = CategoriaRepository(self.session)

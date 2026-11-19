# Importar todos los modelos juntos para resolver relaciones forward y claves foráneas.
from app.modules.usuarios.models import Usuario  # noqa: F401
from app.modules.categorias.models import Categoria  # noqa: F401
from app.modules.productos.models import Producto  # noqa: F401
from app.modules.pedidos.models import Pedido, DetallePedido  # noqa: F401

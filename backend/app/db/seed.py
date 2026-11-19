"""Seed idempotente exigido por el TPI: python -m app.db.seed."""
from sqlmodel import select
from app.core.config import settings
from app.core.database import create_all_tables, session_factory
from app.core.security import hash_password
from app.modules.usuarios.models import Usuario
from app.modules.categorias.models import Categoria
from app.modules.productos.models import Producto

CATEGORIAS = [
    ('Pizzas', 'Pizzas artesanales al horno'),
    ('Hamburguesas', 'Hamburguesas clásicas y especiales'),
    ('Bebidas', 'Bebidas frías para acompañar'),
]
PRODUCTOS = [
    ('Pizza mozzarella', 'Pizzas', 9500, 25, 'Masa artesanal, mozzarella y salsa de tomate', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600'),
    ('Pizza napolitana', 'Pizzas', 10800, 15, 'Tomate fresco, mozzarella y albahaca', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600'),
    ('Pizza fugazzeta', 'Pizzas', 11000, 12, 'Cebolla y abundante queso', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600'),
    ('Hamburguesa clásica', 'Hamburguesas', 8500, 25, 'Carne, queso, lechuga y tomate', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600'),
    ('Hamburguesa doble', 'Hamburguesas', 11500, 18, 'Doble carne y doble cheddar', 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600'),
    ('Hamburguesa veggie', 'Hamburguesas', 8200, 10, 'Medallón vegetal, queso y vegetales', 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=600'),
    ('Agua mineral', 'Bebidas', 2200, 50, 'Botella de agua de 500 ml', 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=600'),
    ('Gaseosa', 'Bebidas', 3000, 48, 'Gaseosa fría de 500 ml', 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=600'),
]


def seed() -> None:
    create_all_tables()
    with session_factory() as session:
        admin = session.exec(select(Usuario).where(Usuario.username == settings.SEED_ADMIN_USERNAME)).first()
        if not admin:
            session.add(Usuario(username=settings.SEED_ADMIN_USERNAME,
                                full_name='Administrador Food Store', email='admin@example.com',
                                hashed_password=hash_password(settings.SEED_ADMIN_PASSWORD), role='admin'))
            session.flush()
        for nombre, desc in CATEGORIAS:
            category = session.exec(select(Categoria).where(Categoria.nombre == nombre)).first()
            if category is None:
                session.add(Categoria(nombre=nombre, descripcion=desc))
                session.flush()
        for nombre, category_name, precio, stock, desc, img in PRODUCTOS:
            existing = session.exec(select(Producto).where(Producto.nombre == nombre)).first()
            if existing is not None:
                continue
            category = session.exec(select(Categoria).where(Categoria.nombre == category_name)).first()
            assert category is not None
            session.add(Producto(categoria_id=category.id, nombre=nombre, precio_base=precio,
                                stock=stock, descripcion=desc, imagen_url=img))
        session.commit()
    print('Seed completo: admin, 3 categorías y 8 productos (sin duplicados).')


if __name__ == '__main__':
    seed()

"""Ejecutar con: pytest -q. SQLite temporal: no toca PostgreSQL ni las credenciales personales."""
import os
import tempfile
from pathlib import Path

TEST_DB = Path(tempfile.gettempdir()) / 'foodstore_tpi_pruebas_utn.sqlite3'
if TEST_DB.exists():
    TEST_DB.unlink()
os.environ['DATABASE_URL'] = f'sqlite:///{TEST_DB.as_posix()}'
os.environ['SECRET_KEY'] = 'CLAVE_SEGURA_LOCAL_PARA_PRUEBAS_AUTOMATIZADAS_12345'

from fastapi.testclient import TestClient  # noqa: E402
from app.main import app  # noqa: E402
from app.db.seed import seed  # noqa: E402
from app.core.database import session_factory  # noqa: E402
from app.modules.productos.models import Producto  # noqa: E402


def test_end_to_end():
    seed()
    seed()  # idempotencia
    with TestClient(app) as client:
        base = '/api/v1'
        categories = client.get(f'{base}/categorias')
        assert categories.status_code == 200 and len(categories.json()) == 3
        products = client.get(f'{base}/productos').json()
        assert products['total'] == 8 and len(products['items']) == 8
        register = client.post(f'{base}/auth/register', json={
            'username': 'cliente_test', 'full_name': 'Cliente de Prueba',
            'email': 'cliente@example.com', 'password': 'Cliente1234!'})
        assert register.status_code == 201, register.text
        assert register.json()['role'] == 'user' and 'hashed_password' not in register.json()
        assert client.post(f'{base}/auth/register', json={
            'username': 'cliente_test', 'full_name': 'Cliente de Prueba',
            'email': 'cliente2@example.com', 'password': 'Cliente1234!'}).status_code == 409
        assert client.post(f'{base}/auth/token', data={'username': 'cliente_test', 'password': 'mala'}).status_code == 401
        assert client.post(f'{base}/auth/token', data={'username': 'cliente_test', 'password': 'Cliente1234!'}).status_code == 200
        assert 'access_token' in client.cookies
        assert client.get(f'{base}/auth/me').json()['role'] == 'user'
        assert client.post(f'{base}/categorias', json={'nombre': 'Prohibida'}).status_code == 403
        product = products['items'][0]
        original_stock = product['stock']
        order = {'items': [{'producto_id': product['id'], 'cantidad': 2}],
                 'forma_pago': 'EFECTIVO', 'direccion_entrega': 'Calle 123, CABA'}
        created = client.post(f'{base}/pedidos', json=order)
        assert created.status_code == 201, created.text
        pedido = created.json()
        assert pedido['estado'] == 'PENDIENTE' and pedido['total'] == 2 * product['precio_base']
        assert pedido['items'][0]['nombre_producto'] == product['nombre']
        after_purchase = client.get(f"{base}/productos/{product['id']}").json()
        assert after_purchase['stock'] == original_stock - 2
        assert client.patch(f"{base}/pedidos/{pedido['id']}/estado", json={'estado': 'ENTREGADO'}).status_code == 403
        assert client.post(f'{base}/pedidos', json={**order, 'items': [order['items'][0]] * 2}).status_code == 400
        assert client.post(f'{base}/pedidos', json={**order, 'items': [{'producto_id': product['id'], 'cantidad': 5000}]}).status_code == 400
        assert client.get(f"{base}/productos/{product['id']}").json()['stock'] == original_stock - 2
        cancelled = client.patch(f"{base}/pedidos/{pedido['id']}/cancelar")
        assert cancelled.status_code == 200 and cancelled.json()['estado'] == 'CANCELADO'
        assert client.get(f"{base}/productos/{product['id']}").json()['stock'] == original_stock
        assert client.patch(f"{base}/pedidos/{pedido['id']}/cancelar").status_code == 400
        assert client.post(f'{base}/auth/logout').status_code == 200
        assert client.get(f'{base}/pedidos').status_code == 401
        assert client.post(f'{base}/auth/token', data={'username': 'admin', 'password': 'Admin1234!'}).status_code == 200
        assert client.get(f'{base}/pedidos/resumen').status_code == 200
        assert client.post(f'{base}/categorias', json={'nombre': 'Promociones'}).status_code == 201
        assert client.post(f'{base}/categorias', json={'nombre': 'Promociones'}).status_code == 409
        assert client.patch(f"{base}/productos/{product['id']}/stock", json={'stock': 22, 'disponible': True}).status_code == 200
        assert client.delete(f"{base}/productos/{product['id']}").status_code == 204
        assert client.get(f"{base}/productos/{product['id']}").status_code == 404
        # No se borra realmente la fila.
        with session_factory() as session:
            assert session.get(Producto, product['id']).activo is False

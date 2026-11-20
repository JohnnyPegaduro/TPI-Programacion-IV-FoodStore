# Food Store — Trabajo Práctico Integrador · Programación IV (UTN)

**Alumno:** Matías Ariel Deluca · **Modalidad:** individual  
**Proyecto:** aplicación de pedidos de comida. Backend **FastAPI + SQLModel + PostgreSQL**; frontend **React + TypeScript + Vite**.


> - **Repositorio público de GitHub:** `https://github.com/JohnnyPegaduro/TPI-Programacion-IV-FoodStore`
> - **Video demostrativo público:** `https://youtu.be/WaRyuSZ_Jqo`


## 1. Descripción funcional

El cliente se registra e inicia sesión; explora un catálogo paginado y filtrable, añade productos a un carrito persistente, completa una dirección y elige pago en efectivo o transferencia. Confirma el pedido y puede consultar sus propios pedidos y cancelar los **PENDIENTE**.

El administrador gestiona **categorías, productos, stock, disponibilidad, usuarios y pedidos**, actualiza estados permitidos y consulta un resumen con indicadores de negocio. Los permisos se verifican en el **backend** en cada endpoint, no solo en React.

La API usa JWT exclusivamente en cookie **HttpOnly**, sin guardar el token en `localStorage`. Zustand persiste solo datos públicos de sesión y carrito; TanStack Query administra el estado obtenido del servidor.

## 2. Requisitos

- Python **3.11, 3.12 o 3.13** (no 3.14 con las versiones de la consigna).
- PostgreSQL **15 o superior**, con una base vacía `foodstore_db`; para desarrollo es posible usar SQLite en `DATABASE_URL`.
- Node.js **20.19 o superior** y **pnpm 9 o superior**.
- Git para publicar el repositorio público.
- Dos terminales, una para backend y otra para frontend.

El proyecto fue desarrollado para ejecutarse en **http://localhost:8000** (API) y **http://localhost:5173** (web). Usar `localhost` de forma consistente por el manejo de cookies y CORS.

## 3. Estructura

```text
FoodStore_TPI_Deluca/
├── README.md                  ← Único README evaluado
├── backend/
│   ├── .env.example
│   ├── requirements.txt
│   ├── app/
│   │   ├── main.py
│   │   ├── core/               ← settings, database, security, deps, UoW y BaseRepository[T]
│   │   ├── db/seed.py          ← python -m app.db.seed
│   │   └── modules/
│   │       ├── auth/
│   │       ├── usuarios/
│   │       ├── categorias/
│   │       ├── productos/
│   │       └── pedidos/
│   ├── docs/UML_FOOD_STORE.svg
│   └── tests/test_api.py
└── frontend/
    ├── .env.example
    ├── package.json
    └── src/
        ├── features/          ← auth, categorias, productos, pedidos, usuarios
        │   └── <feature>/     ← pages, components, hooks, api, types
        ├── shared/            ← axiosInstance, manejo de errores, UI, layout y tabla
        ├── store/             ← authStore y cartStore (Zustand con persist)
        ├── routes/            ← AppRouter y ProtectedRoute
        ├── App.tsx            ← llama a checkSession al montar
        ├── main.tsx           ← QueryClientProvider
        └── index.css          ← Tailwind CSS 4
```

Las entidades corresponden al diagrama incluido, **`backend/docs/UML_FOOD_STORE.svg`**:
`Usuario` 1:N `Pedido`, `Categoria` 1:N `Producto`, `Pedido` 1:N `DetallePedido`, `Producto` 1:N `DetallePedido`. Los nombres de `Relationship` y `back_populates` coinciden con el UML.

## 4. Instalar y ejecutar el backend

Crear la base de datos desde pgAdmin o psql:

```sql
CREATE DATABASE foodstore_db;
```

### Windows PowerShell

```powershell
cd backend
py -3.13 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
Copy-Item .env.example .env
```

> En Windows, usar Python **3.13** (como en la instalación verificada), o reemplazar `py -3.13` por `py -3.12` / `py -3.11` si la versión instalada está entre 3.11 y 3.13. Verificar con `py -0p`.

Editar **`backend/.env`**:

```dotenv
DATABASE_URL=postgresql://postgres:TU_CLAVE@localhost:5432/foodstore_db
SECRET_KEY=UNA_CLAVE_CRIPTOGRAFICAMENTE_ALEATORIA_DE_MAS_DE_32_CARACTERES
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
FRONTEND_ORIGIN=http://localhost:5173
SEED_ADMIN_USERNAME=admin
SEED_ADMIN_PASSWORD=Admin1234!
```

Generar la clave JWT en PowerShell:

```powershell
.\.venv\Scripts\python.exe -c "import secrets; print(secrets.token_urlsafe(48))"
```

Pegá el resultado en `SECRET_KEY`. Si la contraseña de PostgreSQL tiene caracteres reservados (`@`, `:`, `/`, `#`, etc.), codificalos para una URL antes de colocarla en `DATABASE_URL`.

El seed **no** borra datos existentes ni sobrescribe usuarios o productos modificados. Ejecutarlo desde **`backend/`**:

```powershell
.\.venv\Scripts\python.exe -m app.db.seed
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload
```

En macOS/Linux, usar `python3 -m venv .venv`, activar el entorno (`source .venv/bin/activate`), luego `pip install -r requirements.txt`, `python -m app.db.seed` y `uvicorn app.main:app `.

La documentación está en **http://localhost:8000/docs** y **http://localhost:8000/redoc**. El healthcheck está en `/health`.

### Usuario de administrador del seed

- **Usuario:** `admin`
- **Contraseña académica inicial:** `Admin1234!`
- **Rol:** `admin`
- **Qué carga el seed:** un administrador, 3 categorías y 8 productos con stock.

La contraseña se determina mediante `SEED_ADMIN_PASSWORD` **en el momento de crear** la cuenta. Si admin ya existía, el seed idempotente **no cambia su contraseña**. Cambiar esta contraseña para otros entornos.

## 5. Instalar y ejecutar el frontend

En **otra terminal**:

```powershell
cd frontend
Copy-Item .env.example .env
pnpm install
pnpm build
pnpm dev
```

El `frontend/.env` debe contener:

```dotenv
VITE_API_URL=http://localhost:8000/api/v1
```

Abrir **http://localhost:5173**. El comando de build utiliza `tsc -b && vite build` con TypeScript estricto (`strict: true`).

Si `pnpm` no está disponible, habilitar Corepack (`corepack enable`) y verificar la versión (`pnpm --version`).

### URLs principales

| Página | Acceso |
|---|---|
| `/` | Catálogo público con filtros, skeleton, búsqueda y paginación server-side |
| `/login`, `/register` | Público |
| `/carrito` | Público, persiste al recargar |
| `/checkout` | Sesión requerida |
| `/mis-pedidos` | Sesión requerida; cada usuario ve sus pedidos |
| `/admin/resumen` | Admin |
| `/admin/categorias` | Admin |
| `/admin/productos` | Admin |
| `/admin/pedidos` | Admin |
| `/admin/usuarios` | Admin |
| `/unauthorized` | Público, acceso denegado |

## 6. Arquitectura del backend y transacciones

`Router → Service → UnitOfWork → Repository → Model`. Cada módulo de negocio tiene los archivos `router.py`, `service.py`, `unit_of_work.py`, `repository.py`, `models.py`, `schemas.py` (en `auth/` no se requiere entidad propia).

- **Router:** declara endpoints y dependencias; captura errores de dominio a través del manejador global que responde `{"detail":"..."}`.
- **Service:** ejecuta reglas de negocio y devuelve schemas de lectura **dentro** del bloque `with self.uow as uow:`.
- **UnitOfWork:** abre una única `Session` en `__enter__`, expone repositorios que comparten esa sesión y realiza `commit`, `rollback` y `close` en `__exit__`.
- **Repository:** consultas SQLModel sin reglas de negocio, hereda `BaseRepository[T]`.
- **Model:** cinco tablas SQLModel `table=True`; **Schemas** separados para entrada/salida.

No hay `session.commit()` ni en routers ni en services de categorías, productos y pedidos. En pedidos, una operación fallida deshace todos los cambios de la transacción.

### Reglas de negocio RN-01 a RN-06

- **RN-01:** pedido con al menos un producto sin repeticiones; todos activos, disponibles y con stock. La compra descuenta stock, registra líneas con copia de nombre y precio unitario y fija el total. Una transacción o nada. Para PostgreSQL se usa `SELECT ... FOR UPDATE` al descontar stock.
- **RN-02:** `PENDIENTE → EN_PREPARACION | CANCELADO`; `EN_PREPARACION → ENTREGADO | CANCELADO`; `ENTREGADO` y `CANCELADO` no admiten cambios.
- **RN-03:** cancelar repone todo el stock de las líneas, dentro de la misma transacción.
- **RN-04:** usuario ve y cancela **únicamente sus propios pedidos** y solo desde `PENDIENTE`. Admin puede ver todos y avanzar/cancelar no terminales.
- **RN-05:** no existen endpoints para cambiar líneas, precio, total o borrar un pedido.
- **RN-06:** pago `EFECTIVO` o `TRANSFERENCIA`; dirección de 5–200 caracteres.

Los errores siguen el documento: 401 token ausente/inválido, 400 cuenta desactivada, 403 rol o pedido ajeno, 404 inexistente, 409 duplicado, 422 validación y 400 reglas de negocio.

### APIs de referencia (prefijo `/api/v1`)

| Recurso | Endpoints |
|---|---|
| Auth | `POST /auth/register`, `POST /auth/token`, `POST /auth/logout`, `GET /auth/me` |
| Usuarios | `GET /admin/usuarios`, `POST /admin/usuarios/{id}/activar`, `POST /admin/usuarios/{id}/desactivar` |
| Categorías | `GET /categorias`, `GET /categorias/{id}`, `POST /categorias`, `PUT /categorias/{id}`, `DELETE /categorias/{id}` |
| Productos | `GET /productos`, `GET /productos/{id}`, `POST /productos`, `PUT /productos/{id}`, `PATCH /productos/{id}/stock`, `DELETE /productos/{id}` |
| Pedidos | `POST /pedidos`, `GET /pedidos`, `GET /pedidos/resumen`, `GET /pedidos/{id}`, `PATCH /pedidos/{id}/estado`, `PATCH /pedidos/{id}/cancelar` |

La baja de categorías y productos es **lógica** (`activo=false`). Los pedidos nunca se borran. La baja lógica de una categoría no elimina ni oculta automáticamente sus productos. En el proyecto, el `PUT` actualiza **solo los campos enviados**, según la convención particular de la consigna.

## 7. Tecnologías y manejo del estado

- **Backend:** FastAPI, SQLModel, SQLAlchemy, PostgreSQL, Pydantic, JWT con `python-jose`, bcrypt.
- **Frontend:** React 19, TypeScript 5.9, Vite 7, Tailwind 4, Axios, TanStack Query 5, **TanStack Form 1**, **TanStack Table 8**, React Router 7 y Zustand 5.
- **TanStack Query:** `useQuery` y `useMutation`, claves descriptivas e invalidación tras compras, cancelaciones o edición de catálogo.
- **TanStack Form:** formularios de registro, login, categorías, productos, stock y checkout.
- **TanStack Table:** listados administrativos paginados por el cliente de categorías, productos, pedidos y usuarios.
- **Zustand persist:** `authStore` conserva **solo el usuario público** (`partialize`) y verifica sesión al montar con `/auth/me`; `cartStore` persiste ítems, cantidad, precio ilustrativo y subtotal. Jamás se guarda el JWT en JS.
- **Axios:** `baseURL=VITE_API_URL`, `withCredentials: true` e interceptor para 401 y cuentas desactivadas.

## 8. Pruebas

El archivo `backend/tests/test_api.py` incluye un flujo con SQLite temporal de seed idempotente, registro, usuario duplicado, 401/403, permisos, creación de pedido, stock, cancelación y stock restituido, más baja lógica de productos.

```powershell
cd backend
.\.venv\Scripts\python.exe -m pytest -q
```

### Seguridad y archivos excluidos

Se incluyen `.env.example` con valores de referencia, no los `.env` reales. El JWT nunca va en localStorage. Las contraseñas se almacenan con bcrypt. El `secure=False` de la cookie es solo para desarrollo HTTP en localhost: **en un despliegue HTTPS debería cambiarse a `secure=True`** y ajustarse CORS.

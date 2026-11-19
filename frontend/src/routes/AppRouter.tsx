import {BrowserRouter,Route,Routes,Navigate} from 'react-router-dom';
import {MainLayout} from '@/shared/layout/MainLayout';
import {ProtectedRoute} from './ProtectedRoute';
import {LoginPage} from '@/features/auth';
import {RegisterPage} from '@/features/auth';
import {UnauthorizedPage} from '@/features/auth';
import {CatalogoPage} from '@/features/productos';
import {CarritoPage} from '@/features/pedidos';
import {CheckoutPage} from '@/features/pedidos';
import {MisPedidosPage} from '@/features/pedidos';
import {AdminResumenPage} from '@/features/pedidos';
import {AdminPedidosPage} from '@/features/pedidos';
import {AdminProductosPage} from '@/features/productos';
import {AdminCategoriasPage} from '@/features/categorias';
import {AdminUsuariosPage} from '@/features/usuarios';

export function AppRouter(){return <BrowserRouter><MainLayout><Routes>
  <Route path="/" element={<CatalogoPage/>}/>
  <Route path="/login" element={<LoginPage/>}/>
  <Route path="/register" element={<RegisterPage/>}/>
  <Route path="/carrito" element={<CarritoPage/>}/>
  <Route path="/unauthorized" element={<UnauthorizedPage/>}/>
  <Route element={<ProtectedRoute/>}>
    <Route path="/checkout" element={<CheckoutPage/>}/>
    <Route path="/mis-pedidos" element={<MisPedidosPage/>}/>
  </Route>
  <Route element={<ProtectedRoute allowedRoles={['admin']}/>}> 
    <Route path="/admin/resumen" element={<AdminResumenPage/>}/>
    <Route path="/admin/categorias" element={<AdminCategoriasPage/>}/>
    <Route path="/admin/productos" element={<AdminProductosPage/>}/>
    <Route path="/admin/pedidos" element={<AdminPedidosPage/>}/>
    <Route path="/admin/usuarios" element={<AdminUsuariosPage/>}/>
  </Route>
  <Route path="*" element={<Navigate to="/" replace/>}/>
</Routes></MainLayout></BrowserRouter>;}

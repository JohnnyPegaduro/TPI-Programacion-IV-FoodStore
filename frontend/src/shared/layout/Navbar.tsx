import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/shared/ui/Primitives';
import { useState } from 'react';

const linkClass=({isActive}:{isActive:boolean})=>`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${isActive?'bg-orange-500/15 text-orange-600 dark:text-orange-400':'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'}`;

export function Navbar(){
  const user=useAuthStore(s=>s.usuario);
  const logout=useAuthStore(s=>s.logout);
  const items=useCartStore(s=>s.items);
  const count=items.reduce((sum,item)=>sum+item.cantidad,0);
  const navigate=useNavigate();
  const [menu,setMenu]=useState(false);
  const handleLogout=async()=>{try{await logout();}finally{navigate('/login');setMenu(false);}};
  return <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur dark:border-slate-700 dark:bg-slate-950/95">
    <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-4 py-3 sm:px-6">
      <NavLink to="/" className="mr-auto flex items-center gap-2 text-xl font-black tracking-tight"><span className="rounded-xl bg-orange-500 p-2 text-white">🍔</span><span>FOOD<span className="text-orange-500">STORE</span></span></NavLink>
      <button className="rounded-lg border px-3 py-2 text-sm sm:hidden dark:border-slate-600" onClick={()=>setMenu(!menu)} aria-label="Alternar navegación">☰ Menú</button>
      <nav className={`${menu?'flex':'hidden'} w-full flex-wrap items-center gap-2 sm:flex sm:w-auto`} aria-label="Navegación principal">
        <NavLink className={linkClass} to="/" onClick={()=>setMenu(false)}>Catálogo</NavLink>
        <NavLink className={linkClass} to="/carrito" onClick={()=>setMenu(false)}>🛒 Carrito ({count})</NavLink>
        {user&&<NavLink className={linkClass} to="/mis-pedidos" onClick={()=>setMenu(false)}>Mis pedidos</NavLink>}
        {user?.role==='admin'&&<NavLink className={linkClass} to="/admin/resumen" onClick={()=>setMenu(false)}>Administración</NavLink>}
        {user?<><span className="hidden max-w-28 truncate text-xs text-slate-500 lg:inline">{user.full_name} · {user.role}</span><Button variant="ghost" onClick={()=>void handleLogout()} className="text-sm">Salir</Button></>:<NavLink className="rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600" to="/login" onClick={()=>setMenu(false)}>Ingresar</NavLink>}
      </nav>
    </div>
  </header>;
}

import type {ReactNode} from 'react';
import {NavLink} from 'react-router-dom';
import {Navbar} from './Navbar';
export function MainLayout({children}:{children:ReactNode}){return <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100"><Navbar/><main className="mx-auto min-h-[calc(100vh-190px)] max-w-7xl px-4 py-8 sm:px-6">{children}</main><footer className="border-t border-slate-200 px-4 py-6 text-center text-sm text-slate-500 dark:border-slate-800">Food Store · Trabajo Práctico Integrador · UTN Programación IV · <NavLink to="/">Volver al catálogo</NavLink></footer></div>;}

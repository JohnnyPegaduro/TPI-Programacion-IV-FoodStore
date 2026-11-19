import {Link} from 'react-router-dom';
import {Card} from '@/shared/ui/Primitives';
export function UnauthorizedPage(){return <Card className="mx-auto max-w-xl py-14 text-center"><div className="text-6xl">🔒</div><h1 className="mt-4 text-3xl font-black">Acceso denegado</h1><p className="my-4 text-slate-500">Tu cuenta no tiene permisos para acceder a esta sección.</p><Link to="/" className="font-bold text-orange-500 hover:underline">Volver al catálogo</Link></Card>;}

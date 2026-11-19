import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';

export const cls = (...values: Array<string | false | null | undefined>) => values.filter(Boolean).join(' ');
export const money = (n: number) => new Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS',maximumFractionDigits:0}).format(n);

export function Button({children,variant='primary',className='',...rest}:ButtonHTMLAttributes<HTMLButtonElement>&{variant?:'primary'|'secondary'|'danger'|'ghost'}){
  const colors={primary:'bg-orange-500 text-white hover:bg-orange-600',secondary:'bg-slate-200 text-slate-900 hover:bg-slate-300 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600',danger:'bg-red-600 text-white hover:bg-red-700',ghost:'bg-transparent text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'};
  return <button {...rest} className={cls('rounded-xl px-4 py-2.5 font-semibold transition-colors disabled:opacity-50',colors[variant],className)}>{children}</button>;
}
export function Input({className='',...rest}:InputHTMLAttributes<HTMLInputElement>){return <input {...rest} className={cls('w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:focus:ring-orange-900',className)}/>;}
export function Select({className='',children,...rest}:SelectHTMLAttributes<HTMLSelectElement>){return <select {...rest} className={cls('w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white',className)}>{children}</select>;}
export function Textarea({className='',...rest}:TextareaHTMLAttributes<HTMLTextAreaElement>){return <textarea {...rest} className={cls('w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white',className)}/>;}
export function Card({children,className=''}:{children:ReactNode;className?:string}){return <section className={cls('rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900',className)}>{children}</section>;}
export function PageHeader({title,subtitle,action}:{title:string;subtitle?:string;action?:ReactNode}){return <div className="mb-7 flex flex-wrap items-center justify-between gap-4"><div><h1 className="text-3xl font-extrabold tracking-tight">{title}</h1>{subtitle&&<p className="mt-1 text-slate-500 dark:text-slate-400">{subtitle}</p>}</div>{action}</div>;}
export function Label({children}:{children:ReactNode}){return <span className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">{children}</span>;}
export function ErrorBox({message}:{message:string}){return <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200">{message}</div>;}
export function FieldError({errors}:{errors:unknown[]}){return errors.length? <p className="mt-1 text-xs text-red-500">{errors.map(e=>String(e)).join(', ')}</p>:null;}

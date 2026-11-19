import { useState } from 'react';
import { useReactTable, getCoreRowModel, getPaginationRowModel, flexRender } from '@tanstack/react-table';
import type { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/shared/ui/Primitives';

export function DataTable<TData>({data,columns,empty='No hay registros'}:{data:TData[];columns:ColumnDef<TData,unknown>[];empty?:string}){
  const [pagination,setPagination]=useState({pageIndex:0,pageSize:8});
  const table=useReactTable({data,columns,state:{pagination},onPaginationChange:setPagination,getCoreRowModel:getCoreRowModel(),getPaginationRowModel:getPaginationRowModel()});
  return <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
    <div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left text-sm"><thead className="bg-slate-100 text-xs uppercase text-slate-600 dark:bg-slate-800 dark:text-slate-300">{table.getHeaderGroups().map(group=><tr key={group.id}>{group.headers.map(header=><th className="px-5 py-4" key={header.id}>{header.isPlaceholder?null:flexRender(header.column.columnDef.header,header.getContext())}</th>)}</tr>)}</thead>
      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">{table.getRowModel().rows.map(row=><tr key={row.id} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800">{row.getVisibleCells().map(cell=><td className="px-5 py-3" key={cell.id}>{flexRender(cell.column.columnDef.cell,cell.getContext())}</td>)}</tr>)}</tbody></table>{table.getRowModel().rows.length===0&&<p className="py-12 text-center text-slate-500">{empty}</p>}</div>
    <div className="flex items-center justify-end gap-3 border-t border-slate-100 p-3 dark:border-slate-800"><span className="mr-auto text-xs text-slate-500">{data.length} registro(s)</span><Button variant="secondary" disabled={!table.getCanPreviousPage()} onClick={()=>table.previousPage()}>Anterior</Button><span className="text-sm">{pagination.pageIndex+1} / {Math.max(1,table.getPageCount())}</span><Button variant="secondary" disabled={!table.getCanNextPage()} onClick={()=>table.nextPage()}>Siguiente</Button></div>
  </div>;
}

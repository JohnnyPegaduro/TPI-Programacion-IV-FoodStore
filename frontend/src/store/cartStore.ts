import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CartItem = { producto_id:number; nombre:string; precio_unitario:number; cantidad:number; stock_max:number; imagen_url:string };
type CartStore = {
  items: CartItem[];
  agregar: (item: Omit<CartItem,'cantidad'>) => void;
  quitar: (id:number) => void;
  cambiarCantidad: (id:number, cantidad:number) => void;
  vaciar: () => void;
  total: () => number;
};

export const useCartStore = create<CartStore>()(persist((set,get)=>({
  items: [],
  agregar: (item) => set((state) => {
    if(item.stock_max < 1) return state;
    const exists = state.items.find(current => current.producto_id === item.producto_id);
    if (!exists) return {items:[...state.items,{...item,cantidad:1}]};
    return {items:state.items.map(i=>i.producto_id===item.producto_id?{...i,cantidad:Math.min(i.cantidad+1,item.stock_max),stock_max:item.stock_max}:i)};
  }),
  quitar: (id) => set(s=>({items:s.items.filter(i=>i.producto_id!==id)})),
  cambiarCantidad: (id,cantidad)=>set(s=>({items:s.items.map(i=>i.producto_id===id?{...i,cantidad:Math.max(1,Math.min(cantidad,i.stock_max))}:i)})),
  vaciar: ()=>set({items:[]}),
  total: ()=>get().items.reduce((sum,i)=>sum+i.precio_unitario*i.cantidad,0),
}),{name:'food-store-cart',partialize:state=>({items:state.items})}));

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { createContext } from "react";
import type { Pizza, PizzaSize } from "./APIResponseTypes";

export interface CartItem {
  pizza: Pizza;
  size: PizzaSize;
  price: string;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      state.items.push(action.payload);
    },
    clearCart(state) {
      state.items = [];
    },
  },

  selectors: {
    selectedCartItems: (cart) => cart.items,
    selectedCartCount: (cart) => cart.items.length,
  },
});

export const { addToCart, clearCart } = cartSlice.actions;
export const { selectedCartItems, selectedCartCount } = cartSlice.selectors;



export const CartContext = createContext<
  [CartItem[], (cart: CartItem[]) => void]
>([[], () => {}]);

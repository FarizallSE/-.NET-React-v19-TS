import { createContext } from "react";
import type { Pizza, PizzaSize } from "./APIResponseTypes";

export interface CartItem {
  pizza: Pizza;
  size: PizzaSize;
  price: string;
}

export const CartContext = createContext<
  [CartItem[], (cart: CartItem[]) => void]
>([[], () => {}]);
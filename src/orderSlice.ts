import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store"; // Sesuaikan path-nya menuju file store Anda
import type { PizzaSize } from "./APIResponseTypes";
// import { createContext } from "react";

export interface OrderState {
  pizzaType: string;
  pizzaSize: PizzaSize;
}

const initialState: OrderState = {
  pizzaType: "pepperoni",
  pizzaSize: "M",
};
export const OrderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setPizzaType(state, action: PayloadAction<string>) {
      state.pizzaType = action.payload;
    },
    setPizzaSize(state, action: PayloadAction<PizzaSize>) {
      state.pizzaSize = action.payload;
    },
  },

  selectors: {
    selectedPizzaType: (order) => order.pizzaType,
    selectedPizzaSize: (order) => order.pizzaSize,
  },
});

export const { setPizzaType, setPizzaSize } = OrderSlice.actions;
export const { selectedPizzaType, selectedPizzaSize } =
  OrderSlice.getSelectors((state: RootState) => state.order);

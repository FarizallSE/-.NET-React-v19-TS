import { combineSlices, configureStore } from "@reduxjs/toolkit";
import { cartSlice } from "./cartSlice";
import { pizzaApi } from "./api/pizzaApi";
import { OrderSlice } from "./orderSlice";

const rootReducer = combineSlices(cartSlice, pizzaApi, OrderSlice);

export type RootState = ReturnType<typeof rootReducer>;

export function makeStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(pizzaApi.middleware)
  });
}

export const store = makeStore();

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];
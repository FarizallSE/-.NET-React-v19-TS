import { combineSlices, configureStore } from "@reduxjs/toolkit";
import { cartSlice } from "./cartSlice";

const rootReducer = combineSlices(cartSlice);

export type RootState = ReturnType<typeof rootReducer>;

export function makeStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
}

export const store = makeStore();

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];
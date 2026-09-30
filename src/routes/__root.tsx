import { useState } from "react";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import PizzaOfTheDay from "../PizzaOfTheDay";
import Header from "../Header";
import { CartContext, type CartItem } from "../contexts";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export const Route = createRootRoute({
  component: () => {
    // const cartHook = useState([]);
    const cartHook = useState<CartItem[]>([])
    return (
      //react.Fragment - kenapa pakai fragment? karena kita ingin mengembalikan beberapa elemen tanpa menambahkan node tambahan ke DOM. Fragment memungkinkan kita untuk mengelompokkan beberapa elemen tanpa menambahkan elemen tambahan ke DOM.
      <>
        <CartContext.Provider value={cartHook}>
          <div>
            <Header />
            <Outlet />
            <PizzaOfTheDay />
          </div>
        </CartContext.Provider>
        <TanStackRouterDevtools />
        <ReactQueryDevtools />
      </>
    );
  },
});

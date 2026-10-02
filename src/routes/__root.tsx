// import { useState } from "react";
import { createRootRoute, Outlet } from "@tanstack/react-router";
// import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import PizzaOfTheDay from "../PizzaOfTheDay";
import Header from "../Header";
// import { CartContext, type CartItem } from "../contexts";
import { selectedCartItems } from "../cartSlice";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useAppSelector } from "../hooks";
import { Provider } from "react-redux";
import { makeStore } from "../store";

export const Route = createRootRoute({
  component: () => {
    // const cartHook = useState([]);
    const cartHook = useAppSelector(selectedCartItems);
    return (
      //react.Fragment - kenapa pakai fragment? karena kita ingin mengembalikan beberapa elemen tanpa menambahkan node tambahan ke DOM. Fragment memungkinkan kita untuk mengelompokkan beberapa elemen tanpa menambahkan elemen tambahan ke DOM.
      <>
        <Provider store={makeStore({cart : {items : cartHook}})}>
          <div>
            <Header />
            <Outlet />
            <PizzaOfTheDay />
          </div>
        </Provider>
        {/* <TanStackRouterDevtools /> */}
        {/* <ReactQueryDevtools /> */}
      </>
    );
  },
});

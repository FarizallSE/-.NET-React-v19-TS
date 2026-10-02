import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Pizza } from "../APIResponseTypes";

export const pizzaApi = createApi({
    reducerPath : "pizzaApi",
    baseQuery: fetchBaseQuery({ baseUrl: "/api"}),
    endpoints: (build) => ({
        getPizzas: build.query<Pizza[], void>({
            query: () => "pizzas",
        })
    })
});

export const { useGetPizzasQuery } = pizzaApi;
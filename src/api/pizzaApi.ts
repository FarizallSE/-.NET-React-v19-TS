import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { PastOrderDetail, Pizza, PastOrder } from "../APIResponseTypes";
import type { CartItem } from "../cartSlice";

export const pizzaApi = createApi({
  reducerPath: "pizzaApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["PastOrders"],
  endpoints: (build) => ({
    getPizzas: build.query<Pizza[], void>({
      query: () => "pizzas",
    }),
    getPizzaOfTheDay: build.query<Pizza | null, void>({
      query: () => "pizza-of-the-day",
    }),
    getPastOrder: build.query<PastOrderDetail, number>({
      query: (order) => `past-order/${order}`,
      keepUnusedDataFor: 24 * 60 * 60, //one day, in second
    }),
    getPastOrders: build.query<PastOrder[], number>({
      query: (page) => `past-orders?page=${page}`,
    }),
    placeOrder: build.mutation<unknown, CartItem[]>({
      query: (cart) => ({
        url: "order",
        method: "POST",
        body: { cart },
      }),
      invalidatesTags: ["PastOrders"],
    }),
  }),
});

export const {
  useGetPizzasQuery,
  useGetPizzaOfTheDayQuery,
  useGetPastOrderQuery,
  useGetPastOrdersQuery,
  usePlaceOrderMutation,
} = pizzaApi;

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { build } from "vite";
import type { ContactData } from "../APIResponseTypes";

export const contactApi = createApi({
  reducerPath: "contactApi",
  baseQuery: fetchBaseQuery({ baseUrl: "api" }),
  endpoints: (build) => ({
    postContact: build.mutation<unknown, ContactData>({
      query: (payload) => ({
        url: "contact",
        method: "POST",
        body : payload
      }),
    }),
  }),
});

export const { usePostContactMutation } = contactApi;

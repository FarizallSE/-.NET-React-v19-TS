import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Pizza} from "../APIResponseTypes";
// import getPizzas from "./getPizzas";
// import 

export const getPizzaOfTheDayApi = createApi({
    reducerPath : "getPizzaOfTheDayApi",
    baseQuery : fetchBaseQuery({baseUrl: "/api"}),
    endpoints: (build) => ({
        getPizzasOfTheDays: build.query<Pizza | null, void>({
            query: () => "pizza-of-the-day"
        })
    })
})

export const { useGetPizzasOfTheDaysQuery } = getPizzaOfTheDayApi;
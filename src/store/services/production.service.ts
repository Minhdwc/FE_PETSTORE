import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import config from "@/config";
import { IProduction } from "@/types";

interface ProductionPage {
  data: IProduction[];
  total: number;
  currentPage: number | string;
  totalPages: number;
}

export const productionApi = createApi({
  reducerPath: "productionApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${config.HOST}` }),
  tagTypes: ["Production"],
  keepUnusedDataFor: 30,
  refetchOnMountOrArgChange: true,
  endpoints: (build) => ({
    getProductions: build.query<
      ProductionPage,
      { page?: number; limit?: number; category?: string; minPrice?: number; maxPrice?: number }
    >({
      query: ({ page, limit, category, minPrice, maxPrice }) => {
        const params = new URLSearchParams();
        if (limit) params.append("limit", String(limit));
        if (page) params.append("page", String(page));
        if (category) params.append("category", category);
        if (minPrice !== undefined) params.append("min", String(minPrice));
        if (maxPrice !== undefined) params.append("max", String(maxPrice));
        return {
          url: `production/all?${params.toString()}`,
          method: "GET",
          credentials: "include",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
      providesTags: (results) => {
        console.log(results);
        if (results) {
          return [
            ...results.data.map(({ _id }) => ({ type: "Production" as const, id: _id })),
            { type: "Production" as const, id: "LIST" },
          ];
        }
        return [{ type: "Production" as const, id: "LIST" }];
      },
    }),
    getProductionDetail: build.query<{ status: number; message: string; data: IProduction }, string>({
      query: (id) => ({
        url: `production/detail/u=${id}`,
        method: "GET",
        credentials: "include",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }),
      providesTags: (result, error, id) => [{ type: "Production", id }],
    }),
    searchProductions: build.query<{ total: number; data: IProduction[] }, { q: string; limit?: number }>({
      query: ({ q, limit = 10 }) => ({
        url: `production/search?q=${encodeURIComponent(q)}&limit=${limit}`,
        method: "GET",
        credentials: "include",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }),
    }),
  }),
});

export const { useGetProductionsQuery, useGetProductionDetailQuery, useLazySearchProductionsQuery } = productionApi;



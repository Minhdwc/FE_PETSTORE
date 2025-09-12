import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import config from "@/config";
import { IPet } from "@/types";

interface PetPage {
  data: IPet[];
  total: number;
  currentPage: number;
  totalPages: number;
}

export interface ResponsePet {
  status: number;
  message: string;
  data: IPet;
}

export const petApi = createApi({
  reducerPath: "petApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${config.HOST}` }),
  tagTypes: ["Pets"],
  keepUnusedDataFor: 60,
  refetchOnMountOrArgChange: 30,
  endpoints: (build) => ({
    getpets: build.query<
      PetPage,
      {
        page?: number;
        limit?: number;
        species?: string;
        generic?: string;
        gender?: boolean;
        age?: number;
        breed?: string;
        maxPrice?: number;
        minPrice?: number;
        status?: string;
      }
    >({
      query: ({
        species,
        generic,
        gender,
        age,
        breed,
        maxPrice,
        minPrice,
        status,
        page,
        limit,
      }) => {
        const params = new URLSearchParams();
        if (limit) params.append("limit", String(limit));
        if (page) params.append("page", String(page));
        if (species) params.append("species", species);
        if (generic) params.append("generic", generic);
        if (gender) params.append("gender", String(gender));
        if (age) params.append("age", String(age));
        if (breed) params.append("breed", breed);
        if (status) params.append("status", status);
        if (minPrice !== undefined) params.append("min", String(minPrice));
        if (maxPrice !== undefined) params.append("max", String(maxPrice));

        return {
          url: `pet/all?${params.toString()}`,
          method: "GET",
          credentials: "include",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
      providesTags: (results) => {
        if (results) {
          return [
            ...results.data.map(({ _id }) => ({
              type: "Pets" as const,
              id: _id,
            })),
            { type: "Pets" as const, id: "LIST" },
          ];
        }
        return [{ type: "Pets" as const, id: "LIST" }];
      },
    }),
    getPetDetail: build.query<ResponsePet, string>({
      query: (id) => ({
        url: `pet/detail/u=${id}`,
        method: "GET",
        credentials: "include",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }),
      providesTags: (result, error, id) => [{ type: "Pets", id }],
    }),
    searchPets: build.query<{ total: number; data: IPet[] }, { q: string; limit?: number }>({
      query: ({ q, limit = 10 }) => ({
        url: `pet/search?q=${encodeURIComponent(q)}&limit=${limit}`,
        method: "GET",
        credentials: "include",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }),
    }),
  }),
});

export const { useGetpetsQuery, useGetPetDetailQuery, useLazySearchPetsQuery } = petApi;

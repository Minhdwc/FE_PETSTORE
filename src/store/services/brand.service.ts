import {createApi, fetchBaseQuery}from '@reduxjs/toolkit/query/react';
import config from '@/config';
import { IBrand } from '@/types';

interface BrandPage{
    data: IBrand[],
    total: number,
    currentPage: number;
    totalPages: number;
}

export interface ResponseBrand{
    status: number;
    message: string;
    data: IBrand;
}

export const brandApi = createApi({
    reducerPath: "brandApi",
    baseQuery: fetchBaseQuery({baseUrl: `${config.HOST}`}),
    tagTypes: ["Brands"],
    keepUnusedDataFor: 60,
    refetchOnMountOrArgChange: 30,
    endpoints:(build)=>({
        getbrands: build.query<
        BrandPage,
        {
            page?: number,
            limit?: number
        }
        >({
            query: ({ page, limit }) => {
                const params = new URLSearchParams();
                if (limit) params.append("limit", String(limit));
                if (page) params.append("page", String(page));
                return {
                    url: `brand/all?${params.toString()}`,
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
                        ...results.data.map((b) => ({ type: "Brands" as const, id: (b as any)._id })),
                        { type: "Brands" as const, id: "LIST" },
                    ];
                }
                return [{ type: "Brands" as const, id: "LIST" }];
            },
        }),
        getBrandDetail: build.query<ResponseBrand, string>({
            query: (id) => ({
                url: `brand/detail/u=${id}`,
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
            }),
            providesTags: (result, error, id) => [{ type: "Brands", id }],
        }),
    })
})

export const { useGetbrandsQuery, useGetBrandDetailQuery } = brandApi;
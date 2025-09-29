import {createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import config from "@/config";
import { IService } from "@/types";
import { get } from "http";

interface ServicePage {
    data: IService[];
    total: number;
    currentPage: number;
    totalPages: number;
}

export interface ResponseService {
    status: number;
    message: string;
    data: IService;
}

export interface ResponseServices{
    status: number;
    message: string;
    data: ServicePage;
}

export const serviceApi = createApi({
    reducerPath: "serviceApi",
    baseQuery: fetchBaseQuery({ baseUrl: `${config.HOST}` }),
    tagTypes: ["Services"],
    keepUnusedDataFor: 60,
    refetchOnMountOrArgChange: 30,
    endpoints: (build) => ({
        getServices: build.query<
        ServicePage,{
            page?: number;
            limit?: number;
        }
        >({
            query: ({ page, limit }) => {
                const params = new URLSearchParams();
                if (limit) params.append("limit", String(limit));
                if (page) params.append("page", String(page));
                return {
                    url: `service/all?${params.toString()}`,
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-type": "application/json; charset=UTF-8",
                    },
                };
            },
            providesTags: (results)=>{
                if (results) {
                    return [
                        ...results.data.map((s)=>({type: "Services" as const, id: (s as any)._id})),
                        { type: "Services" as const, id: "LIST"},
                    ]
                }
                return [{ type: "Services" as const, id: "LIST"}];
            }
        }),
        getServiceDetail: build.query<ResponseService, string>({
            query: (id) => ({
                url: `service/detail/u=${id}`,
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
            }),
            providesTags: (result, error, id) => [{ type: "Services", id }]
        }),
    }),
})

export const { useGetServicesQuery, useGetServiceDetailQuery } = serviceApi;
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import config from "@/config";
import { IWishlist } from "@/types";

interface WishlistResponse {
  status: number;
  message: string;
  data: WishlistPage;
}

interface WishlistPage {
  data: IWishlist[];
  total: number;
  pageCurrent: number;
  totalPage: number;
}

export interface ResponseWishlist {
    status: number;
    message: string;
    data: IWishlist;
}

export const wishlistApi = createApi({
    reducerPath: "wishlistApi",
    baseQuery: fetchBaseQuery({ baseUrl: `${config.HOST}` }),
    tagTypes: ["Wishlists"],
    keepUnusedDataFor: 60,
    refetchOnMountOrArgChange: 30,
    endpoints: (build) => ({
        getWishlistByUser: build.query<WishlistResponse,{page?: number, limit?: number, userId: string}>({
            query: ({page, limit, userId}) => {
                const params = new URLSearchParams();
                if (limit) params.append('limit', String(limit));
                if (page) params.append('page', String(page));
                return {
                    url: `favourite/all?userId=${userId}&${params.toString()}`,
                    method: 'GET',
                    credentials: "include",
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                    }
                }
            },
            providesTags: results => {
                if (results) {
                    return [
                        ...results.data.data.map(({ _id }) => ({ type: 'Wishlists' as const, id: _id })),
                        { type: 'Wishlists' as const, id: 'LIST' }
                    ]
                }
                return [{ type: 'Wishlists' as const, id: 'LIST' }]
            }
        })
    })
})
export const { useGetWishlistByUserQuery } = wishlistApi;
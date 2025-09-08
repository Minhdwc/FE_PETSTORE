import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import config from "@/config";
import { ICart } from "@/types";

interface CartPage {
  data: ICart[];
  total: number;
  currentPage: number | string;
  totalPages: number;
}

export interface ResponseCart {
  status: number;
  message: string;
  data: ICart;
}

export interface AddToCartRequest {
  items: Array<{
    itemId: string;
    itemType: "Pet" | "Product";
    quantity: number;
    price: number;
  }>;
  totalQuantity: number;
  totalPrice: number;
}

export interface UpdateCartRequest{
  items: Array<{
    itemId: string;
    itemType: "Pet" | "Product";
    quantity: number;
    price: number;
  }>;
}

export const cartApi = createApi({
  reducerPath: "cartApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${config.HOST}` }),
  tagTypes: ["Carts"],
  keepUnusedDataFor: 30,
  refetchOnMountOrArgChange: true,
  endpoints: (build) => ({
    getCartByUser: build.query<CartPage, { page?: number; limit?: number }>({
      query: ({ page, limit }) => {
        const params = new URLSearchParams();
        if (limit) params.append('limit', String(limit));
        if (page) params.append('page', String(page));
        return {
          url: `cart/user?${params.toString()}`,
          method: 'GET',
          credentials: "include",
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        };
      },
      providesTags: results => {
        if (results?.data && results.data.length > 0) {
          return [
            ...results.data.map(({ _id }) => ({ type: 'Carts' as const, id: _id })),
            { type: 'Carts' as const, id: 'LIST' }
          ];
        }
        return [{ type: 'Carts' as const, id: 'LIST' }];
      }
    }),
    
    addToCart: build.mutation<ResponseCart, AddToCartRequest>({
      query: (cartData) => ({
        url: 'cart/create',
        method: 'POST',
        credentials: "include",
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: cartData
      }),
      invalidatesTags: [{ type: 'Carts' }]
    }),
    updateToCart: build.mutation<ResponseCart, UpdateCartRequest>({
      query: (cartData) => ({
        url: 'cart/update',
        method: 'PUT',
        credentials: "include",
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: cartData
      }),
      invalidatesTags: [{ type: 'Carts' }]
    })
  })
});

export const { useGetCartByUserQuery, useAddToCartMutation, useUpdateToCartMutation } = cartApi;
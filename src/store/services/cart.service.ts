import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import config from "@/config";
import { ICart } from "@/types";

interface CartResponse {
  status: number;
  message: string;
  data: CartPage;
}

interface CartPage {
  data: ICart[];
  total: number;
  pageCurrent: number;
  totalPage: number;
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

export const cartApi = createApi({
  reducerPath: "cartApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${config.HOST}` }),
  tagTypes: ["Carts"],
  keepUnusedDataFor: 60,
  refetchOnMountOrArgChange: 30,
  endpoints: (build) => ({
    getCartByUser: build.query<CartResponse, { page?: number; limit?: number }>({
      query: ({ page, limit }) => {
        const params = new URLSearchParams();
        if (limit) params.append('limit', String(limit));
        if (page) params.append('page', String(page));
        return {
          url: `cart/all?${params.toString()}`,
          method: 'GET',
          credentials: "include",
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        };
      },
      providesTags: results => {
        if (results) {
          return [
            ...results.data.data.map(({ _id }) => ({ type: 'Carts' as const, id: _id })),
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
      invalidatesTags: [{ type: 'Carts', id: 'LIST' }]
    })
  })
});

export const { useGetCartByUserQuery, useAddToCartMutation } = cartApi;
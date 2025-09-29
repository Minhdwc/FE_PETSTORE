import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import config from "@/config";
import { IWishlist } from "@/types";
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
export interface AddToWishlistRequest {
  items: Array<{
    itemId: string;
    itemType: "Pet" | "Product";
    quantity: number;
    price: number;
  }>;
}
export interface UpdateWishlistRequest {
  items: Array<{
    itemId: string;
    itemType: "Pet" | "Product";
    quantity: number;
    price: number;
  }>;
}
export const wishlistApi = createApi({
  reducerPath: "wishlistApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${config.HOST}` }),
  tagTypes: ["Wishlists"],
  keepUnusedDataFor: 60,
  refetchOnMountOrArgChange: 30,
  endpoints: (build) => ({
    getWishlistByUser: build.query<
      WishlistPage,
      { page?: number; limit?: number }
    >({
      query: ({ page, limit }) => {
        const params = new URLSearchParams();
        if (limit) params.append("limit", String(limit));
        if (page) params.append("page", String(page));
        return {
          url: `favourite/all?${params.toString()}`,
          method: "GET",
          credentials: "include",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        };
      },
      providesTags: (results) => {
        if (results) {
          return [
            ...results.data.map(({ _id }) => ({
              type: "Wishlists" as const,
              id: _id,
            })),
            { type: "Wishlists" as const, id: "LIST" },
          ];
        }
        return [{ type: "Wishlists" as const, id: "LIST" }];
      },
    }),
    addToWishlist: build.mutation<ResponseWishlist, AddToWishlistRequest>({
      query: (wishlistData) => ({
        url: "favourite/create",
        method: "POST",
        credentials: "include",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: wishlistData,
      }),
      invalidatesTags: [{ type: "Wishlists" }],
    }),
    updateToWishList: build.mutation<ResponseWishlist, UpdateWishlistRequest>({
      query: (wishlistData) => ({
        url: "favourite/update",
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: wishlistData,
      }),
      invalidatesTags: [{ type: "Wishlists" }],
    })
  }),
});
export const {
  useGetWishlistByUserQuery,
  useAddToWishlistMutation,
  useUpdateToWishListMutation,
} = wishlistApi;

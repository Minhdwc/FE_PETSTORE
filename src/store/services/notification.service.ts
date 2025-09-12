import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import config from "@/config";
import { INotification } from "@/types";
interface NotificationResponse {
  data: INotification[];
  total: number;
  pageCurrent: number;
  totalPage: number;
}

export const notificationApi = createApi({
  reducerPath: "notificationApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${config.HOST}` }),
  tagTypes: ["Notifications"],
  keepUnusedDataFor: 60,
  refetchOnMountOrArgChange: 30,
  endpoints: (build) => ({
    getNotificationsByUser: build.query<
      NotificationResponse,
      { page?: number; limit?: number }
    >({
      query: ({ page, limit}) => {
        const params = new URLSearchParams();
        if (limit) params.append("limit", String(limit));
        if (page) params.append("page", String(page));
        return {
          url: `notification/all?${params.toString()}`,
          method: "GET",
          credentials: "include",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        };
      },
      providesTags: (results) => {
        if (results && results.data) {
          return [
            ...results.data.map(({ _id }) => ({
              type: "Notifications" as const,
              id: _id,
            })),
            { type: "Notifications" as const, id: "LIST" },
          ];
        }
        return [{ type: "Notifications" as const, id: "LIST" }];
      },
    }),
  }),
});

export const { useGetNotificationsByUserQuery } = notificationApi;
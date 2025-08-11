import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import config from "@/config";
import { IUser } from "@/types";

interface UserResponse {
  status: number;
  message: string;
  data: UserPage;
}

interface UserPage {
  data: IUser[];
  total: number;
  pageCurrent: number;
  totalPage: number;
}

export interface ResponseUser {
  status: number;
  message: string;
  data: IUser;
}

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${config.HOST}` }),
  tagTypes: ["Users"],
  keepUnusedDataFor: 60,
  refetchOnMountOrArgChange: 30,
  endpoints: (build) => ({
    getUsers: build.query<UserResponse, { page?: number; limit?: number }>({
        query: ({page, limit}) =>{
            const params = new URLSearchParams();
            if(limit) params.append('limit', String(limit));
            if(page) params.append('page', String(page));
            return {
                url: `users?${params.toString()}`,
                method: 'GET',
                credentials: "include",
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            }
        },
        providesTags: results =>{
            if(results){
                return[
                    ...results.data.data.map(({_id}) => ({type: 'Users' as const, id: _id})),
                    {type: 'Users' as const, id: 'LIST'}
                ]
            }
            return [{type: 'Users' as const, id: 'LIST'}]
        }
    }),
  }),
});

export const { useGetUsersQuery } = userApi;

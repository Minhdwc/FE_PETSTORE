import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import config from '@/config';
import { IAppointment } from '@/types';

interface AppointmentPage{
  data: IAppointment[],
  total: number,
  currentPage: number;
  totalPages: number;
}

interface ResponseAppointment{
  status: number;
  message: string;
  data: IAppointment;
}

export const appointmentApi = createApi({
  reducerPath: "appointmentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${config.HOST}`,
    prepareHeaders: (headers) => {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Appointments"],
  keepUnusedDataFor: 60,
  refetchOnMountOrArgChange: 30,
  endpoints:(build)=>({
    createAppointment: build.mutation<IAppointment, {
      petInfo: {
        name: string;
        breed: string;
        species: string;
        gender: boolean;
        age: number;
        weight: number;
      };
      services: string[];
      date: string;
      time: string;
      notes?: string;
    }>({
      query: (body)=>({
        url: `appointment/create`,
        method: "POST",
        body,
        credentials: "include",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }),
      invalidatesTags: [{ type: "Appointments", id: "LIST" }],
    }),
    getUserAppointments: build.query<IAppointment[], void>({
      query: ()=>({
        url: `appointment/user`,
        method: "GET",
        credentials: "include",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }),
      providesTags: [{ type: "Appointments", id: "LIST" }],
      transformResponse: (res: any): IAppointment[] => {
        if (Array.isArray(res)) return res as IAppointment[];
        return (res?.data ?? []) as IAppointment[];
      }
    }),
    getAppointmentById: build.query<IAppointment, string>({
      query: (id)=>({
        url: `appointment/detail/${id}`,
        method: "GET",
        credentials: "include",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }),
      providesTags: (_res, _err, id)=> [{ type: "Appointments", id }],
      transformResponse: (res: any): IAppointment => {
        if (res && res._id) return res as IAppointment;
        return (res?.data as IAppointment);
      }
    }),
    cancelAppointment: build.mutation<IAppointment, string>({
      query: (id)=>({
        url: `appointment/cancel/${id}`,
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }),
      invalidatesTags: (_res, _err, id)=> [{ type: "Appointments", id }, { type: "Appointments", id: "LIST" }],
      transformResponse: (res: any): IAppointment => (res?.data ?? res) as IAppointment,
    }),
    rescheduleAppointment: build.mutation<IAppointment, { id: string; date: string; time: string }>({
      query: ({ id, date, time })=>({
        url: `appointment/reschedule/${id}`,
        method: "PATCH",
        body: { date, time },
        credentials: "include",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }),
      invalidatesTags: (_res, _err, { id })=> [{ type: "Appointments", id }, { type: "Appointments", id: "LIST" }],
      transformResponse: (res: any): IAppointment => (res?.data ?? res) as IAppointment,
    }),
    getAppointments: build.query<AppointmentPage,{
      page?: number,
      limit?: number
    }
    >({
      query: ({ page, limit})=>{
        const params = new URLSearchParams();
        if(limit) params.append("limit", String(limit));
        if(page) params.append("page", String(page));
        return {
          url: `appointment/all?${params.toString()}`,
          method: "GET",
          credentials: "include",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
      providesTags:(results)=>{
        if(results){
          return [
            ...results.data.map((a) => ({ type: "Appointments" as const, id: (a as any)._id })),
            { type: "Appointments" as const, id: "LIST" },
          ];
        }
        return [{ type: "Appointments" as const, id: "LIST" }];
      }
    })
  })
})


export const {
  useCreateAppointmentMutation,
  useGetUserAppointmentsQuery,
  useGetAppointmentByIdQuery,
  useCancelAppointmentMutation,
  useRescheduleAppointmentMutation,
  useGetAppointmentsQuery,
} = appointmentApi;

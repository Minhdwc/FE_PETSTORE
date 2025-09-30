import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { userApi } from "./services/user.service";
import { petApi } from "./services/pet.service";
import { wishlistApi } from "./services/wishlist.service";
import { cartApi } from "./services/cart.service";
import { notificationApi } from "./services/notification.service";
import { productionApi } from "./services/production.service";
import { serviceApi } from "./services/service.service";
import { appointmentApi } from "./services/appointment.service";

export const store = configureStore({
    reducer: {
        [userApi.reducerPath]: userApi.reducer,
        [petApi.reducerPath]: petApi.reducer,
        [wishlistApi.reducerPath]: wishlistApi.reducer,
        [cartApi.reducerPath]: cartApi.reducer,
        [notificationApi.reducerPath]: notificationApi.reducer,
        [productionApi.reducerPath]: productionApi.reducer,
        [serviceApi.reducerPath]: serviceApi.reducer,
        [appointmentApi.reducerPath]: appointmentApi.reducer,
    },
    middleware: (getDefaultMiddleware)=>
        getDefaultMiddleware().concat(userApi.middleware, petApi.middleware, wishlistApi.middleware, cartApi.middleware, notificationApi.middleware, productionApi.middleware, serviceApi.middleware, appointmentApi.middleware),
})

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector : TypedUseSelectorHook<RootState> = useSelector;
export default store
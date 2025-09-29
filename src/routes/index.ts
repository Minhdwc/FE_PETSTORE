import React from "react";

//Page not found
const pageNotFound = React.lazy(
  () => import("@/pages/pageNotFound/pageNotFound")
);

//Page authentication
const pageLogin = React.lazy(() => import("@/pages/auth/login"))
const pageRegister = React.lazy(() => import("@/pages/auth/register"));

//Page of user
const pageHome = React.lazy(()=>import("@/pages/user/HomePage/homePage"))
const pagePet = React.lazy(()=>import("@/pages/user/PetPage/petPage"))
const pageProduction = React.lazy(()=>import("@/pages/user/ProductionPage/productionPage"))
const pageOrder = React.lazy(()=>import("@/pages/user/OrderPage/orderPage"))
const detailPet = React.lazy(()=>import("@/pages/user/DetailPetPage/detailPetPage"))
const appointment = React.lazy(()=>import("@/pages/user/Appointment/appointment"))
// Note: detailProduction uses the same component as pageProduction
const detailProduction = React.lazy(()=>import("@/pages/user/ProductionPage/productionPage"))
//Page of admin
const dashboard = React.lazy(()=>import("@/pages/admin/dashboard"))


export interface Route{
    path: string,
    element: any;
    isShowHeader: boolean;
    isAdmin: boolean;
}
export const routes: Route[] = [
    //User
    {path: '/', element: pageHome, isShowHeader: true, isAdmin:false},
    {path: '/pet/detail/:id', element: detailPet, isShowHeader:true, isAdmin:false},
    {path: '/pet', element: pagePet, isShowHeader: true, isAdmin:false},
    {path: '/production/detail/:id', element: detailProduction, isShowHeader:true, isAdmin:false},
    {path: '/production', element: pageProduction, isShowHeader: true, isAdmin: false},
    {path: '/order', element: pageOrder, isShowHeader: true, isAdmin: false},
    {path:'/appointment', element: appointment, isShowHeader:true, isAdmin:false},
    //Admin
    {path: '/admin/dashboard', element: dashboard, isShowHeader:false, isAdmin:true},

    //Authen
    {path:'/auth/login', element: pageLogin, isShowHeader:false, isAdmin:false},
    {path: '/auth/register', element: pageRegister, isShowHeader:false, isAdmin:false},

    //Page not found
    {path:'*', element: pageNotFound, isShowHeader: false, isAdmin:false}
]
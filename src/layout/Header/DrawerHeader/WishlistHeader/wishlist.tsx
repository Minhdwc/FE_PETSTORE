import React from "react";
import WishlistHeaderItem from "./WishlistHeaderItem";
import { useGetWishlistByUserQuery } from "@/store/services/wishlist.service";

export default function Wishlist() {
  const userId = localStorage.getItem("userId") || "";
  const {
    data: wishlistData,
    isFetching,
    isError,
  } = useGetWishlistByUserQuery(
    { page: 1, limit: 10, userId },
    { skip: !userId }
  );

  if (!userId) {
    return (
      <div className="text-sm text-gray-500">
        Vui lòng đăng nhập để xem danh sách yêu thích.
      </div>
    );
  }

  if (isFetching) {
    return (
      <div className="text-sm text-gray-500">
        Đang tải danh sách yêu thích...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-sm text-red-500">
        Không thể tải danh sách yêu thích.
      </div>
    );
  }

  const wishlists = wishlistData?.data?.data || [];

  if (wishlists.length === 0) {
    return (
      <div className="text-sm text-gray-500">Danh sách yêu thích trống.</div>
    );
  }

  return (
    <div className="space-y-2">
      {wishlists.map((wishlist: any) => (
        <WishlistHeaderItem key={wishlist._id} wishlist={wishlist} />
      ))}
    </div>
  );
}

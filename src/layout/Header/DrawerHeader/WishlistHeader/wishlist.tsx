import WishlistHeaderItem from "./WishlistHeaderItem";
import { useGetWishlistByUserQuery } from "@/store/services/wishlist.service";
import { MdFavoriteBorder } from "react-icons/md";
import { HeartOutlined } from "@ant-design/icons";
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
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    return (
      <div className="py-6 px-2 text-center">
        <HeartOutlined className="text-4xl text-gray-300 mb-3" />
        <div className="text-sm text-gray-500">
          Vui lòng đăng nhập để xem danh sách yêu thích.
        </div>
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

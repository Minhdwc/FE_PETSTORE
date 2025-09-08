import { IWishlist } from "@/types";

interface WishlistHeaderItemProps {
  wishlist: IWishlist;
}

export default function WishlistHeaderItem({
  wishlist,
}: WishlistHeaderItemProps) {
  return (
    <div className="p-2 rounded border border-gray-200 mb-2">
      <div className="text-sm">
        Danh sách yêu thích #{wishlist._id.slice(-6)}
      </div>
      <div className="text-xs text-gray-400">
        Số lượng mục: {wishlist.items.length}
      </div>
    </div>
  );
}

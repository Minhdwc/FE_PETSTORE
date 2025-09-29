import WishlistHeaderItem from "./WishlistHeaderItem";
import {
  useGetWishlistByUserQuery,
  useUpdateToWishListMutation,
} from "@/store/services/wishlist.service";
import {
  useAddToCartMutation,
  useUpdateToCartMutation,
  useGetCartByUserQuery,
} from "@/store/services/cart.service";
import { HeartOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { toast } from "react-hot-toast";
import { IWishlistItem } from "@/types";

export default function Wishlist() {
  const {
    data: wishlistData,
    isFetching,
    isError,
  } = useGetWishlistByUserQuery(
    { page: 1, limit: 10 },
    { skip: !localStorage.getItem("accessToken") }
  );

  const [updateWishlist] = useUpdateToWishListMutation();
  const [addToCart] = useAddToCartMutation();
  const [updateToCart] = useUpdateToCartMutation();

  const { data: cartData } = useGetCartByUserQuery(
    { page: 1, limit: 100 },
    { skip: !localStorage.getItem("accessToken") }
  );

  const handleRemoveItem = async (_wishlistId: string, itemId: string) => {
    try {
      const currentWishlist = wishlistData?.data?.[0];
      if (!currentWishlist) return;

      const updatedItems = currentWishlist.items.filter(
        (item: IWishlistItem) => item.itemId !== itemId
      );

      await updateWishlist({ items: updatedItems }).unwrap();
      toast.success("Đã xóa khỏi danh sách yêu thích");
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast.error("Không thể xóa khỏi danh sách yêu thích");
    }
  };

  const isItemInCart = (itemId: string, itemType: string) => {
    if (!cartData?.data) return false;
    for (const cart of cartData.data) {
      if (
        cart.items &&
        cart.items.some(
          (cartItem: any) =>
            cartItem.itemId === itemId && cartItem.itemType === itemType
        )
      ) {
        return true;
      }
    }
    return false;
  };

  const handleAddToCart = async (item: IWishlistItem) => {
    try {
      if (isItemInCart(item.itemId, item.itemType)) {
        toast.success("Sản phẩm này đã có trong giỏ hàng");
        return;
      }

      const existingCart = cartData?.data?.[0];

      if (existingCart) {
        const updatedItems = [
          ...existingCart.items,
          {
            itemId: item.itemId,
            itemType: item.itemType,
            quantity: item.quantity,
            price: item.price,
          },
        ];

        await updateToCart({ items: updatedItems }).unwrap();
        toast.success("Đã thêm vào giỏ hàng");
      } else {
        const cartData = {
          items: [item],
          totalQuantity: item.quantity,
          totalPrice: item.price * item.quantity,
        };

        await addToCart(cartData).unwrap();
        toast.success("Đã thêm vào giỏ hàng");
      }

      await handleRemoveItem("", item.itemId);
    } catch (error: any) {
      console.error("Error adding to cart:", error);

      if (error?.status === 401) {
        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        localStorage.removeItem("accessToken");
        window.location.href = "/auth/login";
      } else if (error?.data?.message) {
        toast.error(error.data.message);
      } else {
        toast.error("Không thể thêm vào giỏ hàng. Vui lòng thử lại.");
      }
    }
  };

  const handleAddAllToCart = async () => {
    try {
      const currentWishlist = wishlistData?.data?.[0];
      if (!currentWishlist || currentWishlist.items.length === 0) {
        toast.error("Danh sách yêu thích trống");
        return;
      }

      const existingCart = cartData?.data?.[0];
      const itemsToAdd = currentWishlist.items.filter(
        (item: IWishlistItem) => !isItemInCart(item.itemId, item.itemType)
      );

      if (itemsToAdd.length === 0) {
        toast.success("Tất cả sản phẩm đã có trong giỏ hàng");
        return;
      }

      if (existingCart) {
        const updatedItems = [
          ...existingCart.items,
          ...itemsToAdd.map((item: IWishlistItem) => ({
            itemId: item.itemId,
            itemType: item.itemType,
            quantity: item.quantity,
            price: item.price,
          })),
        ];

        await updateToCart({ items: updatedItems }).unwrap();
        toast.success(`Đã thêm ${itemsToAdd.length} sản phẩm vào giỏ hàng`);
      } else {
        const totalQuantity = itemsToAdd.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        const totalPrice = itemsToAdd.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

        const cartData = {
          items: itemsToAdd,
          totalQuantity,
          totalPrice,
        };

        await addToCart(cartData).unwrap();
        toast.success(`Đã thêm ${itemsToAdd.length} sản phẩm vào giỏ hàng`);
      }

      await updateWishlist({ items: [] }).unwrap();
    } catch (error: any) {
      console.error("Error adding all to cart:", error);

      if (error?.status === 401) {
        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        localStorage.removeItem("accessToken");
        window.location.href = "/auth/login";
      } else if (error?.data?.message) {
        toast.error(error.data.message);
      } else {
        toast.error("Không thể thêm vào giỏ hàng. Vui lòng thử lại.");
      }
    }
  };
  if (!localStorage.getItem("accessToken")) {
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

  const wishlists = wishlistData?.data || [];
  if (wishlists.length === 0) {
    return (
      <div className="text-sm text-gray-500">Danh sách yêu thích trống.</div>
    );
  }

  return (
    <div className="space-y-4">
      {wishlists.map((wishlist: any) => (
        <WishlistHeaderItem
          key={wishlist._id}
          wishlist={wishlist}
          onRemoveItem={handleRemoveItem}
          onAddToCart={handleAddToCart}
        />
      ))}

      {wishlists && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={handleAddAllToCart}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <ShoppingCartOutlined />
            Thêm tất cả vào giỏ hàng
          </button>
        </div>
      )}
    </div>
  );
}

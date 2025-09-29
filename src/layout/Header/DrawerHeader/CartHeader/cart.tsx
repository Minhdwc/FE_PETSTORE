import CartHeaderItem from "./CartHeaderItem";
import { Button } from "antd";
import {
  useGetCartByUserQuery,
  useUpdateToCartMutation,
} from "@/store/services/cart.service";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { toast } from "react-hot-toast";

export default function Cart() {
  const hasAccessToken = Boolean(localStorage.getItem("accessToken"));
  const [updateToCart, { isLoading: isUpdating }] = useUpdateToCartMutation();
  const {
    data: cartData,
    isFetching,
    isError,
  } = useGetCartByUserQuery(
    { page: 1, limit: 100 },
    {
      skip: !hasAccessToken,
      refetchOnMountOrArgChange: true,
    }
  );
  if (isFetching) {
    return (
      <div className="text-sm text-gray-500 p-3">Đang tải giỏ hàng...</div>
    );
  }

  if (isError) {
    return (
      <div className="text-sm text-red-500 p-3">Không thể tải giỏ hàng.</div>
    );
  }

  const cart = cartData?.data?.[0];
  const items = cart?.items || [];
  if (!localStorage.getItem("accessToken")) {
    return (
      <div className="py-6 px-2 text-center">
        <ShoppingCartOutlined className="text-4xl text-gray-300 mb-3" />
        <div className="text-sm text-gray-500">
          Vui lòng đăng nhập để xem danh sách yêu thích.
        </div>
      </div>
    );
  }
  if (!cart || items.length === 0) {
    return <div className="text-sm text-gray-500 p-3">Giỏ hàng trống.</div>;
  }

  const total = items.reduce(
    (sum, item) => sum + (item.price || 0) * item.quantity,
    0
  );

  const handleRemoveItem = async (id: string) => {
    try {
      const updatedItems = items.filter((i) => i.itemId !== id);
      await updateToCart({ items: updatedItems }).unwrap();
      toast.success("Đã xóa khỏi giỏ hàng");
    } catch (e: any) {
      const message = e?.data?.message || "Xóa thất bại";
      toast.error(message);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto pr-1 space-y-2">
        {items.map((item) => (
          <CartHeaderItem
            key={item.itemId}
            cartItem={item}
            onRemove={handleRemoveItem}
          />
        ))}
      </div>

      <div className="border-t mt-3 pt-3 bg-white">
        <div className="flex justify-between items-center mb-3 px-1">
          <span className="text-sm text-gray-600">Tổng cộng:</span>
          <span className="text-lg font-bold text-red-500">
            {total.toLocaleString("vi-VN")} ₫
          </span>
        </div>
        <Button
          type="primary"
          size="large"
          block
          className="!bg-red-500 hover:!bg-red-600 rounded-lg"
          disabled={isUpdating}
        >
          {isUpdating ? "Đang cập nhật..." : "Thanh toán"}
        </Button>
      </div>
    </div>
  );
}

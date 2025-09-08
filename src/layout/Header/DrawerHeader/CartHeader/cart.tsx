import CartHeaderItem from "./CartHeaderItem";
import { Button } from "antd";
import { useGetCartByUserQuery } from "@/store/services/cart.service";

export default function Cart() {
  const hasAccessToken = Boolean(localStorage.getItem("accessToken"));
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
  console.log(cart);
  if (!cart || items.length === 0) {
    return <div className="text-sm text-gray-500 p-3">Giỏ hàng trống.</div>;
  }

  const total = items.reduce(
    (sum, item) => sum + (item.price || 0) * item.quantity,
    0
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto pr-1 space-y-2">
        {items.map((item) => (
          <CartHeaderItem key={item.itemId} cartItem={item} />
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
        >
          Thanh toán
        </Button>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { ICartItem, IPet, IProduction } from "@/types";
import axiosInterceptor from "@/utils/authorAxios";
import { DeleteOutlined } from "@ant-design/icons";

interface CartHeaderItemProps {
  cartItem: ICartItem;
  onRemove?: (id: string) => void;
}

export default function CartHeaderItem({
  cartItem,
  onRemove,
}: CartHeaderItemProps) {
  const [petData, setPetData] = useState<IPet | null>(null);
  const [productionData, setProductionData] = useState<IProduction | null>(
    null
  );
  useEffect(() => {
    const fetchPet = async () => {
      if (cartItem.itemType === "Pet") {
        try {
          const res = await axiosInterceptor.get(
            `/pet/detail/u=${cartItem.itemId}`
          );
          setPetData(res.data.data);
        } catch (err) {
          console.error("Lỗi khi fetch pet:", err);
        }
      } else {
        try {
          const res = await axiosInterceptor.get(
            `/production/detail/u=${cartItem.itemId}`
          );
          setProductionData(res.data.data);
        } catch (err) {
          console.error("Lỗi khi fetch production:", err);
        }
      }
    };
    fetchPet();
  }, [cartItem.itemId, cartItem.itemType]);

  const displayName = petData?.name || productionData?.name;
  const displayImage = petData?.image_url || productionData?.image_url;
  const unitPrice = (petData?.price ?? productionData?.price ?? 0) as number;
  const totalPrice = unitPrice * cartItem.quantity;

  return (
    <div className="flex items-center gap-3 p-2 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
      {displayImage && (
        <img
          src={displayImage}
          alt={displayName}
          className="w-14 h-14 rounded-lg object-cover border"
        />
      )}

      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-gray-800 truncate">
          {displayName}
        </div>
        <div className="text-xs text-gray-500 mt-0.5">
          {unitPrice.toLocaleString("vi-VN")} ₫ × {cartItem.quantity}
        </div>
        <div className="text-sm font-bold text-red-500 mt-1">
          {totalPrice.toLocaleString("vi-VN")} ₫
        </div>
      </div>

      {onRemove && (
        <button
          onClick={() => onRemove(cartItem.itemId)}
          className="text-gray-400 hover:text-red-500 transition"
        >
          <DeleteOutlined />
        </button>
      )}
    </div>
  );
}

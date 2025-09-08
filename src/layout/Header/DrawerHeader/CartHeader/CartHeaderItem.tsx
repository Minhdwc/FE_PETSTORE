import { useEffect, useState } from "react";
import { ICartItem, IPet } from "@/types";
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
      }
    };
    fetchPet();
  }, [cartItem.itemId, cartItem.itemType]);

  const unitPrice = petData?.price || 0;
  const totalPrice = unitPrice * cartItem.quantity;

  return (
    <div className="flex items-center gap-3 p-2 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
      {/* Hình */}
      {petData?.image_url ? (
        <img
          src={petData.image_url}
          alt={petData.name}
          className="w-14 h-14 rounded-lg object-cover border"
        />
      ) : (
        <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-400">
          No Img
        </div>
      )}

      {/* Nội dung */}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-gray-800 truncate">
          {petData?.name || "Sản phẩm"}
        </div>
        <div className="text-xs text-gray-500 mt-0.5">
          {unitPrice.toLocaleString("vi-VN")} ₫ × {cartItem.quantity}
        </div>
        <div className="text-sm font-bold text-red-500 mt-1">
          {totalPrice.toLocaleString("vi-VN")} ₫
        </div>
      </div>

      {/* Xóa */}
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

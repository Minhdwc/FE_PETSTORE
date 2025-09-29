import { IWishlist, IWishlistItem } from "@/types";
import { ShoppingCartOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, Skeleton } from "antd";
import { useGetPetDetailQuery } from "@/store/services/pet.service";
import { useGetProductionDetailQuery } from "@/store/services/production.service";

interface WishlistHeaderItemProps {
  wishlist: IWishlist;
  onRemoveItem?: (wishlistId: string, itemId: string) => void;
  onAddToCart?: (item: IWishlistItem) => void;
}

function WishlistItemDetail({
  item,
  onRemoveItem,
  onAddToCart,
}: {
  item: IWishlistItem;
  onRemoveItem?: (itemId: string) => void;
  onAddToCart?: (item: IWishlistItem) => void;
}) {
  const isPet = item.itemType === "Pet";
  const { data: petData, isLoading: isLoadingPet } = useGetPetDetailQuery(
    item.itemId,
    { skip: !isPet }
  );

  const { data: productData, isLoading: isLoadingProduct } =
    useGetProductionDetailQuery(item.itemId, { skip: isPet });

  const isLoading = isPet ? isLoadingPet : isLoadingProduct;
  const itemData = isPet ? petData?.data : productData?.data;

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200">
        <Skeleton.Image className="w-12 h-12 rounded-lg" />
        <div className="flex-1">
          <Skeleton.Input size="small" className="mb-2" />
          <Skeleton.Input size="small" />
        </div>
        <div className="flex gap-1">
          <Skeleton.Button size="small" />
          <Skeleton.Button size="small" />
        </div>
      </div>
    );
  }

  if (!itemData) {
    return (
      <div className="flex items-center gap-3 p-3 rounded-lg border border-red-200 bg-red-50">
        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
          <span className="text-lg">❌</span>
        </div>
        <div className="flex-1">
          <div className="text-xs text-red-500">
            ID: {item.itemId.slice(-6)}
          </div>
        </div>
        <Button
          type="text"
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => onRemoveItem?.(item.itemId)}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
          title="Xóa khỏi yêu thích"
        />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
        {itemData.image_url ? (
          <img
            src={itemData.image_url}
            alt={itemData.name || "Item"}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <span className="text-lg">{isPet ? "🐾" : "📦"}</span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
            {isPet ? "Thú cưng" : "Sản phẩm"}
          </span>
          {isPet && (itemData as any).breed && (
            <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
              {(itemData as any).breed}
            </span>
          )}
          {!isPet && (itemData as any).category && (
            <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
              {(itemData as any).category}
            </span>
          )}
        </div>

        <div className="text-sm font-medium text-gray-900 truncate">
          {itemData.name || "Tên không xác định"}
        </div>

        <div className="text-sm text-gray-600">
          Giá: {item.price?.toLocaleString()}₫
        </div>

        {isPet && (itemData as any).species && (
          <div className="text-xs text-gray-500">
            Loài: {(itemData as any).species} • Tuổi:{" "}
            {(itemData as any).age || "N/A"} tháng
          </div>
        )}

        {!isPet && (itemData as any).category && (
          <div className="text-xs text-gray-500">
            Danh mục: {(itemData as any).category}
          </div>
        )}
      </div>

      <div className="flex items-center gap-1">
        <Button
          type="text"
          size="small"
          icon={<ShoppingCartOutlined />}
          onClick={() => onAddToCart?.(item)}
          className="text-green-600 hover:text-green-700 hover:bg-green-50"
          title="Thêm vào giỏ hàng"
        />
        <Button
          type="text"
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => onRemoveItem?.(item.itemId)}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
          title="Xóa khỏi yêu thích"
        />
      </div>
    </div>
  );
}

export default function WishlistHeaderItem({
  wishlist,
  onRemoveItem,
  onAddToCart,
}: WishlistHeaderItemProps) {
  const handleRemoveItem = (itemId: string) => {
    onRemoveItem?.(wishlist._id, itemId);
  };

  return (
    <div className="space-y-3">
      {wishlist.items.map((item: IWishlistItem, index: number) => (
        <WishlistItemDetail
          key={`${item.itemId}-${index}`}
          item={item}
          onRemoveItem={handleRemoveItem}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}

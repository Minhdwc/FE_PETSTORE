import { IPet, IProduction } from "@/types";
import UniversalCard from "./UniversalCard";

type UniversalItem = IPet | IProduction;

interface UniversalGridProps {
  items: UniversalItem[];
  itemType: "Pet" | "Production";
  isLoading: boolean;
  isError?: boolean;

  onAddToCart?: (item: UniversalItem) => void;
  isItemInCart?: (itemId: string) => boolean;
  isAddingToCart?: boolean;
  allowMultipleCart?: boolean;

  onToggleFavorite?: (item: UniversalItem) => void;
  isFavorite?: (itemId: string) => boolean;

  showFavoriteButton?: boolean;
  showCartButton?: boolean;

  gridCols?: "2" | "3" | "4" | "5" | "6";
  gap?: "sm" | "md" | "lg";

  getItemLink?: (item: UniversalItem) => string;

  className?: string;
}

const UniversalGrid: React.FC<UniversalGridProps> = ({
  items,
  itemType,
  isLoading,
  isError = false,
  onAddToCart,
  isItemInCart,
  isAddingToCart = false,
  allowMultipleCart = false,
  onToggleFavorite,
  isFavorite,
  showFavoriteButton = false,
  showCartButton = true,
  gridCols = "4",
  gap = "md",
  getItemLink,
  className = "",
}: UniversalGridProps) => {
  const gridClasses = {
    "2": "grid-cols-2",
    "3": "grid-cols-3",
    "4": "grid-cols-4",
    "5": "grid-cols-5",
    "6": "grid-cols-6",
  };

  const gapClasses = {
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
  };

  if (isLoading) {
    return (
      <div
        className={`grid ${gridClasses[gridCols]} ${gapClasses[gap]} ${className}`}
      >
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse rounded-2xl border border-gray-200 bg-white"
          >
            <div className="aspect-square w-full bg-gray-200" />
            <div className="p-4">
              <div className="h-4 bg-gray-200 rounded mb-2" />
              <div className="h-3 bg-gray-200 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="text-4xl text-gray-300 mb-2">⚠️</div>
          <div className="text-gray-500">Không thể tải dữ liệu</div>
        </div>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="text-4xl text-gray-300 mb-2">
            {itemType === "Pet" ? "🐾" : "📦"}
          </div>
          <div className="text-gray-500">
            {itemType === "Pet"
              ? "Không có thú cưng nào"
              : "Không có sản phẩm nào"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`grid ${gridClasses[gridCols]} ${gapClasses[gap]} ${className}`}
    >
      {items.map((item) => (
        <UniversalCard
          key={item._id}
          item={item}
          itemType={itemType}
          onAddToCart={onAddToCart}
          isItemInCart={isItemInCart}
          isAddingToCart={isAddingToCart}
          allowMultipleCart={allowMultipleCart}
          onToggleFavorite={onToggleFavorite}
          isFavorite={isFavorite ? isFavorite(item._id) : false}
          showFavoriteButton={showFavoriteButton}
          showCartButton={showCartButton}
          linkTo={getItemLink ? getItemLink(item) : undefined}
        />
      ))}
    </div>
  );
};

export default UniversalGrid;

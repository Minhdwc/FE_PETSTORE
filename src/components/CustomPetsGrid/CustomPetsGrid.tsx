import { IPet } from "@/types";
import CustomPetCard from "../CustomPetCard/CustomPetCard";

interface CustomPetsGridProps {
  pets: IPet[];
  isLoading?: boolean;
  isError?: boolean;

  onAddToCart?: (pet: IPet) => void;
  isPetInCart?: (petId: string) => boolean;
  isAddingToCart?: boolean;

  onToggleFavorite?: (pet: IPet) => void;
  isFavorite?: (petId: string) => boolean;

  showFavoriteButton?: boolean;
  showCartButton?: boolean;

  gridCols?: "2" | "3" | "4" | "5" | "6";
  gap?: "sm" | "md" | "lg";

  linkTo?: string;

  className?: string;

  skeletonCount?: number;

  errorMessage?: string;

  emptyMessage?: string;
}

export default function CustomPetsGrid({
  pets,
  isLoading = false,
  isError = false,
  onAddToCart,
  isPetInCart,
  isAddingToCart = false,
  onToggleFavorite,
  isFavorite,
  showFavoriteButton = false,
  showCartButton = true,
  gridCols = "4",
  gap = "md",
  linkTo,
  className = "",
  skeletonCount = 8,
  errorMessage = "Lỗi tải dữ liệu",
  emptyMessage = "Không có thú cưng phù hợp",
}: CustomPetsGridProps) {
  const gridClasses = {
    "2": "grid-cols-2",
    "3": "grid-cols-2 sm:grid-cols-3",
    "4": "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
    "5": "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
    "6": "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6",
  };

  const gapClasses = {
    sm: "gap-2",
    md: "gap-4 md:gap-6",
    lg: "gap-6 md:gap-8",
  };

  const gridClassName = `grid ${gridClasses[gridCols]} ${gapClasses[gap]} ${className}`;

  if (isLoading) {
    return (
      <div className={gridClassName}>
        {Array.from({ length: skeletonCount }).map((_, idx) => (
          <div
            key={idx}
            className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
          >
            <div className="aspect-square w-full animate-pulse bg-gray-100" />
            <div className="p-4">
              <div className="h-4 w-2/3 animate-pulse rounded bg-gray-100" />
              <div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-gray-100" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
        {errorMessage}
      </div>
    );
  }

  if (pets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-500">
        <div className="text-4xl mb-4">🐾</div>
        <p className="text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={gridClassName}>
      {pets.map((pet) => (
        <CustomPetCard
          key={pet._id}
          pet={pet}
          onAddToCart={onAddToCart}
          isPetInCart={isPetInCart}
          isAddingToCart={isAddingToCart}
          onToggleFavorite={onToggleFavorite}
          isFavorite={isFavorite ? isFavorite(pet._id) : false}
          showFavoriteButton={showFavoriteButton}
          showCartButton={showCartButton}
          linkTo={linkTo}
        />
      ))}
    </div>
  );
}

import { IPet } from "@/types";
import UniversalGrid from "@/components/UniversalCard/UniversalGrid";

interface CustomPetsGridProps {
  pets: IPet[];
  isLoading?: boolean;

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
}

export default function CustomPetsGrid({
  pets,
  isLoading = false,
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
}: CustomPetsGridProps) {
  return (
    <UniversalGrid
      items={pets}
      itemType="Pet"
      isLoading={isLoading}
      onAddToCart={
        onAddToCart ? (item) => onAddToCart(item as IPet) : undefined
      }
      isItemInCart={isPetInCart}
      isAddingToCart={isAddingToCart}
      allowMultipleCart={false}
      onToggleFavorite={
        onToggleFavorite ? (item) => onToggleFavorite(item as IPet) : undefined
      }
      isFavorite={isFavorite}
      showFavoriteButton={showFavoriteButton}
      showCartButton={showCartButton}
      gridCols={gridCols}
      gap={gap}
      getItemLink={linkTo ? () => linkTo : undefined}
      className={className}
    />
  );
}

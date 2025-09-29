import { IProduction } from "@/types";
import UniversalGrid from "@/components/UniversalCard/UniversalGrid";

interface ProductsGridProps {
  products: IProduction[];
  isLoading: boolean;
  isError: boolean;
  isAddingToCart: boolean;
  onAddToCart: (product: IProduction) => void;
  onToggleFavorite?: (product: IProduction) => void;
  isFavorite?: (productId: string) => boolean;
}

export default function ProductsGrid({
  products,
  isLoading,
  isError,
  isAddingToCart,
  onAddToCart,
  onToggleFavorite,
  isFavorite,
}: ProductsGridProps) {
  return (
    <UniversalGrid
      items={products}
      itemType="Production"
      isLoading={isLoading}
      isError={isError}
      onAddToCart={(item) => onAddToCart(item as IProduction)}
      isAddingToCart={isAddingToCart}
      onToggleFavorite={
        onToggleFavorite
          ? (item) => onToggleFavorite(item as IProduction)
          : undefined
      }
      isFavorite={isFavorite}
      allowMultipleCart={true}
      showCartButton={true}
      showFavoriteButton={true}
      gridCols="4"
      gap="md"
    />
  );
}

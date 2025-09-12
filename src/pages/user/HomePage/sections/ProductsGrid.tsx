import { IProduction } from "@/types";
import ProductionCard from "./ProductionCard";

interface ProductsGridProps {
  products: IProduction[];
  isLoading: boolean;
  isError: boolean;
  isAddingToCart: boolean;
  onAddToCart: (product: IProduction) => void;
}

export default function ProductsGrid({
  products,
  isLoading,
  isError,
  isAddingToCart,
  onAddToCart,
}: ProductsGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 8 }).map((_, idx) => (
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
        Failed to load products. Please try again later.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <ProductionCard
          key={product._id}
          product={product}
          isAddingToCart={isAddingToCart}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}

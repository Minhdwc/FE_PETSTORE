import { IPet } from "@/types";
import PetCard from "./PetCard";

interface PetsGridProps {
  pets: IPet[];
  isLoading: boolean;
  isError: boolean;
  isPetInCart: (petId: string) => boolean;
  isAddingToCart: boolean;
  onAddToCart: (pet: IPet) => void;
}

export default function PetsGrid({
  pets,
  isLoading,
  isError,
  isPetInCart,
  isAddingToCart,
  onAddToCart,
}: PetsGridProps) {
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
        Failed to load pets. Please try again later.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {pets.map((pet) => (
        <PetCard
          key={pet._id}
          pet={pet}
          isPetInCart={isPetInCart}
          isAddingToCart={isAddingToCart}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}

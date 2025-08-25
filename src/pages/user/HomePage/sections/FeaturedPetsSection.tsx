import PetCard from "@/components/PetCard/PetCard";
import { useGetpetsQuery } from "@/store/services/pet.service";
import type { IPet } from "@/types";
import { Link } from "react-router-dom";

type FeaturedPetsSectionProps = {
  favoriteIds: Set<string>;
  toggleFavorite: (pet: IPet) => void;
  addToCart: (pet: IPet) => void;
};

export default function FeaturedPetsSection({
  favoriteIds,
  toggleFavorite,
  addToCart,
}: FeaturedPetsSectionProps) {
  const { data, isLoading, isError } = useGetpetsQuery({ page: 1, limit: 8 });
  const pets: IPet[] = data?.data || [];

  return (
    <section className="mt-10">
      <div className="mb-4 flex items-end justify-between">
        <h2 className="text-xl md:text-2xl font-bold text-slate-900">
          New friends waiting for you
        </h2>
        <Link to="/pet" className="text-blue-700 hover:underline">
          See more
        </Link>
      </div>

      {isLoading ? (
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
      ) : isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          Failed to load pets. Please try again later.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {pets.map((pet) => (
            <PetCard
              key={pet._id}
              pet={pet}
              isFavorite={favoriteIds.has(pet._id)}
              onToggleFavorite={toggleFavorite}
              onAddToCart={addToCart}
            />
          ))}
        </div>
      )}
    </section>
  );
}

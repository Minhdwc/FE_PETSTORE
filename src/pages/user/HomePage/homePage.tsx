import { Link } from "react-router-dom";
import { useGetpetsQuery } from "@/store/services/pet.service";
import { IPet } from "@/types";
import SliderHome from "./SliderHome/SliderHome";
import CategorySection from "./sections/CategorySection";
import CustomPetsGrid from "@/components/CustomPetsGrid/CustomPetsGrid";
import { useGetProductionsQuery } from "@/store/services/production.service";
import { IProduction } from "@/types";
import ProductsGrid from "./sections/ProductsGrid";
import useCartWishlist from "@/hooks/useCartWishlist";

export default function HomePage() {
  const {
    isPetInCart,
    handlePetAddToCart,
    handleProductAddToCart,
    isAddingToCart,
    isPetInWishlist,
    isProductInWishlist,
    toggleFavoritePet,
    toggleFavoriteProduct,
  } = useCartWishlist();

  const { data, isLoading } = useGetpetsQuery({
    page: 1,
    limit: 8,
    status: "available",
  });

  const pets: IPet[] = data?.data || [];
  const {
    data: productsRes,
    isLoading: isLoadingProducts,
    isError: isErrorProducts,
  } = useGetProductionsQuery({ page: 1, limit: 8 });
  const products: IProduction[] = productsRes?.data || [];

  return (
    <div className="py-8">
      <SliderHome />

      <CategorySection />

      <section className="mt-10">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900">
            New friends waiting for you
          </h2>
          <Link to="/pet" className="text-blue-700 hover:underline">
            See more
          </Link>
        </div>

        <CustomPetsGrid
          pets={pets}
          isLoading={isLoading}
          isPetInCart={isPetInCart}
          isAddingToCart={isAddingToCart}
          onAddToCart={handlePetAddToCart}
          onToggleFavorite={toggleFavoritePet}
          isFavorite={isPetInWishlist}
          showFavoriteButton={true}
          showCartButton={true}
          gridCols="4"
          gap="md"
        />
      </section>

      <section className="mt-10">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900">
            Products for your pets
          </h2>
          <Link to="/production" className="text-blue-700 hover:underline">
            See more
          </Link>
        </div>

        <ProductsGrid
          products={products}
          isLoading={isLoadingProducts}
          isError={isErrorProducts}
          isAddingToCart={isAddingToCart}
          onAddToCart={handleProductAddToCart}
          onToggleFavorite={toggleFavoriteProduct}
          isFavorite={isProductInWishlist}
        />
      </section>
    </div>
  );
}

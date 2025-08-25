import { Link } from "react-router-dom";
import { FaDog, FaCat, FaFish, FaBone } from "react-icons/fa";
import { useGetpetsQuery } from "@/store/services/pet.service";
import {
  useGetCartByUserQuery,
  useAddToCartMutation,
} from "@/store/services/cart.service";
import { IPet, ICart } from "@/types";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { FaShoppingCart, FaHeart } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import axiosInterceptor from "@/utils/authorAxios";

import SliderHome from "./SliderHome/SliderHome";

type Category = {
  key: string;
  name: string;
  icon: ReactNode;
  to: string;
  description: string;
};

const categories: Category[] = [
  {
    key: "dogs",
    name: "Dogs",
    icon: <FaDog size={28} />,
    to: "/pet",
    description: "Puppies and adult dogs looking for a home.",
  },
  {
    key: "cats",
    name: "Cats",
    icon: <FaCat size={28} />,
    to: "/pet",
    description: "Adorable kittens and cats to cuddle.",
  },
  {
    key: "fish",
    name: "Fish",
    icon: <FaFish size={28} />,
    to: "/pet",
    description: "Colorful aquarium fish and care guides.",
  },
  {
    key: "supplies",
    name: "Supplies",
    icon: <FaBone size={28} />,
    to: "/production",
    description: "Food, toys, and accessories for every pet.",
  },
];

function CategoryCard({ item }: { item: Category }) {
  return (
    <Link
      to={item.to}
      className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md hover:-translate-y-0.5"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 text-blue-600 ring-1 ring-blue-100">
          {item.icon}
        </div>
        <div className="flex-1">
          <div className="text-base font-semibold text-slate-800 group-hover:text-blue-700">
            {item.name}
          </div>
          <div className="mt-1 text-sm text-slate-500 line-clamp-2">
            {item.description}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const navigate = useNavigate();

  const { data, isLoading, isError } = useGetpetsQuery({
    page: 1,
    limit: 8,
    status: "available",
  });

  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();

  const pets: IPet[] = data?.data || [];
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  // Get cart data for current user
  const { data: cartData } = useGetCartByUserQuery({
    page: 1,
    limit: 100,
  });

  // Check if a pet is already in cart
  const isPetInCart = (petId: string) => {
    if (!cartData?.data?.data) return false;
    
    // Check all cart items for this user
    for (const cart of cartData.data.data) {
      if (cart.items && cart.items.some(item => item.itemId === petId)) {
        return true;
      }
    }
    return false;
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem("favorites");
      if (raw) setFavoriteIds(new Set(JSON.parse(raw)));
    } catch {}
  }, []);

  const persistFavorites = (ids: Set<string>) => {
    localStorage.setItem("favorites", JSON.stringify(Array.from(ids)));
  };

  const toggleFavorite = (pet: IPet) => {
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (pet._id) {
        if (next.has(pet._id)) {
          next.delete(pet._id);
          toast("Removed from favorites");
        } else {
          next.add(pet._id);
          toast.success("Added to favorites");
        }
      }
      persistFavorites(next);
      return next;
    });
  };

  const handleAddToCart = async (pet: IPet) => {
    try {
      // Check if user is authenticated
      const isAuthenticated = localStorage.getItem("accessToken");

      if (!isAuthenticated) {
        toast.error("Please login to add items to cart");
        navigate("/auth/login");
        return;
      }

      // Add pet to cart via Redux - using /cart/create endpoint
      const cartData = {
        items: [
          {
            itemId: pet._id,
            itemType: "Pet" as const,
            quantity: 1,
            price: typeof pet.price === "number" ? pet.price : 0,
          },
        ],
        totalQuantity: 1,
        totalPrice: typeof pet.price === "number" ? pet.price : 0,
      };

      await addToCart(cartData).unwrap();
      toast.success("Added to cart successfully!");
    } catch (error: any) {
      console.error("Error adding to cart:", error);

      if (error?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("accessToken");
        navigate("/auth/login");
      } else if (error?.data?.message) {
        toast.error(error.data.message);
      } else {
        toast.error("Could not add to cart. Please try again.");
      }
    }
  };

  return (
    <div className="py-8">
      <SliderHome />
      <section className="mt-10">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900">
            Browse by category
          </h2>
          <Link to="/production" className="text-blue-700 hover:underline">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((c) => (
            <CategoryCard key={c.key} item={c} />
          ))}
        </div>
      </section>

      {/* Cart Counter Banner */}
      {cartData?.data?.data && cartData.data.data.length > 0 && (
        <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaShoppingCart className="text-blue-600" size={20} />
              <div>
                <p className="font-medium text-blue-900">Your Cart</p>
                <p className="text-sm text-blue-700">
                  {cartData.data.data.reduce((total, cart) => total + (cart.totalQuantity || 0), 0)} items in cart
                </p>
              </div>
            </div>
            <Link
              to="/cart"
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-colors"
            >
              View Cart
            </Link>
          </div>
        </div>
      )}

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
              <Link
                to={`/pet/detail/u=${pet._id}`}
                key={pet._id}
                className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-lg hover:-translate-y-1"
              >
                <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
                  <div className="absolute right-2 top-2 z-10 flex flex-col gap-2">
                    <button
                      aria-label="Add to favorites"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFavorite(pet);
                      }}
                      className={`flex h-9 w-9 items-center justify-center rounded-full bg-white/70 backdrop-blur ring-1 ring-blue-100 shadow-sm transition hover:scale-105 hover:bg-white ${
                        favoriteIds.has(pet._id)
                          ? "text-red-500"
                          : "text-slate-700"
                      }`}
                      title={
                        favoriteIds.has(pet._id)
                          ? "Remove favorite"
                          : "Add to favorites"
                      }
                    >
                      <FaHeart size={16} />
                    </button>
                    <button
                      aria-label="Add to cart"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleAddToCart(pet);
                      }}
                      disabled={isPetInCart(pet._id) || isAddingToCart}
                      className={`flex h-9 w-9 items-center justify-center rounded-full ring-1 ring-blue-100 shadow-sm transition ${
                        isPetInCart(pet._id)
                          ? "bg-green-100 text-green-600 cursor-not-allowed opacity-60"
                          : isAddingToCart
                          ? "bg-white/50 text-slate-400 cursor-wait opacity-50"
                          : "bg-white/70 text-slate-700 hover:scale-105 hover:bg-white"
                      }`}
                      title={
                        isPetInCart(pet._id) ? "Already in cart" : "Add to cart"
                      }
                    >
                      <FaShoppingCart size={16} />
                    </button>
                  </div>

                  {pet.status && (
                    <div className="absolute left-2 top-2 z-10">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium shadow-sm ${
                          pet.status === "available"
                            ? "bg-green-100 text-green-700 ring-1 ring-green-200"
                            : "bg-gray-100 text-gray-700 ring-1 ring-gray-200"
                        }`}
                      >
                        {pet.status}
                      </span>
                    </div>
                  )}

                  {pet.image_url ? (
                    <img
                      src={pet.image_url}
                      alt={pet.name || "pet"}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-400">
                      No image
                    </div>
                  )}

                  {typeof pet.price === "number" && (
                    <div className="absolute bottom-2 left-2 z-10">
                      <span className="rounded-full bg-white/80 backdrop-blur px-2.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-100 shadow-sm">
                        {pet.price.toLocaleString()} ₫
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="line-clamp-1 text-sm font-semibold text-slate-900">
                    {pet.name}
                  </div>
                  <div className="mt-1 text-xs text-slate-500 line-clamp-1">
                    {pet.breed || pet.species}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

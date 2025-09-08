import { Link } from "react-router-dom";
import { useGetpetsQuery } from "@/store/services/pet.service";
import {
  useGetCartByUserQuery,
  useAddToCartMutation,
  useUpdateToCartMutation,
} from "@/store/services/cart.service";
import { IPet } from "@/types";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import SliderHome from "./SliderHome/SliderHome";
import CategorySection from "./sections/CategorySection";
import PetsGrid from "./sections/PetsGrid";

export default function HomePage() {
  const navigate = useNavigate();

  const { data, isLoading, isError } = useGetpetsQuery({
    page: 1,
    limit: 8,
    status: "available",
  });

  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();
  const [updateToCart, { isLoading: isUpdatingToCart }] =
    useUpdateToCartMutation();
  const pets: IPet[] = data?.data || [];

  const hasAccessToken = Boolean(localStorage.getItem("accessToken"));
  const { data: cartData } = useGetCartByUserQuery(
    {
      page: 1,
      limit: 100,
    },
    {
      skip: !hasAccessToken,
    }
  );
  console.log(cartData);

  const isPetInCart = (petId: string) => {
    if (!cartData?.data) return false;

    for (const cart of cartData.data) {
      if (cart.items && cart.items.some((item) => item.itemId === petId)) {
        return true;
      }
    }
    return false;
  };

  const getPetFromCart = (petId: string) => {
    if (!cartData?.data) return null;

    for (const cart of cartData.data) {
      const item = cart.items?.find((item) => item.itemId === petId);
      if (item) {
        return { cart, item };
      }
    }
    return null;
  };

  const handleAddToCart = async (pet: IPet) => {
    try {
      const isAuthenticated = localStorage.getItem("accessToken");

      if (!isAuthenticated) {
        toast.error("Please login to add items to cart");
        navigate("/auth/login");
        return;
      }

      const existingCart = cartData?.data?.[0];
      const petInCart = getPetFromCart(pet._id);

      if (existingCart) {
        let updatedItems;

        if (petInCart) {
          updatedItems = existingCart.items.map((item) =>
            item.itemId === pet._id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          updatedItems = [
            ...existingCart.items,
            {
              itemId: pet._id,
              itemType: "Pet" as const,
              quantity: 1,
              price: typeof pet.price === "number" ? pet.price : 0,
            },
          ];
        }

        const updateData = {
          items: updatedItems,
        };

        await updateToCart(updateData).unwrap();
        toast.success("Cart updated successfully!");
      } else {
        const addData = {
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

        await addToCart(addData).unwrap();
        toast.success("Added to cart successfully!");
      }
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

        <PetsGrid
          pets={pets}
          isLoading={isLoading}
          isError={isError}
          isPetInCart={isPetInCart}
          isAddingToCart={isAddingToCart || isUpdatingToCart}
          onAddToCart={handleAddToCart}
        />
      </section>
    </div>
  );
}

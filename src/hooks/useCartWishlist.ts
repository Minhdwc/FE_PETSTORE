import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  useGetCartByUserQuery,
  useAddToCartMutation,
  useUpdateToCartMutation,
} from "@/store/services/cart.service";
import {
  useGetWishlistByUserQuery,
  useAddToWishlistMutation,
  useUpdateToWishListMutation,
} from "@/store/services/wishlist.service";
import type { IPet, IProduction } from "@/types";

export function useCartWishlist() {
  const navigate = useNavigate();

  const hasAccessToken = Boolean(localStorage.getItem("accessToken"));

  const { data: cartData } = useGetCartByUserQuery(
    { page: 1, limit: 100 },
    { skip: !hasAccessToken }
  );

  const { data: favouriteData } = useGetWishlistByUserQuery(
    { page: 1, limit: 100 },
    { skip: !hasAccessToken }
  );

  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();
  const [updateToCart, { isLoading: isUpdatingToCart }] =
    useUpdateToCartMutation();

  const [addToWishlist] = useAddToWishlistMutation();
  const [updateToWishlist] = useUpdateToWishListMutation();

  const isPetInCart = (petId: string) => {
    if (!cartData?.data) return false;
    for (const cart of cartData.data) {
      if (cart.items && cart.items.some((item: any) => item.itemId === petId)) {
        return true;
      }
    }
    return false;
  };

  const isProductInCart = (productId: string) => {
    if (!cartData?.data) return false;
    for (const cart of cartData.data) {
      if (
        cart.items &&
        cart.items.some(
          (item: any) =>
            item.itemId === productId && item.itemType === "Product"
        )
      ) {
        return true;
      }
    }
    return false;
  };

  const getPetFromCart = (petId: string) => {
    if (!cartData?.data) return null;
    for (const cart of cartData.data) {
      const item = cart.items?.find((item: any) => item.itemId === petId);
      if (item) return { cart, item };
    }
    return null;
  };

  const getProductFromCart = (productId: string) => {
    if (!cartData?.data) return null;
    for (const cart of cartData.data) {
      const item = cart.items?.find(
        (item: any) => item.itemId === productId && item.itemType === "Product"
      );
      if (item) return { cart, item };
    }
    return null;
  };

  const ensureAuthOrRedirect = () => {
    const isAuthenticated = localStorage.getItem("accessToken");
    if (!isAuthenticated) {
      toast.error("Please login to continue");
      navigate("/auth/login");
      return false;
    }
    return true;
  };

  const handleProductAddToCart = async (product: IProduction) => {
    try {
      if (!ensureAuthOrRedirect()) return;

      const existingCart = cartData?.data?.[0];
      const productInCart = getProductFromCart(product._id);

      if (existingCart) {
        let updatedItems;
        if (productInCart) {
          updatedItems = existingCart.items.map((item: any) =>
            item.itemId === product._id && item.itemType === "Product"
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          updatedItems = [
            ...existingCart.items,
            {
              itemId: product._id,
              itemType: "Product" as const,
              quantity: 1,
              price: typeof product.price === "number" ? product.price : 0,
            },
          ];
        }

        await updateToCart({ items: updatedItems }).unwrap();
        toast.success("Thêm vào giỏ hàng thành công!");
      } else {
        const addData = {
          items: [
            {
              itemId: product._id,
              itemType: "Product" as const,
              quantity: 1,
              price: typeof product.price === "number" ? product.price : 0,
            },
          ],
          totalQuantity: 1,
          totalPrice: typeof product.price === "number" ? product.price : 0,
        };
        await addToCart(addData).unwrap();
        toast.success("Thêm vào giỏ hàng thành công!");
      }
    } catch (error: any) {
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

  const handlePetAddToCart = async (pet: IPet) => {
    try {
      if (!ensureAuthOrRedirect()) return;

      const existingCart = cartData?.data?.[0];
      const petInCart = getPetFromCart(pet._id);

      if (existingCart) {
        if (petInCart) {
          toast.success("This pet is already in your cart");
          return;
        }

        const updatedItems = [
          ...existingCart.items,
          {
            itemId: pet._id,
            itemType: "Pet" as const,
            quantity: 1,
            price: typeof pet.price === "number" ? pet.price : 0,
          },
        ];

        await updateToCart({ items: updatedItems }).unwrap();
        toast.success("Thêm vào giỏ hàng thành công");
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
        toast.success("Thêm vào giỏ hàng thành công!");
      }
    } catch (error: any) {
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

  const isPetInWishlist = (petId: string) => {
    if (!favouriteData) return false;
    for (const favourite of favouriteData.data) {
      if (
        favourite.items &&
        favourite.items.some((item: any) => item.itemId === petId)
      ) {
        return true;
      }
    }
    return false;
  };

  const isProductInWishlist = (productId: string) => {
    if (!favouriteData) return false;
    for (const favourite of favouriteData.data) {
      if (
        favourite.items &&
        favourite.items.some(
          (item: any) =>
            item.itemId === productId && item.itemType === "Product"
        )
      ) {
        return true;
      }
    }
    return false;
  };

  const toggleFavoritePet = async (pet: IPet) => {
    try {
      if (!ensureAuthOrRedirect()) return;

      const existingWishlist = favouriteData?.data?.[0];
      const alreadyInWishlist = isPetInWishlist(pet._id);

      if (existingWishlist) {
        let updatedItems = existingWishlist.items || [];
        if (alreadyInWishlist) {
          updatedItems = updatedItems.filter(
            (item: any) => !(item.itemId === pet._id && item.itemType === "Pet")
          );
          await updateToWishlist({ items: updatedItems }).unwrap();
          toast.success("Đã xóa khỏi danh sách yêu thích");
          return;
        } else {
          updatedItems = [
            ...updatedItems,
            {
              itemId: pet._id,
              itemType: "Pet" as const,
              quantity: 1,
              price: typeof pet.price === "number" ? pet.price : 0,
            },
          ];
          await updateToWishlist({ items: updatedItems }).unwrap();
          toast.success("Thêm vào danh sách yêu thich thành công!");
          return;
        }
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
        };
        await addToWishlist(addData).unwrap();
        toast.success("Thêm vào danh sách yêu thich thành công!");
      }
    } catch (error: any) {
      if (error?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("accessToken");
        navigate("/auth/login");
      } else if (error?.data?.message) {
        toast.error(error.data.message);
      } else {
        toast.error("Could not update wishlist. Please try again.");
      }
    }
  };

  const toggleFavoriteProduct = async (product: IProduction) => {
    try {
      if (!ensureAuthOrRedirect()) return;

      const existingWishlist = favouriteData?.data?.[0];
      const alreadyInWishlist = isProductInWishlist(product._id);

      if (existingWishlist) {
        let updatedItems = existingWishlist.items || [];
        if (alreadyInWishlist) {
          updatedItems = updatedItems.filter(
            (item: any) =>
              !(item.itemId === product._id && item.itemType === "Product")
          );
          await updateToWishlist({ items: updatedItems }).unwrap();
          toast.success("Đã xóa khỏi danh sách yêu thích");
          return;
        } else {
          updatedItems = [
            ...updatedItems,
            {
              itemId: product._id,
              itemType: "Product" as const,
              quantity: 1,
              price: typeof product.price === "number" ? product.price : 0,
            },
          ];
          await updateToWishlist({ items: updatedItems }).unwrap();
          toast.success("Thêm vào danh sách yêu thich thành công!");
          return;
        }
      } else {
        const addData = {
          items: [
            {
              itemId: product._id,
              itemType: "Product" as const,
              quantity: 1,
              price: typeof product.price === "number" ? product.price : 0,
            },
          ],
        };
        await addToWishlist(addData).unwrap();
        toast.success("Thêm vào danh sách yêu thich thành công!");
      }
    } catch (error: any) {
      if (error?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("accessToken");
        navigate("/auth/login");
      } else if (error?.data?.message) {
        toast.error(error.data.message);
      } else {
        toast.error("Could not update wishlist. Please try again.");
      }
    }
  };

  return {
    isPetInCart,
    isProductInCart,
    handlePetAddToCart,
    handleProductAddToCart,
    isAddingToCart: isAddingToCart || isUpdatingToCart,

    isPetInWishlist,
    isProductInWishlist,
    toggleFavoritePet,
    toggleFavoriteProduct,
  };
}

export default useCartWishlist;

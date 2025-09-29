import { Link } from "react-router-dom";
import { FaShoppingCart, FaHeart } from "react-icons/fa";
import { IPet, IProduction } from "@/types";

type UniversalItem = IPet | IProduction;

interface UniversalCardProps {
  item: UniversalItem;
  itemType: "Pet" | "Production";

  onAddToCart?: (item: UniversalItem) => void;
  isItemInCart?: (itemId: string) => boolean;
  isAddingToCart?: boolean;
  allowMultipleCart?: boolean;

  onToggleFavorite?: (item: UniversalItem) => void;
  isFavorite?: boolean;

  showFavoriteButton?: boolean;
  showCartButton?: boolean;

  linkTo?: string;

  className?: string;
}

export default function UniversalCard({
  item,
  itemType,
  onAddToCart,
  isItemInCart,
  isAddingToCart = false,
  allowMultipleCart = false,
  onToggleFavorite,
  isFavorite = false,
  showFavoriteButton = false,
  showCartButton = true,
  linkTo,
  className = "",
}: UniversalCardProps) {
  const defaultLinkTo =
    itemType === "Pet"
      ? `/pet/detail/${item._id}`
      : `/production/detail/${item._id}`;
  const finalLinkTo = linkTo || defaultLinkTo;

  const inCart =
    !allowMultipleCart && isItemInCart ? isItemInCart(item._id) : false;

  const getDisplayInfo = () => {
    if (itemType === "Pet") {
      const pet = item as IPet;
      return {
        name: pet.name,
        subtitle: pet.breed || pet.species,
        price: pet.price,
        image: pet.image_url,
        status: pet.status,
        statusText: pet.status === "available" ? "Còn bán" : "Đã bán",
        statusColor:
          pet.status === "available"
            ? "bg-green-100 text-green-700 ring-green-200"
            : "bg-gray-100 text-gray-700 ring-gray-200",
      };
    } else {
      const product = item as IProduction;
      return {
        name: product.name,
        subtitle: product.category,
        price: product.price,
        image: product.image_url,
        status: null,
        statusText: "",
        statusColor: "",
      };
    }
  };

  const displayInfo = getDisplayInfo();

  return (
    <Link
      to={finalLinkTo}
      className={`group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-lg hover:-translate-y-1 ${className}`}
    >
      <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
        <div className="absolute right-2 top-2 z-10 flex flex-col gap-2">
          {showFavoriteButton && onToggleFavorite && (
            <button
              aria-label="Add to favorites"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleFavorite(item);
              }}
              className={`flex h-9 w-9 items-center justify-center rounded-full bg-white/70 backdrop-blur ring-1 ring-blue-100 shadow-sm transition hover:scale-105 hover:bg-white ${
                isFavorite ? "text-red-500" : "text-slate-700"
              }`}
              title={isFavorite ? "Remove favorite" : "Add to favorites"}
            >
              <FaHeart size={16} />
            </button>
          )}

          {showCartButton && onAddToCart && (
            <button
              aria-label="Add to cart"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onAddToCart(item);
              }}
              disabled={inCart || isAddingToCart}
              className={`flex h-9 w-9 items-center justify-center rounded-full ring-1 ring-blue-100 shadow-sm transition ${
                inCart
                  ? "bg-green-100 text-green-600 cursor-not-allowed opacity-60"
                  : isAddingToCart
                  ? "bg-white/50 text-slate-400 cursor-wait opacity-50"
                  : "bg-white/70 text-slate-700 hover:scale-105 hover:bg-white"
              }`}
              title={
                inCart
                  ? "Already in cart"
                  : allowMultipleCart
                  ? "Add to cart"
                  : "Add to cart"
              }
            >
              <FaShoppingCart size={16} />
            </button>
          )}
        </div>

        {displayInfo.status && (
          <div className="absolute left-2 top-2 z-10">
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium shadow-sm ring-1 ${displayInfo.statusColor}`}
            >
              {displayInfo.statusText}
            </span>
          </div>
        )}

        {displayInfo.image ? (
          <img
            src={displayInfo.image}
            alt={displayInfo.name || itemType.toLowerCase()}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400">
            No image
          </div>
        )}

        {typeof displayInfo.price === "number" && (
          <div className="absolute bottom-2 left-2 z-10">
            <span className="rounded-full bg-white/80 backdrop-blur px-2.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-100 shadow-sm">
              {displayInfo.price.toLocaleString("vi-VN")} ₫
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="line-clamp-1 text-sm font-semibold text-slate-900">
          {displayInfo.name}
        </div>
        <div className="mt-1 text-xs text-slate-500 line-clamp-1">
          {displayInfo.subtitle}
        </div>
      </div>
    </Link>
  );
}

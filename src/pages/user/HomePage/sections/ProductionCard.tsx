import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { IProduction } from "@/types";

interface ProductionCardProps {
  product: IProduction;
  isAddingToCart: boolean;
  onAddToCart: (product: IProduction) => void;
}

export default function ProductionCard({
  product,
  isAddingToCart,
  onAddToCart,
}: ProductionCardProps) {
  return (
    <Link
      to={`/production/detail/${product._id}`}
      className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-lg hover:-translate-y-1"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
        <div className="absolute right-2 top-2 z-10 flex flex-col gap-2">
          <button
            aria-label="Add to cart"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAddToCart(product);
            }}
            disabled={isAddingToCart}
            className={`flex h-9 w-9 items-center justify-center rounded-full ring-1 ring-blue-100 shadow-sm transition ${
              isAddingToCart
                ? "bg-white/50 text-slate-400 cursor-wait opacity-50"
                : "bg-white/70 text-slate-700 hover:scale-105 hover:bg-white"
            }`}
            title="Add to cart"
          >
            <FaShoppingCart size={16} />
          </button>
        </div>

        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name || "product"}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400">
            No image
          </div>
        )}

        {typeof product.price === "number" && (
          <div className="absolute bottom-2 left-2 z-10">
            <span className="rounded-full bg-white/80 backdrop-blur px-2.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-100 shadow-sm">
              {product.price.toLocaleString("vi-VN")} ₫
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="line-clamp-1 text-sm font-semibold text-slate-900">
          {product.name}
        </div>
        <div className="mt-1 text-xs text-slate-500 line-clamp-1">
          {product.category}
        </div>
      </div>
    </Link>
  );
}

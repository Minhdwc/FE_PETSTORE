import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";

interface CartBannerProps {
  cartData: any;
}

export default function CartBanner({ cartData }: CartBannerProps) {
  if (!cartData?.data?.data || cartData.data.data.length === 0) {
    return null;
  }

  const totalItems = cartData.data.data.reduce(
    (total: number, cart: any) => total + (cart.totalQuantity || 0),
    0
  );

  return (
    <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FaShoppingCart className="text-blue-600" size={20} />
          <div>
            <p className="font-medium text-blue-900">Your Cart</p>
            <p className="text-sm text-blue-700">
              {totalItems} items in cart
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
  );
}


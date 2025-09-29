import React from "react";
import { Dropdown, Avatar } from "antd";
import {
  UserOutlined,
  ShoppingCartOutlined,
  HeartOutlined,
  DownOutlined,
  BellOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import Logo from "@/assets/logo.png";
import CustomLogo from "@/components/Logo/Logo";
import HeaderMenu from "./MenuHeader/Menu";
import CustomDrawer from "./DrawerHeader/Drawer";
import toast from "react-hot-toast";
import Cart from "./DrawerHeader/CartHeader/cart";
import Wishlist from "./DrawerHeader/WishlistHeader/wishlist";
import Notification from "./DrawerHeader/NotificationHeader/Notification";
import { useLazySearchPetsQuery } from "@/store/services/pet.service";
import { useLazySearchProductionsQuery } from "@/store/services/production.service";
import { useGetNotificationsByUserQuery } from "@/store/services/notification.service";
import { useGetCartByUserQuery } from "@/store/services/cart.service";
import { useGetWishlistByUserQuery } from "@/store/services/wishlist.service";

const HeaderComponent: React.FC = () => {
  const token = localStorage.getItem("accessToken");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [badgeCountNotifications, setBadgeCountNotifications] = useState(0);
  const [badgeCountCart, setBadgeCountCart] = useState(0);
  const [badgeCountWishlist, setBadgeCountWishlist] = useState(0);
  const [searchPets, { data: petResults }] = useLazySearchPetsQuery();
  const [searchProductions, { data: productResults }] =
    useLazySearchProductionsQuery();

  const { data: cartData } = useGetCartByUserQuery(
    { page: 1, limit: 100 },
    { skip: !token }
  );
  const { data: wishlistData } = useGetWishlistByUserQuery(
    { page: 1, limit: 100 },
    { skip: !token }
  );
  const { data: notificationData } = useGetNotificationsByUserQuery(
    { page: 1, limit: 100 },
    { skip: !token }
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      const q = keyword.trim();
      if (q) {
        searchPets({ q, limit: 5 });
        searchProductions({ q, limit: 5 });
      }
    }, 350);
    return () => clearTimeout(handler);
  }, [keyword]);

  useEffect(() => {
    if (cartData?.data?.[0]?.items) {
      setBadgeCountCart(cartData.data[0].items.length);
    }
  }, [cartData]);

  useEffect(() => {
    if (wishlistData?.data?.[0]?.items) {
      setBadgeCountWishlist(wishlistData.data[0].items.length);
    }
  }, [wishlistData]);

  useEffect(() => {
    if (notificationData?.data) {
      setBadgeCountNotifications(notificationData.data.length);
    }
  }, [notificationData]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    toast.success("Đăng xuất thành công!");
    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  };

  const userMenuItemsNotLogged = [
    {
      key: "orders",
      label: <a href="/">Đơn hàng của tôi</a>,
      icon: <ShoppingCartOutlined />,
    },
    {
      key: "favorites",
      label: <a href="">Yêu thích</a>,
      icon: <HeartOutlined />,
    },
    {
      key: "login",
      label: <a href="/auth/login">Đăng nhập</a>,
      icon: <UserOutlined />,
    },
    {
      key: "register",
      label: <a href="/auth/register">Đăng ký</a>,
      icon: <UserOutlined />,
    },
  ];
  const menuUserItemsLogged = [
    {
      key: "profile",
      label: <a href="/user/detail">Hồ sơ cá nhân</a>,
      icon: <UserOutlined />,
    },
    {
      key: "orders",
      label: <a href="/">Đơn hàng của tôi</a>,
      icon: <ShoppingCartOutlined />,
    },
    {
      key: "favorites",
      label: "Yêu thích",
      icon: <HeartOutlined />,
    },
    {
      type: "divider" as const,
    },
    {
      key: "logout",
      label: <a onClick={handleLogout}>Đăng xuất</a>,
      icon: <UserOutlined />,
    },
  ];

  return (
    <div className="flex items-center justify-between shadow-lg h-auto">
      <div className="flex items-center">
        <CustomLogo src={Logo} alt="Pet Store Logo" width={60} height={60} />
        <div className="hidden md:block px-2">
          <h1 className="text-2xl font-bold bg-white bg-clip-text text-transparent">
            Pet Store
          </h1>
          <p className="text-xs text-white -mt-1">Chăm sóc thú cưng của bạn</p>
        </div>
      </div>

      <HeaderMenu />

      <div className="flex items-center space-x-3 text-white">
        <CustomDrawer
          context={({ isOpen }) => <Notification isOpen={isOpen} />}
          icon={
            <BellOutlined
              className="text-white group-hover:text-amber-600 transition-colors"
              style={{ fontSize: 20 }}
            />
          }
          titleDrawer="Thông báo"
          badgeCount={badgeCountNotifications}
        />
        <button
          aria-label="Search"
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center  space-x-2 p-2 rounded-full hover:bg-amber-100 hover:text-black cursor-pointer transition-all duration-200 group"
        >
          <SearchOutlined
            className="text-white group-hover:text-amber-600 transition-colors"
            style={{ fontSize: 20 }}
          />
        </button>
        <CustomDrawer
          context={<Wishlist />}
          icon={
            <HeartOutlined
              className="text-white group-hover:text-amber-600 transition-colors"
              style={{ fontSize: 20 }}
            />
          }
          titleDrawer="Yêu thích"
          badgeCount={badgeCountWishlist}
        />
        <CustomDrawer
          context={<Cart />}
          icon={
            <ShoppingCartOutlined
              className="text-white group-hover:text-amber-600 transition-colors"
              style={{ fontSize: 20 }}
            />
          }
          titleDrawer="Giỏ hàng"
          badgeCount={badgeCountCart}
        />
        <Dropdown
          menu={{ items: token ? menuUserItemsLogged : userMenuItemsNotLogged }}
          placement="bottomRight"
          trigger={["hover"]}
        >
          <button className="flex items-center space-x-2 p-2 rounded-full hover:bg-amber-100 transition-all duration-200 group">
            <Avatar
              size={32}
              icon={<UserOutlined />}
              className="bg-amber-500 group-hover:bg-amber-600 transition-colors"
              style={{ color: "#fff" }}
            />
            <DownOutlined className="text-white text-xs group-hover:text-amber-600 transition-colors" />
          </button>
        </Dropdown>
      </div>
      {isSearchOpen && (
        <div
          className="fixed inset-0 z-[1000]"
          onClick={() => {
            setIsSearchOpen(false);
            setKeyword("");
          }}
        >
          <div className="absolute inset-0 bg-black/30" />
          <div
            className="relative mx-auto w-full max-w-3xl bg-white shadow-2xl rounded-b-xl overflow-hidden mt-[72px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 p-3 border-b">
              <SearchOutlined className="text-gray-500" />
              <input
                autoFocus
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Tìm kiếm thú cưng, sản phẩm..."
                className="flex-1 outline-none text-gray-900"
              />
              <button
                onClick={() => {
                  setIsSearchOpen(false);
                  setKeyword("");
                }}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Đóng
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto">
              {!keyword.trim() && (
                <div className="p-4 text-gray-500 text-sm">
                  Nhập từ khóa để tìm kiếm...
                </div>
              )}
              {keyword.trim() && (
                <div className="p-2">
                  {(() => {
                    const pets = petResults?.data || [];
                    const products = productResults?.data || [];
                    const combined = [
                      ...pets.map((item: any) => ({ ...item, __type: "pet" })),
                      ...products.map((item: any) => ({
                        ...item,
                        __type: "product",
                      })),
                    ];
                    if (combined.length === 0) {
                      return (
                        <div className="p-4 text-sm text-gray-500">
                          Không tìm thấy
                        </div>
                      );
                    }
                    return combined.map((item: any) => (
                      <a
                        key={`${item.__type}-${item._id}`}
                        href={
                          item.__type === "pet"
                            ? `/pet/detail/${item._id}`
                            : `/production/detail/${item._id}`
                        }
                        className="flex items-center gap-3 p-2 rounded hover:bg-gray-50"
                      >
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-gray-900 line-clamp-1">
                            {item.name}
                          </div>
                          <div className="text-xs text-gray-500 flex items-center gap-2">
                            <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-700">
                              {item.__type === "pet" ? "Thú cưng" : "Sản phẩm"}
                            </span>
                            {item.__type === "pet" ? (
                              <span className="line-clamp-1">
                                {item.breed} • {item.price?.toLocaleString()}₫
                              </span>
                            ) : (
                              <span className="line-clamp-1">
                                {item.brand} • {item.price?.toLocaleString()}₫
                              </span>
                            )}
                          </div>
                        </div>
                      </a>
                    ));
                  })()}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeaderComponent;

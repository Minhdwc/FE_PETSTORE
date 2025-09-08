import React from "react";
import { Dropdown, Avatar } from "antd";
import {
  UserOutlined,
  ShoppingCartOutlined,
  HeartOutlined,
  DownOutlined,
  BellOutlined,
} from "@ant-design/icons";

import Logo from "@/assets/logo.png";
import CustomLogo from "@/components/Logo/Logo";
import HeaderMenu from "./MenuHeader/Menu";
import CustomDrawer from "./DrawerHeader/Drawer";
import toast from "react-hot-toast";
import Cart from "./DrawerHeader/CartHeader/cart";
import Wishlist from "./DrawerHeader/WishlistHeader/wishlist";
import Notification from "./DrawerHeader/NotificationHeader/Notification";

const HeaderComponent: React.FC = () => {
  const token = localStorage.getItem("accessToken");

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
        />
        <CustomDrawer
          context={<Wishlist />}
          icon={
            <HeartOutlined
              className="text-white group-hover:text-amber-600 transition-colors"
              style={{ fontSize: 20 }}
            />
          }
          titleDrawer="Yêu thích"
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
          badgeCount={10}
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
    </div>
  );
};

export default HeaderComponent;

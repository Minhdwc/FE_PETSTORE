import React, { useState } from "react";
import { Badge, Dropdown, Avatar } from "antd";
import {
  UserOutlined,
  ShoppingCartOutlined,
  HeartOutlined,
  BellOutlined,
  DownOutlined,
} from "@ant-design/icons";

import Logo from "@/assets/logo.png";
import CustomLogo from "@/components/Logo/Logo";
import HeaderMenu from "./MenuHeader/Menu";

const HeaderComponent: React.FC = () => {
  const [cartCount, setCartCount] = useState(5);
  const [notificationsCount, setNotificationsCount] = useState(3);

  const userMenuItems = [
    {
      key: "profile",
      label: "Hồ sơ cá nhân",
      icon: <UserOutlined />,
    },
    {
      key: "orders",
      label: "Đơn hàng của tôi",
      icon: <HeartOutlined />,
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
      label: "Đăng xuất",
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
        <button className="flex items-center space-x-2 p-2 rounded-full hover:bg-amber-100 hover:text-black transition-all duration-200 group">
          <Badge count={notificationsCount} size="small" offset={[-2, 2]}>
            <BellOutlined style={{ fontSize: 20, color: "#fff" }} />
          </Badge>
        </button>

        <button className="flex items-center space-x-2 p-2 rounded-full hover:bg-amber-100 hover:text-black transition-all duration-200 group">
          <HeartOutlined
            className="text-white group-hover:text-amber-600 transition-colors"
            style={{ fontSize: 20 }}
          />
        </button>

        <button className="flex items-center space-x-2 p-2 rounded-full hover:bg-amber-100 hover:text-black transition-all duration-200 group">
          <Badge count={cartCount} size="small" offset={[-2, 2]}>
            <ShoppingCartOutlined style={{ fontSize: 20, color: "#fff" }} />
          </Badge>
        </button>

        <Dropdown
          menu={{ items: userMenuItems }}
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

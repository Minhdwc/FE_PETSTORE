import type { MenuProps } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { LuDog } from "react-icons/lu";
import { BiBone } from "react-icons/bi";
import { FaRegCalendarAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

export const getHeaderMenuItems = (): MenuProps["items"] => [
  {
    key: "home",
    label: (
      <Link to="/">
        <span className="flex items-center space-x-1 font-medium text-white hover:text-amber-600 transition-colors">
          <HomeOutlined />
          <span>Trang chủ</span>
        </span>
      </Link>
    ),
    className: "hover:bg-amber-100 rounded-lg mx-2",
  },
  {
    key: "pets",
    label: (
      <Link to="/pet">
        <span className="flex items-center space-x-1 font-medium text-white hover:text-amber-600 transition-colors">
          <LuDog />
          <span>Thú cưng</span>
        </span>
      </Link>
    ),
    className: "hover:bg-amber-100 rounded-lg mx-2",
  },
  {
    key: "products",
    label: (
      <Link to="/product">
        <span className="flex items-center space-x-1 font-medium text-white hover:text-amber-600 transition-colors">
          <BiBone />
          <span>Sản phẩm</span>
        </span>
      </Link>
    ),
    className: "hover:bg-amber-100 rounded-lg mx-2",
  },
  {
    key: "calendar",
    label: (
      <Link to="/appointment">
        <span className="flex items-center space-x-1 font-medium text-white hover:text-amber-600 transition-colors">
          <FaRegCalendarAlt />
          <span>Lịch hẹn</span>
        </span>
      </Link>
    ),
    className: "hover:bg-amber-100 rounded-lg mx-2",
  },
];

export default getHeaderMenuItems;

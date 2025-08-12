import type { MenuProps } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { LuDog } from "react-icons/lu";
import { BiBone } from "react-icons/bi";
import { FaRegCalendarAlt } from "react-icons/fa";

export const getHeaderMenuItems = (): MenuProps["items"] => [
  {
    key: "home",
    label: (
      <span className="flex items-center space-x-1 font-medium text-white hover:text-amber-600 transition-colors">
        <HomeOutlined />
        <span>Trang chủ</span>
      </span>
    ),
    className: "hover:bg-amber-100 rounded-lg mx-2",
  },
  {
    key: "pets",
    label: (
      <span className="flex items-center space-x-1 font-medium text-white hover:text-amber-600 transition-colors">
        <LuDog />
        <span>Thú cưng</span>
      </span>
    ),
    className: "hover:bg-amber-100 rounded-lg mx-2",
  },
  {
    key: "products",
    label: (
      <span className="flex items-center space-x-1 font-medium text-white hover:text-amber-600 transition-colors">
        <BiBone />
        <span>Sản phẩm</span>
      </span>
    ),
    className: "hover:bg-amber-100 rounded-lg mx-2",
  },
  {
    key: "calendar",
    label: (
      <span className="flex items-center space-x-1 font-medium text-white hover:text-amber-600 transition-colors">
        <FaRegCalendarAlt />
        <span>Lịch hẹn</span>
      </span>
    ),
    className: "hover:bg-amber-100 rounded-lg mx-2",
  },
];

export default getHeaderMenuItems;

import React from "react";
import { Menu } from "antd";
import type { MenuProps } from "antd";
import getHeaderMenuItems from "./MenuItems";

type HeaderMenuProps = {
  className?: string;
};

const HeaderMenu: React.FC<HeaderMenuProps> = ({ className = "" }) => {
  const items: MenuProps["items"] = getHeaderMenuItems();
  return (
    <Menu
      mode="horizontal"
      className={`flex-1 flex justify-center items-center max-w-2xl border-none bg-transparent ${className}`}
      style={{ background: "transparent", borderBottom: "none" }}
      items={items}
    />
  );
};

export default HeaderMenu;

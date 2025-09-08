import React, { useState } from "react";
import { Drawer } from "antd";
import { Badge } from "@mui/material";

type DrawerRenderContext = {
  isOpen: boolean;
};

type DrawerProps = {
  context: React.ReactNode | ((ctx: DrawerRenderContext) => React.ReactNode);
  icon: React.ReactNode;
  titleDrawer: string;
  badgeCount?: number;
};

const CustomDrawer: React.FC<DrawerProps> = ({
  context,
  icon,
  titleDrawer,
  badgeCount = 0,
}) => {
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={showDrawer}
        className="flex items-center  space-x-2 p-2 rounded-full hover:bg-amber-100 hover:text-black cursor-pointer transition-all duration-200 group"
      >
        <Badge badgeContent={badgeCount && badgeCount} color="error">
          <div className="inline-flex items-center [&>*]:!text-white [&>*]:group-hover:!text-amber-600 [&>*]:!transition-colors">
            {icon}
          </div>
        </Badge>
      </button>
      <Drawer
        title={titleDrawer}
        open={open}
        onClose={onClose}
        style={{ background: "#f8f8f8" }}
      >
        {typeof context === "function"
          ? (context as (ctx: DrawerRenderContext) => React.ReactNode)({
              isOpen: open,
            })
          : context}
      </Drawer>
    </>
  );
};

export default CustomDrawer;

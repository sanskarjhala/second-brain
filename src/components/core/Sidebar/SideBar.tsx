import { useState } from "react";
import { TwitterIcon } from "../../../icons/TwitterIcon";
import { SideBarItems } from "./SideBarItems";
import image from "../../../icons/brain.svg";

export const SideBar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={`transition-all duration-300 ${collapsed ? "w-12" : "w-37.5"}`}
    >
      <div className="sticky top-4 h-[calc(100vh-32px-48px)] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 border-b border-gray-200 py-4">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <img src={image} alt="" height={30} width={30} />
              <h1 className="text-md font-semibold whitespace-nowrap">
                Second Brain
              </h1>
            </div>
          )}
          {collapsed && (
            <div className="mx-auto">
              <img src={image} alt="" height={30} width={30} />
            </div>
          )}
        </div>

        {/* Nav Items */}
        <div className={`mt-5 flex-1 ${collapsed && "mx-auto"}`}>
          <SideBarItems
            title="Youtube"
            icon={<TwitterIcon />}
            collapsed={collapsed}
          />
          <SideBarItems
            title="Github"
            icon={<TwitterIcon />}
            collapsed={collapsed}
          />
          <SideBarItems
            title="Resume"
            icon={<TwitterIcon />}
            collapsed={collapsed}
          />
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="mt-auto w-full flex items-center justify-center gap-2 rounded-md py-2 px-3 text-sm text-gray-600 hover:bg-gray-200 transition-colors"
        >
          <span className="text-lg leading-none">{collapsed ? "→" : "←"}</span>
          {!collapsed && <span className="text-xs">Collapse</span>}
        </button>
      </div>
    </div>
  );
};

import { useState } from "react";
import { useLocation } from "react-router-dom";
import { TwitterIcon } from "../../../icons/TwitterIcon";
import { SideBarItems } from "./SideBarItems";
import image from "../../../icons/brain.svg";

const NAV_ITEMS = [
  { title: "All Notes", icon: <TwitterIcon />, path: "/dashboard" },
  { title: "Youtube", icon: <TwitterIcon />, path: "/dashboard/youtube" },
  { title: "Twitter", icon: <TwitterIcon />, path: "/dashboard/twitter" },
  { title: "Resume", icon: <TwitterIcon />, path: "/dashboard/resume" },
];

// Utility: generate a consistent bg color from a name
function getAvatarColor(name: string) {
  const colors = [
    "bg-violet-500",
    "bg-rose-500",
    "bg-amber-500",
    "bg-emerald-500",
    "bg-sky-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}


const USER = {
  name: "Alex Johnson",
  username: "@alexjohnson",
};

export const SideBar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const initials = getInitials(USER.name);
  const avatarColor = getAvatarColor(USER.name);

  return (
    <div
      className={`transition-all duration-300 ${collapsed ? "w-12" : "w-37.5"}`}
    >
      <div className="sticky top-4 h-[calc(100vh-32px-48px)] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 border-b border-gray-200 py-4">
          {!collapsed ? (
            <div className="flex items-center gap-2">
              <img src={image} alt="" height={30} width={30} />
              <h1 className="text-md font-semibold whitespace-nowrap">
                Second Brain
              </h1>
            </div>
          ) : (
            <div className="mx-auto">
              <img src={image} alt="" height={30} width={30} />
            </div>
          )}
        </div>

        {/* Nav Items */}
        <div className={`mt-5 flex-1 ${collapsed ? "mx-auto" : ""}`}>
          {NAV_ITEMS.map((item) => (
            <SideBarItems
              key={item.path}
              title={item.title}
              icon={item.icon}
              path={item.path}
              collapsed={collapsed}
              active={location.pathname === item.path}
            />
          ))}
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="mt-auto w-full flex items-center justify-center gap-2 rounded-md py-2 px-3 text-sm text-black font-bold mb-2 hover:bg-gray-200 transition-colors"
        >
          <span className="text-lg leading-none">{collapsed ? "→" : "←"}</span>
          {!collapsed && <span className="text-xs">Collapse</span>}
        </button>

        {/* Profile Indicator */}
        <div
          className={`pt-3 border-t border-gray-200 flex items-center gap-2.5 px-1 ${
            collapsed ? "justify-center" : ""
          }`}
          title={collapsed ? `${USER.name} (${USER.username})` : undefined}
        >
          {/* Avatar circle */}
          <div
            className={`shrink-0 w-8 h-8 rounded-full ${avatarColor} flex items-center justify-center text-white text-xs font-semibold select-none`}
          >
            {initials}
          </div>

          {/* Name + username — hidden when collapsed */}
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium text-gray-800 truncate leading-tight">
                {USER.name}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

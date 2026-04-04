import type { ReactElement } from "react";
import { Link } from "react-router-dom";

interface SideBarProps {
  title: string;
  icon: ReactElement;
  collapsed?: boolean;
  path?: string;
  active?: boolean;
}

export const SideBarItems = ({ title, icon, collapsed = false, path = "/", active = false }: SideBarProps) => {
  return (
    <Link
      to={path}
      className={`flex gap-3 mb-5 items-center font-sans cursor-pointer transition-colors rounded-md px-2 py-1
        ${active ? "text-purple-700 bg-purple-50 font-semibold" : "hover:text-gray-600"}`}
    >
      <span>{icon}</span>
      {!collapsed && (
        <span className="whitespace-nowrap overflow-hidden text-ellipsis">{title}</span>
      )}
    </Link>
  );
};
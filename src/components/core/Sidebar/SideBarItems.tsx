import type { ReactElement } from "react";

interface SideBarProps {
  title: string;
  icon: ReactElement;
  collapsed?: boolean;
}

export const SideBarItems = ({ title, icon, collapsed = false }: SideBarProps) => {
  return (
    <div className="flex gap-3 mb-5 items-center font-sans cursor-pointer hover:text-gray-600 transition-colors">
      <span>{icon}</span>
      {!collapsed && (
        <span className="whitespace-nowrap overflow-hidden text-ellipsis">{title}</span>
      )}
    </div>
  );
};
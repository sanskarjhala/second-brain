import type { ReactElement } from "react";

interface SideBarProps {
  title: string;
  icon: ReactElement;
}
export const SideBarItems = ({ title, icon }: SideBarProps) => {
  return (
    <div className="flex gap-3 my-3">
      <span className="pl-2">{icon}</span>
      <span className="font-semibold text-lg pl-2">{title}</span>
    </div>
  );
};

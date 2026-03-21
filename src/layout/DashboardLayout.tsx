import { Outlet } from "react-router-dom";
import { SideBar } from "../components/SideBar";

export const DashboardLayout = () => {
  return (
    <div className="w-full flex">
      <div className="w-[20%]">
        <SideBar />
      </div>

      <main className="w-[90%]  p-4 bg-gray-100 h-screen overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};

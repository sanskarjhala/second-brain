// layouts/DashboardLayout.tsx
import { Outlet } from "react-router-dom";
import { DashboardProvider } from "../pages/DashboardContext";
import { Sidebar } from "../components/core/sidebar/sidebar";

export default function DashboardLayout() {
  return (
    <DashboardProvider>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </div>
      </div>
    </DashboardProvider>
  );
}

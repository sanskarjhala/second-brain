import { useState } from "react";
import { Outlet } from "react-router-dom";
import { SideBar } from "../components/core/Sidebar/SideBar";
import { AddShareContent } from "../components/core/AddShareContent";

export default function DashboardLayout() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-gray-400 p-4 gap-4">
      <div className="shrink-0">
        <SideBar />
      </div>

      <div className="flex-1 bg-gray-200 rounded-lg px-4 py-2 flex flex-col overflow-hidden">
        <div className="border-b py-2 flex justify-between px-2 shrink-0">
          <h1 className="text-xl font-bold">Dashboard</h1>
          <AddShareContent onContentAdded={() => setRefreshKey(k => k + 1)} />
        </div>

        <main className="flex-1 overflow-y-auto">
          <Outlet context={{ refreshKey }} /> {/* ✅ pass refreshKey to child routes */}
        </main>
      </div>
    </div>
  );
}
import { Route, Routes } from "react-router-dom";
import { HomeLayout } from "./layout/HomeLayout";
import DashboardLayout from "./layout/DashboardLayout";
import { CardGrid } from "./components/core/CardGrid";

function App() {
  return (
    <Routes>
      <Route element={<HomeLayout />} />

      <Route element={<DashboardLayout />}>
        <Route path="/dashboard/all-notes" element={<CardGrid />} />
      </Route>
    </Routes>
  );
}

export default App;
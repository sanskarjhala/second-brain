import { Route, Routes } from "react-router-dom";
import { HomeLayout } from "./layout/HomeLayout";
import DashboardLayout from "./layout/DashboardLayout";
import { CardGrid } from "./components/core/CardGrid";
import { Signup } from "./pages/SignUpPage";
import { Login } from "./pages/LoginPage";

function App() {
  return (
    <div className="bg-richblack-900 w-screen h-screen">
      <Routes>
        <Route element={<HomeLayout />} />

        <Route path="login" element={<Login />} />
        <Route path="sign-up" element={<Signup />} />

        <Route element={<DashboardLayout />}>
          <Route path="/dashboard/all-notes" element={<CardGrid />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;

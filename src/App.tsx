import { Route, Routes } from "react-router-dom";
import { HomeLayout } from "./layout/HomeLayout";
import DashboardLayout from "./layout/DashboardLayout";
import { CardGrid } from "./components/core/CardGrid";
import { Signup } from "./pages/SignUpPage";
import { Login } from "./pages/LoginPage";
import YoutubePage from "./pages/YoutubePage";
import TwitterPage from "./pages/TwitterPage";
import ResumePage from "./pages/ResumePage";

function App() {
  return (
    <div className="bg-richblack-900 w-screen h-screen">
      <Routes>
        <Route element={<HomeLayout />} />

        <Route path="login" element={<Login />} />
        <Route path="sign-up" element={<Signup />} />

        <Route path={"/dashboard"} element={<DashboardLayout />}>
          <Route index element={<CardGrid />} />
          <Route path={"youtube"} element={<YoutubePage />} />
          <Route path={"twitter"} element={<TwitterPage />} />
          <Route path={"resume"} element={<ResumePage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;

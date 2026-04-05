import { Route, Routes } from "react-router-dom";
import { HomeLayout } from "./layout/HomeLayout";
import DashboardLayout from "./layout/DashboardLayout";
import { CardGrid } from "./components/core/CardGrid";
import { Signup } from "./pages/SignUpPage";
import { Login } from "./pages/LoginPage";
import YoutubePage from "./pages/YoutubePage";
import TwitterPage from "./pages/TwitterPage";
import ResumePage from "./pages/ResumePage";
import LandingPage from "./pages/Home";
import { SupportPage } from "./pages/SupportPage";

function App() {
  return (
    <div className="w-screen h-screen overflow-x-hidden dark:bg-black">
      <Routes>
        <Route  element={<HomeLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/support" element={<SupportPage/>} />
          {/* <Route path="/about" element={<About />} /> */}
          {/* <Route path="/contact" element={<Contact />} /> */}
        </Route>

        
        

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

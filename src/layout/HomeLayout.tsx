import { Outlet } from "react-router-dom";
import { Navbar } from "../components/core/Homepage/Navbar";
import { Footer } from "../components/core/Homepage/Footer";

export const HomeLayout = () => {
  return (
    <div className="overflow-hidden">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

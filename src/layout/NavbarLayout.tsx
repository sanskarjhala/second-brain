import { Outlet } from "react-router-dom";
import { Footer } from "../components/core/footer";
import { Navbar } from "../components/core/Navbar";

export default function NavbarLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

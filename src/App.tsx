import DashboardLayout from "./layout/DashboardLayout";
import NavbarLayout from "./layout/NavbarLayout";
import { Dashboard } from "./pages/dashboard";
import LandingPage from "./pages/landingPage";
import { Signin } from "./pages/signin";
import { Signup } from "./pages/signup";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/themeContext";
import { SupportPage } from "./pages/supportme";
import { About } from "./pages/about";
import { Contact } from "./pages/contact";
import toast, { Toaster } from "react-hot-toast";
import { AnalyticsTracker } from "./components/AnalyticsTracker";
import ResumeAnalyzer from "./pages/ResumeAnalyser";
import { useEffect } from "react";
import { serverwakeup } from "./apis/Serverwakeup";

function App() {
  useEffect(() => {
    const wakeUp = async () => {
      const toastId = "server-wakeup";

      try {
        toast.loading("Waking up server...", { id: toastId });

        await serverwakeup();

        toast.success("Server is ready 🚀", { id: toastId });
      } catch {
        toast.error("Server wake-up failed", { id: toastId });
      }
    };

    wakeUp();
  }, []);
  return (
    //  here theme is provided so it works on both pages landing+dashboard
    <ThemeProvider>
      <BrowserRouter>
        <Toaster position="top-center" reverseOrder={false} />

        {/* Track SPA route changes */}
        <AnalyticsTracker />

        <Routes>
          {/* Layout with Navbar */}
          <Route element={<NavbarLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          {/* Dashboard layout without Navbar */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="resume" element={<ResumeAnalyzer />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

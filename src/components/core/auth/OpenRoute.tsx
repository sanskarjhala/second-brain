// OpenRoute.tsx
import { Navigate } from "react-router-dom";

export const OpenRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("token-brain");
  return !token ? <>{children}</> : <Navigate to="/dashboard" />;
};
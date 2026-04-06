// PrivateRoute.tsx
import { Navigate } from "react-router-dom";

export const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("token-brain");
  return token ? <>{children}</> : <Navigate to="/login" />;
};
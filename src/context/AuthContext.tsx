import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GetUserProfile } from "../apis/userApis";

interface User {
  username: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => void;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: () => {},
  setUser: () => {},
});

const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return Date.now() > payload.exp * 1000;
  } catch {
    return true;
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const token = localStorage.getItem("token-brain");

        // no token → just stop loading, don't navigate
        if (!token) {
          setLoading(false);
          return;
        }

        // expired token → clear and stop loading
        if (isTokenExpired(token)) {
          localStorage.removeItem("token-brain");
          setLoading(false);
          return;
        }

        const res = await GetUserProfile(token);

        // backend rejected token
        if (!res.success) {
          if (res.status === 401) {
            localStorage.removeItem("token-brain");
          }
          setLoading(false);
          return;
        }

        // ✅ set user from response
        setUser({ username: res.data.username });

      } catch (err) {
        console.error("Failed to fetch user", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  const logout = () => {
    localStorage.removeItem("token-brain");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
import { createContext, useState, useEffect, useMemo, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

interface User {
  email: string;
}

interface AuthContextProps {
  inited: boolean;
  isLogged: boolean;
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [inited, setInited] = useState(false);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [user, setUser] = useState<User | null>(null);

  const isLogged = useMemo(() => !!token, [token]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get("/api/auth/profile");
      setUser(response.data);
    } catch (error) {
      console.error("Failed to fetch profile", error);
      logout();
    }
  };

  const login = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    navigate("/dashboard");
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setToken(null);
    setUser(null);
    navigate("/auth");
  };

  useEffect(() => {
    if (inited) return;

    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchUserProfile();
      if (location.pathname === "/auth") navigate("/dashboard");
    } else if (!token && location.pathname !== "/auth") {
      navigate("/auth");
    }

    setInited(true);
  }, [location]);

  return (
    <AuthContext.Provider
      value={{ inited, isLogged, user, token, login, logout }}
    >
      {inited ? children : <p>Loading...</p>}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("No auth context found");
  return context;
};

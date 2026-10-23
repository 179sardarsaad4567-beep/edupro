import { createContext, useContext, useState } from "react";
import api from "../api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("edusphere_user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    const { token, user } = res.data;

    localStorage.setItem("edusphere_token", token);
    localStorage.setItem("edusphere_user", JSON.stringify(user));
    setUser(user);
    return true;
  };

  const logout = () => {
    localStorage.removeItem("edusphere_token");
    localStorage.removeItem("edusphere_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
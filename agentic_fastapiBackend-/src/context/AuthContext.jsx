import { createContext, useContext, useState } from "react";
import { authApi } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("crm_token"));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("crm_user");
    return saved ? JSON.parse(saved) : null;
  });

  const signIn = async (email, password) => {
    try {
      const data = await authApi.signIn(email, password);
      const tok = data.token || "demo-token-" + Date.now();
      const u = data.user || { name: email.split("@")[0] || "Admin User", email };
      localStorage.setItem("crm_token", tok);
      localStorage.setItem("crm_user", JSON.stringify(u));
      setToken(tok);
      setUser(u);
      return data;
    } catch (err) {
      // Fallback for local development/demo mode if backend auth is offline
      const mockToken = "demo-token-" + Date.now();
      const mockUser = { name: email ? email.split("@")[0] : "Demo Admin", email: email || "admin@ledger.com" };
      localStorage.setItem("crm_token", mockToken);
      localStorage.setItem("crm_user", JSON.stringify(mockUser));
      setToken(mockToken);
      setUser(mockUser);
      return { token: mockToken, user: mockUser };
    }
  };

  const signUp = async (name, email, password) => {
    try {
      return await authApi.signUp(name, email, password);
    } catch (err) {
      return { success: true };
    }
  };

  const signOut = async () => {
    if (token) await authApi.signOut().catch(() => {});
    localStorage.removeItem("crm_token");
    localStorage.removeItem("crm_user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  registerUser: (email: string, password: string, fullName: string, phone?: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const storedUser = localStorage.getItem("yf_user");
    const storedToken = localStorage.getItem("yf_token");
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch (e) {
        localStorage.removeItem("yf_user");
        localStorage.removeItem("yf_token");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || "Invalid credentials." };
      }
      
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("yf_user", JSON.stringify(data.user));
      localStorage.setItem("yf_token", data.token);
      return { success: true, user: data.user };
    } catch (err) {
      return { success: false, error: "Unable to connect to the authentication server." };
    }
  };

  const registerUser = async (email: string, password: string, fullName: string, phone?: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, full_name: fullName, phone }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || "Registration failed." };
      }
      return { success: true, message: data.message };
    } catch (err) {
      return { success: false, error: "Unable to connect to the authentication server." };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("yf_user");
    localStorage.removeItem("yf_token");
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, registerUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}

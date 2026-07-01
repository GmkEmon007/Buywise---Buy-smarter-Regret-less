"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Role = "admin" | "user";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  joinedAt: string;
  analysisCount: number;
  status: string;
  password?: string;
};

export type HistoryItem = {
  id: string;
  product: string;
  buyScore: number;
  regretScore: number;
  trustScore: number;
  price: number;
  date: string;
  verdict: "buy" | "skip" | "wait";
};

type AuthCtx = {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  history: HistoryItem[];
};

const AuthContext = createContext<AuthCtx | null>(null);

// Demo users
const DEMO_USERS: User[] = [
  {
    id: "u1", name: "Alex Johnson", email: "user@demo.com", password: "user123",
    role: "user", joinedAt: "2024-11-15", analysisCount: 14,
    avatar: "AJ", status: "active"
  },
  {
    id: "u2", name: "Mia Patel", email: "mia@demo.com", password: "user123",
    role: "user", joinedAt: "2025-01-20", analysisCount: 7,
    avatar: "MP", status: "active"
  },
  {
    id: "u3", name: "James Liu", email: "james@demo.com", password: "user123",
    role: "user", joinedAt: "2025-03-05", analysisCount: 22,
    avatar: "JL", status: "active"
  },
  {
    id: "u4", name: "Sara Kim", email: "sara@demo.com", password: "user123",
    role: "user", joinedAt: "2025-02-14", analysisCount: 3,
    avatar: "SK", status: "suspended"
  },
  {
    id: "a1", name: "Admin User", email: "admin@demo.com", password: "admin123",
    role: "admin", joinedAt: "2024-01-01", analysisCount: 52,
    avatar: "AU", status: "active"
  },
];

const DEMO_HISTORY: HistoryItem[] = [
  { id: "h1", product: "Sony WH-1000XM5",   buyScore: 80, regretScore: 22, trustScore: 84, price: 279.99, date: "2025-06-20", verdict: "buy" },
  { id: "h2", product: "iPad Pro 13-inch",    buyScore: 76, regretScore: 34, trustScore: 90, price: 999.00, date: "2025-06-18", verdict: "wait" },
  { id: "h3", product: "Dyson V15 Detect",    buyScore: 88, regretScore: 15, trustScore: 92, price: 649.99, date: "2025-06-14", verdict: "buy" },
  { id: "h4", product: "AirPods Pro 2",       buyScore: 82, regretScore: 18, trustScore: 87, price: 199.00, date: "2025-06-10", verdict: "buy" },
  { id: "h5", product: "Razer DeathAdder V3", buyScore: 58, regretScore: 48, trustScore: 71, price: 89.99,  date: "2025-06-05", verdict: "skip" },
  { id: "h6", product: "LG C3 OLED 55\"",     buyScore: 91, regretScore: 10, trustScore: 95, price: 1199.00,date: "2025-05-28", verdict: "buy" },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem("bw_user");
    if (saved) setUser(JSON.parse(saved));

    const storedUsers = localStorage.getItem("buywise_users");
    if (!storedUsers) {
      localStorage.setItem("buywise_users", JSON.stringify(DEMO_USERS));
    }
  }, []);

  async function login(email: string, password: string): Promise<boolean> {
    await new Promise(r => setTimeout(r, 800));
    const storedUsers = localStorage.getItem("buywise_users");
    const usersList: User[] = storedUsers ? JSON.parse(storedUsers) : DEMO_USERS;
    
    const found = usersList.find(u => u.email === email && u.password === password);
    if (!found) return false;
    
    if (found.status === "suspended") {
      alert("Your account has been suspended by an administrator.");
      return false;
    }
    
    const { password: _, ...safe } = found;
    setUser(safe);
    sessionStorage.setItem("bw_user", JSON.stringify(safe));
    return true;
  }

  function logout() {
    setUser(null);
    sessionStorage.removeItem("bw_user");
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, history: DEMO_HISTORY }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

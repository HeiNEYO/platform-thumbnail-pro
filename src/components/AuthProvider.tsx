"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@/lib/types";
import { getStoredUser, setStoredUser, seedDemoData } from "@/lib/store";

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    seedDemoData();
    setUserState(getStoredUser());
    setIsLoading(false);
  }, []);

  const setUser = (u: User | null) => {
    setUserState(u);
    setStoredUser(u);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

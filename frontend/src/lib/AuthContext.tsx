"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { api, ApiUser } from "./api";

interface AuthState {
  user: ApiUser | null;
  token: string | null;
  loading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    fullName: string;
    phone: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  isAuthenticated: false,
});

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    loading: true,
  });

  useEffect(() => {
    const match = document.cookie.match(/(?:^|; )token=([^;]*)/);
    const savedToken = match ? decodeURIComponent(match[1]) : null;
    const savedUser = localStorage.getItem("jogga_user");

    if (savedToken && savedUser) {
      try {
        setState({
          token: savedToken,
          user: JSON.parse(savedUser),
          loading: false,
        });
      } catch {
        setState({ token: null, user: null, loading: false });
      }
    } else {
      setState((s) => ({ ...s, loading: false }));
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { access_token, user } = await api.post<{
      access_token: string;
      user: ApiUser;
    }>("/auth/login", { email, password });

    setCookie("token", access_token, 7);
    localStorage.setItem("jogga_user", JSON.stringify(user));
    setState({ token: access_token, user, loading: false });
  }, []);

  const register = useCallback(
    async (data: {
      fullName: string;
      phone: string;
      email: string;
      password: string;
    }) => {
      const { access_token, user } = await api.post<{
        access_token: string;
        user: ApiUser;
      }>("/auth/register", data);

      setCookie("token", access_token, 7);
      localStorage.setItem("jogga_user", JSON.stringify(user));
      setState({ token: access_token, user, loading: false });
    },
    []
  );

  const logout = useCallback(() => {
    deleteCookie("token");
    localStorage.removeItem("jogga_user");
    setState({ token: null, user: null, loading: false });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        isAuthenticated: !!state.token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

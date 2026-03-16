import { AuthPayload } from "@/types";

export function useAuth() {
  const getUser = (): AuthPayload | null => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? (JSON.parse(raw) as AuthPayload) : null;
    } catch {
      return null;
    }
  };

  const getToken = () => localStorage.getItem("token");

  const isAuthenticated = () => !!getToken();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const hasRole = (...roles: AuthPayload["role"][]) => {
    const user = getUser();
    return user ? roles.includes(user.role) : false;
  };

  const isHokage = () => hasRole("HOKAGE");
  const isAdmin = () => hasRole("ADMINISTRADOR", "HOKAGE");

  return { getUser, getToken, isAuthenticated, logout, hasRole, isHokage, isAdmin };
}
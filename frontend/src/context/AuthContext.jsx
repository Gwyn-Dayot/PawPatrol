import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const isLoggedIn = !!token;

  const login = async (email, password) => {
    const { data } = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });

    setToken(data.token);
    setUser(data);

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data));

    return data;
  };

  const registerUser = async (fullname, email, password) => {
    const { data } = await axios.post(`${API_URL}/auth/register`, {
      fullname,
      email,
      password,
    });

    setToken(data.token);
    setUser(data);

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data));

    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoggedIn, login, logout, registerUser }}>
      {children}
    </AuthContext.Provider>
  );
}
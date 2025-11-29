import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  
  // Base URL for your API (Adjust port if needed)
  const API_URL = "http://localhost:5000/api/auth"; 

  // Check if user is logged in on page load
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);
  }, []);

  // REGISTER FUNCTION
  // Now accepts 'address' as an argument
  const registerUser = async (fullname, email, phone, address, password) => {
    try {
      const response = await axios.post(`${API_URL}/register`, {
        fullname,
        email,
        phone,
        address,
        password,
      });

      if (response.data) {
        // Save user data and token to local storage
        localStorage.setItem("userInfo", JSON.stringify(response.data));
        setUser(response.data);
      }
      
      return response.data;
    } catch (error) {
      // Throw error to be caught in Register.jsx
      throw error; 
    }
  };

  // LOGOUT FUNCTION
  const logoutUser = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, registerUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};
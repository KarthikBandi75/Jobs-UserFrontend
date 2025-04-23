import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [userData, setUserData] = useState(null);

  const loadUserProfileData = async () => {
    try {
      const { data } = await axios.get("http://localhost:5577/api/user/profile", {
        headers: {
          token: token,
        },
      });
      if (data.success) {
        setUserData(data.user);
        navigate("/"); 
      } else {
        toast.error(data.message || "Failed to load user profile");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      toast.error(error.message || "Error fetching user profile");
    }
  };

  useEffect(() => {
    if (token) {
      loadUserProfileData();
    }
  }, [token]);

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, setToken, userData, setUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

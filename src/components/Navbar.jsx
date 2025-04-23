import React, { useContext, useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiChevronDown, FiMenu, FiX } from "react-icons/fi";
import { AuthContext } from "../context/AppContext";
import { motion } from "framer-motion";
import { assets } from "../assets/assets";
const Navbar = () => {
  const navigate = useNavigate();
  const { token, setToken, userData, setUserData } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const logout = () => {
    setToken("");
    setUserData(null);
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navItems = [
    { to: "/", label: "Home" },
    { to: "/alljobs", label: "All Jobs" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  // Optional: Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 120 }}
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo */}
        <motion.img
          src={assets.logo}
          alt="Job Board Logo"
          className="w-35 cursor-pointer"
          onClick={() => navigate("/")}
          whileHover={{ scale: 1.05 }}
        />

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8 text-base font-medium">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `relative py-2 transition-colors ${
                  isActive ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {item.label}
                  {isActive && (
                    <motion.div
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"
                      layoutId="underline"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Actions */}
        <div className="flex items-center gap-4">
          {token && userData ? (
            <div className="relative" ref={dropdownRef}>
              <motion.div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                whileHover={{ scale: 1.05 }}
              >
                <img
                  className="w-8 h-8 rounded-full object-cover border-2 border-blue-300"
                  src={userData.image || "https://assets.leetcode.com/users/default_avatar.jpg"}
                  alt="User Profile"
                />
                <FiChevronDown className="text-gray-700" size={20} />
              </motion.div>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 top-12 bg-white text-gray-700 shadow-lg rounded-lg p-4 min-w-48 z-50"
                >
                  <p
                    onClick={() => {
                      navigate("/profile");
                      setIsDropdownOpen(false);
                    }}
                    className="cursor-pointer py-2 hover:text-blue-600"
                  >
                    My Profile
                  </p>
                  <p
                    onClick={() => {
                      navigate("/allappliedjobs");
                      setIsDropdownOpen(false);
                    }}
                    className="cursor-pointer py-2 hover:text-blue-600"
                  >
                    All Applied Jobs
                  </p>
                  <p
                    onClick={() => {
                      logout();
                      setIsDropdownOpen(false);
                    }}
                    className="cursor-pointer py-2 hover:text-blue-600"
                  >
                    Logout
                  </p>
                </motion.div>
              )}
            </div>
          ) : (
            <motion.button
              onClick={() => navigate("/signup")}
              className="px-6 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Create Account
            </motion.button>
          )}

          {/* Mobile Menu Toggle */}
          <motion.button
            className="md:hidden text-gray-700"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileTap={{ scale: 0.9 }}
          >
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.nav
          initial={{ height: 0 }}
          animate={{ height: "auto" }}
          className="md:hidden bg-white shadow-lg px-6 py-4"
        >
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `block py-2 text-base font-medium ${
                  isActive ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
                }`
              }
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </motion.nav>
      )}
    </motion.header>
  );
};

export default Navbar;

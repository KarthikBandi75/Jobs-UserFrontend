import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User } from 'lucide-react';
import Input from '../components/Input';
import { toast } from 'react-toastify';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false); // 🔹 Track loading state

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    try {
      const res = await axios.post(`https://jobs-backend-47u0.onrender.com/api/user/signup`, formData);
      if (res.data.success) {
        localStorage.setItem('email', formData.email);
        toast.success("Signup successful. Please verify OTP.");
        navigate('/verify-otp');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-green-100">
      <motion.div
        className="w-full max-w-md p-8 text-white bg-gray-900 shadow-2xl rounded-2xl"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold text-center mb-4">User Signup</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            icon={User}
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <Input
            icon={Mail}
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <Input
            icon={Lock}
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <motion.button
            type="submit"
            disabled={loading}
            className={`w-full py-3 font-bold rounded-xl transition duration-300 ${
              loading
                ? 'bg-purple-400 cursor-not-allowed'
                : 'bg-purple-500 hover:bg-purple-600 cursor-pointer'
            }`}
          >
            {loading ? (
              <motion.div
                className="flex justify-center items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  className="w-4 h-4 rounded-full border-2 border-t-white border-purple-200 animate-spin"
                />
                Signing Up...
              </motion.div>
            ) : (
              'Sign Up'
            )}
          </motion.button>
        </form>

        <div className="mt-6 space-y-2 text-center text-sm text-gray-300">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="text-purple-400 hover:text-purple-500 underline">
              Login here
            </Link>
          </p>
          <p>
            <Link to="/" className="text-purple-400 hover:text-purple-500 underline">
              Go to Homepage
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;

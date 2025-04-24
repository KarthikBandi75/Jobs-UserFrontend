import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Input from '../components/Input';
import { Mail } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`https://jobs-backend-47u0.onrender.com/api/user/login`, { email });
      if (res.data.success) {
        localStorage.setItem('email', email);
        toast.success("OTP sent to your email");
        navigate('/verify-otp');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
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
        <h2 className="text-3xl font-bold text-center mb-4">User Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            icon={Mail}
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
                <motion.div className="w-4 h-4 rounded-full border-2 border-t-white border-purple-200 animate-spin" />
                Sending...
              </motion.div>
            ) : (
              'Send OTP'
            )}
          </motion.button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-300">
          Don't have an account?{' '}
          <Link to="/signup" className="text-purple-400 hover:text-purple-500 underline">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;

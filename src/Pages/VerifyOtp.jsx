import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate,Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Input from '../components/Input';
import { Key } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AppContext';

const VerifyOtp = () => {
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();
  const email = localStorage.getItem('email');
  const {setToken}=useContext(AuthContext);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`https://jobs-backend-47u0.onrender.com/api/user/verify-otp`, { email, otp });
      if (res.data.success) {
        localStorage.setItem('token',res.data.token);
       setToken(res.data.token);
        toast.success("OTP Verified! Logged in.");
        navigate('/');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'OTP verification failed');
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
        <h2 className="text-3xl font-bold text-center mb-4">Verify OTP</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            icon={Key}
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <motion.button
            type="submit"
            className="w-full py-3 font-bold bg-purple-500 rounded-xl hover:bg-purple-600 cursor-pointer"
          >
            Verify OTP
          </motion.button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-300">
 Entered Wrong Email?{' '}
  <Link to="/login" className="text-purple-400 hover:text-purple-500 underline">
    Login
  </Link>
</p>

      </motion.div>
    </div>
  );
};

export default VerifyOtp;

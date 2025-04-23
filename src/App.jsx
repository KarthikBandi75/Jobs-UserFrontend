import React, { useContext } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthContext } from './context/AppContext';
import Signup from './Pages/Signup';
import Login from './Pages/Login';
import Home from './Pages/Home';
import VerifyOtp from './Pages/VerifyOtp';
import AllJobs from './Pages/AllJobs';
import SingleJob from './Pages/SingleJob';
import AllAppliedJobs from './Pages/AllAppliedJobs';
import Profile from './Pages/Profile';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import About from './components/About';
import Contact from './components/Contact';

const App = () => {
  const { token } = useContext(AuthContext);
  const location = useLocation();
  const hideLayoutOnRoutes = ['/login', '/signup', '/verify-otp'];
  const shouldHideLayout = hideLayoutOnRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideLayout && <Navbar />}
      
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/alljobs" element={<AllJobs />} />
        <Route path="/job/:id" element={<SingleJob />} />
        <Route path="/allappliedjobs" element={<AllAppliedJobs />} />
        <Route path="/about" element={<About/>}/>
        <Route path="/contact" element={<Contact/>}/>
      </Routes>

      {!shouldHideLayout && <Footer />}
    </>
  );
};

export default App;

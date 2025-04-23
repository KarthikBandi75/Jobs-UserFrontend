import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaBriefcase, FaUserGraduate, FaRocket, FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Animation Variants
const textVariant = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
    },
  },
};

const letterVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Home = () => {
  const navigate = useNavigate();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const offerings = [
    {
      icon: FaBriefcase,
      title: "Internship Opportunities",
      description: "Explore internships from top companies tailored for students.",
      link: "/alljobs",
    },
    {
      icon: FaUserGraduate,
      title: "Career Guidance",
      description: "Get personalized advice to build your career path.",
      link: "/about",
    },
    {
      icon: FaRocket,
      title: "Skill Development",
      description: "Access resources to enhance your technical and soft skills.",
      link: "/contact",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Computer Science Student",
      quote: "Job Board helped me land my dream internship at a tech giant!",
      image: "https://randomuser.me/api/portraits/women/1.jpg",
    },
    {
      name: "Michael Chen",
      role: "Engineering Student",
      quote: "The platform's resources were key to acing my interviews.",
      image: "https://randomuser.me/api/portraits/men/2.jpg",
    },
    {
      name: "Emily Davis",
      role: "Business Student",
      quote: "The career guidance was a game-changer for my job search.",
      image: "https://randomuser.me/api/portraits/women/3.jpg",
    },
  ];

  // Auto-cycle testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const cycleTestimonial = (direction) => {
    setCurrentTestimonial((prev) => (prev + direction + testimonials.length) % testimonials.length);
  };

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center bg-white relative"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12 z-10 py-20">
          <div className="lg:w-1/2 text-center">
          <motion.h1
              variants={textVariant}
              initial="hidden"
              animate="visible"
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-600 mb-6"
            >
              {"Your Path to Success Starts Here".split("").map((char, index) => (
                <motion.span key={index} variants={letterVariant}>
                  {char}
                </motion.span>
              ))}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg sm:text-xl text-teal-500 mb-8 max-w-2xl mx-auto"
            >
              Explore internships, career guidance, and skills with CampusBridge.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <motion.button
                onClick={() => navigate("/alljobs")}
                className="px-12 py-5 bg-teal-500 text-white font-semibold text-lg rounded-full transition shadow-2xl z-20 cursor-pointer"
                whileHover={{ scale: 1.1, boxShadow: "0 12px 24px rgba(0, 165, 181, 0.4)" }}
                whileTap={{ scale: 0.95 }}
              >
                Explore Internships
              </motion.button>
              <motion.button
                onClick={() => navigate("/signup")}
                className="px-12 py-5 bg-white border-3 border-b-cyan-950 text-slate-600 font-semibold text-lg rounded-full  transition shadow-2xl z-20 cursor-pointer"
                whileHover={{ scale: 1.1, boxShadow: "0 12px 24px rgba(0, 119, 181, 0.3)" }}
                whileTap={{ scale: 0.95 }}
              >
                Join Now
              </motion.button>
            </motion.div>
          </div>
          <motion.div
            className="lg:w-1/2 bg-white/80 backdrop-blur-md p-4 rounded-lg shadow-xl"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
          >
            <img
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644"
              alt="Students collaborating"
              className="rounded-lg w-full object-cover max-h-[400px] lg:max-h-[500px]"
            />
          </motion.div>
        </div>
      </motion.section>

      {/* Offerings Section */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-extrabold text-slate-600 text-center mb-12"
          >
            What We Offer
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {offerings.map((offer, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-white/90 backdrop-blur-md p-6 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105 border border-teal-300 hover:border-teal-500"
              >
                <offer.icon className="text-teal-600 w-12 h-12 mb-4" />
                <h3 className="text-xl font-semibold text-teal-950 mb-2">{offer.title}</h3>
                <p className="text-teal-500 font-medium mb-4">{offer.description}</p>
                <motion.button
                  onClick={() => navigate(offer.link)}
                  className="text-gray-950 hover:underline font-medium cursor-pointer"
                  whileHover={{ x: 5 }}
                >
                  Learn More
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-extrabold text-slate-600 mb-12"
          >
            Student Success Stories
          </motion.h2>
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonials[currentTestimonial].name}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.5 }}
                className="p-8 bg-gray-100 rounded-xl shadow-xl"
              >
                <motion.img
                  src={testimonials[currentTestimonial].image}
                  alt={testimonials[currentTestimonial].name}
                  className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-teal-300 object-cover"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                />
                <p className="italic text-lg mb-4 text-teal-500">"{testimonials[currentTestimonial].quote}"</p>
                <h4 className="text-lg font-semibold text-slate-600">{testimonials[currentTestimonial].name}</h4>
                <p className="text-sm text-gray-600">{testimonials[currentTestimonial].role}</p>
              </motion.div>
            </AnimatePresence>
            <div className="flex justify-center mt-6 gap-4">
              <motion.button
                aria-label="Previous testimonial"
                onClick={() => cycleTestimonial(-1)}
                className="p-2 bg-teal-100 text-teal-600 rounded-full hover:bg-teal-200 transition"
                whileHover={{ scale: 1.1 }}
              >
                <FaChevronLeft />
              </motion.button>
              <motion.button
                aria-label="Next testimonial"
                onClick={() => cycleTestimonial(1)}
                className="p-2 bg-teal-100 text-teal-600 rounded-full hover:bg-teal-200 transition"
                whileHover={{ scale: 1.1 }}
              >
                <FaChevronRight />
              </motion.button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-navy-800 text-white text-center relative z-10">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/subtle-dots.png')] opacity-5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-600 mb-6"
          >
            Begin Your Career Journey Today
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-green-950 mb-10 max-w-2xl mx-auto"
          >
            Sign up for internships, guidance, and career resources with CampusBridge.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <motion.button
              onClick={() => navigate("/signup")}
              className="px-12 py-5 bg-teal-500 text-white font-semibold text-lg rounded-full  transition shadow-2xl z-20 cursor-pointer"
              whileHover={{ scale: 1.1, boxShadow: "0 12px 24px rgba(0, 165, 181, 0.4)" }}
              whileTap={{ scale: 0.95 }}
            >
              Sign Up
            </motion.button>
            <motion.button
              onClick={() => navigate("/about")}
              className="px-12 py-5 bg-white border-3 border-teal-900 text-slate-600 font-semibold text-lg rounded-full  transition shadow-2xl z-20 cursor-pointer"
              whileHover={{ scale: 1.1, boxShadow: "0 12px 24px rgba(0, 119, 181, 0.3)" }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
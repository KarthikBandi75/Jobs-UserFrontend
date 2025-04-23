import React from "react";
import { motion } from "framer-motion";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-4xl font-bold text-gray-800 text-center mb-12"
        >
          About Job Board
        </motion.h1>

        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-center gap-12 mb-20"
        >
          <div className="md:w-1/2">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Our Mission
            </h2>
            <p className="text-gray-600 mb-4">
              At Job Board, we are dedicated to empowering students by connecting
              them with meaningful internship and job opportunities. Our platform is
              designed to bridge the gap between academia and industry, providing
              students with the tools and resources to kickstart their careers.
            </p>
            <p className="text-gray-600">
              Founded in 2023, Job Board has grown into a trusted platform for
              thousands of students and top employers worldwide.
            </p>
          </div>
          <motion.div
            className="md:w-1/2"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
          >
            <img
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3"
              alt="Team working"
              className="rounded-lg shadow-xl h-70 w-110"
            />
          </motion.div>
        </motion.section>

        
      </div>
    </div>
  );
};

export default About;
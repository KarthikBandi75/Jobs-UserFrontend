import React from "react";
import { motion } from "framer-motion";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

const Contact = () => {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-4xl font-extrabold text-slate-600 text-center mb-12"
        >
          Contact Us
        </motion.h1>

        <div className="flex flex-col md:flex-row gap-12 mb-20">
          {/* Left Side: All Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1"
          >
            <h2 className="text-2xl font-semibold text-slate-600 mb-4">
              We’re Here to Help!
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed mb-6">
              At Job Board, our goal is to ensure students, mentors, and recruiters are always supported. Whether you have questions about our platform, feedback to share, or need help navigating opportunities—reach out to us anytime!
            </p>
            <ul className="list-disc pl-5 text-slate-500 space-y-2 text-base mb-6">
              <li>Get answers about internships, placements, and profiles.</li>
              <li>Explore partnership opportunities with CampusBridge.</li>
              <li>Need tech support? We’re just a message away.</li>
            </ul>

            {/* Contact Details */}
            <div className="p-0">
              <h2 className="text-2xl font-semibold text-slate-600 mb-4">
                Get in Touch
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FaEnvelope className="text-teal-600 w-6 h-6" />
                  <p className="text-teal-500">
                    Email:{" "}
                    <a
                      href="mailto:support@campusbridge.com"
                      className="text-slate-600 hover:underline"
                    >
                      support@jobboard.com
                    </a>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <FaPhone className="text-teal-600 w-6 h-6" />
                  <p className="text-teal-500">
                    Phone:{" "}
                    <a
                      href="tel:+18001234567"
                      className="text-slate-600 hover:underline"
                    >
                      +1 (800) 123-4567
                    </a>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <FaMapMarkerAlt className="text-teal-600 w-6 h-6" />
                  <p className="text-teal-500">
                    Address: 123 Campus Way, Tech City, USA
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Image Only */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 flex items-center justify-center"
          >
            <motion.div
              className="rounded-lg shadow-xl w-full"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              <img
                src="https://www.odysseytraining.com.au/wp-content/uploads/2019/07/Blog_customercare_1500x884-1.jpg"
                alt="Customer support team"
                className="rounded-lg w-full object-cover max-h-[500px]"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

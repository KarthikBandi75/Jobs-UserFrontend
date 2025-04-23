import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
  FaUser,
  FaBuilding,
  FaMapPin,
  FaMoneyBillWave,
  FaClock,
  FaCalendarAlt,
  FaList,
  FaStar,
  FaCheckCircle,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

const SingleJob = () => {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const [job, setJob] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [logo,setLogo]=useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    description: false,
    whoCanApply: false,
    otherRequirements: false,
  });
  const navigate = useNavigate();

  const getJob = async () => {
    try {
      const res = await axios.get(`https://jobs-backend-47u0.onrender.com/api/user/job/${id}`, {
        headers: { token },
      });
      if (res.data.success) {
        setJob(res.data.job);
        setLogo(res.data.response.companyLogo);
        setHasApplied(res.data.hasApplied);
      } else {
        toast.error("Job not found");
        navigate("/alljobs");
      }
    } catch (error) {
      console.error("Error fetching job:", error);
      toast.error("Failed to load job details");
      navigate("/alljobs");
    } finally {
      setLoading(false);
    }
  };

  const applyJob = async () => {
    try {
      const res = await axios.post(
        `https://jobs-backend-47u0.onrender.com/api/applications/apply/${id}`,
        {},
        { headers: { token } }
      );
      if (res.data.success) {
        toast.success("Application submitted successfully!");
        setHasApplied(true);
        navigate("/allappliedjobs");
      } else {
        toast.warn("Failed to apply. Please try again.");
      }
    } catch (err) {
      console.error("Error applying to job:", err);
      const message =
        err.response?.status === 401
          ? "Please log in to apply"
          : "Something went wrong while applying";
      toast.error(message);
    }
  };

  useEffect(() => {
    if (!token) {
      toast.error("Please log in to view job details");
      navigate("/login");
      return;
    }
    getJob();
  }, [token]);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity }}
          className="h-12 w-12 border-t-2 border-b-2 border-teal-500 rounded-full"
        />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-10 text-gray-600">Job not found.</div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 text-sm text-gray-500"
        >
          <ol className="flex items-center space-x-2">
            <li>
              <button
                onClick={() => navigate("/")}
                className="hover:text-teal-500 transition"
              >
                Home
              </button>
            </li>
            <li>/</li>
            <li>
              <button
                onClick={() => navigate("/alljobs")}
                className="hover:text-teal-500 transition"
              >
                Jobs
              </button>
            </li>
            <li>/</li>
            <li className="text-gray-700">{job.title}</li>
          </ol>
        </motion.nav>

        {/* Sticky Job Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-10 bg-white/80 backdrop-blur-md rounded-lg shadow-lg p-6 mb-8 border border-gray-200"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img
                className="w-12 h-12 rounded-full object-cover border-2 border-teal-500"
                src={
                  logo
                }
                alt={`${job.company.companyName} logo`}
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{job.title}</h1>
                <p className="text-lg text-teal-950">
                  {job.company.companyName}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {hasApplied ? (
                <motion.span
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full font-semibold"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                >
                  Applied
                </motion.span>
              ) : (
                <motion.button
                  onClick={applyJob}
                  className="px-6 py-2 bg-teal-500 text-white rounded-full font-semibold hover:bg-teal-600 transition cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Apply Now
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Job Overview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white/80 backdrop-blur-md rounded-lg shadow-md p-6 mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <FaList className="text-teal-500 w-6 h-6" />
            <h2 className="text-xl font-semibold text-teal-950">Job Overview</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-3"
            >
              <FaBuilding className="text-teal-500 w-5 h-5" />
              <div>
                <span className="font-medium text-gray-700">Company:</span>
                <p className="text-gray-600">{job.company.companyName}</p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3"
            >
              <FaMapPin className="text-teal-500 w-5 h-5" />
              <div>
                <span className="font-medium text-gray-700">Location:</span>
                <p className="text-gray-600">
                  {job.location}{" "}
                  {job.location.toLowerCase().includes("remote") && (
                    <span className="ml-2 inline-block px-2 py-1 text-xs font-semibold text-white bg-teal-500 rounded-full">
                      Work from Home
                    </span>
                  )}
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-3"
            >
              <FaMoneyBillWave className="text-teal-500 w-5 h-5" />
              <div>
                <span className="font-medium text-gray-700">Salary:</span>
                <p className="text-gray-600">
                  ₹{job.salary.toLocaleString()}{" "}
                  {job.salary > 50000 && (
                    <span className="ml-2 inline-block px-2 py-1 text-xs font-semibold text-white bg-orange-500 rounded-full">
                      High Stipend
                    </span>
                  )}
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-3"
            >
              <FaClock className="text-teal-500 w-5 h-5" />
              <div>
                <span className="font-medium text-gray-700">Duration:</span>
                <p className="text-gray-600">{job.duration}</p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-3"
            >
              <FaCalendarAlt className="text-teal-500 w-5 h-5" />
              <div>
                <span className="font-medium text-gray-700">
                  Last Date to Apply:
                </span>
                <p className="text-gray-600">
                  {new Date(job.lastDateToApply).toLocaleDateString()}
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-3"
            >
              <FaList className="text-teal-500 w-5 h-5" />
              <div>
                <span className="font-medium text-gray-700">
                  No. of Openings:
                </span>
                <p className="text-gray-600">{job.noOfOpenings}</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Job Description */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white/80 backdrop-blur-md rounded-lg shadow-md p-6 mb-8"
        >
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => toggleSection("description")}
          >
            <div className="flex items-center gap-2">
              <FaList className="text-teal-500 w-6 h-6" />
              <h2 className="text-xl font-semibold text-teal-950">
                Job Description
              </h2>
            </div>
            {expandedSections.description ? (
              <FaChevronUp className="text-gray-500" />
            ) : (
              <FaChevronDown className="text-gray-500" />
            )}
          </div>
          {expandedSections.description && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 prose max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: job.description }}
            />
          )}
        </motion.div>

        {/* Who Can Apply */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white/80 backdrop-blur-md rounded-lg shadow-md p-6 mb-8"
        >
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => toggleSection("whoCanApply")}
          >
            <div className="flex items-center gap-2">
              <FaUser className="text-teal-500 w-6 h-6" />
              <h2 className="text-xl font-semibold text-teal-950">
                Who Can Apply
              </h2>
            </div>
            {expandedSections.whoCanApply ? (
              <FaChevronUp className="text-gray-500" />
            ) : (
              <FaChevronDown className="text-gray-500" />
            )}
          </div>
          {expandedSections.whoCanApply && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 prose max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: job.whoCanApply }}
            />
          )}
        </motion.div>

        {/* Other Requirements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white/80 backdrop-blur-md rounded-lg shadow-md p-6 mb-8"
        >
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => toggleSection("otherRequirements")}
          >
            <div className="flex items-center gap-2">
              <FaList className="text-teal-500 w-6 h-6" />
              <h2 className="text-xl font-semibold text-teal-950">
                Other Requirements
              </h2>
            </div>
            {expandedSections.otherRequirements ? (
              <FaChevronUp className="text-gray-500" />
            ) : (
              <FaChevronDown className="text-gray-500" />
            )}
          </div>
          {expandedSections.otherRequirements && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 prose max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: job.otherRequirements }}
            />
          )}
        </motion.div>

        {/* Skills Required */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white/80 backdrop-blur-md rounded-lg shadow-md p-6 mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <FaStar className="text-teal-500 w-6 h-6" />
            <h2 className="text-xl font-semibold text-teal-950">
              Skills Required
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {job.skills.map((skill, idx) => (
              <motion.span
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium hover:bg-teal-200 transition cursor-pointer"
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Perks */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white/80 backdrop-blur-md rounded-lg shadow-md p-6 mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <FaCheckCircle className="text-teal-500 w-6 h-6" />
            <h2 className="text-xl font-semibold text-teal-950">Perks</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {job.perks.map((perk, idx) => (
             
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center gap-2 text-gray-950"
              >
                <FaCheckCircle className="text-green-500 w-5 h-5" />
                <span>{perk}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Sticky Apply Button (Mobile) */}
        <motion.div
          className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4 md:hidden"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
        >
          {hasApplied ? (
            <span className="block text-center px-4 py-2 bg-gray-200 text-gray-700 rounded-full font-semibold">
              Applied
            </span>
          ) : (
            <button
              onClick={applyJob}
              className="w-full px-6 py-2 bg-teal-500 text-white rounded-full font-semibold hover:bg-teal-600 transition cursor-pointer"
            >
              Apply Now
            </button>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SingleJob;
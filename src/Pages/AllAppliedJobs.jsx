import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const AllAppliedJobs = () => {
  const { token } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      const res = await axios.get(`https://jobs-backend-47u0.onrender.com/api/applications/user`, {
        headers: { token },
      });
      if (res.data.success) {
        setApplications(res.data.applications);
      } else {
        toast.warn("Failed to fetch applications");
      }
    } catch (err) {
      console.error("Error fetching applications:", err);
      toast.error("Something went wrong while loading your applications.");
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (jobId) => {
    try {
      const res = await axios.delete(
        `https://jobs-backend-47u0.onrender.com/api/applications/withdraw/${jobId}`,
        { headers: { token } }
      );
      if (res.data.success) {
        toast.success("Application withdrawn successfully");
        fetchApplications();
      } else {
        toast.warn("Failed to withdraw application");
      }
    } catch (err) {
      console.error("Error withdrawing application:", err);
      toast.error("Error withdrawing application");
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-10">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity }}
          className="h-12 w-12 border-t-2 border-b-2 border-blue-500 rounded-full mx-auto"
        />
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No applications found.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50 min-h-screen">
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-3xl font-bold text-center text-slate-700 mb-6"
      >
        All Applied Jobs
      </motion.h2>
      <div className="space-y-6">
        {applications.map((app) => (
          <motion.div
            key={app._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center bg-white/80 backdrop-blur-md rounded-lg p-5 shadow-md hover:shadow-lg transition"
          >
            <div>
              <h3 className="text-xl font-bold text-gray-800">{app.job.title}</h3>
              <p className="text-gray-600">
                <span className="font-semibold">Company:</span>{" "}
                {app.job.company.companyName}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Email:</span>{" "}
                {app.job.company.email}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span
                className={`px-4 py-1 text-sm rounded-full font-semibold ${
                  app.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : app.status === "accepted"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
              </span>
              <motion.button
                onClick={() => handleWithdraw(app.job._id)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-md text-sm transition cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Withdraw Application
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AllAppliedJobs;
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const AllJobs = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    role: "",
    skills: "",
    location: "",
    salary: "",
  });

  const getAllJobs = async () => {
    try {
      const response = await axios.get("http://localhost:5577/api/jobs/", {
        headers: { token: token },
      });
      const activeJobs = response.data.jobs.filter((job) => job.isActive);
      setJobs(activeJobs);
      toast.success("Jobs loaded successfully!");
    } catch (err) {
      toast.error("Failed to load jobs");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllJobs();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesRole = filters.role
      ? job.title.toLowerCase().includes(filters.role.toLowerCase())
      : true;
    const matchesSkills = filters.skills
      ? job.skills.some((skill) =>
          skill.toLowerCase().includes(filters.skills.toLowerCase())
        )
      : true;
    const matchesLocation = filters.location
      ? job.location.toLowerCase().includes(filters.location.toLowerCase())
      : true;
    const matchesSalary = filters.salary
      ? parseInt(job.salary) >= parseInt(filters.salary)
      : true;
    return matchesRole && matchesSkills && matchesLocation && matchesSalary;
  });

  const handleJobClick = (jobId) => {
    navigate(`/job/${jobId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity }}
          className="h-12 w-12 border-t-2 border-b-2 border-blue-500 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6">
        {/* Filter Sidebar */}
        <motion.aside
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-full md:w-1/4 bg-white/80 backdrop-blur-md p-6 rounded-lg shadow-md sticky top-24"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Filters</h3>
          <div className="space-y-4">
            {[
              { name: "role", placeholder: "e.g., Full Stack Developer", label: "Role" },
              { name: "skills", placeholder: "e.g., Java, MERN", label: "Skills" },
              { name: "location", placeholder: "e.g., Hyderabad", label: "Location" },
              {
                name: "salary",
                placeholder: "e.g., 5000",
                label: "Minimum Salary",
                type: "number",
              },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                </label>
                <input
                  type={field.type || "text"}
                  name={field.name}
                  value={filters[field.name]}
                  onChange={handleFilterChange}
                  placeholder={field.placeholder}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
            <motion.button
              onClick={() =>
                setFilters({ role: "", skills: "", location: "", salary: "" })
              }
              className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
              whileHover={{ scale: 1.05 }}
            >
              Clear Filters
            </motion.button>
          </div>
        </motion.aside>

        {/* Job Cards */}
        <div className="w-full md:w-3/4">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-2xl font-semibold text-gray-800 mb-6"
          >
            Available Jobs ({filteredJobs.length})
          </motion.h2>
          {filteredJobs.length === 0 ? (
            <p className="text-gray-600">No jobs match your filters.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredJobs.map((job) => (
                <motion.div
                  key={job._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => handleJobClick(job._id)}
                  className="bg-white/80 backdrop-blur-md p-6 rounded-lg shadow-md hover:shadow-xl transition cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                >
                  <h3 className="text-xl font-semibold text-gray-800">{job.title}</h3>
                  <p className="text-blue-600 font-medium">
                    Company: {job.company.companyName}
                  </p>
                  <p className="text-gray-600 mt-2">
                    <span className="font-medium">Location:</span> {job.location}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Salary:</span> ₹{job.salary}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Skills:</span>{" "}
                    {job.skills.join(", ")}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Last Date to Apply:</span>{" "}
                    {new Date(job.lastDateToApply).toLocaleDateString()}
                  </p>
                  <div
                    className="mt-3 text-gray-600 line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: job.description }}
                  />
                  <div className="mt-4 flex justify-between items-center ">
                    <span className="text-sm px-4 py-1 rounded-full font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                    <button className="px-4 py-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition cursor-pointer">
                      View Details
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllJobs;
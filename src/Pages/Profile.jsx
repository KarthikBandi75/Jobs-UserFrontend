import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { FiUpload } from "react-icons/fi";
import { FaUser, FaMapPin, FaGraduationCap, FaTrophy, FaCertificate, FaLanguage, FaProjectDiagram, FaFileAlt } from "react-icons/fa";
import { motion } from "framer-motion";

const Profile = () => {
  const { userData, token, setUserData } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: userData?.name || "",
    gender: userData?.gender || "Not Selected",
    dob: userData?.dob || "Not Selected",
    phone: userData?.phone || "0000000000",
    address: {
      line1: userData?.address?.line1 || "",
      line2: userData?.address?.line2 || "",
      city: userData?.address?.city || "",
      state: userData?.address?.state || "",
      zip: userData?.address?.zip || "",
    },
    branch: userData?.branch || "CSE",
    semester: userData?.semester || "1",
    skills: userData?.skills || [],
    achievements: userData?.achievements || [],
    projects: userData?.projects || [],
    certifications: userData?.certifications || [],
    languages: userData?.languages || [],
    headline: userData?.headline || "Full-Stack Developer | MERN Stack Enthusiast",
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity }}
          className="h-12 w-12 border-t-2 border-b-2 border-teal-500 rounded-full"
        />
      </div>
    );
  }

  const calculateProfileCompleteness = () => {
    const fields = [
      formData.name,
      formData.headline,
      formData.phone,
      formData.address.line1 || formData.address.city,
      formData.branch,
      formData.semester,
      formData.skills.length > 0,
      formData.projects.length > 0,
      userData.resumeUrl,
    ];
    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!formData.headline.trim()) {
      newErrors.headline = "Headline is required";
    }
    formData.skills.forEach((skill, index) => {
      if (skill.skillname.trim() && !skill.proficiency) {
        newErrors[`skills[${index}].proficiency`] = "Proficiency is required";
      } else if (!skill.skillname.trim() && skill.proficiency) {
        newErrors[`skills[${index}].skillName`] = "Skill name is required";
      }
    });
    formData.achievements.forEach((achievement, index) => {
      if (achievement.title.trim() && !achievement.description.trim()) {
        newErrors[`achievements[${index}].description`] = "Description is required";
      } else if (!achievement.title.trim() && achievement.description.trim()) {
        newErrors[`achievements[${index}].title`] = "Title is required";
      }
    });
    formData.projects.forEach((project, index) => {
      if (project.title.trim() && !project.description.trim()) {
        newErrors[`projects[${index}].description`] = "Description is required";
      } else if (!project.title.trim() && project.description.trim()) {
        newErrors[`projects[${index}].title`] = "Title is required";
      }
    });
    formData.certifications.forEach((certification, index) => {
      if (certification.title.trim()) {
        if (!certification.issuingorganization.trim()) {
          newErrors[`certifications[${index}].issuingorganization`] = "Issuing organization is required";
        }
        if (!certification.issuedate) {
          newErrors[`certifications[${index}].issuedate`] = "Issue date is required";
        }
      } else if (certification.issuingorganization.trim() || certification.issuedate) {
        newErrors[`certifications[${index}].title`] = "Title is required";
      }
    });
    formData.languages.forEach((language, index) => {
      if (language.language.trim() && !language.proficiency) {
        newErrors[`languages[${index}].proficiency`] = "Proficiency is required";
      } else if (!language.language.trim() && language.proficiency) {
        newErrors[`languages[${index}].language`] = "Language is required";
      }
    });
    if (resumeFile && (resumeFile.type !== "application/pdf" || resumeFile.size > 10 * 1024 * 1024)) {
      newErrors.resume = "Resume must be a PDF file under 10 MB";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("address.")) {
      const field = name.split(".")[1];
      setFormData({
        ...formData,
        address: { ...formData.address, [field]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type !== "application/pdf" || file.size > 10 * 1024 * 1024)) {
      toast.error("Please upload a PDF file under 10 MB");
      setResumeFile(null);
    } else {
      setResumeFile(file);
      setErrors((prev) => ({ ...prev, resume: "" }));
    }
  };

  const handleArrayChange = (field, index, key, value) => {
    const updatedArray = [...formData[field]];
    updatedArray[index] = { ...updatedArray[index], [key]: value };
    setFormData({ ...formData, [field]: updatedArray });
    setErrors((prev) => ({ ...prev, [`${field}[${index}].${key}`]: "" }));
  };

  const addArrayItem = (field, defaultItem) => {
    setFormData({
      ...formData,
      [field]: [...formData[field], defaultItem],
    });
  };

  const removeArrayItem = (field, index) => {
    setFormData({
      ...formData,
      [field]: formData[field].filter((_, i) => i !== index),
    });
    setErrors((prev) => {
      const newErrors = { ...prev };
      Object.keys(prev).forEach((key) => {
        if (key.startsWith(`${field}[${index}]`)) {
          delete newErrors[key];
        }
      });
      return newErrors;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix all errors before submitting");
      return;
    }
    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "address") {
          Object.keys(formData.address).forEach((addrKey) => {
            data.append(`address[${addrKey}]`, formData.address[addrKey] || "");
          });
        } else if (Array.isArray(formData[key])) {
          const validArray = formData[key].filter((item) => {
            if (key === "skills") return item.skillname.trim() && item.proficiency;
            if (key === "certifications") return item.title.trim() && item.issuingorganization.trim() && item.issuedate;
            if (key === "achievements") return item.title.trim() && item.description.trim();
            if (key === "projects") return item.title.trim() && item.description.trim();
            if (key === "languages") return item.language.trim() && item.proficiency;
            return false;
          });
          validArray.forEach((item, index) => {
            Object.keys(item).forEach((subKey) => {
              data.append(`${key}[${index}][${subKey}]`, item[subKey] || "");
            });
          });
          if (validArray.length === 0) {
            data.append(key, JSON.stringify([]));
          }
        } else {
          data.append(key, formData[key] || "");
        }
      });
      if (resumeFile) {
        data.append("resume", resumeFile);
      }
     
      const response = await axios.put(
        `https://jobs-backend-47u0.onrender.com/api/user/profile`,
        data,
        {
          headers: {
            token: token,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setUserData(response.data.user);
      toast.success(response.data.message || "Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Failed to update profile";
      toast.error(message);
      if (message.includes("token") || message.includes("Unauthorized")) {
        toast.error("Session expired. Please log in again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const formatAddress = (address) => {
    const parts = [
      address.line1,
      address.line2,
      address.city,
      address.state,
      address.zip,
    ].filter(Boolean);
    if (!parts.length) return "Not Available";
    return parts.join(", ");
  };

  const isValidUrl = (url) => {
    return url && (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("https://res.cloudinary.com"));
  };

  const renderArrayField = (field, label, fields, defaultItem, Icon) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white-50/80 backdrop-blur-md p-6 rounded-lg shadow-md border border-grey-500 mb-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <Icon className="text-teal-500 w-6 h-6" />
        <h4 className="text-lg font-semibold text-blue-900">{label}</h4>
      </div>
      {formData[field].map((item, index) => (
        <div
          key={index}
          className="border border-grey-500 p-4 mb-4 rounded-lg bg-white-50"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map(({ name, type, options }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-grey-500 mb-1">
                  {name.replace(/([A-Z])/g, " $1").trim()}
                  {["SkillName", "Proficiency", "Title", "Description", "Issuingorganization", "Issuedate", "Language"].includes(name) && (
                    <span className="text-orange-500">*</span>
                  )}
                </label>
                {type === "select" ? (
                  <select
                    value={item[name.toLowerCase()] || ""}
                    onChange={(e) => handleArrayChange(field, index, name.toLowerCase(), e.target.value)}
                    className="w-full p-2 border border-grey-500 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    aria-label={name.replace(/([A-Z])/g, " $1").trim()}
                  >
                    <option value="">Select {name}</option>
                    {options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={type}
                    value={item[name.toLowerCase()] || ""}
                    onChange={(e) => handleArrayChange(field, index, name.toLowerCase(), e.target.value)}
                    className="w-full p-2 border border-grey-500 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    aria-label={name.replace(/([A-Z])/g, " $1").trim()}
                  />
                )}
                {errors[`${field}[${index}].${name.toLowerCase()}`] && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-orange-500 text-sm mt-1"
                    id={`${field}-${index}-${name.toLowerCase()}-error`}
                  >
                    {errors[`${field}[${index}].${name.toLowerCase()}`]}
                  </motion.p>
                )}
              </div>
            ))}
          </div>
          <motion.button
            type="button"
            onClick={() => removeArrayItem(field, index)}
            className="mt-3 px-3 py-1 bg-teal-500 text-white text-sm rounded-md hover:bg-orange-500 transition cursor-pointer"
            whileHover={{ scale: 1.05 }}
          >
            Remove
          </motion.button>
        </div>
      ))}
      <motion.button
        type="button"
        onClick={() => addArrayItem(field, defaultItem)}
        className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-orange-500 transition cursor-pointer"
        whileHover={{ scale: 1.05 }}
      >
        Add {label}
      </motion.button>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Profile Hero */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white-50/80 backdrop-blur-md rounded-lg shadow-xl p-8 mb-8 border border-grey-500 flex flex-col md:flex-row items-center justify-between relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-900 to-teal-500" />
          <div className="flex items-center gap-6 z-10 mt-12">
            <img
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
              src={userData.image || "https://assets.leetcode.com/users/default_avatar.jpg"}
              alt="User profile"
            />
            <div>
              <h1 className="text-4xl font-extrabold text-blue-900">{userData.name || "No Name Provided"}</h1>
              {isEditing ? (
                <input
                  type="text"
                  name="headline"
                  value={formData.headline}
                  onChange={handleInputChange}
                  className="w-full mt-2 p-2 border border-grey-500 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  aria-label="Professional Headline"
                  aria-required="true"
                />
              ) : (
                <p className="text-lg text-grey-500">{userData.headline || "No Headline Provided"}</p>
              )}
              {errors.headline && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-orange-500 text-sm mt-1"
                >
                  {errors.headline}
                </motion.p>
              )}
              <p className="text-base text-grey-500 mt-1">{userData.email || "No Email Provided"}</p>
            </div>
          </div>
          <div className="flex flex-col items-end z-10">
            <motion.div
              className="w-64 bg-grey-200 rounded-full h-4 mb-4"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
            >
              <div
                className="bg-orange-500 h-4 rounded-full"
                style={{ width: `${calculateProfileCompleteness()}%` }}
              />
            </motion.div>
            <p className="text-sm text-grey-500 mb-2">
              Profile Completeness: {calculateProfileCompleteness()}%
            </p>
            {!isEditing && (
              <motion.button
                onClick={() => setIsEditing(true)}
                className="px-6 py-2 bg-blue-900 text-white rounded-full font-semibold hover:bg-gradient-to-r hover:from-blue-900 hover:to-teal-500 transition shadow-xl cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Edit Profile
              </motion.button>
            )}
          </div>
        </motion.div>

        {isEditing ? (
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={handleSubmit}
            className="space-y-8"
          >
            {/* Personal Information */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white-50/80 backdrop-blur-md p-6 rounded-lg shadow-md border border-grey-500 hover:shadow-lg transition"
            >
              <div className="flex items-center gap-2 mb-4">
                <FaUser className="text-teal-500 w-6 h-6" />
                <h3 className="text-xl font-semibold text-blue-900">Personal Information</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-grey-500 mb-1">
                    Name <span className="text-orange-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-grey-500 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    aria-required="true"
                    aria-label="Name"
                    aria-describedby={errors.name ? "name-error" : undefined}
                  />
                  {errors.name && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-orange-500 text-sm mt-1"
                      id="name-error"
                    >
                      {errors.name}
                    </motion.p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-grey-500 mb-1">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-grey-500 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    aria-label="Gender"
                  >
                    <option value="Not Selected">Not Selected</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-grey-500 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob !== "Not Selected" ? formData.dob : ""}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-grey-500 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    aria-label="Date of Birth"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-grey-500 mb-1">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-grey-500 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    aria-label="Phone"
                  />
                </div>
              </div>
            </motion.div>

            {/* Address */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white-50/80 backdrop-blur-md p-6 rounded-lg shadow-md border border-grey-500 hover:shadow-lg transition"
            >
              <div className="flex items-center gap-2 mb-4">
                <FaMapPin className="text-teal-500 w-6 h-6" />
                <h3 className="text-xl font-semibold text-blue-900">Address</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {["line1", "line2", "city", "state", "zip"].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-grey-500 mb-1 capitalize">
                      {field.replace(/([A-Z])/g, " $1").trim()}
                    </label>
                    <input
                      type="text"
                      name={`address.${field}`}
                      value={formData.address[field]}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-grey-500 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      aria-label={field.replace(/([A-Z])/g, " $1").trim()}
                    />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Academic Information */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white-50/80 backdrop-blur-md p-6 rounded-lg shadow-md border border-grey-500 hover:shadow-lg transition"
            >
              <div className="flex items-center gap-2 mb-4">
                <FaGraduationCap className="text-teal-500 w-6 h-6" />
                <h3 className="text-xl font-semibold text-blue-900">Academic Information</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-grey-500 mb-1">Branch</label>
                  <input
                    type="text"
                    name="branch"
                    value={formData.branch}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-grey-500 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    aria-label="Branch"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-grey-500 mb-1">Semester</label>
                  <input
                    type="text"
                    name="semester"
                    value={formData.semester}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-grey-500 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    aria-label="Semester"
                  />
                </div>
              </div>
            </motion.div>

            {/* Array Fields */}
            {renderArrayField(
              "skills",
              "Skills",
              [
                { name: "SkillName", type: "text" },
                { name: "Proficiency", type: "select", options: ["Beginner", "Intermediate", "Advanced", "Expert"] },
              ],
              { skillname: "", proficiency: "" },
              FaTrophy
            )}

            {renderArrayField(
              "achievements",
              "Achievements",
              [
                { name: "Title", type: "text" },
                { name: "Description", type: "text" },
                { name: "Date", type: "date" },
              ],
              { title: "", description: "", date: "" },
              FaTrophy
            )}

            {renderArrayField(
              "projects",
              "Projects",
              [
                { name: "Title", type: "text" },
                { name: "Description", type: "text" },
                { name: "Technologies", type: "text" },
                { name: "Link", type: "text" },
              ],
              { title: "", description: "", technologies: "", link: "" },
              FaProjectDiagram
            )}

            {renderArrayField(
              "certifications",
              "Certifications",
              [
                { name: "Title", type: "text" },
                { name: "IssuingOrganization", type: "text" },
                { name: "IssueDate", type: "date" },
                { name: "ExpirationDate", type: "date" },
                { name: "CredentialId", type: "text" },
                { name: "CredentialUrl", type: "text" },
              ],
              {
                title: "",
                issuingorganization: "",
                issuedate: "",
                expirationDate: "",
                credentialId: "",
                credentialUrl: "",
              },
              FaCertificate
            )}

            {renderArrayField(
              "languages",
              "Languages",
              [
                { name: "Language", type: "text" },
                { name: "Proficiency", type: "select", options: ["Beginner", "Intermediate", "Advanced", "Native"] },
              ],
              { language: "", proficiency: "" },
              FaLanguage
            )}

            {/* Resume Upload */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white-50/80 backdrop-blur-md p-6 rounded-lg shadow-md border border-grey-500 hover:shadow-lg transition"
            >
              <div className="flex items-center gap-2 mb-4">
                <FaFileAlt className="text-teal-500 w-6 h-6" />
                <h3 className="text-xl font-semibold text-blue-900">Resume</h3>
              </div>
              <label
                htmlFor="resume-upload"
                className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-grey-500 rounded-md hover:border-teal-500 hover:bg-teal-500/10 transition"
              >
                <FiUpload className="w-8 h-8 text-teal-500 mb-2" />
                <span className="text-blue-900 text-sm">
                  {resumeFile ? resumeFile.name : "Upload Resume (PDF, max 10 MB)"}
                </span>
                <input
                  id="resume-upload"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  aria-label="Upload Resume"
                />
              </label>
              {errors.resume && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-orange-500 text-sm mt-2"
                  id="resume-error"
                >
                  {errors.resume}
                </motion.p>
              )}
              {userData.resumeUrl && isValidUrl(userData.resumeUrl) ? (
                <a
                  href={userData.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-orange-500 transition"
                >
                  View Current Resume
                </a>
              ) : userData.resumeUrl ? (
                <p className="text-orange-500 text-sm mt-2">
                  Resume link is invalid. Please upload a new resume.
                </p>
              ) : null}
            </motion.div>

            {/* Form Actions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-4 justify-end"
            >
              <motion.button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-blue-900 text-white rounded-full font-semibold hover:bg-gradient-to-r hover:from-blue-900 hover:to-teal-500 transition shadow-xl disabled:bg-grey-500 disabled:cursor-not-allowed cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {loading ? "Saving..." : "Save Changes"}
              </motion.button>
              <motion.button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-6 py-3 bg-teal-500 text-white rounded-full font-semibold hover:bg-orange-500 transition shadow-md cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>
            </motion.div>
          </motion.form>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white-50/80 backdrop-blur-md p-6 rounded-lg shadow-md border border-grey-500 hover:shadow-lg transition"
            >
              <div className="flex items-center gap-2 mb-4">
                <FaMapPin className="text-teal-500 w-6 h-6" />
                <h3 className="text-xl font-semibold text-blue-900">Contact Information</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <span className="font-medium text-grey-500">Phone:</span>
                  <p className="text-grey-500">{userData.phone || "Not Available"}</p>
                </div>
                <div>
                  <span className="font-medium text-grey-500">Address:</span>
                  <p className="text-grey-500">{formatAddress(userData.address)}</p>
                </div>
              </div>
            </motion.div>

            {/* Basic Information */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white-50/80 backdrop-blur-md p-6 rounded-lg shadow-md border border-grey-500 hover:shadow-lg transition"
            >
              <div className="flex items-center gap-2 mb-4">
                <FaUser className="text-teal-500 w-6 h-6" />
                <h3 className="text-xl font-semibold text-blue-900">Basic Information</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <span className="font-medium text-grey-500">DOB:</span>
                  <p className="text-grey-500">{userData.dob || "Not Selected"}</p>
                </div>
                <div>
                  <span className="font-medium text-grey-500">Gender:</span>
                  <p className="text-grey-500">{userData.gender || "Not Selected"}</p>
                </div>
                <div>
                  <span className="font-medium text-grey-500">Branch:</span>
                  <p className="text-grey-500">{userData.branch || "Not Available"}</p>
                </div>
                <div>
                  <span className="font-medium text-grey-500">Semester:</span>
                  <p className="text-grey-500">{userData.semester || "Not Available"}</p>
                </div>
              </div>
            </motion.div>

            {/* Skills */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white-50/80 backdrop-blur-md p-6 rounded-lg shadow-md border border-grey-500 hover:shadow-lg transition"
            >
              <div className="flex items-center gap-2 mb-4">
                <FaTrophy className="text-teal-500 w-6 h-6" />
                <h3 className="text-xl font-semibold text-blue-900">Skills</h3>
              </div>
              {userData.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {userData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-teal-500 text-white px-3 py-1 rounded-full text-sm font-medium transition"
                    >
                      {skill.skillname} ({skill.proficiency})
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-grey-500">No skills listed</p>
              )}
            </motion.div>

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className=" p-6 rounded-lg shadow-md border border-grey-500 hover:shadow-lg transition"
            >
              <div className="flex items-center gap-2 mb-4">
                <FaTrophy className="text-teal-500 w-6 h-6" />
                <h3 className="text-xl font-semibold text-blue-900">Achievements</h3>
              </div>
              {userData.achievements.length > 0 ? (
                <ul className="space-y-4">
                  {userData.achievements.map((achievement, index) => (
                    <li key={index} className="">
                      <div className=" ml-4">
                      <span className=" font-medium">{index + 1}) </span>
                        <span className="text-cyan-950 font-medium"> Title:</span> {achievement.title}
                        <p><span className="text-cyan-950 font-medium"> Description:</span> {achievement.description}</p>
                        {achievement.date && (
                          <p><span className="text-cyan-950 font-medium">Date:</span> {new Date(achievement.date).toLocaleDateString()}</p>
                        )}
                      </div>
                      <br/>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-grey-500">No achievements listed</p>
              )}
            </motion.div>

            {/* Projects */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className=" p-6 rounded-lg shadow-md border border-grey-500 hover:shadow-lg transition"
            >
              <div className="flex items-center gap-2 mb-4">
                <FaProjectDiagram className="text-teal-500 w-6 h-6" />
                <h3 className="text-xl font-semibold text-blue-900">Projects</h3>
              </div>
              {userData.projects.length > 0 ? (
                <ul className="space-y-4">
                  {userData.projects.map((project, index) => (
                    <li key={index} className="">
                      <div className="ml-4">
                        <p> <span className="text-teal-950 font-medium">{index + 1}) </span><span className="text-teal-950 font-medium">Title:</span> {project.title}</p>
                        <p><span className="text-teal-950 font-medium">Description:</span> {project.description}</p>
                        {project.technologies && (
                          <p><span className="text-teal-950 font-medium">Technologies:</span> {project.technologies}</p>
                        )}
                        {project.link && (
                          <p>
                            <span className="text-teal-950 font-medium">Link:</span>{" "}
                            <a
                              href={project.link}
                              className="text-white hover:underline"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {project.link}
                            </a>
                          </p>
                        )}
                      </div>
                      <br />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-grey-500">No projects listed</p>
              )}
            </motion.div>

            {/* Certifications */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-6 rounded-lg shadow-md border border-grey-500 hover:shadow-lg transition"
            >
              <div className="flex items-center gap-2 mb-4">
                <FaCertificate className="text-teal-500 w-6 h-6" />
                <h3 className="text-xl font-semibold text-blue-900">Certifications</h3>
              </div>
              {userData.certifications.length > 0 ? (
                <ul className="space-y-4">
                  {userData.certifications.map((certification, index) => (
                    <li key={index} className="">
                      <span className="font-medium">{index + 1}) </span>
                      <div className="ml-4">
                        <p><span className="text-teal-950 font-medium">Title:</span> {certification.title}</p>
                        <p><span className="text-teal-950 font-medium">Issuing Organization:</span> {certification.issuingorganization}</p>
                        {certification.issuedate && (
                          <p><span className="text-teal-950 font-medium">Issue Date:</span> {new Date(certification.issuedate).toLocaleDateString()}</p>
                        )}
                        {certification.expirationDate && (
                          <p><span className="text-teal-950 font-medium">Expiration Date:</span> {new Date(certification.expirationDate).toLocaleDateString()}</p>
                        )}
                        {certification.credentialId && (
                          <p><span className="text-teal-950 font-medium">Credential ID:</span> {certification.credentialId}</p>
                        )}
                        {certification.credentialUrl && (
                          <p>
                            <span className="text-teal-950 font-medium">Credential URL:</span>{" "}
                            <a
                              href={certification.credentialUrl}
                              className="text-white hover:underline"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {certification.credentialUrl}
                            </a>
                          </p>
                        )}
                      </div>
                      <br />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-grey-500">No certifications listed</p>
              )}
            </motion.div>

            {/* Languages */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white-50/80 backdrop-blur-md p-6 rounded-lg shadow-md border border-grey-500 hover:shadow-lg transition"
            >
              <div className="flex items-center gap-2 mb-4">
                <FaLanguage className="text-teal-500 w-6 h-6" />
                <h3 className="text-xl font-semibold text-blue-900">Languages</h3>
              </div>
              {userData.languages.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {userData.languages.map((language, index) => (
                    <span
                      key={index}
                      className="bg-teal-500 text-white px-3 py-1 rounded-full text-sm font-medium transition"
                    >
                      {language.language} ({language.proficiency})
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-grey-500">No languages listed</p>
              )}
            </motion.div>

            {/* Resume */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white-50/80 backdrop-blur-md p-6 rounded-lg shadow-md border border-grey-500 hover:shadow-lg transition"
            >
              <div className="flex items-center gap-2 mb-4">
                <FaFileAlt className="text-teal-500 w-6 h-6" />
                <h3 className="text-xl font-semibold text-blue-900">Resume</h3>
              </div>
              {userData.resumeUrl && isValidUrl(userData.resumeUrl) ? (
                <a
                  href={userData.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-orange-500 transition"
                >
                  View Resume
                </a>
              ) : userData.resumeUrl ? (
                <p className="text-orange-500">
                  Resume link is invalid. Please upload a new resume.
                </p>
              ) : (
                <p className="text-grey-500">No resume uploaded</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Profile;
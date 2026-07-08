import "./App.css";
import { useState } from "react";
import axios from "axios";
import {
  FaRobot,
  FaUpload,
  FaCheckCircle,
  FaTimesCircle,
  FaChartLine,
  FaFileAlt,
  FaBrain,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useDropzone } from "react-dropzone";
import toast, { Toaster } from "react-hot-toast";

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const onDrop = (acceptedFiles) => {
    if (!acceptedFiles.length) return;

    setFile(acceptedFiles[0]);
    toast.success("Resume uploaded successfully");
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "application/pdf": [".pdf"],
    },
  });

  const analyzeResume = async () => {
    if (!file) {
      toast.error("Please upload your resume first");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const response = await axios.post(
        "https://resume-analyzer-backend-46ju.onrender.com/upload",
        formData
      );

      setResult(response.data);
      toast.success("Analysis Complete!");
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" />

      {/* Animated Background */}
      <div className="bg">
        <div className="blob blob1"></div>
        <div className="blob blob2"></div>
        <div className="blob blob3"></div>
      </div>

      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          <FaRobot />
          <span>ResumeAI</span>
        </div>

      </nav>

      {/* Hero */}
      <section className="hero">

        <motion.div
          initial={{ opacity: 0, y: 70 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >

          <span className="badge">
            <FaBrain />
            AI Powered Resume Analysis
          </span>

          <h1>
            Analyze Your Resume
            <span> Like a Recruiter</span>
          </h1>

          <p>
            Upload your resume and instantly discover your ATS score,
            technical skills, missing keywords and personalized AI
            suggestions.
          </p>

          {/* Upload Card */}

          <div
            {...getRootProps()}
            className={`upload-card ${
              isDragActive ? "active" : ""
            }`}
          >

            <input {...getInputProps()} />

            <FaUpload className="upload-icon" />

            <h2>
              Drag & Drop Resume
            </h2>

            <p>
              or click to browse
            </p>

            {file && (
              <div className="selected-file">
                <FaFileAlt />
                {file.name}
              </div>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                analyzeResume();
              }}
            >
              Analyze Resume
            </button>

          </div>

          {/* Loading */}

          {loading && (
            <div className="loading-box">

              <div className="loader"></div>

              <h3>AI is analyzing your resume...</h3>

              <p>
                Reading PDF • Detecting Skills •
                Calculating ATS Score
              </p>

            </div>
          )}
          {/* Result Section */}

          {result && (
            <motion.div
              className="dashboard"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Score Card */}

              <div className="score-card">

                <div className="circle">

                  <CircularProgressbar
                    value={result.score}
                    text={`${result.score}%`}
                    styles={buildStyles({
                      pathColor: "#3b82f6",
                      textColor: "#fff",
                      trailColor: "#29324e",
                    })}
                  />

                </div>

                <h2>ATS Resume Score</h2>

                <p>
                  Your resume has been analyzed successfully.
                </p>

              </div>

              {/* Skills */}

              <div className="skills-container">

                <div className="card">

                  <h2>
                    <FaCheckCircle />
                    Skills Found
                  </h2>

                  <div className="chips">

                    {result.skillsFound.length > 0 ? (

                      result.skillsFound.map((skill, index) => (

                        <span
                          key={index}
                          className="chip success"
                        >
                          {skill}
                        </span>

                      ))

                    ) : (

                      <p>No skills detected.</p>

                    )}

                  </div>

                </div>

                <div className="card">

                  <h2>
                    <FaTimesCircle />
                    Missing Skills
                  </h2>

                  <div className="chips">

                    {result.missingSkills.length > 0 ? (

                      result.missingSkills.map((skill, index) => (

                        <span
                          key={index}
                          className="chip danger"
                        >
                          {skill}
                        </span>

                      ))

                    ) : (

                      <p>No missing skills 🎉</p>

                    )}

                  </div>

                </div>

              </div>

              {/* Resume Strength */}

              <div className="strength-card">

                <h2>
                  <FaChartLine />
                  Resume Strength
                </h2>

                <div className="strength-bar">

                  <div
                    className="strength-fill"
                    style={{
                      width: `${result.score}%`,
                    }}
                  ></div>

                </div>

                <p>

                  {result.score >= 85
                    ? "Excellent Resume"
                    : result.score >= 70
                    ? "Good Resume"
                    : result.score >= 50
                    ? "Needs Improvement"
                    : "Weak Resume"}

                </p>

              </div>

              {/* AI Suggestions */}

              <div className="suggestions">

                <h2>
                  <FaBrain />
                  AI Suggestions
                </h2>

                <ul>

                  <li>
                    ✔ Add measurable achievements wherever possible.
                  </li>

                  <li>
                    ✔ Include GitHub and live project links.
                  </li>

                  <li>
                    ✔ Add more technologies related to your target job.
                  </li>

                  <li>
                    ✔ Improve keyword matching for ATS systems.
                  </li>

                  <li>
                    ✔ Keep the resume limited to one page.
                  </li>

                </ul>

              </div>

            </motion.div>

          )}

        </motion.div>

      </section>

    </>

  );

}

export default App;
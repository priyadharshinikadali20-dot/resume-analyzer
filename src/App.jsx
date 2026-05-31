import './App.css';
import { useState } from 'react';
import axios from "axios";

function App() {

  const [fileName, setFileName] = useState("");
  const [result, setResult] = useState(null);

  const handleFileChange = (event) => {

    const file = event.target.files[0];

    if (file) {
      setFileName(file.name);
    }

  };

  const analyzeResume = async () => {

    if (!fileName) {

      alert("Please upload resume");

      return;
    }

    const formData = new FormData();

    formData.append(
      "resume",
      document.querySelector("input[type=file]").files[0]
    );

    try {

      const response = await axios.post(
        "http://localhost:5000/upload",
        formData
      );

      setResult(response.data);

    } catch (error) {

      console.log(error);

    }

  };

  return (

    <div className="container">

      <h1>AI Resume Analyzer</h1>

      <p>
        Upload your resume and get skill analysis
      </p>

      <input
        type="file"
        onChange={handleFileChange}
      />

      <br />
      <br />

      <button onClick={analyzeResume}>
        Analyze Resume
      </button>

      <h3>{fileName}</h3>
      {result && (

  <div className="result-box">

    <h2>
      Resume Score: {result.score}%
    </h2>

    <h3>Skills Found</h3>

    <ul>
      {result.skillsFound.map((skill, index) => (
        <li key={index}>{skill}</li>
      ))}
    </ul>

    <h3>Missing Skills</h3>

    <ul>
      {result.missingSkills.map((skill, index) => (
        <li key={index}>{skill}</li>
      ))}
    </ul>

  </div>

)}
    </div>

  );

}

export default App;
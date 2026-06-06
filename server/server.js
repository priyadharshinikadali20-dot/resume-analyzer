const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const pdfParse = require("pdf-parse");

const app = express();

app.use(cors());
app.use(express.json());

// Home Route
app.get("/", (req, res) => {
  res.send("Resume Analyzer Backend Running");
});

// Multer Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Resume Upload Route
app.post("/upload", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "No file uploaded",
      });
    }

    const filePath = req.file.path;

    const dataBuffer = fs.readFileSync(filePath);

    const pdfData = await pdfParse(dataBuffer);

    const resumeText = pdfData.text.toLowerCase();

    const skills = [
      "html",
      "css",
      "javascript",
      "react",
      "node.js",
      "mongodb",
      "sql",
      "python",
    ];

    let skillsFound = [];
    let missingSkills = [];

    skills.forEach((skill) => {
      if (resumeText.includes(skill)) {
        skillsFound.push(skill);
      } else {
        missingSkills.push(skill);
      }
    });

    const score = Math.round(
      (skillsFound.length / skills.length) * 100
    );

    fs.unlinkSync(filePath);

    res.json({
      score,
      skillsFound,
      missingSkills,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Error analyzing resume",
    });
  }
});

// Render uses PORT environment variable
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
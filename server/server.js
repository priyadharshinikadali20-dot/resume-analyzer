const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const pdfParse = require("pdf-parse");

const app = express();

app.use(cors());

const storage = multer.diskStorage({

  destination: function (req, file, cb) {

    cb(null, "uploads/");

  },

  filename: function (req, file, cb) {

    cb(null, file.originalname);

  },

});

const upload = multer({ storage: storage });

app.post(
  "/upload",
  upload.single("resume"),

  async (req, res) => {

    try {

      const filePath = req.file.path;

      const dataBuffer =
        fs.readFileSync(filePath);

      const pdfData =
        await pdfParse(dataBuffer);

      const resumeText =
        pdfData.text.toLowerCase();

      const skills = [

        "html",
        "css",
        "javascript",
        "react",
        "node.js",
        "mongodb",
        "sql",
        "python"

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

      const analysisResult = {

        score,

        skillsFound,

        missingSkills

      };

      res.json(analysisResult);

    } catch (error) {

      console.log(error);

      res.status(500).send(
        "Error analyzing resume"
      );

    }

  }

);

app.listen(5000, () => {

  console.log(
    "Server running on port 5000"
  );

});
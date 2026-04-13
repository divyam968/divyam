require("dotenv").config();

const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const pdf = require("pdf-parse");
const OpenAI = require("openai");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

// ✅ OpenRouter setup
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1"
});

// ================= FRONTEND =================
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ================= ANALYZE API =================
app.post("/analyze", upload.single("resume"), async (req, res) => {
  console.log("Request received 🔥");

  try {
    const filePath = req.file.path;

    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    const resumeText = data.text;

    // 🔥 AI CALL
    const aiResponse = await openai.chat.completions.create({
      model: "meta-llama/llama-3-8b-instruct",
      messages: [
        {
          role: "system",
          content: `
You are an expert AI resume analyzer.

Analyze the resume and match it with job roles.

Rules:
- Give match percentage for each role (0-100%)
- Match based on skills, education, and experience
- Be realistic (not all 90%)
- Also suggest missing skills required for top roles

Output format:

Score: (0-100)

Skills:
- skill1
- skill2

Best Job Roles:
- Role 1 - Match: XX% (reason)
- Role 2 - Match: XX% (reason)

Improvements:
- suggestion1
- suggestion2

ATS Tips:
- tip1
- tip2

Resume:
${resumeText}
          `
        }
      ]
    });

    const output = aiResponse.choices[0].message.content;

    res.json({ result: output });

  } catch (err) {
    console.error("REAL ERROR:", err);

    res.json({
      result: "❌ ERROR: " + err.message
    });
  }
});

// ================= SERVER =================
app.listen(3000, () => {
  console.log("Server running on http://127.0.0.1:3000");
});
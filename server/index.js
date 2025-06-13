const express = require("express");

const app = express();
const fs = require("fs");

const path = require("path");

const PORT = process.env.PORT || 3000;

// enable parsing of JSON
app.use(express.json());

// Serve static files from the client directory
app.use(express.static(path.join(__dirname, "../client")));

// API route to serve FAQ data
app.get("/api/faq", (req, res) => {
  const faqPath = path.join(__dirname, "faq.json");

  try {
    const data = fs.readFileSync(faqPath, "utf8");

    res.json(JSON.parse(data));

  } catch (err) {
    console.error("Error reading faq.json.", err);
    res.status(500).json({ error: "Failed to read FAQ data" });
  }
});

// API route to answer messages
app.post("/api/ask", (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ reply: "No message received" });
  }

  // Loop through FAQ to find matching answer
  const faqPath = path.join(__dirname, "faq.json");

  let reply = "I'm not sure how to answer that yet.";

  try {
    const faqs = JSON.parse(fs.readFileSync(faqPath, "utf8"));
    for (const item of faqs) {
      if (item.keywords.some((kw) => message.toLowerCase().includes(kw.toLowerCase()) )) {
        reply = item.answer;
        break;
      }
    }
  } catch (err) {
    console.error("Error reading faq.json.", err);
    reply = "Failed to retrieve information.";
  }

  res.json({ reply });
});

// Fallback route - serve index.html for any unknown route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

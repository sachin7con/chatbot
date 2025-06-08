const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;

// Serve static files from the client directory
app.use(express.static(path.join(__dirname, "../client")));

// API route to serve FAQ data
app.get("/api/faq", (req, res) => {
  const faqPath = path.join(__dirname, "faq.json");
  try {
    const data = fs.readFileSync(faqPath, "utf8");
    const faq = JSON.parse(data);
    res.json(faq);
  } catch (err) {
    console.error("Error reading faq.json:", err);
    res.status(500).json({ error: "Failed to read FAQ data" });
  }
});

app.post("/api/ask", (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ reply: "No message received" });
  }

  const msg = message.toLowerCase();

  let reply = "I'm not sure how to answer that yet.";

  if (msg.includes("hello") || msg.includes("hi")) {
    reply = "Hello! How can I help you today?";
  } else if (msg.includes("exam")) {
    reply = "Exam-related queries include date, time, and results.";
  } else if (msg.includes("register")) {
    reply = "You can register through your school or online.";
  } else if (msg.includes("bye")) {
    reply = "Goodbye! Have a great day!";
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

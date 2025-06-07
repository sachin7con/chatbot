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

// Fallback route - serve index.html for any unknown route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

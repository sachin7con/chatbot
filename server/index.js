const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

const faqs = JSON.parse(fs.readFileSync(path.join(__dirname, 'faq.json'), 'utf-8'));

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from client folder
app.use(express.static(path.join(__dirname, '../client')));

// API route
app.post('/api/ask', (req, res) => {
  const { message } = req.body;
  const lowerMsg = message.toLowerCase();

  const match = faqs.find(faq =>
    faq.keywords.some(kw => lowerMsg.includes(kw))
  );

  if (match) {
    res.json({ reply: match.answer });
  } else {
    res.json({ reply: "Sorry, I didn’t understand that. Please contact support." });
  }
});

// Serve index.html on root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
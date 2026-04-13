const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

const content = JSON.parse(fs.readFileSync(path.join(__dirname, 'content.json'), 'utf-8'));

app.get('/api/content', (req, res) => {
  res.json(content);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`LevelUp ESL running on port ${PORT}`);
});

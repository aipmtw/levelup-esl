const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  const content = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'content.json'), 'utf-8')
  );
  res.json(content);
};

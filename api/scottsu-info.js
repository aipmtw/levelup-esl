const fs = require('fs');
const path = require('path');

let knowledgeBase;
try {
  knowledgeBase = JSON.parse(
    fs.readFileSync(path.join(__dirname, '..', 'public', 'scottsu', 'knowledge-base.json'), 'utf-8')
  );
} catch {
  knowledgeBase = null;
}

module.exports = async (req, res) => {
  if (!knowledgeBase) {
    return res.status(500).json({ error: 'Knowledge base not found' });
  }
  res.json(knowledgeBase);
};

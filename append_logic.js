const fs = require('fs');
let c = fs.readFileSync('app.js', 'utf8');
c = c.replace(/if \(tabId === 'squad'\) renderSquad\(\);\r?\n}/g, "if (tabId === 'squad') renderSquad();\n    if (tabId === 'comp') window.renderCompLeaderboard();\n}");
fs.writeFileSync('app.js', c, 'utf8');
console.log('Hook replaced!');

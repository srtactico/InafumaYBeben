const fs = require('fs');
const content = fs.readFileSync('app.js');
const lines = fs.readFileSync('app.js', 'utf8').split('\n');

for (let i = 4710; i < 4730; i++) {
  console.log(`Line ${i}:`, lines[i] ? lines[i].substring(0, 30).split('').map(c => c.charCodeAt(0)) : 'undefined');
}

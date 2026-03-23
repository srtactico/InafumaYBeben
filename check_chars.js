const fs = require('fs');
const content = fs.readFileSync('app.js');
const text = content.toString('utf8');
const lines = text.split('\n');

const chunk = lines.slice(18, 136).join('\n');
try {
    const wrapped = `[\n${chunk}\n]`;
    eval(wrapped);
    console.log("SUCCESS: Entire block evaluates perfectly as a JSON array.");
} catch(e) {
    console.log("ERROR parsing combined block: " + e.message);
}

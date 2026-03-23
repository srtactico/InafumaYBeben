const fs = require('fs');
const lines = fs.readFileSync('app.js', 'utf8').split(/\r?\n/);
const startIndex = lines.findIndex(l => l.includes("document.getElementById('register-form').addEventListener('submit'"));

if (startIndex !== -1) {
    console.log("--- Register Logic ---");
    for (let i = startIndex; i < Math.min(startIndex + 35, lines.length); i++) {
        console.log(i + ": " + lines[i]);
    }
} else {
    console.log("Could not find register form listener");
}

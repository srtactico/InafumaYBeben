const fs = require('fs');
const lines = fs.readFileSync('app.js', 'utf8').split(/\r?\n/);
const startIndex = lines.findIndex(l => l.includes("document.getElementById('login-form').addEventListener('submit'"));

console.log("--- Login Logic ---");
if (startIndex !== -1) {
    for (let i = startIndex; i < Math.min(startIndex + 25, lines.length); i++) {
        console.log(i + ": " + lines[i]);
    }
} else {
    console.log("Could not find login form listener");
}

console.log("\n--- Custom Popup Function? ---");
const popupIndex = lines.findIndex(l => l.includes('function showPopup') || l.includes('function customAlert'));
if (popupIndex !== -1) {
    console.log("Found popup logic at line:", popupIndex);
} else {
    console.log("No standard custom popup function found.");
}

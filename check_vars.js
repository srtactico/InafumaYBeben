const fs = require('fs');
const content = fs.readFileSync('app.js', 'utf8');

console.log("toggleAuth:", content.includes('toggleAuth'));
console.log("togglePasswordVisibility:", content.includes('togglePasswordVisibility'));

// Check for top-level code that might crash
console.log("First 20 lines of code:");
const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0);
for (let i = 0; i < Math.min(20, lines.length); i++) {
    console.log(i + ': ' + lines[i]);
}

// See if there's any document.getElementById outside a function or DOMContentLoaded
let nullCrashMatches = 0;
lines.forEach((line, i) => {
    if (line.includes('document.getElementById') && !line.includes('function') && !line.includes('=>') && !line.includes('//')) {
        // Just print lines testing getElementById
        if (i < 30) console.log(`Suspicious line ${i}: ${line}`);
    }
});

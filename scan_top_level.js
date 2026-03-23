const fs = require('fs');
const lines = fs.readFileSync('app.js', 'utf8').split(/\r?\n/).slice(0, 535);

let inBlockCount = 0;
lines.forEach((line, i) => {
    const l = line.trim();
    if (!l || l.startsWith('//')) return;
    
    // Count brackets
    const opens = (l.match(/\{/g) || []).length;
    const closes = (l.match(/\}/g) || []).length;
    
    // Quick hack for brackets inside regex or strings ignored for simplicity
    
    if (inBlockCount === 0) {
        // This line runs at top level!
        if (l.includes('addEventListener') || l.includes('classList') || l.includes('style.')) {
            console.log(`Potential crash at line ${i+1}: ${l}`);
        }
    }
    
    inBlockCount += opens - closes;
});

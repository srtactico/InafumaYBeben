const fs = require('fs');
let c = fs.readFileSync('app.js', 'utf8');

c = c.replace(/Ã“/g, 'Ó');
c = c.replace(/Ã£/g, 'ã');
c = c.replace(/Ãš/g, 'Ú');
c = c.replace(/ÃƒÂ©/g, 'é');
c = c.replace(/Ã¢S\s*/g, '');
c = c.replace(/Ã¢a\s*Ã¯Â¸Â/g, 'VS');
c = c.replace(/Ãƒ³/g, 'ó');
c = c.replace(/Ãƒ¡/g, 'á');
c = c.replace(/Ã‚¿/g, '¿');
c = c.replace(/ÃƒÂ±/g, 'ñ');
c = c.replace(/\$\{isPrivate \? 'Ã°x\s*' : 'Ã°x R Â '\}/g, "${isPrivate ? 'Privado' : '-'}");
c = c.replace(/Ã°x\s*/g, '');

fs.writeFileSync('app.js', c, 'utf8');
console.log('Fixed encodings!');

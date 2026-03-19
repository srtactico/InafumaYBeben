const fs = require('fs');
const lines = fs.readFileSync('app.js', 'utf8').split('\n');

lines[5462] = lines[5462].replace(/Torneo creado con.*/, 'Torneo creado con éxito.");');
lines[5485] = lines[5485].replace(/showConfirm.*/, 'showConfirm("¿Seguro que quieres eliminar tu torneo?", async () => {');
lines[5398] = lines[5398].replace(/\$\{isPrivate.*\}/, "${isPrivate ? 'Privado' : '-'}");
lines[5369] = lines[5369].replace(/UNIRSE.*/, 'UNIRSE</button>\`;');
lines[5540] = lines[5540].replace(/return showAlert.*/, 'return showAlert("Contraseña incorrecta.");');

fs.writeFileSync('app.js', lines.join('\n'));
console.log('Fixed alerts & encodings by index!');

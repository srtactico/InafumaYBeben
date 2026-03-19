const fs = require('fs');
const buf = fs.readFileSync('app.js');

const seq = Buffer.from([0x2F, 0x00, 0x2A, 0x00, 0x20, 0x00]); // "/\0*\0 \0"
const idx = buf.indexOf(seq);

if (idx !== -1) {
    const goodPart = buf.subarray(0, idx);
    const badPart = buf.subarray(idx);
    
    let decoded = '';
    for (let i = 0; i < badPart.length; i++) {
        if (badPart[i] !== 0x00) {
            decoded += String.fromCharCode(badPart[i]);
        }
    }
    
    const fixedBuf = Buffer.concat([goodPart, Buffer.from(decoded, 'utf8')]);
    fs.writeFileSync('app.js', fixedBuf);
    console.log('Archivo app.js corregido exitosamente. Corrupción empezaba en el índice:', idx);
} else {
    // Si no encuentra la secuencia exacta, simplemente quita los bytes nulos del archivo entero
    // Esto es seguro si el archivo original no debe contener bytes nulos.
    let count = 0;
    const cleanBuf = Buffer.alloc(buf.length);
    let j = 0;
    for (let i = 0; i < buf.length; i++) {
        if (buf[i] !== 0x00) {
            cleanBuf[j++] = buf[i];
        } else {
            count++;
        }
    }
    fs.writeFileSync('app.js', cleanBuf.subarray(0, j));
    console.log('Se eliminaron ' + count + ' bytes nulos de app.js.');
}

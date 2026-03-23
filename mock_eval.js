const fs = require('fs');
const code = fs.readFileSync('app.js', 'utf8');

global.window = global;
global.document = {
    getElementById: () => ({ classList: { add:()=>{}, remove:()=>{}, toggle:()=>{} }, style: {}, innerHTML: '', textContent: '', addEventListener:()=>{} }),
    body: { classList: { remove:()=>{} } },
    createElement: () => ({ style: {} }),
    querySelector: () => null
};
global.localStorage = { getItem: () => null, setItem: () => {} };
global.navigator = { language: 'es-ES' };
global.firebase = {
    initializeApp: () => {},
    auth: () => ({ onAuthStateChanged: () => {}, signInWithEmailAndPassword: () => Promise.resolve() }),
    firestore: () => ({ collection: () => ({ doc: () => ({ set: () => Promise.resolve(), get: () => Promise.resolve({exists:true, data:()=>({})}) }) }) })
};
global.io = () => ({ on: () => {}, emit: () => {} });
global.Audio = class { constructor() { this.play = () => {}; this.pause = () => {}; } };

try {
    eval(code);
    console.log("No top-level crash during evaluation!");
} catch(e) {
    console.error("RUNTIME CRASH:");
    console.error(e.message);
    console.error(e.stack);
}

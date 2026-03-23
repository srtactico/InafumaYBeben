const fs = require('fs');
const { JSDOM } = require('jsdom');

const code = fs.readFileSync('app.js', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');

const dom = new JSDOM(html, {
    url: "http://localhost/",
    runScripts: "dangerously",
    resources: "usable"
});

// Mock Firebase, since it's loaded via CDN in index.html
dom.window.firebase = {
    initializeApp: () => {},
    auth: () => ({
        onAuthStateChanged: (cb) => { setTimeout(() => cb({ uid: '123' }), 10); },
        signInWithEmailAndPassword: () => Promise.resolve(),
        createUserWithEmailAndPassword: () => Promise.resolve()
    }),
    firestore: () => ({
        collection: () => ({
            doc: () => ({
                set: () => Promise.resolve(),
                get: () => Promise.resolve({ exists: true, data: () => ({}) })
            })
        })
    })
};

dom.window.io = () => ({
    on: () => {},
    emit: () => {}
});

// Inject code manually into JSDOM and catch error
try {
    // We execute it in the context of the JSDOM window
    const scriptEl = dom.window.document.createElement('script');
    scriptEl.textContent = `
        try {
            ${code}
        } catch(e) {
            window.__sandboxError = e;
        }
    `;
    dom.window.document.body.appendChild(scriptEl);

    if (dom.window.__sandboxError) {
        console.error("Runtime Error Caught:", dom.window.__sandboxError.message);
        console.error(dom.window.__sandboxError.stack);
    } else {
        console.log("No runtime error caught in JS execution!");
        console.log("toggleAuth exists:", !!dom.window.toggleAuth);
        console.log("togglePasswordVisibility exists:", !!dom.window.togglePasswordVisibility);
    }
} catch (e) {
    console.error("Failed to inject script:", e.message);
}

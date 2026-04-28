const fs = require('fs');
const path = require('path');

const appJsPath = path.join(__dirname, 'app.js');
const indexHtmlPath = path.join(__dirname, 'index.html');

// Helper to read and write with correct encoding detection
function readFileAuto(filePath) {
    const buffer = fs.readFileSync(filePath);
    if (buffer.length >= 2 && buffer[0] === 0xFF && buffer[1] === 0xFE) {
        return { content: buffer.toString('utf16le'), encoding: 'utf16le' };
    }
    return { content: buffer.toString('utf8'), encoding: 'utf8' };
}

function writeFileAuto(filePath, content, encoding) {
    if (encoding === 'utf16le') {
        const buf = Buffer.from(content, 'utf16le');
        // Add BOM if not present (although Buffer.from('utf16le') doesn't add BOM automatically, 
        // we might need to prepend it, but let's just write what was there or what's standard)
        // Actually, if we just use fs.writeFileSync with utf16le it works.
        const outBuf = Buffer.alloc(buf.length + 2);
        outBuf[0] = 0xFF;
        outBuf[1] = 0xFE;
        buf.copy(outBuf, 2);
        fs.writeFileSync(filePath, outBuf);
    } else {
        fs.writeFileSync(filePath, content, 'utf8');
    }
}

// 1. Modify index.html
let htmlData = readFileAuto(indexHtmlPath);
let html = htmlData.content;

const friendSearchHtmlOld = `<h3 class="text-xs text-blue-400 font-bold uppercase mb-3 tracking-widest">Añadir Mánager</h3>
                        <div class="flex flex-col gap-2 relative">
                            <input type="text" id="friend-search-input" class="input-fm text-xs"
                                placeholder="Nombre de usuario a buscar...">
                            <button onclick="searchFriends()" id="btn-search-friends"
                                class="btn-action w-full py-2 text-[10px] tracking-widest bg-blue-600 hover:bg-blue-500 transition">
                                BUSCAR MÁNAGER
                            </button>`;
                            
const friendSearchHtmlNew = `<h3 class="text-xs text-blue-400 font-bold uppercase mb-3 tracking-widest">Añadir Mánager</h3>
                        <div class="mb-4 text-center border-b border-[#313145] pb-3">
                            <div class="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Tu Código de Amigo</div>
                            <div id="my-friend-code" class="text-xl font-mono text-yellow-400 font-bold select-all cursor-pointer" onclick="navigator.clipboard.writeText(this.innerText); showAlert('Código copiado');">--------</div>
                        </div>
                        <div class="flex flex-col gap-2 relative">
                            <input type="text" id="friend-search-input" class="input-fm text-xs text-center font-mono uppercase"
                                placeholder="CÓDIGO (8 CARACT.)" maxlength="8">
                            <button onclick="searchFriends()" id="btn-search-friends"
                                class="btn-action w-full py-2 text-[10px] tracking-widest bg-blue-600 hover:bg-blue-500 transition">
                                AÑADIR POR CÓDIGO
                            </button>`;

if(html.includes(friendSearchHtmlOld)) {
    html = html.replace(friendSearchHtmlOld, friendSearchHtmlNew);
    console.log('index.html: Replaced search UI');
} else {
    // try line by line or regex
    html = html.replace(/<input type="text" id="friend-search-input".*?>/s, 
        `<div class="mb-4 text-center border-b border-[#313145] pb-3">
                            <div class="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Tu Código de Amigo</div>
                            <div id="my-friend-code" class="text-xl font-mono text-yellow-400 font-bold select-all cursor-pointer" onclick="navigator.clipboard.writeText(this.innerText); showAlert('Código copiado');">--------</div>
                        </div>\n<input type="text" id="friend-search-input" class="input-fm text-xs text-center font-mono uppercase" placeholder="CÓDIGO DE AMIGO (8 CARACT.)" maxlength="8">`);
    html = html.replace(/>\s*BUSCAR MÁNAGER\s*<\/button>/, '>AÑADIR POR CÓDIGO</button>');
    console.log('index.html: Replaced search UI (regex fallback)');
}

// FIX: â€” string in HTML
html = html.replace(/â€”/g, '—');

writeFileAuto(indexHtmlPath, html, htmlData.encoding);


// 2. Modify app.js
let appJsData = readFileAuto(appJsPath);
let app = appJsData.content;

// Remove old showSubpage infinite wrap bug
app = app.replace(/const originalShowSubpageFriends = window\.showSubpage;[\s\S]*?window\.showSubpage = async function \(pageId\) \{[\s\S]*?if \(originalShowSubpageFriends\) originalShowSubpageFriends\(pageId\);\n\}/, '');
app = app.replace(/if \(!window\._friendSubpageHooked\) \{[\s\S]*?window\._friendSubpageHooked = true;\n\}/, '');

// Append safe showSubpage wrapper at the end or before updateUI
const safeShowSubpage = `
if (!window._friendSubpageHooked) {
    const originalShowSubpage = window.showSubpage;
    window.showSubpage = async function(pageId) {
        if (pageId === 'friends') {
            if (auth.currentUser) {
                try {
                    const doc = await db.collection('users').doc(auth.currentUser.uid).get();
                    if(doc.exists) {
                        const data = doc.data();
                        state.friends = data.friends || [];
                        state.friendRequests = data.friendRequests || [];
                        renderFriendsTab();
                    }
                    // Inject friend code
                    const friendCode = auth.currentUser.uid.substring(0, 8).toUpperCase();
                    const el = document.getElementById('my-friend-code');
                    if(el) el.innerText = friendCode;
                } catch(e) { console.error("Error fetching friends data:", e); }
            }
        }
        if (originalShowSubpage) originalShowSubpage(pageId);
    };
    window._friendSubpageHooked = true;
}
`;
app += '\\n' + safeShowSubpage;


// Replace acceptFriendRequest
const acceptFriendRequestOld = `window.acceptFriendRequest = async function (reqUid, reqUsername) {
    if (!state || !auth.currentUser) return;
    try {
        state.friendRequests = state.friendRequests.filter(r => r.uid !== reqUid);
        const myNewFriend = { uid: reqUid, username: reqUsername, addedAt: Date.now()  };
        state.friends.push(myNewFriend);`;
const acceptFriendRequestNew = `window.acceptFriendRequest = async function (reqUid, reqUsername) {
    if (!state || !auth.currentUser) return;
    try {
        state.friendRequests = state.friendRequests || [];
        state.friends = state.friends || [];
        state.friendRequests = state.friendRequests.filter(r => r.uid !== reqUid);
        const myNewFriend = { uid: reqUid, username: reqUsername, addedAt: Date.now()  };
        state.friends.push(myNewFriend);`;
app = app.replace(acceptFriendRequestOld, acceptFriendRequestNew);

// Replace searchFriends
const searchFriendsRegex = /window\.searchFriends = async function \(\) \{[\s\S]*?resultsContainer\.classList\.remove\('hidden'\);\n\}/;
const searchFriendsNew = `window.searchFriends = async function () {
    const searchInput = document.getElementById('friend-search-input');
    const resultsContainer = document.getElementById('friend-search-results');
    
    if (!searchInput || !resultsContainer) return;
    
    const term = searchInput.value.trim().toUpperCase();
    if (term.length !== 8) {
        return showAlert("El código de amigo debe tener 8 caracteres.");
    }
    if (term === auth.currentUser.uid.substring(0, 8).toUpperCase()) {
        return showAlert("No puedes añadirte a ti mismo.");
    }

    resultsContainer.innerHTML = '<div class="text-[10px] text-slate-400 text-center italic">Buscando...</div>';
    resultsContainer.classList.remove('hidden');

    try {
        // Since we don't have the exact UID, we must fetch users and find the one whose UID starts with 'term'
        // But since UIDs are doc IDs, we can just fetch some users. Actually, getting all users might be heavy.
        // Let's do a query. We cannot query by doc.id prefix easily without \`__name__\`.
        // Let's use a workaround: get all users (assuming low scale for now, as before).
        const snap = await db.collection('users').get();
        let foundUser = null;
        let foundUid = null;
        snap.forEach(doc => {
            if(doc.id.toUpperCase().startsWith(term)) {
                foundUser = doc.data();
                foundUid = doc.id;
            }
        });

        if (!foundUser) {
            resultsContainer.innerHTML = '<div class="text-[10px] text-red-400 text-center italic">Código de amigo no encontrado.</div>';
            return;
        }

        // Auto-send friend request
        await sendFriendRequest(foundUid, foundUser.auth ? foundUser.auth.user : 'Desconocido');
        resultsContainer.innerHTML = '<div class="text-[10px] text-green-400 text-center italic">Solicitud enviada automáticamente a ' + (foundUser.auth ? foundUser.auth.user : 'Desconocido') + '!</div>';
        searchInput.value = '';

    } catch (err) {
        console.error("Error buscando amigo", err);
        resultsContainer.innerHTML = '<div class="text-[10px] text-red-500 text-center italic">Error al buscar.</div>';
    }
}`;
app = app.replace(searchFriendsRegex, searchFriendsNew);

// Fix duplicate renderFriendsTab and add SVGs
// First, delete the second renderFriendsTab
const firstRenderIndex = app.indexOf('window.renderFriendsTab = function ()');
const secondRenderIndex = app.indexOf('window.renderFriendsTab = function ()', firstRenderIndex + 100);
if(secondRenderIndex !== -1) {
    const endOfSecond = app.indexOf('};', secondRenderIndex);
    if(endOfSecond !== -1) {
        app = app.substring(0, secondRenderIndex) + app.substring(endOfSecond + 2);
        console.log('Removed duplicate renderFriendsTab');
    }
}

// Replace the buttons in the first renderFriendsTab
// old buttons:
// <button onclick="acceptFriendRequest('\${req.uid}', '\${req.username}')" class="bg-green-600 hover:bg-green-500 text-white p-1 rounded transition text-xs">   </button>
// <button onclick="rejectFriendRequest('\${req.uid}')" class="bg-red-600 hover:bg-red-500 text-white p-1 rounded transition text-xs">   </button>
app = app.replace(
    /class="bg-green-600 hover:bg-green-500 text-white p-1 rounded transition text-xs">\s*<\/button>/g, 
    \`class="bg-green-600 hover:bg-green-500 text-white p-1 rounded transition text-xs"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg></button>\`
);
app = app.replace(
    /class="bg-red-600 hover:bg-red-500 text-white p-1 rounded transition text-xs">\s*<\/button>/g, 
    \`class="bg-red-600 hover:bg-red-500 text-white p-1 rounded transition text-xs"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg></button>\`
);


// Replace â€” with —
app = app.replace(/â€”/g, '—');


writeFileAuto(appJsPath, app, appJsData.encoding);
console.log('app.js modified successfully');

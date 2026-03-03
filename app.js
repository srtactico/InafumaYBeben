const firebaseConfig = {
    apiKey: "AIzaSyBvlnwg6VwX-U5yqjiG350ERFtc6cGrNlA",
    authDomain: "inafuma-y-beben-10cfc.firebaseapp.com",
    projectId: "inafuma-y-beben-10cfc",
    storageBucket: "inafuma-y-beben-10cfc.firebasestorage.app",
    messagingSenderId: "745321582772",
    appId: "1:745321582772:web:eb3f39dcb80df0d6eec7e1",
    measurementId: "G-JZGK0D0JMS"
};

// Arrancamos los motores de la nube
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
/* =========================================================================
   BASE DE DATOS: JUGADORES Y AVATARES
   ========================================================================= */
function getAvatar(name) { return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&bold=true`; }

const PLAYERS_DB = [
    { id: 101, name: "Lionel Messi", pos: "DEL", pac: 80, sho: 93, pas: 94, def: 30, phy: 65, rep: 5000, priceBasic: 150000000, pricePrem: 12000, img: "https://us-tuna-sounds-images.voicemod.net/f0a3dd8a-eea8-4f46-9e4b-26637d97899c-1682820619597.jpeg" },
    { id: 102, name: "Cristiano Ronaldo", pos: "DEL", pac: 82, sho: 95, pas: 80, def: 35, phy: 85, rep: 5000, priceBasic: 140000000, pricePrem: 11000, img: "https://i.pinimg.com/236x/fc/16/9c/fc169c4de125f69c56bf67c9ef03d931.jpg" },
    { id: 103, name: "Kylian Mbappé", pos: "DEL", pac: 99, sho: 92, pas: 85, def: 35, phy: 78, rep: 4500, priceBasic: 135000000, pricePrem: 10000, img: "https://pbs.twimg.com/media/FUMiCSJXEAAHdvH.jpg" },
    { id: 201, name: "Kevin De Bruyne", pos: "MED", pac: 72, sho: 85, pas: 98, def: 65, phy: 75, rep: 4800, priceBasic: 110000000, pricePrem: 9000, img: "https://i.redd.it/ekbnqb2za2y51.jpg" },
    { id: 301, name: "Virgil van Dijk", pos: "DEF", pac: 78, sho: 60, pas: 75, def: 95, phy: 90, rep: 4500, priceBasic: 95000000, pricePrem: 7800, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGWdbul4YolKhJhyNFg6s3G57zUScIbryrtw&s" },
    { id: 401, name: "Thibaut Courtois", pos: "POR", pac: 40, sho: 20, pas: 65, def: 95, phy: 88, rep: 4000, priceBasic: 85000000, pricePrem: 6500, img: "https://www.clarin.com/2022/05/28/-h5dvaCni_360x240__1.jpg" },
    { id: 104, name: "Vini Jr.", pos: "DEL", pac: 95, sho: 86, pas: 85, def: 30, phy: 70, rep: 3500, priceBasic: 95000000, pricePrem: 7500, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRt8XM1bPlLnxJiwtXA-dRI0m2_JFiF06AOCw&s" },
    { id: 202, name: "Jude Bellingham", pos: "MED", pac: 82, sho: 85, pas: 88, def: 78, phy: 85, rep: 4500, priceBasic: 105000000, pricePrem: 8500, img: "https://img.asmedia.epimg.net/resizer/v2/A43ZCIYQ45GOPD6RSU4BMQDJKA.jpg?auth=28955647f8c2746ddacbcaef794724da6461afeb5818292923b1c8266be15a5e&width=360" },
    { id: 302, name: "Antonio Rüdiger", pos: "DEF", pac: 85, sho: 40, pas: 70, def: 90, phy: 92, rep: 3500, priceBasic: 75000000, pricePrem: 6000, img: "https://images7.memedroid.com/images/UPLOADED575/652d60841d73b.jpeg" },
    { id: 402, name: "Alisson Becker", pos: "POR", pac: 45, sho: 25, pas: 80, def: 92, phy: 85, rep: 3000, priceBasic: 65000000, pricePrem: 5000, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUODxT9kUGcLFOAQG-xYCweQphUsebWt7whg&s" },
    { id: 105, name: "A. Griezmann", pos: "DEL", pac: 80, sho: 85, pas: 88, def: 50, phy: 70, rep: 2000, priceBasic: 55000000, pricePrem: 4500, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6Xl8wrodmxAQjKIMaHo8yXTA_1r23KaTsuw&s" },
    { id: 203, name: "Pedri González", pos: "MED", pac: 78, sho: 70, pas: 92, def: 68, phy: 65, rep: 3000, priceBasic: 75000000, pricePrem: 6000, img: "https://esportbase.valenciaplaza.com/wp-content/uploads/2021/08/E8MPi_LWUAY2YvY.jpg" },
    { id: 304, name: "Dani Carvajal", pos: "DEF", pac: 80, sho: 50, pas: 80, def: 82, phy: 80, rep: 800, priceBasic: 20000000, pricePrem: 1500, img: "https://pbs.twimg.com/media/GSeKCF4XMAAILjg.jpg" },
    { id: 403, name: "Unai Simón", pos: "POR", pac: 45, sho: 20, pas: 75, def: 85, phy: 75, rep: 400, priceBasic: 12000000, pricePrem: 900, img: "https://assets.goal.com/images/v3/blt58f6b3a15aac644b/0b605ad106ff7459d79745dd71267d9de5783cb3.png?auto=webp&format=pjpg&width=3840&quality=60" },
    { id: 506, name: "Neymar Jr.", pos: "DEL", pac: 88, sho: 90, pas: 90, def: 40, phy: 80, rep: 5000, priceBasic: 135000000, pricePrem: 10500, img: "https://peopleenespanol.com/thmb/mupW5fAgLVCwjZHm_CyhZ4kXaNE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/memes-de-neymar23-00f89d757f3c46279829547ff5eaf52b.png" },
    { id: 507, name: "Luis Suarez", pos: "DEL", pac: 85, sho: 88, pas: 85, def: 50, phy: 85, rep: 5000, priceBasic: 130000000, pricePrem: 10000, img: "https://i.pinimg.com/736x/37/04/b0/3704b045926c5754515afcb51bc5cb37.jpg" },
    // Nivel Base Inicial (Plantilla de Regalo)
    { id: 106, name: "Joselu", pos: "DEL", pac: 65, sho: 82, pas: 68, def: 40, phy: 82, rep: 0, priceBasic: 5000000, pricePrem: 400, img: "https://estaticos-cdn.prensaiberica.es/clip/916e8357-aa8e-450f-95d7-0fd46b11ccf1_source-aspect-ratio_default_0.jpg" },
    { id: 107, name: "Borja Iglesias", pos: "DEL", pac: 60, sho: 80, pas: 65, def: 35, phy: 85, rep: 0, priceBasic: 4000000, pricePrem: 300, img: "https://static.eldiario.es/clip/dc7c24bc-4e9b-46fa-b0d7-bd9080e2986a_16-9-discover-aspect-ratio_default_1134172.jpg" },
    { id: 108, name: "Hugo Duro", pos: "DEL", pac: 75, sho: 75, pas: 65, def: 40, phy: 75, rep: 0, priceBasic: 3000000, pricePrem: 200, img: "https://image.ondacero.es/clipping/cmsimages02/2024/01/23/BA3CE66A-7976-4522-95D4-3B094E6A5BCB/hugo-duro_103.jpg?crop=600,450,x137,y0&width=1200&height=900&optimize=low&format=webply" },
    { id: 204, name: "Sergi Darder", pos: "MED", pac: 68, sho: 75, pas: 80, def: 70, phy: 70, rep: 0, priceBasic: 4000000, pricePrem: 300, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEyOd-ScVKgWFmy4Uwuf5Q20jDrEOFvmHi4w&s" },
    { id: 205, name: "Isco Alarcón", pos: "MED", pac: 62, sho: 78, pas: 85, def: 45, phy: 60, rep: 0, priceBasic: 5000000, pricePrem: 400, img: "https://www.mundodeportivo.com/files/og_thumbnail/uploads/2021/01/20/60e70648d9fe5.jpeg" },
    { id: 206, name: "Pepelu", pos: "MED", pac: 60, sho: 65, pas: 78, def: 75, phy: 75, rep: 0, priceBasic: 2500000, pricePrem: 150, img: "https://www.valenciacf.com/public/Image/2023/12/nr30b5l0gsuquemyeyxbqsuc2g74drmjrmwvgont4jasseos8edirodhdhuwssn8.jpg" }, -
    { id: 207, name: "Óscar Trejo", pos: "MED", pac: 65, sho: 70, pas: 78, def: 50, phy: 60, rep: 0, priceBasic: 1500000, pricePrem: 100, img: "https://killerasturias.com/sites/default/files/2021-12/trejo.jpeg" },
    { id: 305, name: "Pau Cubarsí", pos: "DEF", pac: 75, sho: 40, pas: 78, def: 80, phy: 75, rep: 0, priceBasic: 8000000, pricePrem: 600, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHJk1Gw8cjNu4w5mlv3kCZFNJi3wZhCeMj8g&s" },
    { id: 306, name: "David García", pos: "DEF", pac: 65, sho: 45, pas: 60, def: 82, phy: 85, rep: 0, priceBasic: 4500000, pricePrem: 350, img: "https://img.a.transfermarkt.technology/portrait/big/298589-1740664950.jpg?lm=1" },
    { id: 307, name: "Pablo Maffeo", pos: "DEF", pac: 82, sho: 55, pas: 70, def: 75, phy: 78, rep: 0, priceBasic: 2500000, pricePrem: 200, img: "https://i.pinimg.com/474x/16/3c/ff/163cffab021629302f8314665c2c1582.jpg" },
    { id: 308, name: "Jesús Navas", pos: "DEF", pac: 75, sho: 60, pas: 80, def: 70, phy: 60, rep: 0, priceBasic: 1500000, pricePrem: 100, img: "https://pbs.twimg.com/media/Fwgt6PSXwAEvYWv.jpg" },
    { id: 309, name: "Harry Maguire", pos: "DEF", pac: 48, sho: 50, pas: 65, def: 78, phy: 85, rep: 0, priceBasic: 2000000, pricePrem: 150, img: "https://pics.craiyon.com/2023-09-13/fd5957a5268b45d4b5b0640c78980701.webp" },
    { id: 404, name: "David Soria", pos: "POR", pac: 35, sho: 10, pas: 60, def: 80, phy: 78, rep: 0, priceBasic: 3000000, pricePrem: 200, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRE2H0vymmNHD9tmRyLPodRo7GwSRBne7pUg&s" },
    { id: 405, name: "P. Gazzaniga", pos: "POR", pac: 42, sho: 15, pas: 68, def: 78, phy: 75, rep: 0, priceBasic: 2000000, pricePrem: 150, img: "https://i.pinimg.com/736x/a3/97/b5/a397b5f830894abb925a36ae74652e35.jpg" }
];

function calcPlayerOVR(p) {
    if (p.pos === 'DEL') return Math.round((p.pac * 0.20) + (p.sho * 0.45) + (p.phy * 0.15) + (p.pas * 0.20));
    if (p.pos === 'MED') return Math.round((p.pac * 0.10) + (p.pas * 0.45) + (p.def * 0.25) + (p.phy * 0.20));
    if (p.pos === 'DEF') return Math.round((p.pac * 0.15) + (p.def * 0.50) + (p.phy * 0.25) + (p.pas * 0.10));
    if (p.pos === 'POR') return Math.round((p.def * 0.70) + (p.phy * 0.20) + (p.pas * 0.10));
    return 50;
}

// Inicializar DB 
PLAYERS_DB.forEach(p => {
    p.ovr = calcPlayerOVR(p);
    p.morale = 100;
    p.con = 100;
});

/* =========================================================================
   EQUIPOS IA (LA LIGA TUSSI)
   ========================================================================= */
const AI_TEAMS = [
    { name: "Madrid Kings", ovr: 88, c1: "#ffffff", c2: "#e2e8f0", shape: "shape-shield" },
    { name: "Catalunya AC", ovr: 87, c1: "#b91c1c", c2: "#1d4ed8", shape: "shape-shield" },
    { name: "Atletico Titan", ovr: 85, c1: "#ef4444", c2: "#ffffff", shape: "shape-circle" },
    { name: "Basque Lions", ovr: 82, c1: "#dc2626", c2: "#ffffff", shape: "shape-hexagon" },
    { name: "Sevilla Sur", ovr: 80, c1: "#ffffff", c2: "#dc2626", shape: "shape-shield" },
    { name: "Valencia Bats", ovr: 78, c1: "#ffffff", c2: "#0f172a", shape: "shape-circle" },
    { name: "Galicia CF", ovr: 76, c1: "#60a5fa", c2: "#ffffff", shape: "shape-shield" },
    { name: "Betis Norte", ovr: 75, c1: "#16a34a", c2: "#ffffff", shape: "shape-circle" },
    { name: "Villarreal Sun", ovr: 74, c1: "#eab308", c2: "#ca8a04", shape: "shape-shield" },
    { name: "Real Sebastian", ovr: 73, c1: "#1d4ed8", c2: "#ffffff", shape: "shape-circle" },
    { name: "Celta Sky", ovr: 71, c1: "#93c5fd", c2: "#ffffff", shape: "shape-shield" },
    { name: "Mallorca Red", ovr: 70, c1: "#ef4444", c2: "#0f172a", shape: "shape-hexagon" },
    { name: "Osasuna Bulls", ovr: 68, c1: "#991b1b", c2: "#1e293b", shape: "shape-shield" },
    { name: "Alaves Blue", ovr: 67, c1: "#1e3a8a", c2: "#ffffff", shape: "shape-circle" },
    { name: "Rayo Thunder", ovr: 66, c1: "#ffffff", c2: "#dc2626", shape: "shape-shield" },
    { name: "Getafe Light", ovr: 65, c1: "#2563eb", c2: "#1e40af", shape: "shape-circle" },
    { name: "Las Palmas FC", ovr: 64, c1: "#fde047", c2: "#1e293b", shape: "shape-shield" },
    { name: "Granada City", ovr: 63, c1: "#b91c1c", c2: "#ffffff", shape: "shape-hexagon" },
    { name: "Cadiz Yellows", ovr: 62, c1: "#facc15", c2: "#1e3a8a", shape: "shape-shield" }
];

function initLeague() {
    let league = [{ name: state.team.name, isUser: true, pld: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 }];
    AI_TEAMS.forEach(ai => league.push({ name: ai.name, isUser: false, ovr: ai.ovr, pld: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0, badge: ai }));
    return league;
}

/* =========================================================================
   SISTEMA DE ALERTAS Y SEGURIDAD DOM
   ========================================================================= */
window.showAlert = function (msg) {
    const alertModal = document.getElementById('custom-alert');
    if (alertModal) {
        document.getElementById('alert-message').textContent = msg;
        alertModal.classList.remove('hidden');
    } else {
        alert(msg); // Fallback por si falta el HTML
    }
}
window.closeAlert = function () {
    const alertModal = document.getElementById('custom-alert');
    if (alertModal) alertModal.classList.add('hidden');
}

let confirmCallback = null;
window.showConfirm = function (msg, callback) {
    const confirmModal = document.getElementById('custom-confirm');
    if (confirmModal) {
        document.getElementById('confirm-message').textContent = msg;
        confirmCallback = callback;
        confirmModal.classList.remove('hidden');
    } else {
        if (confirm(msg)) callback(); // Fallback por si falta el HTML
    }
}
window.closeConfirm = function (result) {
    const confirmModal = document.getElementById('custom-confirm');
    if (confirmModal) confirmModal.classList.add('hidden');
    if (result && confirmCallback) confirmCallback();
}

/* =========================================================================
   SISTEMA DE LIMPIEZA DE NaNs (VITAL PARA CUENTAS ANTIGUAS)
   ========================================================================= */
let state = null;

function cleanState(s) {
    if (!s) return null;

    // Convertir todo a números seguros para borrar los NaNs
    if (!s.stats) s.stats = {};
    s.stats.wins = isNaN(parseInt(s.stats.wins)) ? 0 : parseInt(s.stats.wins);
    s.stats.draws = isNaN(parseInt(s.stats.draws)) ? 0 : parseInt(s.stats.draws);
    s.stats.losses = isNaN(parseInt(s.stats.losses)) ? 0 : parseInt(s.stats.losses);
    s.stats.matches = isNaN(parseInt(s.stats.matches)) ? 0 : parseInt(s.stats.matches);
    s.stats.rep = isNaN(parseInt(s.stats.rep)) ? 0 : parseInt(s.stats.rep);
    s.stats.matchday = isNaN(parseInt(s.stats.matchday)) ? 1 : Math.max(1, parseInt(s.stats.matchday));
    s.stats.goals = isNaN(parseInt(s.stats.goals)) ? 0 : parseInt(s.stats.goals);
    s.stats.trophies = isNaN(parseInt(s.stats.trophies)) ? 0 : parseInt(s.stats.trophies);

    // Economía
    if (!s.economy) s.economy = { coins: 50000000, premium: 0 };
    if (isNaN(parseInt(s.economy.coins))) s.economy.coins = 50000000;
    if (isNaN(parseInt(s.economy.premium))) s.economy.premium = 0;

    // Liga y Equipos IA
    if (!s.league || s.league.length < 20) {
        s.league = [{ name: s.team ? s.team.name : "Tú", isUser: true, pld: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 }];
        AI_TEAMS.forEach(ai => s.league.push({ name: ai.name, isUser: false, ovr: ai.ovr, pld: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0, badge: ai }));
    } else {
        s.league.forEach(t => { if (!t.isUser && !t.badge) t.badge = AI_TEAMS.find(a => a.name === t.name) || AI_TEAMS[0]; });
    }

    if (!s.flags) s.flags = { canTrain: true, canTalk: true };
    if (!s.playedTeams || !Array.isArray(s.playedTeams)) s.playedTeams = [];
    if (!s.history) s.history = {};
    if (!s.activeBets) s.activeBets = [];
    if (!s.nextFixtures) s.nextFixtures = [];

    // Plantilla a prueba de errores
    if (!s.roster || s.roster.length < 11) {
        const initialIDs = [404, 309, 308, 307, 306, 207, 206, 205, 108, 107, 106];
        s.roster = initialIDs.map(id => JSON.parse(JSON.stringify(PLAYERS_DB.find(p => p.id === id) || PLAYERS_DB[0])));
    }
    s.roster.forEach(p => { if (p.con === undefined) p.con = 100; if (p.morale === undefined) p.morale = 100; });

    if (!s.lineup || s.lineup.length !== 11) s.lineup = s.roster.slice(0, 11).map(p => p.id);
    if (!s.formation) s.formation = '4-4-2';

    // Asegurar estructura del escudo del equipo de usuario
    if (s.team && !s.team.shape) {
        s.team.shape = "shape-shield";
        s.team.c1 = s.team.color || "#e11d48";
        s.team.c2 = "#1e293b";
    }

    // Forzar creación de calendario si no lo hay
    if (s.team && s.nextFixtures.length === 0) {
        generateFixtures(s);
    }

    return s;
}

window.onload = () => {
    const cookiesModal = document.getElementById('modal-cookies');
    if (!localStorage.getItem('inafuma_cookies') && cookiesModal) cookiesModal.classList.remove('hidden');

    // Escuchar cambios de autenticación de Firebase
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            try {
                const doc = await db.collection('users').doc(user.uid).get();
                if (doc.exists) {
                    state = cleanState(doc.data());
                }
            } catch (err) {
                console.error('Error al cargar estado desde Firestore:', err);
            }
        }
        routeView();
    });
};

function saveState() {
    if (!state) return;
    const user = auth.currentUser;
    if (user) {
        // Subir el estado completo a Firestore
        db.collection('users').doc(user.uid).set(JSON.parse(JSON.stringify(state)))
            .catch(err => console.error('Error al guardar en Firestore:', err));
    }
    updateUI();
}

window.acceptCookies = function () {
    localStorage.setItem('inafuma_cookies', 'true');
    const cookiesModal = document.getElementById('modal-cookies');
    if (cookiesModal) cookiesModal.classList.add('hidden');
}

/* =========================================================================
   SISTEMA DE LOGIN, REGISTRO Y CLUB
   ========================================================================= */
window.toggleAuth = function (mode) {
    document.getElementById('login-form').classList.toggle('hidden', mode !== 'login');
    document.getElementById('register-form').classList.toggle('hidden', mode !== 'register');

    const tabLogin = document.getElementById('tab-login');
    const tabReg = document.getElementById('tab-register');

    if (tabLogin && tabReg) {
        tabLogin.className = mode === 'login' ? "flex-1 pb-2 text-white border-b-2 border-yellow-400 font-bold text-xs uppercase transition" : "flex-1 pb-2 text-sky-400 hover:text-white font-bold text-xs uppercase transition cursor-pointer";
        tabReg.className = mode === 'register' ? "flex-1 pb-2 text-white border-b-2 border-yellow-400 font-bold text-xs uppercase transition" : "flex-1 pb-2 text-sky-400 hover:text-white font-bold text-xs uppercase transition cursor-pointer";
    }
}

document.getElementById('register-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const user = document.getElementById('reg-user').value;
    const pass = document.getElementById('reg-pass').value;
    const email = user + '@inafuma.com';

    auth.createUserWithEmailAndPassword(email, pass)
        .then((cred) => {
            state = cleanState({ auth: { user }, team: null, economy: { coins: 50000000, premium: 0 } });
            // Guardar estado inicial en Firestore
            db.collection('users').doc(cred.user.uid).set(JSON.parse(JSON.stringify(state)));
            routeView();
        })
        .catch((err) => {
            if (err.code === 'auth/email-already-in-use') showAlert("El usuario ya existe.");
            else if (err.code === 'auth/weak-password') showAlert("La contraseña debe tener al menos 6 caracteres.");
            else showAlert("Error al registrar: " + err.message);
        });
});

document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const u = document.getElementById('log-user').value;
    const p = document.getElementById('log-pass').value;
    const email = u + '@inafuma.com';

    auth.signInWithEmailAndPassword(email, p)
        .then(async (cred) => {
            // Login exitoso — intentar descargar estado desde Firestore
            try {
                const doc = await db.collection('users').doc(cred.user.uid).get();
                if (doc.exists) {
                    state = cleanState(doc.data());
                } else {
                    // Si no existe documento (cuenta legacy), crear uno nuevo
                    state = cleanState({ auth: { user: u }, team: null, economy: { coins: 50000000, premium: 0 } });
                    db.collection('users').doc(cred.user.uid).set(JSON.parse(JSON.stringify(state))).catch(() => { });
                }
            } catch (firestoreErr) {
                console.error('Firestore no disponible, usando estado local:', firestoreErr);
                // Crear estado local si Firestore falla
                state = cleanState({ auth: { user: u }, team: null, economy: { coins: 50000000, premium: 0 } });
            }
            routeView();
        })
        .catch((err) => {
            if (err.code === 'auth/user-not-found') showAlert("No existe ninguna cuenta con este usuario.");
            else if (err.code === 'auth/wrong-password') showAlert("Contraseña incorrecta.");
            else showAlert("Error al iniciar sesión: " + err.message);
        });
});

// Creador Visual de Escudos (Seguro)
window.updatePreviewBadge = function () {
    const shapeEl = document.getElementById('set-shape');
    const c1El = document.getElementById('set-c1');
    const c2El = document.getElementById('set-c2');
    const badgeEl = document.getElementById('preview-badge');
    const nameEl = document.getElementById('set-team');

    if (!badgeEl) return;

    const shape = shapeEl ? shapeEl.value : 'shape-shield';
    const c1 = c1El ? c1El.value : '#e11d48';
    const c2 = c2El ? c2El.value : '#1e293b';
    const name = nameEl ? nameEl.value : 'CLUB';

    badgeEl.className = `w-16 h-20 club-badge text-xs shadow-lg ${shape}`;
    badgeEl.style.background = `linear-gradient(135deg, ${c1} 50%, ${c2} 50%)`;
    badgeEl.textContent = name.substring(0, 4).toUpperCase();
}

const teamInput = document.getElementById('set-team');
if (teamInput) teamInput.addEventListener('input', updatePreviewBadge);

document.getElementById('setup-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const shapeEl = document.getElementById('set-shape');
    const c1El = document.getElementById('set-c1');
    const c2El = document.getElementById('set-c2');

    state.team = {
        name: document.getElementById('set-team').value,
        manager: document.getElementById('set-manager').value,
        shape: shapeEl ? shapeEl.value : 'shape-shield',
        c1: c1El ? c1El.value : '#e11d48',
        c2: c2El ? c2El.value : '#1e293b'
    };
    state.league = initLeague();

    const initialIDs = [404, 309, 308, 307, 306, 207, 206, 205, 108, 107, 106];
    state.roster = initialIDs.map(id => JSON.parse(JSON.stringify(PLAYERS_DB.find(p => p.id === id) || PLAYERS_DB[0])));
    state.lineup = [...initialIDs];

    generateFixtures(state);

    if (!state.inbox) state.inbox = [];
    addEmail('Directiva', 'Bienvenido a LaLiga Tussi', `Míster ${state.team.manager}, la temporada consta de 38 jornadas (Ida y Vuelta). Le hemos asignado un 11 inicial básico. Llévenos a la gloria.`);
    saveState(); routeView();
});

window.logout = function () { auth.signOut().then(() => { state = null; location.reload(); }).catch(err => console.error('Error al cerrar sesión:', err)); }
window.toggleProfileMenu = function () { document.getElementById('profile-dropdown').classList.toggle('hidden'); }

window.showSubpage = function (id) {
    document.getElementById('page-' + id).classList.remove('hidden');
    if (id === 'stats') {
        document.getElementById('stat-goals').textContent = state.stats.goals;
        document.getElementById('stat-matches').textContent = state.stats.matches;
        document.getElementById('stat-trophies').textContent = state.stats.trophies;
        document.getElementById('stat-wins').textContent = state.stats.wins;
        document.getElementById('stat-draws').textContent = state.stats.draws;
        document.getElementById('stat-losses').textContent = state.stats.losses;
    }
}
window.closeSubpage = function () { document.querySelectorAll('.subpage-container').forEach(el => el.classList.add('hidden')); }

function routeView() {
    document.querySelectorAll('.view-section').forEach(el => el.classList.add('hidden'));
    if (!state) document.getElementById('view-landing').classList.remove('hidden');
    else if (!state.team) document.getElementById('view-setup').classList.remove('hidden');
    else {
        // Mostrar menú de selección de modo
        document.getElementById('view-mode-select').classList.remove('hidden');
    }
}

/* =========================================================================
   SELECCIÓN DE MODO DE JUEGO (LOCAL / MULTIJUGADOR)
   ========================================================================= */
let currentGameMode = null;
let pvpSocket = null;
let pvpRoomId = null;
let pvpSide = null; // 'home' o 'away'

window.selectGameMode = function (mode) {
    currentGameMode = mode;
    document.querySelectorAll('.view-section').forEach(el => el.classList.add('hidden'));

    if (mode === 'local') {
        // Modo carrera contra IA — flujo original
        document.getElementById('app-layout').classList.remove('hidden');
        updateUI();
        const savedTab = localStorage.getItem('inafuma_active_tab') || 'dash';
        switchTab(savedTab);
    } else if (mode === 'multiplayer') {
        // Modo PvP — conectar al servidor y buscar rival
        startMultiplayerSearch();
    }
}

/* =========================================================================
   MULTIPLAYER — Cliente Socket.io
   ========================================================================= */
const PVP_SERVER_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3001'
    : 'https://inafumapvp.onrender.com';

function startMultiplayerSearch() {
    document.getElementById('pvp-searching-overlay').classList.remove('hidden');
    document.getElementById('pvp-search-status').textContent = 'Conectando al servidor...';

    // Conectar al servidor PvP
    pvpSocket = io(PVP_SERVER_URL, { transports: ['websocket', 'polling'] });

    pvpSocket.on('connect', () => {
        document.getElementById('pvp-search-status').textContent = 'Buscando rival...';

        // Enviar datos del equipo al lobby
        pvpSocket.emit('join_lobby', {
            teamName: state.team.name,
            managerName: state.team.manager,
            roster: state.roster,
            lineup: state.lineup,
            badge: { shape: state.team.shape, c1: state.team.c1, c2: state.team.c2 }
        });
    });

    pvpSocket.on('connect_error', () => {
        document.getElementById('pvp-search-status').textContent = 'Error: Servidor no disponible';
    });

    pvpSocket.on('lobby_waiting', (data) => {
        document.getElementById('pvp-search-status').textContent = data.message;
    });

    // ---- PARTIDO ENCONTRADO ----
    pvpSocket.on('match_start', (data) => {
        pvpRoomId = data.roomId;
        pvpSide = data.you; // 'home' o 'away'

        // Cerrar overlay de búsqueda
        document.getElementById('pvp-searching-overlay').classList.add('hidden');

        // Mostrar modal del partido PvP
        document.querySelectorAll('.view-section').forEach(el => el.classList.add('hidden'));
        document.getElementById('pvp-match-modal').classList.remove('hidden');
        document.getElementById('pvp-halftime-actions').classList.add('hidden');
        document.getElementById('pvp-post-match').classList.add('hidden');

        // Rellenar datos
        document.getElementById('pvp-home-name').textContent = data.homeName;
        document.getElementById('pvp-away-name').textContent = data.awayName;
        document.getElementById('pvp-home-ovr').textContent = data.homeOvr;
        document.getElementById('pvp-away-ovr').textContent = data.awayOvr;
        document.getElementById('pvp-home-score').textContent = '0';
        document.getElementById('pvp-away-score').textContent = '0';
        document.getElementById('pvp-match-progress').style.width = '0%';
        document.getElementById('pvp-match-narrative').innerHTML = '';

        // Escudos
        const myBadge = { shape: state.team.shape, c1: state.team.c1, c2: state.team.c2 };
        const oppBadge = data.opponentBadge || { shape: 'shape-shield', c1: '#666', c2: '#333' };

        if (pvpSide === 'home') {
            document.getElementById('pvp-home-shield').innerHTML = getBadgeHTML(data.homeName, myBadge.shape, myBadge.c1, myBadge.c2, 'w-12 h-16 text-xs');
            document.getElementById('pvp-away-shield').innerHTML = getBadgeHTML(data.awayName, oppBadge.shape, oppBadge.c1, oppBadge.c2, 'w-12 h-16 text-xs');
        } else {
            document.getElementById('pvp-home-shield').innerHTML = getBadgeHTML(data.homeName, oppBadge.shape, oppBadge.c1, oppBadge.c2, 'w-12 h-16 text-xs');
            document.getElementById('pvp-away-shield').innerHTML = getBadgeHTML(data.awayName, myBadge.shape, myBadge.c1, myBadge.c2, 'w-12 h-16 text-xs');
        }
    });

    // ---- KICKOFF ----
    pvpSocket.on('match_kickoff', (data) => {
        const logDiv = document.getElementById('pvp-match-narrative');
        logDiv.innerHTML += `<div class='text-blue-400 font-bold'>${data.message}</div>`;
    });

    // ---- TICK DEL PARTIDO ----
    pvpSocket.on('match_tick', (data) => {
        document.getElementById('pvp-match-time').textContent = data.min + "'";
        document.getElementById('pvp-home-score').textContent = data.homeGoals;
        document.getElementById('pvp-away-score').textContent = data.awayGoals;
        document.getElementById('pvp-match-progress').style.width = data.progress + '%';

        // Narrativa
        const logDiv = document.getElementById('pvp-match-narrative');
        let cssClass = '';
        if (data.eventType === 'home_goal') cssClass = 'text-green-400 font-bold';
        else if (data.eventType === 'away_goal') cssClass = 'text-red-400 font-bold';
        logDiv.innerHTML += `<div><span class="text-slate-500">${data.min}'</span> - <span class="${cssClass}">${data.narrative.split(' - ').slice(1).join(' - ') || data.narrative}</span></div>`;
        logDiv.scrollTop = logDiv.scrollHeight;

        // Estadísticas
        document.getElementById('pvp-stat-poss-home').textContent = data.stats.hPoss + '%';
        document.getElementById('pvp-stat-poss-away').textContent = data.stats.aPoss + '%';
        document.getElementById('pvp-bar-poss-home').style.width = data.stats.hPoss + '%';
        document.getElementById('pvp-bar-poss-away').style.width = data.stats.aPoss + '%';
        document.getElementById('pvp-stat-shots-home').textContent = data.stats.hShots;
        document.getElementById('pvp-stat-shots-away').textContent = data.stats.aShots;
        let totalShots = data.stats.hShots + data.stats.aShots;
        document.getElementById('pvp-bar-shots-home').style.width = totalShots > 0 ? ((data.stats.hShots / totalShots) * 100) + '%' : '50%';
        document.getElementById('pvp-bar-shots-away').style.width = totalShots > 0 ? ((data.stats.aShots / totalShots) * 100) + '%' : '50%';
    });

    // ---- DESCANSO ----
    pvpSocket.on('match_halftime', (data) => {
        document.getElementById('pvp-halftime-actions').classList.remove('hidden');
        const logDiv = document.getElementById('pvp-match-narrative');
        logDiv.innerHTML += `<div class="mt-4"><strong class="text-yellow-400 font-bold">${data.narrative}</strong></div>`;
        logDiv.scrollTop = logDiv.scrollHeight;
    });

    pvpSocket.on('halftime_response', (data) => {
        const logDiv = document.getElementById('pvp-match-narrative');
        logDiv.innerHTML += `<div class="text-blue-400 mt-2 text-xs italic">${data.message}</div>`;
        logDiv.scrollTop = logDiv.scrollHeight;
        document.getElementById('pvp-halftime-actions').classList.add('hidden');
    });

    pvpSocket.on('match_resume', (data) => {
        document.getElementById('pvp-halftime-actions').classList.add('hidden');
        const logDiv = document.getElementById('pvp-match-narrative');
        logDiv.innerHTML += `<div class="mt-4"><strong class="text-white">${data.message}</strong></div>`;
        logDiv.scrollTop = logDiv.scrollHeight;
    });

    // ---- FIN DEL PARTIDO ----
    pvpSocket.on('match_result', (data) => {
        document.getElementById('pvp-post-match').classList.remove('hidden');

        const logDiv = document.getElementById('pvp-match-narrative');
        logDiv.innerHTML += `<div class="mt-4 text-white font-bold uppercase border-t border-[#313145] pt-2">Fin del tiempo reglamentario.</div>`;
        logDiv.scrollTop = logDiv.scrollHeight;

        const rewards = data.yourRewards;
        let resultText = '';
        if (rewards.result === 'win') resultText = '🏆 ¡VICTORIA!';
        else if (rewards.result === 'draw') resultText = '🤝 EMPATE';
        else resultText = '💔 DERROTA';

        document.getElementById('pvp-result-text').textContent = resultText;
        document.getElementById('pvp-rewards-text').innerHTML = `+€${(rewards.coins / 1000000).toFixed(1)}M | +${rewards.pts} PTS | REP: ${rewards.rep > 0 ? '+' : ''}${rewards.rep}`;

        // Aplicar recompensas al estado local
        if (rewards.result === 'win') state.stats.wins++;
        else if (rewards.result === 'draw') state.stats.draws++;
        else state.stats.losses++;
        state.stats.matches++;
        state.stats.goals += rewards.goalsScored;
        state.economy.coins += rewards.coins;
        state.stats.rep = Math.max(0, state.stats.rep + rewards.rep);
        saveState();
    });

    // ---- RIVAL DESCONECTADO ----
    pvpSocket.on('opponent_disconnected', (data) => {
        document.getElementById('pvp-searching-overlay').classList.add('hidden');
        document.getElementById('pvp-halftime-actions').classList.add('hidden');
        document.getElementById('pvp-post-match').classList.remove('hidden');
        document.getElementById('pvp-result-text').textContent = '🏆 ¡VICTORIA POR ABANDONO!';
        document.getElementById('pvp-rewards-text').textContent = data.message;
    });
}

window.pvpHalftimeAction = function (action) {
    if (pvpSocket && pvpRoomId) {
        pvpSocket.emit('match_halftime_action', { roomId: pvpRoomId, action: action });
    }
}

window.cancelMultiplayerSearch = function () {
    if (pvpSocket) {
        pvpSocket.disconnect();
        pvpSocket = null;
    }
    document.getElementById('pvp-searching-overlay').classList.add('hidden');
    routeView();
}

window.exitPvpMatch = function () {
    if (pvpSocket) {
        pvpSocket.disconnect();
        pvpSocket = null;
    }
    pvpRoomId = null;
    pvpSide = null;
    document.querySelectorAll('.view-section').forEach(el => el.classList.add('hidden'));
    routeView();
}

/* =========================================================================
   UI GLOBAL, TABS Y BUZÓN
   ========================================================================= */
window.switchTab = function (tabId) {
    document.querySelectorAll('.fm-tab').forEach(t => { t.classList.remove('active'); t.style.display = 'none'; });
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

    const targetTab = document.getElementById('tab-' + tabId);
    if (targetTab) { targetTab.classList.add('active'); targetTab.style.display = 'flex'; }

    const targetBtn = document.getElementById('nav-' + tabId);
    if (targetBtn) targetBtn.classList.add('active');

    const titles = { 'dash': 'Inicio', 'squad': 'Plantilla', 'tactics': 'Tácticas', 'train': 'Entrenamientos', 'talk': 'Vestuario', 'league': 'Clasificación', 'season': 'Resultados Temporada', 'market': 'Mercado de Fichajes', 'bet': 'Apuestas' };
    const pTitle = document.getElementById('page-title');
    if (pTitle) pTitle.textContent = titles[tabId] || 'Panel';

    // Guardar tab activo en localStorage
    localStorage.setItem('inafuma_active_tab', tabId);

    if (tabId === 'market') { setMarketMode('buy'); filterMarket(); }
    if (tabId === 'tactics') renderTactics();
    if (tabId === 'league') renderLeague();
    if (tabId === 'train') renderTrainStatus();
    if (tabId === 'talk') renderTalkStatus();
    if (tabId === 'season') renderSeasonTab();
    if (tabId === 'bet') renderBetTab();
    if (tabId === 'dash') updateUI();
    if (tabId === 'squad') renderSquad();
}

function addEmail(sender, subject, body) {
    const date = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    state.inbox.unshift({ id: Date.now(), sender, subject, body, date, read: false });
}

function renderInbox() {
    const list = document.getElementById('inbox-list');
    if (!list) return;
    list.innerHTML = '';

    if (state.inbox.length === 0) {
        list.innerHTML = '<div class="text-slate-500 text-sm text-center italic mt-4">Sin noticias.</div>';
        return;
    }

    state.inbox.forEach(mail => {
        const opacity = mail.read ? 'opacity-60' : 'opacity-100';
        const dot = mail.read ? '' : '<span class="w-2 h-2 rounded-full bg-blue-500 inline-block mr-2"></span>';
        list.innerHTML += `
        <div class="bg-[#111119] p-3 rounded border border-[#313145] cursor-pointer hover:border-slate-500 transition mb-2 ${opacity}" onclick="readMail(${mail.id})">
            <div class="flex justify-between items-baseline mb-1">
                <span class="text-[10px] font-bold text-blue-400">${mail.sender}</span>
                <span class="text-[9px] text-slate-500">${mail.date}</span>
            </div>
            <h4 class="text-xs font-bold text-white truncate">${dot}${mail.subject}</h4>
            <p class="text-[10px] text-slate-400 mt-1 line-clamp-2">${mail.body}</p>
        </div>`;
    });
}
window.readMail = function (id) { const m = state.inbox.find(x => x.id === id); if (m) { m.read = true; saveState(); renderInbox(); } }

function getStartingXI() { return state.lineup.map(id => state.roster.find(p => p.id === id)).filter(p => p !== undefined); }
function getTeamOvr() {
    const xi = getStartingXI();
    if (xi.length === 0) return 0;
    const sum = xi.reduce((acc, p) => acc + (p.ovr * (1 + ((p.morale - 50) / 200)) * (p.con / 100)), 0);
    return Math.round(sum / xi.length);
}

function getBadgeHTML(name, shape, c1, c2, extraClass = "w-8 h-10 text-[10px]") {
    let n = name ? name.substring(0, 3).toUpperCase() : "FM";
    let sh = shape || "shape-shield";
    let col1 = c1 || "#1e293b";
    let col2 = c2 || "#0f172a";
    return `<div class="club-badge ${sh} ${extraClass}" style="background: linear-gradient(135deg, ${col1} 50%, ${col2} 50%);">${n}</div>`;
}

function updateUI() {
    if (!state || !state.team) return;
    const formatM = (num) => num >= 1000000 ? (num / 1000000).toFixed(1) + 'M' : num.toLocaleString();

    document.getElementById('ui-rep').textContent = "★ " + state.stats.rep;
    document.getElementById('ui-coins').textContent = "€" + formatM(state.economy.coins);
    document.getElementById('ui-prem').textContent = state.economy.premium;
    document.getElementById('ui-jornada').textContent = state.stats.matchday || 1;
    document.getElementById('dash-jornada').textContent = state.stats.matchday || 1;

    document.getElementById('top-manager').textContent = state.team.manager;
    document.getElementById('sidebar-manager').textContent = state.team.manager;

    const teamNameEls = document.querySelectorAll('#top-teamname, #sidebar-teamname, #dash-greeting-team');
    teamNameEls.forEach(el => el.textContent = state.team.name);

    const badgeHTML = getBadgeHTML(state.team.name, state.team.shape, state.team.c1, state.team.c2, "w-full h-full text-xs shadow");
    document.getElementById('top-shield').innerHTML = badgeHTML;
    document.getElementById('sidebar-shield').innerHTML = badgeHTML;

    // Próximo Partido en UI
    let myNextFix = state.nextFixtures ? state.nextFixtures.find(f => f.isUserMatch) : null;
    if (myNextFix) {
        let isHome = myNextFix.home === state.team.name;
        let oppName = isHome ? myNextFix.away : myNextFix.home;
        let oppData = state.league.find(t => t.name === oppName) || { badge: AI_TEAMS[0] };

        document.getElementById('ui-next-opp').textContent = oppName;
        document.getElementById('dash-next-home').textContent = myNextFix.home;
        document.getElementById('dash-next-away').textContent = myNextFix.away;

        let homeBadge = isHome ? getBadgeHTML(state.team.name, state.team.shape, state.team.c1, state.team.c2, "w-full h-full border border-white/20") : getBadgeHTML(oppName, oppData.badge.shape, oppData.badge.c1, oppData.badge.c2, "w-full h-full border border-white/20");
        let awayBadge = isHome ? getBadgeHTML(oppName, oppData.badge.shape, oppData.badge.c1, oppData.badge.c2, "w-full h-full border border-white/20") : getBadgeHTML(state.team.name, state.team.shape, state.team.c1, state.team.c2, "w-full h-full border border-white/20");

        document.getElementById('dash-next-home-shield').innerHTML = homeBadge;
        document.getElementById('dash-next-away-shield').innerHTML = awayBadge;
    } else {
        document.getElementById('ui-next-opp').textContent = "Fin Temporada";
    }

    document.getElementById('dash-ovr-big').textContent = getTeamOvr();
    document.getElementById('dash-matches').textContent = state.stats.matches;
    document.getElementById('dash-wins').textContent = state.stats.wins;
    document.getElementById('dash-draws').textContent = state.stats.draws;
    document.getElementById('dash-losses').textContent = state.stats.losses;

    renderInbox(); renderSquad();
    if (document.getElementById('tab-tactics').classList.contains('active')) renderTactics();
}

/* =========================================================================
   FIXTURES (CALENDARIO DE 38 JORNADAS) Y RESULTADOS
   ========================================================================= */
function generateFixtures(targetState = state) {
    if (targetState.stats.matchday > 38) return;
    let fixtures = [];

    // Buscamos equipo que el usuario haya jugado MENOS de 2 veces.
    const unplayed = targetState.league.filter(t => !t.isUser && targetState.playedTeams.filter(x => x === t.name).length < 2);
    let myOpponent = null;

    if (unplayed.length > 0) {
        myOpponent = unplayed[Math.floor(Math.random() * unplayed.length)];
        let isHome = Math.random() > 0.5;
        if (isHome) fixtures.push({ home: targetState.team.name, away: myOpponent.name, isUserMatch: true, homeOvr: getTeamOvr(), awayOvr: myOpponent.ovr });
        else fixtures.push({ home: myOpponent.name, away: targetState.team.name, isUserMatch: true, homeOvr: myOpponent.ovr, awayOvr: getTeamOvr() });
    }

    // Partidos IA contra IA
    let remainingAIs = targetState.league.filter(t => !t.isUser && (!myOpponent || t.name !== myOpponent.name));
    remainingAIs = remainingAIs.sort(() => Math.random() - 0.5);

    for (let i = 0; i < remainingAIs.length; i += 2) {
        if (remainingAIs[i + 1]) {
            fixtures.push({
                home: remainingAIs[i].name,
                away: remainingAIs[i + 1].name,
                isUserMatch: false,
                homeOvr: remainingAIs[i].ovr,
                awayOvr: remainingAIs[i + 1].ovr
            });
        }
    }
    targetState.nextFixtures = fixtures;
}

window.renderSeasonTab = function () {
    const selector = document.getElementById('season-matchday-select');
    const list = document.getElementById('season-results-list');
    if (!selector || !list) return;

    if (selector.options.length === 0 || selector.options.length < state.stats.matchday - 1) {
        selector.innerHTML = '';
        for (let i = 1; i < state.stats.matchday; i++) {
            selector.innerHTML += `<option value="${i}">Jornada ${i}</option>`;
        }
        if (selector.options.length > 0) selector.value = state.stats.matchday - 1;
    }

    const selectedDay = selector.value;
    list.innerHTML = '';

    if (!state.history || !state.history[selectedDay]) {
        list.innerHTML = '<div class="text-center text-slate-500 text-xs mt-10">Selecciona una jornada pasada.</div>';
        return;
    }

    state.history[selectedDay].forEach(res => {
        let hClass = res.hG > res.aG ? "text-green-400 font-bold" : "text-white";
        let aClass = res.aG > res.hG ? "text-green-400 font-bold" : "text-white";
        let isMyMatch = res.home === state.team.name || res.away === state.team.name;
        let borderClass = isMyMatch ? "border-blue-500 bg-[#1e293b]" : "border-[#313145] bg-[#111119]";

        list.innerHTML += `
        <div class="p-3 rounded border ${borderClass} flex justify-between items-center text-xs shadow-lg mb-2">
            <span class="w-2/5 text-right ${hClass} truncate px-2">${res.home}</span>
            <span class="w-1/5 text-center font-bold bg-black py-1 rounded mx-2">${res.hG} - ${res.aG}</span>
            <span class="w-2/5 text-left ${aClass} truncate px-2">${res.away}</span>
        </div>`;
    });
}

/* =========================================================================
   APUESTAS DEPORTIVAS
   ========================================================================= */
window.renderBetTab = function () {
    const selMatch = document.getElementById('bet-match-select');
    const listBets = document.getElementById('active-bets-list');
    if (!selMatch || !listBets) return;

    selMatch.innerHTML = '';
    if (state.nextFixtures) {
        state.nextFixtures.forEach((fix, index) => {
            selMatch.innerHTML += `<option value="${index}">${fix.home} vs ${fix.away}</option>`;
        });
    }

    listBets.innerHTML = '';
    if (!state.activeBets || state.activeBets.length === 0) {
        listBets.innerHTML = '<div class="text-slate-500 text-xs italic text-center mt-4">No tienes apuestas activas para esta jornada.</div>';
        return;
    }

    state.activeBets.forEach(bet => {
        let currText = bet.currency === 'coins' ? '€ Club' : 'Premium';
        listBets.innerHTML += `
        <div class="bg-[#111119] border border-yellow-500/50 p-3 rounded flex justify-between items-center">
            <div>
                <div class="text-[10px] text-yellow-400 font-bold mb-1 uppercase">Boleto Registrado</div>
                <div class="text-xs text-white">${bet.home} vs ${bet.away}</div>
                <div class="text-[10px] text-slate-400 mt-1">Pronóstico: <span class="text-white font-bold bg-slate-800 px-2 py-0.5 rounded">${bet.hG} - ${bet.aG}</span></div>
            </div>
            <div class="text-right">
                <div class="text-[9px] font-bold text-slate-300 uppercase">Inversión</div>
                <div class="text-lg font-mono font-bold text-${bet.currency === 'coins' ? 'green' : 'yellow'}-400">${bet.amount}</div>
                <div class="text-[9px] text-slate-500 uppercase">${currText}</div>
            </div>
        </div>`;
    });
}

window.placeBet = function () {
    const matchIdx = document.getElementById('bet-match-select').value;
    const hG = parseInt(document.getElementById('bet-hg').value);
    const aG = parseInt(document.getElementById('bet-ag').value);
    const amount = parseInt(document.getElementById('bet-amount').value);
    const currency = document.getElementById('bet-currency').value;

    if (isNaN(hG) || isNaN(aG) || isNaN(amount) || amount < 10) return showAlert("Introduce datos válidos. Mínimo 10 de apuesta.");
    if (currency === 'coins' && state.economy.coins < amount) return showAlert("No hay fondos suficientes en el club.");
    if (currency === 'premium' && state.economy.premium < amount) return showAlert("No tienes suficientes Monedas Premium.");

    if (currency === 'coins') state.economy.coins -= amount;
    else state.economy.premium -= amount;

    const fixture = state.nextFixtures[matchIdx];
    state.activeBets.push({ home: fixture.home, away: fixture.away, hG: hG, aG: aG, amount: amount, currency: currency });

    saveState();
    renderBetTab();
    showAlert(`Boleto validado: ${amount} apostados al resultado ${hG}-${aG}.`);
}

/* =========================================================================
   LIGA Y TABLA DE CLASIFICACIÓN
   ========================================================================= */
function renderLeague() {
    const tbody = document.getElementById('league-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    const sorted = [...state.league].sort((a, b) => b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga));

    sorted.forEach((t, i) => {
        const isUserClass = t.isUser ? 'user-row' : '';
        const badgeObj = t.isUser ? state.team : (t.badge || AI_TEAMS[0]);
        const miniBadge = getBadgeHTML(t.name, badgeObj.shape, badgeObj.c1, badgeObj.c2, "w-6 h-8 text-[8px] mx-auto border border-white/10");

        tbody.innerHTML += `
        <tr class="${isUserClass}">
            <td class="text-center font-bold">${i + 1}</td>
            <td class="text-center p-1">${miniBadge}</td>
            <td class="text-white">${t.name}</td>
            <td>${t.pld}</td>
            <td>${t.w}</td>
            <td>${t.d}</td>
            <td>${t.l}</td>
            <td>${t.gf}</td>
            <td>${t.ga}</td>
            <td>${t.gf - t.ga}</td>
            <td class="text-white font-bold text-sm bg-slate-800/50 text-center">${t.pts}</td>
        </tr>`;
    });
}

function updateTeamStats(team, gf, ga) {
    if (!team) return;
    team.pld++; team.gf += gf; team.ga += ga;
    if (gf > ga) { team.w++; team.pts += 3; }
    else if (gf === ga) { team.d++; team.pts += 1; }
    else { team.l++; }
}

/* =========================================================================
   ENTRENAMIENTO Y VESTUARIO
   ========================================================================= */
function renderTrainStatus() {
    const st = document.getElementById('train-status');
    if (st) st.textContent = state.flags.canTrain ? "PROGRAMACIÓN DISPONIBLE" : "SESIÓN COMPLETADA. JUEGA PARA AVANZAR.";
}

window.executeWeeklyTraining = function () {
    if (!state.flags.canTrain) return showAlert("Los jugadores están agotados. Juega la jornada de liga para avanzar de semana.");
    if (state.roster.length === 0) return showAlert("No tienes jugadores.");

    const days = ['mon', 'tue', 'wed', 'thu', 'fri'];
    days.forEach(d => {
        let type = document.getElementById(`train-${d}`).value;
        state.roster.forEach(p => {
            if (type !== 'rest') {
                if (type === 'atk' && (p.pos === 'DEL' || p.pos === 'MED')) { p.sho++; p.pas++; }
                if (type === 'def' && (p.pos !== 'DEL')) { p.def++; p.phy++; }
                if (type === 'phy') { p.pac++; p.phy++; }
                p.con = Math.max(10, p.con - 6);
            } else {
                p.con = Math.min(100, p.con + 15);
            }
            p.ovr = calcPlayerOVR(p);
        });
    });

    state.flags.canTrain = false; saveState(); renderTrainStatus();
    showAlert("Programa completado. Atributos y Condición Física actualizados.");
}

function renderTalkStatus() {
    const st = document.getElementById('talk-status');
    if (st) st.textContent = state.flags.canTalk ? "DISPONIBLE" : "COMPLETADO";
}

window.executeTalk = function (tone) {
    if (!state.flags.canTalk) return showAlert("Ya has dado la charla pre-partido.");
    let xi = getStartingXI();
    let bench = state.roster.filter(p => !state.lineup.includes(p.id));

    if (tone === 'calm') {
        state.roster.forEach(p => p.morale = Math.min(100, p.morale + 5));
        showAlert("Toda la plantilla sube +5 de Moral.");
    } else if (tone === 'aggressive') {
        if (Math.random() < 0.7) {
            state.roster.forEach(p => p.morale = Math.min(100, p.morale + 20));
            showAlert("¡La bronca ha funcionado! (+20 Moral).");
        } else {
            state.roster.forEach(p => p.morale = Math.max(0, p.morale - 15));
            showAlert("Te has pasado. El equipo está presionado (-15 Moral).");
        }
    } else if (tone === 'passionate') {
        state.roster.forEach(p => { if (Math.random() < 0.5) p.morale = Math.min(100, p.morale + 15); });
        showAlert("El discurso ha calado en parte de la plantilla (+15 Moral).");
    } else if (tone === 'assertive') {
        xi.forEach(p => p.morale = Math.min(100, p.morale + 10));
        bench.forEach(p => p.morale = Math.max(0, p.morale - 5));
        showAlert("Titulares suben (+10 Moral), suplentes bajan (-5 Moral).");
    }

    state.flags.canTalk = false; saveState(); renderTalkStatus();
}

/* =========================================================================
   PLANTILLA Y TÁCTICAS (ARRASTRAR Y SOLTAR)
   ========================================================================= */
function getAttrClass(val) {
    if (val >= 85) return 'bg-[#10b981] text-white';
    if (val >= 70) return 'bg-[#eab308] text-black';
    if (val >= 50) return 'bg-[#f97316] text-white';
    return 'bg-[#ef4444] text-white';
}

function renderSquad() {
    const tbody = document.getElementById('squad-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    const posOrder = { 'POR': 1, 'DEF': 2, 'MED': 3, 'DEL': 4 };
    const sorted = [...state.roster].sort((a, b) => posOrder[a.pos] - posOrder[b.pos] || b.ovr - a.ovr);

    sorted.forEach(p => {
        let pClass = `pos-${p.pos.toLowerCase()}`;
        let conIcon = p.con >= 85 ? '🟢' : p.con >= 60 ? '🟡' : '🔴';
        let moralColor = p.morale >= 80 ? '#10b981' : p.morale >= 40 ? '#f59e0b' : '#ef4444';

        tbody.innerHTML += `
        <tr>
            <td class="text-center"><button class="text-xs bg-slate-700 px-2 py-1 rounded hover:bg-slate-600 text-white">ℹ</button></td>
            <td><span class="pos-badge ${pClass}">${p.pos}</span></td>
            <td class="font-bold text-white flex items-center gap-2"><img src="${p.img}" class="w-6 h-6 rounded-full border border-slate-600">${p.name}</td>
            <td class="font-bold text-[10px]">${conIcon} ${p.con}%</td>
            <td style="width: 60px;">
                <div class="w-full h-1.5 bg-slate-700 rounded overflow-hidden"><div class="h-full" style="width:${p.morale}%; background:${moralColor};"></div></div>
            </td>
            <td class="font-bold text-white text-sm bg-slate-800/50 text-center">${p.ovr}</td>
            <td><span class="attr-val ${getAttrClass(p.pac)}">${p.pac}</span></td>
            <td><span class="attr-val ${getAttrClass(p.sho)}">${p.sho}</span></td>
            <td><span class="attr-val ${getAttrClass(p.pas)}">${p.pas}</span></td>
            <td><span class="attr-val ${getAttrClass(p.def)}">${p.def}</span></td>
            <td><span class="attr-val ${getAttrClass(p.phy)}">${p.phy}</span></td>
        </tr>`;
    });
    const ovrTag = document.getElementById('squad-ovr');
    if (ovrTag) ovrTag.textContent = getTeamOvr();
}

let dragSrc = { id: null, slot: null };
window.dragStart = function (e, pId, slotIndex) {
    dragSrc = { id: pId, slot: slotIndex };

    // Crear ghost personalizado: solo la bola con la imagen del jugador
    const player = state.roster.find(p => p.id === pId);
    const ghost = document.createElement('div');
    ghost.className = 'drag-ghost';
    if (player) {
        ghost.style.backgroundImage = `url(${player.img})`;
    }
    document.body.appendChild(ghost);
    e.dataTransfer.setDragImage(ghost, 22, 22);
    // Limpiar ghost después de que el navegador lo capture
    setTimeout(() => { if (ghost.parentNode) ghost.parentNode.removeChild(ghost); }, 100);

    setTimeout(() => e.target.classList.add('opacity-50'), 0);
};
window.dragEnd = function (e) { e.target.classList.remove('opacity-50'); };
window.allowDrop = function (e) { e.preventDefault(); };

window.dropOnPitch = function (e, targetSlotIndex) {
    e.preventDefault(); if (!dragSrc.id) return;

    const targetPlayerId = state.lineup[targetSlotIndex];
    if (dragSrc.slot !== null) {
        state.lineup[dragSrc.slot] = targetPlayerId;
        state.lineup[targetSlotIndex] = dragSrc.id;
    } else {
        state.lineup[targetSlotIndex] = dragSrc.id;
    }
    saveState(); renderTactics();
};

window.dropOnBench = function (e) {
    e.preventDefault();
    if (dragSrc.slot !== null) { state.lineup[dragSrc.slot] = null; saveState(); renderTactics(); }
};

window.changeFormation = function () { state.formation = document.getElementById('tactics-formation').value; saveState(); renderTactics(); }

window.autoFillLineup = function () {
    const posMap = {
        '4-4-2': ['POR', 'DEF', 'DEF', 'DEF', 'DEF', 'MED', 'MED', 'MED', 'MED', 'DEL', 'DEL'],
        '4-3-3': ['POR', 'DEF', 'DEF', 'DEF', 'DEF', 'MED', 'MED', 'MED', 'DEL', 'DEL', 'DEL'],
        '5-3-2': ['POR', 'DEF', 'DEF', 'DEF', 'DEF', 'DEF', 'MED', 'MED', 'MED', 'DEL', 'DEL'],
        '3-4-3': ['POR', 'DEF', 'DEF', 'DEF', 'MED', 'MED', 'MED', 'MED', 'DEL', 'DEL', 'DEL'],
        '4-2-3-1': ['POR', 'DEF', 'DEF', 'DEF', 'DEF', 'MED', 'MED', 'MED', 'MED', 'MED', 'DEL'],
        '5-4-1': ['POR', 'DEF', 'DEF', 'DEF', 'DEF', 'DEF', 'MED', 'MED', 'MED', 'MED', 'DEL']
    };
    const targetLayout = posMap[state.formation];
    let newLineup = new Array(11).fill(null);
    let availableRoster = [...state.roster].sort((a, b) => b.ovr - a.ovr);

    for (let i = 0; i < 11; i++) {
        let neededPos = targetLayout[i];
        let bestPlayerIndex = availableRoster.findIndex(p => p.pos === neededPos);
        if (bestPlayerIndex !== -1) {
            newLineup[i] = availableRoster[bestPlayerIndex].id;
            availableRoster.splice(bestPlayerIndex, 1);
        }
    }
    for (let i = 0; i < 11; i++) {
        if (newLineup[i] === null && availableRoster.length > 0) {
            newLineup[i] = availableRoster[0].id;
            availableRoster.splice(0, 1);
        }
    }
    state.lineup = newLineup; saveState(); renderTactics();
};

function renderTactics() {
    const formSelect = document.getElementById('tactics-formation');
    if (formSelect) formSelect.value = state.formation;
    const pitch = document.getElementById('pitch-players');
    const benchContainer = document.getElementById('bench-list');
    if (!pitch || !benchContainer) return;
    pitch.innerHTML = ''; benchContainer.innerHTML = '';

    const layouts = {
        '4-4-2': [{ x: 50, y: 85 }, { x: 20, y: 65 }, { x: 40, y: 70 }, { x: 60, y: 70 }, { x: 80, y: 65 }, { x: 20, y: 35 }, { x: 40, y: 40 }, { x: 60, y: 40 }, { x: 80, y: 35 }, { x: 40, y: 15 }, { x: 60, y: 15 }],
        '4-3-3': [{ x: 50, y: 85 }, { x: 20, y: 70 }, { x: 40, y: 75 }, { x: 60, y: 75 }, { x: 80, y: 70 }, { x: 30, y: 45 }, { x: 50, y: 40 }, { x: 70, y: 45 }, { x: 20, y: 20 }, { x: 50, y: 15 }, { x: 80, y: 20 }],
        '5-3-2': [{ x: 50, y: 85 }, { x: 10, y: 65 }, { x: 30, y: 75 }, { x: 50, y: 78 }, { x: 70, y: 75 }, { x: 90, y: 65 }, { x: 30, y: 40 }, { x: 50, y: 45 }, { x: 70, y: 40 }, { x: 40, y: 15 }, { x: 60, y: 15 }],
        '3-4-3': [{ x: 50, y: 85 }, { x: 25, y: 70 }, { x: 50, y: 75 }, { x: 75, y: 70 }, { x: 15, y: 45 }, { x: 38, y: 40 }, { x: 62, y: 40 }, { x: 85, y: 45 }, { x: 25, y: 20 }, { x: 50, y: 15 }, { x: 75, y: 20 }],
        '4-2-3-1': [{ x: 50, y: 85 }, { x: 20, y: 70 }, { x: 40, y: 75 }, { x: 60, y: 75 }, { x: 80, y: 70 }, { x: 35, y: 50 }, { x: 65, y: 50 }, { x: 20, y: 30 }, { x: 50, y: 25 }, { x: 80, y: 30 }, { x: 50, y: 10 }],
        '5-4-1': [{ x: 50, y: 85 }, { x: 10, y: 70 }, { x: 30, y: 75 }, { x: 50, y: 78 }, { x: 70, y: 75 }, { x: 90, y: 70 }, { x: 20, y: 45 }, { x: 40, y: 50 }, { x: 60, y: 50 }, { x: 80, y: 45 }, { x: 50, y: 20 }]
    };

    layouts[state.formation].forEach((pos, index) => {
        const player = state.roster.find(p => p.id === state.lineup[index]);
        let innerHTML = '';
        if (player) {
            let conColor = player.con >= 85 ? '#10b981' : player.con >= 60 ? '#eab308' : '#ef4444';
            innerHTML = `
                <div class="pitch-ovr-tag">${player.ovr}</div>
                <div class="pitch-shirt" style="background-image:url(${player.img}); border-color: ${conColor}" draggable="true" ondragstart="dragStart(event, ${player.id}, ${index})" ondragend="dragEnd(event)"></div>
                <div class="pitch-name">${player.name.split(' ').pop()}</div>
            `;
        } else {
            innerHTML = `<div class="pitch-shirt border-dashed bg-black/50 text-slate-400">+</div>`;
        }
        pitch.innerHTML += `<div class="pitch-player" style="left:${pos.x}%; top:${pos.y}%;" ondragover="allowDrop(event)" ondrop="dropOnPitch(event, ${index})">${innerHTML}</div>`;
    });

    const benchPlayers = state.roster.filter(p => !state.lineup.includes(p.id));
    benchPlayers.forEach(p => {
        let pClass = `pos-${p.pos.toLowerCase()}`;
        benchContainer.innerHTML += `
        <div class="bench-player" draggable="true" ondragstart="dragStart(event, ${p.id}, null)" ondragend="dragEnd(event)">
            <div class="flex items-center gap-2">
                <img src="${p.img}" class="w-6 h-6 rounded-full object-cover border border-[#313145]">
                <span class="pos-badge ${pClass} text-[8px] w-auto px-1">${p.pos}</span>
                <span class="text-white text-[10px] font-bold truncate max-w-[80px] block">${p.name}</span>
            </div>
            <div class="flex items-center gap-2">
                <span class="text-[9px] text-slate-400">Con: ${p.con}%</span>
                <span class="text-yellow-400 font-bold bg-[#111119] px-1.5 py-0.5 rounded text-[10px] border border-[#313145]">${p.ovr}</span>
            </div>
        </div>`;
    });
}

/* =========================================================================
   MERCADO Y BUSCADOR CENTRADO SIN LUPA
   ========================================================================= */
let marketMode = 'buy';
let currentMarketFilter = 'ALL';

window.setMarketMode = function (mode) {
    marketMode = mode;
    document.getElementById('mode-buy').className = mode === 'buy' ? "text-white font-bold border-b-2 border-red-500 pb-1 uppercase tracking-widest text-xs" : "text-slate-500 hover:text-white font-bold pb-1 cursor-pointer uppercase tracking-widest text-xs transition";
    document.getElementById('mode-sell').className = mode === 'sell' ? "text-white font-bold border-b-2 border-red-500 pb-1 uppercase tracking-widest text-xs" : "text-slate-500 hover:text-white font-bold pb-1 cursor-pointer uppercase tracking-widest text-xs transition";
    document.getElementById('market-th-rep').style.display = mode === 'buy' ? "table-cell" : "none";
    filterMarket();
};

window.filterMarket = function (pos) {
    if (pos) currentMarketFilter = pos;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    const btn = document.getElementById(`filter-${currentMarketFilter}`);
    if (btn) btn.classList.add('active');

    const formatM = (num) => (num / 1000000).toFixed(1) + 'M';
    document.getElementById('market-funds').textContent = `€${formatM(state.economy.coins)}`;

    const searchInput = document.getElementById('market-search');
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const tbody = document.getElementById('market-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    let items = marketMode === 'buy' ? PLAYERS_DB.filter(db_p => !state.roster.find(rp => rp.id === db_p.id)) : state.roster;
    if (currentMarketFilter !== 'ALL') items = items.filter(p => p.pos === currentMarketFilter);
    if (searchTerm) items = items.filter(p => p.name.toLowerCase().includes(searchTerm));

    if (items.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center text-slate-500 py-6 text-xs">Sin resultados de búsqueda.</td></tr>`;
        return;
    }

    items.forEach(p => {
        let pClass = `pos-${p.pos.toLowerCase()}`;
        if (marketMode === 'buy') {
            const canRep = state.stats.rep >= p.rep;
            tbody.innerHTML += `
            <tr>
                <td class="text-center"><button class="text-xs bg-slate-700 px-2 py-1 rounded hover:bg-slate-600 text-white">ℹ</button></td>
                <td class="font-bold text-white flex items-center gap-2"><img src="${p.img}" class="w-6 h-6 rounded-full border border-slate-600">${p.name}</td>
                <td class="text-center"><span class="pos-badge ${pClass}">${p.pos}</span></td>
                <td class="font-bold text-white text-sm bg-slate-800/50 text-center">${p.ovr}</td>
                <td class="${canRep ? 'text-slate-400' : 'text-red-500 font-bold'} text-center">★ ${p.rep}</td>
                <td class="font-mono text-green-400 text-right pr-4">€${formatM(p.priceBasic)}</td>
                <td class="text-center"><button class="btn-action w-3/4 py-1.5 text-[10px]" onclick="buyPlayer(${p.id}, 'basic')">FICHAR</button></td>
            </tr>`;
        } else {
            const sellValue = Math.floor(p.priceBasic * 0.6);
            tbody.innerHTML += `
            <tr>
                <td class="text-center"><button class="text-xs bg-slate-700 px-2 py-1 rounded hover:bg-slate-600 text-white">ℹ</button></td>
                <td class="font-bold text-white flex items-center gap-2"><img src="${p.img}" class="w-6 h-6 rounded-full border border-slate-600">${p.name}</td>
                <td class="text-center"><span class="pos-badge ${pClass}">${p.pos}</span></td>
                <td class="font-bold text-white text-sm bg-slate-800/50 text-center">${p.ovr}</td>
                <td style="display:none;"></td> 
                <td class="font-mono text-slate-400 text-right pr-4">Oferta: €${formatM(sellValue)}</td>
                <td class="text-center"><button class="btn-sell w-3/4 py-1.5" onclick="sellPlayer(${p.id}, ${sellValue})">VENDER</button></td>
            </tr>`;
        }
    });
}

window.buyPlayer = function (id, curr) {
    const p = PLAYERS_DB.find(x => x.id === id);
    if (state.stats.rep < p.rep) return showAlert(`Reputación Insuficiente (Req: ★ ${p.rep}).`);

    if (curr === 'basic') {
        if (state.economy.coins < p.priceBasic) return showAlert("Presupuesto insuficiente.");
        state.economy.coins -= p.priceBasic;
    } else {
        if (state.economy.premium < p.pricePrem) return showAlert("Moneda Premium insuficiente.");
        state.economy.premium -= p.pricePrem;
    }

    let newPlayer = JSON.parse(JSON.stringify(p));
    newPlayer.con = 100;
    newPlayer.morale = 100;

    state.roster.push(newPlayer);
    const emptySlot = state.lineup.findIndex(slot => slot === null);
    if (emptySlot !== -1) state.lineup[emptySlot] = p.id;

    addEmail('Director Deportivo', `Fichaje Cerrado: ${p.name}`, `Hemos llegado a un acuerdo y el jugador se incorpora al club.`);
    saveState(); filterMarket();
}

window.sellPlayer = function (id, sellValue) {
    showConfirm(`¿Vender al jugador y añadir €${(sellValue / 1000000).toFixed(1)}M al club?`, () => {
        state.economy.coins += sellValue;
        state.roster = state.roster.filter(p => p.id !== id);
        for (let i = 0; i < state.lineup.length; i++) { if (state.lineup[i] === id) state.lineup[i] = null; }
        saveState(); filterMarket();
    });
}

window.buyIAP = function () { document.getElementById('modal-store').classList.remove('hidden'); renderCart(); }

/* =========================================================================
   CARRITO DE COMPRA Y METODO DE PAGO (1 PACK A LA VEZ CON PRECIOS EUR)
   ========================================================================= */
let selectedPack = null; // { amount: number, price: number } o null

window.selectPack = function (amount, price) {
    // Solo un paquete a la vez: si ya está seleccionado el mismo, deseleccionar
    if (selectedPack && selectedPack.amount === amount) {
        selectedPack = null;
    } else {
        selectedPack = { amount, price };
    }
    renderCart();
}

window.addToCart = function (amount) {
    // Legacy compat - mapear a selectPack
    const priceMap = { 500: 0.99, 2000: 3.99, 5000: 7.99, 10000: 14.99, 25000: 34.99, 50000: 59.99 };
    selectPack(amount, priceMap[amount] || 0.99);
}

window.clearCart = function () {
    selectedPack = null;
    renderCart();
}

window.removeFromCart = function () {
    selectedPack = null;
    renderCart();
}

function renderCart() {
    const listEl = document.getElementById('cart-items-list');
    const totalEl = document.getElementById('cart-total');
    const totalEurEl = document.getElementById('cart-total-eur');
    const btnPayAmount = document.getElementById('btn-pay-amount');
    if (!listEl || !totalEl) return;

    // Actualizar selección visual de packs
    document.querySelectorAll('.store-pack').forEach(el => {
        el.classList.remove('selected');
        if (selectedPack && el.dataset.pack == selectedPack.amount) {
            el.classList.add('selected');
        }
    });

    if (!selectedPack) {
        listEl.innerHTML = '<div class="text-sky-500 text-xs text-center italic">Ningún paquete seleccionado</div>';
        totalEl.textContent = '0';
        if (totalEurEl) totalEurEl.textContent = '0,00 €';
        if (btnPayAmount) btnPayAmount.textContent = '0,00 €';
        updatePaymentButton();
        return;
    }

    const priceStr = selectedPack.price.toFixed(2).replace('.', ',');
    listEl.innerHTML = `
    <div class="flex justify-between items-center bg-[#132a4a] p-3 rounded border border-yellow-500/30">
        <div>
            <span class="text-sm text-yellow-400 font-mono font-bold">${selectedPack.amount.toLocaleString()} Monedas</span>
        </div>
        <div class="flex items-center gap-3">
            <span class="text-green-400 font-bold text-sm font-mono">${priceStr} €</span>
            <button onclick="removeFromCart()" class="text-red-400 hover:text-red-300 text-xs font-bold cursor-pointer px-2">✕</button>
        </div>
    </div>`;

    totalEl.textContent = selectedPack.amount.toLocaleString();
    if (totalEurEl) totalEurEl.textContent = priceStr + ' €';
    if (btnPayAmount) btnPayAmount.textContent = priceStr + ' €';
    updatePaymentButton();
}

function updatePaymentButton() {
    const payBtn = document.getElementById('btn-process-payment');
    const payMethod = document.getElementById('payment-method');
    if (!payBtn || !payMethod) return;

    const hasPack = selectedPack !== null;
    const hasMethod = payMethod.value !== '';

    if (hasPack && hasMethod) {
        payBtn.disabled = false;
        payBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    } else {
        payBtn.disabled = true;
        payBtn.classList.add('opacity-50', 'cursor-not-allowed');
    }
}

window.closeStore = function () {
    document.getElementById('modal-store').classList.add('hidden');
    selectedPack = null;
    renderCart();
    const payMethod = document.getElementById('payment-method');
    if (payMethod) payMethod.value = '';
    const cardForm = document.getElementById('payment-card-form');
    if (cardForm) cardForm.classList.add('hidden');
}

window.processPayment = function () {
    if (!selectedPack) return showAlert("Selecciona un paquete de monedas.");
    const payMethod = document.getElementById('payment-method');
    if (!payMethod || payMethod.value === '') return showAlert("Selecciona un metodo de pago.");

    // Validar datos de tarjeta si es visa/mastercard
    if (payMethod.value === 'visa' || payMethod.value === 'mastercard') {
        const cardNum = document.getElementById('card-number').value.trim();
        const cardExpiry = document.getElementById('card-expiry').value.trim();
        const cardCvv = document.getElementById('card-cvv').value.trim();
        const cardName = document.getElementById('card-name').value.trim();
        if (!cardNum || !cardExpiry || !cardCvv || !cardName) {
            return showAlert("Completa todos los datos de la tarjeta.");
        }
    }

    const amount = selectedPack.amount;
    const priceStr = selectedPack.price.toFixed(2).replace('.', ',');
    state.economy.premium += amount;
    selectedPack = null;
    saveState();
    closeStore();
    showAlert(`Pago de ${priceStr} € procesado correctamente. +${amount.toLocaleString()} Monedas Premium añadidas.`);
}

window.confirmIAP = function () {
    // Legacy - kept for compatibility
    processPayment();
}

/* =========================================================================
   MOTOR DE PARTIDO AVANZADO FM
   ========================================================================= */
let matchState = { mG: 0, oG: 0, min: 0, myProb: 0, oppProb: 0, interval: null, talkMod: 0, isHome: true, stats: { hPoss: 50, aPoss: 50, hShots: 0, aShots: 0 } };
let currentOpponent = null;

window.startMatch = function () {
    const xi = getStartingXI();
    if (xi.length < 11) return showAlert(`Plantilla incompleta. Asigna a 11 titulares en Tácticas.`);

    if (!state.nextFixtures || state.nextFixtures.length === 0) generateFixtures(state);

    let myMatch = state.nextFixtures.find(f => f.isUserMatch);
    if (!myMatch || state.stats.matchday > 38) {
        endSeason();
        return;
    }

    let isHome = myMatch.home === state.team.name;
    currentOpponent = state.league.find(t => t.name === (isHome ? myMatch.away : myMatch.home));

    document.getElementById('app-layout').classList.add('hidden');
    document.getElementById('match-modal').classList.remove('hidden');
    document.getElementById('match-post').classList.add('hidden');
    document.getElementById('match-halftime').classList.add('hidden');
    document.getElementById('match-actions').classList.add('hidden');

    document.getElementById('sim-home-name').textContent = isHome ? state.team.name : currentOpponent.name;
    document.getElementById('sim-away-name').textContent = isHome ? currentOpponent.name : state.team.name;

    const hTeam = isHome ? state.team : currentOpponent.badge;
    const aTeam = isHome ? currentOpponent.badge : state.team;

    document.getElementById('sim-home-shield').innerHTML = getBadgeHTML(isHome ? state.team.name : currentOpponent.name, hTeam.shape, hTeam.c1, hTeam.c2, "w-12 h-16 text-xs");
    document.getElementById('sim-away-shield').innerHTML = getBadgeHTML(isHome ? currentOpponent.name : state.team.name, aTeam.shape, aTeam.c1, aTeam.c2, "w-12 h-16 text-xs");

    const myOvr = getTeamOvr();
    document.getElementById('sim-home-ovr').textContent = isHome ? myOvr : currentOpponent.ovr;
    document.getElementById('sim-away-ovr').textContent = isHome ? currentOpponent.ovr : myOvr;

    // Cansancio Post Partido
    state.roster.forEach(p => { if (state.lineup.includes(p.id)) p.con = Math.max(10, p.con - 10); });

    matchState = {
        mG: 0, oG: 0, min: 0, talkMod: 0, isHome: isHome,
        myProb: 0.08 + ((myOvr - currentOpponent.ovr) * 0.003),
        oppProb: 0.08 - ((myOvr - currentOpponent.ovr) * 0.003),
        interval: null, stats: { hPoss: 50, aPoss: 50, hShots: 0, aShots: 0 }
    };

    document.getElementById('sim-home-score').textContent = "0";
    document.getElementById('sim-away-score').textContent = "0";
    document.getElementById('match-progress').style.width = "0%";
    document.getElementById('match-narrative').innerHTML = "<div class='text-blue-400 font-bold'>¡El árbitro señala el inicio del partido!</div>";

    updateMatchStatsUI();
    runMatchLoop(45);
}

function updateMatchStatsUI() {
    document.getElementById('stat-poss-home').textContent = matchState.stats.hPoss + "%";
    document.getElementById('stat-poss-away').textContent = matchState.stats.aPoss + "%";
    document.getElementById('bar-poss-home').style.width = matchState.stats.hPoss + "%";
    document.getElementById('bar-poss-away').style.width = matchState.stats.aPoss + "%";

    document.getElementById('stat-shots-home').textContent = matchState.stats.hShots;
    document.getElementById('stat-shots-away').textContent = matchState.stats.aShots;

    let totalShots = matchState.stats.hShots + matchState.stats.aShots;
    document.getElementById('bar-shots-home').style.width = totalShots > 0 ? ((matchState.stats.hShots / totalShots) * 100) + "%" : "50%";
    document.getElementById('bar-shots-away').style.width = totalShots > 0 ? ((matchState.stats.aShots / totalShots) * 100) + "%" : "50%";
}

function runMatchLoop(targetMinute) {
    const logDiv = document.getElementById('match-narrative');
    const commentary = ["Controlando el ritmo del partido.", "Pase filtrado peligroso que corta la zaga.", "Falta táctica.", "Disparo lejano que se va alto.", "Gran intervención del portero.", "Despeje de cabeza."];

    matchState.interval = setInterval(() => {
        matchState.min += 3;
        document.getElementById('match-time').textContent = `${matchState.min}'`;
        document.getElementById('match-progress').style.width = `${(matchState.min / 90) * 100}%`;

        // Posesión dinámica
        matchState.stats.hPoss = Math.min(80, Math.max(20, matchState.stats.hPoss + (Math.floor(Math.random() * 11) - 5)));
        matchState.stats.aPoss = 100 - matchState.stats.hPoss;

        if (matchState.min === 45 && targetMinute === 45) {
            clearInterval(matchState.interval);
            logDiv.innerHTML += `<div class="mt-4"><strong class="text-yellow-400 font-bold">45': Final de la primera mitad. Nos vamos al descanso.</strong></div>`;
            logDiv.scrollTop = logDiv.scrollHeight;
            document.getElementById('match-actions').classList.remove('hidden');
            document.getElementById('match-halftime').classList.remove('hidden');
            updateMatchStatsUI();
            return;
        }

        if (matchState.min >= 90) {
            clearInterval(matchState.interval);
            finishMatch(matchState.mG, matchState.oG); return;
        }

        let eventText = commentary[Math.floor(Math.random() * commentary.length)];
        let rand = Math.random();
        let activeMyProb = matchState.myProb + matchState.talkMod;

        if (rand < (activeMyProb * 0.4)) {
            matchState.mG++;
            matchState.isHome ? matchState.stats.hShots++ : matchState.stats.aShots++;
            const xi = getStartingXI();
            const scorers = xi.filter(p => p.pos === 'DEL' || p.pos === 'MED');
            const scorer = scorers.length > 0 ? scorers[Math.floor(Math.random() * scorers.length)].name : "el delantero";
            eventText = `<span class="text-green-400 font-bold">¡GOL! Definición perfecta de ${scorer}.</span>`;
        } else if (rand > 1 - (matchState.oppProb * 0.4)) {
            matchState.oG++;
            matchState.isHome ? matchState.stats.aShots++ : matchState.stats.hShots++;
            eventText = `<span class="text-red-400 font-bold">¡Gol del equipo rival! Grave error en defensa.</span>`;
        } else if (rand < 0.3) {
            matchState.stats.hShots++;
        } else if (rand > 0.7) {
            matchState.stats.aShots++;
        }

        logDiv.innerHTML += `<div><span class="text-slate-500">${matchState.min}'</span> - ${eventText}</div>`;
        logDiv.scrollTop = logDiv.scrollHeight;
        document.getElementById('sim-home-score').textContent = matchState.isHome ? matchState.mG : matchState.oG;
        document.getElementById('sim-away-score').textContent = matchState.isHome ? matchState.oG : matchState.mG;
        updateMatchStatsUI();

    }, 350);
}

window.matchTalk = function (type) {
    const logDiv = document.getElementById('match-narrative');
    if (type === 'animar') {
        matchState.talkMod = 0.01;
        logDiv.innerHTML += `<div class="text-blue-400 mt-2 text-xs italic">El equipo sale motivado para la 2ª parte.</div>`;
    } else {
        if (Math.random() < 0.6) {
            matchState.talkMod = 0.02;
            logDiv.innerHTML += `<div class="text-green-400 mt-2 text-xs italic">Los jugadores reaccionan bien a la bronca.</div>`;
        } else {
            matchState.talkMod = -0.01;
            logDiv.innerHTML += `<div class="text-red-400 mt-2 text-xs italic">La plantilla se pone nerviosa tras los gritos.</div>`;
        }
    }
    logDiv.scrollTop = logDiv.scrollHeight;
    document.getElementById('match-halftime').innerHTML = '<button onclick="resumeMatch()" class="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded text-xs uppercase tracking-widest mt-2 transition">JUGAR SEGUNDA PARTE</button>';
}

window.goToTacticsFromMatch = function () {
    document.getElementById('match-modal').classList.add('hidden');
    document.getElementById('app-layout').classList.remove('hidden');
    switchTab('tactics');

    const topBtn = document.getElementById('top-continue-btn');
    topBtn.innerHTML = 'VOLVER AL PARTIDO ⏱';
    topBtn.className = "btn-continue shadow-lg bg-yellow-600";
    topBtn.onclick = returnToMatch;
}

window.returnToMatch = function () {
    document.getElementById('app-layout').classList.add('hidden');
    document.getElementById('match-modal').classList.remove('hidden');

    const topBtn = document.getElementById('top-continue-btn');
    topBtn.innerHTML = 'CONTINUAR ⏭';
    topBtn.className = "btn-continue shadow-lg";
    topBtn.onclick = startMatch;
}

window.resumeMatch = function () {
    document.getElementById('match-actions').classList.add('hidden');
    document.getElementById('match-halftime').classList.add('hidden');

    const newOvr = getTeamOvr();
    matchState.myProb = 0.08 + ((newOvr - currentOpponent.ovr) * 0.003);

    const logDiv = document.getElementById('match-narrative');
    logDiv.innerHTML += `<div class="mt-4"><strong class="text-white">45': Arranca la segunda mitad.</strong></div>`;
    logDiv.scrollTop = logDiv.scrollHeight;
    runMatchLoop(90);
}

function finishMatch(mG, oG) {
    document.getElementById('match-actions').classList.remove('hidden');
    document.getElementById('match-post').classList.remove('hidden');

    const logDiv = document.getElementById('match-narrative');
    logDiv.innerHTML += `<div class="mt-4 text-white font-bold uppercase border-t border-[#313145] pt-2">Fin del tiempo reglamentario.</div>`;
    logDiv.scrollTop = logDiv.scrollHeight;

    let ptsEarned = 0; let coins = 0; let rep = 0;

    if (mG > oG) { ptsEarned = 3; coins = 5000000; rep = 150; state.stats.wins++; }
    else if (mG === oG) { ptsEarned = 1; coins = 1500000; rep = 50; state.stats.draws++; }
    else { ptsEarned = 0; coins = 500000; rep = -10; state.stats.losses++; }

    state.stats.goals += mG;

    // Resolver todos los partidos de la jornada
    let results = [];
    state.nextFixtures.forEach(fix => {
        let hG = 0, aG = 0;
        if (fix.isUserMatch) {
            hG = matchState.isHome ? mG : oG;
            aG = matchState.isHome ? oG : mG;
        } else {
            let p = 0.5 + ((fix.homeOvr - fix.awayOvr) * 0.02);
            hG = Math.random() < p ? Math.floor(Math.random() * 4) : Math.floor(Math.random() * 2);
            aG = Math.random() > p ? Math.floor(Math.random() * 4) : Math.floor(Math.random() * 2);
        }

        results.push({ home: fix.home, away: fix.away, hG, aG });
        updateTeamStats(state.league.find(t => t.name === fix.home), hG, aG);
        updateTeamStats(state.league.find(t => t.name === fix.away), aG, hG);
    });

    state.history[state.stats.matchday.toString()] = results;

    // Evaluar Apuestas
    let betResults = [];
    state.activeBets.forEach(b => {
        const actual = results.find(r => r.home === b.home && r.away === b.away);
        if (actual) {
            let actualWinner = actual.hG > actual.aG ? 'h' : (actual.aG > actual.hG ? 'a' : 'd');
            let predictedWinner = b.hG > b.aG ? 'h' : (b.aG > b.hG ? 'a' : 'd');

            if (actual.hG === b.hG && actual.aG === b.aG) {
                let winAmt = b.amount * 2;
                if (b.currency === 'coins') state.economy.coins += winAmt; else state.economy.premium += winAmt;
                betResults.push(`Acierto EXACTO (${b.home}): +${winAmt}`);
            } else if (actualWinner === predictedWinner) {
                let winAmt = Math.floor(b.amount * 1.5);
                if (b.currency === 'coins') state.economy.coins += winAmt; else state.economy.premium += winAmt;
                betResults.push(`Acierto GANADOR (${b.home}): +${winAmt}`);
            } else {
                betResults.push(`Fallo (${b.home}): -${b.amount}`);
            }
        }
    });

    if (betResults.length > 0) addEmail('Apuestas Deportivas', 'Boleto de Jornada', betResults.join(' | '));
    state.activeBets = [];

    state.playedTeams.push(currentOpponent.name);
    state.stats.matches++;
    state.stats.matchday++;
    state.economy.coins += coins;
    state.stats.rep = Math.max(0, state.stats.rep + rep);

    state.flags.canTrain = true;
    state.flags.canTalk = true;

    generateFixtures(state); // Crear siguiente jornada (Para verla en apuestas y demás)
    saveState();

    document.getElementById('match-coins').textContent = `+€${(coins / 1000000).toFixed(1)}M`;
    document.getElementById('match-pts').innerHTML = `+${ptsEarned} PTS<br><span class="text-[10px] ${rep > 0 ? 'text-blue-400' : 'text-red-400'}">REP: ${rep > 0 ? '+' : ''}${rep}</span>`;
}

window.endMatchAndReturn = function () {
    document.getElementById('match-modal').classList.add('hidden');
    document.getElementById('app-layout').classList.remove('hidden');

    if (state.stats.matchday > 38) {
        endSeason();
    } else {
        switchTab('league');
    }
}

/* =========================================================================
   FIN DE TEMPORADA Y TROFEOS
   ========================================================================= */
function endSeason() {
    document.getElementById('modal-season-end').classList.remove('hidden');

    const sorted = [...state.league].sort((a, b) => {
        if (b.pts !== a.pts) return b.pts - a.pts;
        return (b.gf - b.ga) - (a.gf - a.ga);
    });

    const userPos = sorted.findIndex(t => t.isUser) + 1;

    if (userPos === 1) {
        document.getElementById('season-trophy').classList.remove('hidden');
        document.getElementById('season-no-trophy').classList.add('hidden');
        state.stats.trophies++;
        addEmail('Directiva', '¡CAMPEONES DE LIGA!', 'El club hace historia ganando LaLiga Tussi.');
    } else {
        document.getElementById('season-trophy').classList.add('hidden');
        document.getElementById('season-no-trophy').classList.remove('hidden');
        document.getElementById('season-pos').textContent = userPos + "º";
        addEmail('Directiva', 'Revisión de Temporada', `Hemos finalizado en la posición ${userPos}. Debemos mejorar.`);
    }
    saveState();
}

window.startNewSeason = function () {
    state.stats.matchday = 1;
    state.playedTeams = [];
    state.history = {};
    state.activeBets = [];

    state.league.forEach(t => {
        t.pld = 0; t.w = 0; t.d = 0; t.l = 0; t.gf = 0; t.ga = 0; t.pts = 0;
    });

    state.roster.forEach(p => { p.morale = 100; p.con = 100; });
    generateFixtures(state);

    saveState();
    document.getElementById('modal-season-end').classList.add('hidden');
    switchTab('dash');
    showAlert("¡Arranca una nueva edición de LaLiga Tussi! Dinero y plantilla se conservan.");
}
const fs = require('fs');
let c = fs.readFileSync('app.js', 'utf8');

const targetReg = `document.getElementById('register-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const user = document.getElementById('reg-user').value;
    const pass = document.getElementById('reg-pass').value;
    const email = user + '@inafuma.com';

    auth.createUserWithEmailAndPassword(email, pass)
        .then((cred) => {
            state = cleanState({ auth: { user }, team: null, economy: { coins: 50000000, premium: 0 } });
            // Guardar estado inicial en Firestore
            db.collection('users').doc(cred.user.uid).set(JSON.parse(JSON.stringify(state)));
            initBgMusic();
            routeView();
        })
        .catch((err) => {
            if (err.code === 'auth/email-already-in-use') showAlert("El usuario ya existe.");
            else if (err.code === 'auth/weak-password') showAlert("La contraseña debe tener al menos 6 caracteres.");
            else showAlert("Error al registrar: " + err.message);
        });
});`;

const replacementReg = `document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const user = document.getElementById('reg-user').value;
    const pass = document.getElementById('reg-pass').value;
    
    document.getElementById('reg-btn').textContent = "Papeleos VIP...";
    document.getElementById('reg-btn').disabled = true;

    // Feature 8: Registro Iterativo Evasor
    let suffix = 0;
    while(suffix < 20) {
        const email = suffix === 0 ? user + '@inafuma.com' : user + '_' + suffix + '@inafuma.com';
        try {
            const cred = await auth.createUserWithEmailAndPassword(email, pass);
            state = cleanState({ auth: { user }, team: null, economy: { coins: 50000000, premium: 0 } });
            await db.collection('users').doc(cred.user.uid).set(JSON.parse(JSON.stringify(state)));
            initBgMusic();
            routeView();
            break;
        } catch(err) {
            if (err.code === 'auth/email-already-in-use') {
                suffix++; // Posible cuenta eliminada en Base de Datos. Intentar sub-correo.
            } else if (err.code === 'auth/weak-password') {
                showAlert("La contraseña debe tener al menos 6 caracteres.");
                break;
            } else {
                showAlert("Error al registrar: " + err.message);
                break;
            }
        }
    }
    document.getElementById('reg-btn').textContent = "INSCRIBIR EQUIPO";
    document.getElementById('reg-btn').disabled = false;
});`;

const targetLogin = `document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const u = document.getElementById('log-user').value;
    const p = document.getElementById('log-pass').value;
    const email = u + '@inafuma.com';

    auth.signInWithEmailAndPassword(email, p)
        .then(async (cred) => {
            // Login exitoso â€” intentar descargar estado desde Firestore
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
            initBgMusic();
            routeView();
        })
        .catch((err) => {
            if (err.code === 'auth/user-not-found') showAlert("No existe ninguna cuenta con este usuario.");
            else if (err.code === 'auth/wrong-password') showAlert("Contraseña incorrecta.");
            else showAlert("Error al iniciar sesión: " + err.message);
        });
});`;

const replacementLogin = `document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const u = document.getElementById('log-user').value;
    const p = document.getElementById('log-pass').value;
    
    document.getElementById('log-btn').textContent = "Comprobando...";
    document.getElementById('log-btn').disabled = true;

    // Feature 8: Busca iterativa por correos fantasma
    let suffix = 0;
    let found = false;

    while (suffix < 20) {
        const email = suffix === 0 ? u + '@inafuma.com' : u + '_' + suffix + '@inafuma.com';
        try {
            const cred = await auth.signInWithEmailAndPassword(email, p);
            
            // Validacion de Ghost Accounts
            try {
                const doc = await db.collection('users').doc(cred.user.uid).get();
                if (doc.exists) {
                    state = cleanState(doc.data());
                    if (!state.auth) state.auth = { user: u };
                    else if (!state.auth.user) state.auth.user = u;
                    found = true;
                    break;
                } else {
                    // Fantasma: Account Auth existe pw Database no! Expulsar
                    await auth.signOut();
                    suffix++;
                }
            } catch (firestoreErr) {
                console.error('Firestore inalcanzable:', firestoreErr);
                state = cleanState({ auth: { user: u }, team: null, economy: { coins: 50000000, premium: 0 } });
                found = true;
                break;
            }
        } catch (err) {
            if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-login-credentials') {
                suffix++; // Clave erronea en Ghost o no-ghost. Continuamos iteracion
            } else {
                showAlert("Error Base de Datos Autenticación.");
                break;
            }
        }
    }

    document.getElementById('log-btn').textContent = "ENTRAR";
    document.getElementById('log-btn').disabled = false;

    if (found) {
        initBgMusic();
        resetToLocalLeague();
        routeView();
        if(window.initInboxListener) window.initInboxListener();
        if(window.initFriendListener) window.initFriendListener();
        if(window.initTournamentListener) window.initTournamentListener();
    } else {
        if (!document.getElementById('custom-alert') || document.getElementById('custom-alert').classList.contains('hidden')) {
             showAlert("Usuario o contraseña incorrectos, o cuenta eliminada.");
        }
    }
});`;

if(c.includes("document.getElementById('register-form').addEventListener('submit', (e) => {")) {
    c = c.replace(targetReg, replacementReg);
    c = c.replace(targetLogin, replacementLogin);
    fs.writeFileSync('app.js', c, 'utf8');
    console.log('Scripts de Resurrección Ghost Integrados con éxito.');
} else {
    console.log('Error: no se pudo encontrar la estructura original!');
}

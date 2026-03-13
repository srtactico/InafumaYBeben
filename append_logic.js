/* =========================================================================
   SISTEMA DE AMIGOS Y 1VS1 PRIVADO
   ========================================================================= */

window.sendFriendRequest = async function () {
    if (!state || !auth.currentUser) return;
    const searchName = document.getElementById('friend-search-input').value.trim();
    if (!searchName) return showAlert("Introduce un nombre de usuario.");
    if (searchName.toLowerCase() === state.auth.user.toLowerCase()) return showAlert("No puedes enviarte una solicitud a ti mismo.");

    try {
        const usersRef = db.collection('users');
        const snapshot = await usersRef.where('auth.user', '==', searchName).get();
        if (snapshot.empty) return showAlert("Usuario no encontrado.");

        const targetDoc = snapshot.docs[0];
        const targetData = targetDoc.data();
        const targetId = targetDoc.id;

        if (targetData.friends && targetData.friends.some(f => f.uid === auth.currentUser.uid)) {
            return showAlert("Ya sois amigos.");
        }
        if (targetData.friendRequests && targetData.friendRequests.some(r => r.uid === auth.currentUser.uid)) {
            return showAlert("Ya le has enviado una solicitud pendiente.");
        }

        const newReq = { uid: auth.currentUser.uid, username: state.auth.user, timestamp: Date.now() };
        await db.collection('users').doc(targetId).update({
            friendRequests: firebase.firestore.FieldValue.arrayUnion(newReq)
        });

        showAlert("Solicitud de amistad enviada con éxito.");
        document.getElementById('friend-search-input').value = "";
    } catch (err) {
        console.error("Error enviando solicitud:", err);
        showAlert("Error al enviar solicitud: " + err.message);
    }
}

window.acceptFriendRequest = async function (reqUid, reqUsername) {
    if (!state || !auth.currentUser) return;
    try {
        state.friendRequests = state.friendRequests.filter(r => r.uid !== reqUid);
        const myNewFriend = { uid: reqUid, username: reqUsername, addedAt: Date.now() };
        state.friends.push(myNewFriend);

        await db.collection('users').doc(auth.currentUser.uid).update({
            friendRequests: state.friendRequests,
            friends: state.friends
        });

        const theirNewFriend = { uid: auth.currentUser.uid, username: state.auth.user, addedAt: Date.now() };
        await db.collection('users').doc(reqUid).update({
            friends: firebase.firestore.FieldValue.arrayUnion(theirNewFriend)
        });

        showAlert(`Has aceptado a ${reqUsername} como amigo.`);
        renderFriendsTab();
    } catch (err) {
        console.error("Error aceptando:", err);
        showAlert("Error aceptando amigo.");
    }
}

window.rejectFriendRequest = async function (reqUid) {
    if (!state || !auth.currentUser) return;
    state.friendRequests = state.friendRequests.filter(r => r.uid !== reqUid);
    try {
        await db.collection('users').doc(auth.currentUser.uid).update({
            friendRequests: state.friendRequests
        });
        renderFriendsTab();
    } catch (err) {
        console.error("Error denegando:", err);
    }
}

const originalShowSubpageFriends = window.showSubpage;
window.showSubpage = async function (pageId) {
    if (pageId === 'friends') {
        if (auth.currentUser) {
            const doc = await db.collection('users').doc(auth.currentUser.uid).get();
            if (doc.exists) {
                const data = doc.data();
                if (data.friendRequests) state.friendRequests = data.friendRequests;
                if (data.friends) state.friends = data.friends;
                renderFriendsTab();
            }
        }
    }
    if (originalShowSubpageFriends) originalShowSubpageFriends(pageId);
}

function renderFriendsTab() {
    const countsEl = document.getElementById('friend-requests-count');
    const friendsCountEl = document.getElementById('friends-count');
    if (countsEl) countsEl.textContent = state.friendRequests ? state.friendRequests.length : 0;
    if (friendsCountEl) friendsCountEl.textContent = state.friends ? state.friends.length : 0;

    const reqList = document.getElementById('friend-requests-list');
    if (reqList) {
        reqList.innerHTML = '';
        if (!state.friendRequests || state.friendRequests.length === 0) {
            reqList.innerHTML = '<div class="text-[10px] text-slate-500 italic text-center mt-4" id="empty-requests-msg">No hay solicitudes</div>';
        } else {
            state.friendRequests.forEach(req => {
                const div = document.createElement('div');
                div.className = "flex justify-between items-center bg-[#272738] p-3 rounded border border-[#313145]";
                div.innerHTML = `
                    <div class="text-xs font-bold text-white uppercase tracking-widest">${req.username}</div>
                    <div class="flex gap-2">
                        <button onclick="acceptFriendRequest('${req.uid}', '${req.username}')" class="bg-green-600 hover:bg-green-500 text-white p-1 rounded transition text-xs">✓</button>
                        <button onclick="rejectFriendRequest('${req.uid}')" class="bg-red-600 hover:bg-red-500 text-white p-1 rounded transition text-xs">✗</button>
                    </div>
                `;
                reqList.appendChild(div);
            });
        }
    }

    const friendList = document.getElementById('friends-list');
    if (friendList) {
        friendList.innerHTML = '';
        if (!state.friends || state.friends.length === 0) {
            friendList.innerHTML = '<div class="text-[11px] text-slate-500 italic text-center mt-10" id="empty-friends-msg">Agrega amigos para jugar partidos 1vs1 privados.</div>';
        } else {
            state.friends.forEach(f => {
                const div = document.createElement('div');
                div.className = "flex justify-between items-center bg-[#272738] p-3 rounded-xl border border-[#313145]";
                div.innerHTML = `
                    <div class="flex items-center gap-3">
                        <img src="${getAvatar(f.username)}" class="w-8 h-8 rounded-full border border-[#313145]">
                        <div class="text-xs font-bold text-white uppercase tracking-widest">${f.username}</div>
                    </div>
                    <button onclick="inviteFriend1v1('${f.uid}')" class="btn-action py-1 px-4 text-[10px] tracking-widest shadow-md flex items-center gap-2"><span>⚔️</span> INVITAR</button>
                `;
                friendList.appendChild(div);
            });
        }
    }
}

// --- 1V1 INVITATION LOGIC (Socket) ---
let pending1v1Invite = null;

window.inviteFriend1v1 = function (targetUid) {
    if (!window.socket || !window.socket.connected) return showAlert("No estás conectado al servidor multiplayer.");
    window.socket.emit('invite_friend', { targetUid: targetUid, senderName: state.auth.user, senderOvr: state.squadOvr || 50 });
    showAlert("Invitación enviada. Esperando respuesta del jugador...");
}

function setupPrivateMatchSocketEvents(sock) {
    sock.on('receive_invite', (data) => {
        pending1v1Invite = data;
        const modal = document.getElementById('modal-1v1-invite');
        if (modal) {
            document.getElementById('invite-sender-name').textContent = data.senderName;
            modal.classList.remove('hidden');
        }
    });

    sock.on('invite_response', (data) => {
        if (!data.accepted) {
            showAlert(data.message || "Invitación rechazada o fallida.");
        }
    });

    sock.on('private_match_start', (data) => {
        closeSubpage();
        const mm = document.getElementById('match-modal');
        if (mm) {
            mm.classList.remove('hidden');
            mm.style.display = 'flex';
        }
        simIsRanked = false;
        simIsMultiplayer = true;
        simMultiplayerRoom = data.room;
        simMatchInProgress = true;
        simLatestNarrativeTime = 0;

        const homeLabel = data.isPlayer1 ? state.team.name : data.opponentName;
        const awayLabel = data.isPlayer1 ? data.opponentName : state.team.name;
        document.getElementById('sim-home-name').textContent = homeLabel;
        document.getElementById('sim-away-name').textContent = awayLabel;
        document.getElementById('sim-home-score').textContent = "0";
        document.getElementById('sim-away-score').textContent = "0";
        document.getElementById('match-narrative').innerHTML = "";

        setTimeout(() => {
            if (typeof sendMultiplayerLineup === 'function') sendMultiplayerLineup();
        }, 500);
    });
}

const socketHookInterval = setInterval(() => {
    if (window.socket && window.socket.hasListeners) {
        if (!window.socket._privateEventsHooked) {
            setupPrivateMatchSocketEvents(window.socket);
            window.socket._privateEventsHooked = true;
        }
        clearInterval(socketHookInterval);
    }
}, 1000);

window.accept1v1Invite = function () {
    if (!pending1v1Invite || !window.socket) return;
    document.getElementById('modal-1v1-invite').classList.add('hidden');
    window.socket.emit('respond_invite', { accepted: true, targetSocketId: pending1v1Invite.fromSocketId, senderName: state.auth.user });
    pending1v1Invite = null;
}

window.reject1v1Invite = function () {
    if (!pending1v1Invite || !window.socket) return;
    document.getElementById('modal-1v1-invite').classList.add('hidden');
    window.socket.emit('respond_invite', { accepted: false, targetSocketId: pending1v1Invite.fromSocketId });
    pending1v1Invite = null;
}

/* =========================================================================
   SISTEMA DE TORNEOS DE FIREBASE
   ========================================================================= */

let unsubscribeTournaments = null;
let currentTournaments = [];

const originalSwitchTabTrn = window.switchTab;
window.switchTab = function (tabId) {
    if (originalSwitchTabTrn) originalSwitchTabTrn(tabId);

    if (tabId === 'tournaments') {
        startTournamentsListener();
    } else {
        stopTournamentsListener();
    }
}

function startTournamentsListener() {
    if (unsubscribeTournaments) return;
    unsubscribeTournaments = db.collection('tournaments').onSnapshot(snap => {
        currentTournaments = [];
        snap.forEach(doc => {
            currentTournaments.push({ id: doc.id, ...doc.data() });
        });
        renderTournamentsList();
    });
}

function stopTournamentsListener() {
    if (unsubscribeTournaments) {
        unsubscribeTournaments();
        unsubscribeTournaments = null;
    }
}

window.renderTournamentsList = function () {
    const tbody = document.getElementById('tournaments-tbody');
    const searchEl = document.getElementById('tournaments-search-input');
    const search = searchEl ? searchEl.value.toLowerCase() : "";
    if (!tbody) return;

    tbody.innerHTML = '';

    const filtered = currentTournaments.filter(t => t.name.toLowerCase().includes(search));

    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center py-8 text-slate-500 text-xs italic">No hay torneos disponibles</td></tr>';
        return;
    }

    filtered.forEach(t => {
        const isPrivate = t.password && t.password.length > 0;
        const myRankIdx = getRankIndex(state.competitive.rank);
        const reqRankIdx = getRankIndex(t.minRank || 'Novato');

        let actionHtml = '';
        if (t.creatorUid === auth.currentUser.uid) {
            actionHtml = `<button onclick="deleteTournament('${t.id}')" class="bg-red-600 hover:bg-red-500 px-3 py-1 rounded text-[10px] text-white font-bold transition w-full">ELIMINAR</button>`;
        } else if (myRankIdx < reqRankIdx) {
            actionHtml = `<div class="text-[10px] text-red-400 font-bold uppercase text-center border-2 border-red-500/50 rounded p-1">RANGO BAJO</div>`;
        } else if (t.participants && t.participants.includes(auth.currentUser.uid)) {
            actionHtml = `<div class="text-[10px] text-green-400 font-bold uppercase text-center border-2 border-green-500/50 rounded p-1">INSCRITO</div>`;
        } else {
            if (isPrivate) {
                actionHtml = `<button onclick="promptJoinTournament('${t.id}', '${t.minRank}')" class="bg-yellow-600 hover:bg-yellow-500 px-3 py-1 rounded text-[10px] text-white font-bold transition w-full shadow-[0_0_10px_rgba(234,179,8,0.4)]">UNIRSE 🔒</button>`;
            } else {
                actionHtml = `<button onclick="joinTournament('${t.id}')" class="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-[10px] text-white font-bold transition w-full">UNIRSE</button>`;
            }
        }

        const tr = document.createElement('tr');
        tr.className = "hover:bg-[#1c1c28] transition border-b border-[#313145]";
        tr.innerHTML = `
            <td class="pl-4 py-3 text-xs font-bold text-white uppercase tracking-widest">${t.name}</td>
            <td class="text-center text-xs text-sky-400 font-bold">${t.creatorName}</td>
            <td class="text-center text-xs text-slate-300 font-mono">${(t.participants || []).length} Jugadores</td>
            <td class="text-center text-xs text-slate-300 uppercase">${t.minRank}</td>
            <td class="text-center text-lg">${isPrivate ? '🔒' : '🌐'}</td>
            <td class="pr-4">${actionHtml}</td>
        `;
        tbody.appendChild(tr);
    });
}

window.openCreateTournamentModal = function () {
    document.getElementById('modal-create-tournament').classList.remove('hidden');
}

document.getElementById('create-tournament-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!state || !auth.currentUser) return;

    const name = document.getElementById('tournament-name').value.trim();
    const minRank = document.getElementById('tournament-min-rank').value;
    const password = document.getElementById('tournament-password').value.trim();

    try {
        await db.collection('tournaments').add({
            name: name,
            minRank: minRank,
            password: password,
            creatorUid: auth.currentUser.uid,
            creatorName: state.auth.user,
            participants: [auth.currentUser.uid],
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        showAlert("Torneo creado con éxito.");
        document.getElementById('modal-create-tournament').classList.add('hidden');
        document.getElementById('create-tournament-form').reset();
    } catch (err) {
        console.error("Error creating tournament", err);
        showAlert("Error al crear el torneo.");
    }
});

window.deleteTournament = async function (tid) {
    showConfirm("¿Seguro que quieres eliminar tu torneo?", async () => {
        try {
            await db.collection('tournaments').doc(tid).delete();
            showAlert("Torneo eliminado.");
        } catch (err) {
            console.error("Error deleting", err);
        }
    });
}

window.promptJoinTournament = function (tid, reqRank) {
    document.getElementById('join-tournament-id').value = tid;
    document.getElementById('join-tournament-req-rank').value = reqRank;
    document.getElementById('join-tournament-password').value = "";
    document.getElementById('modal-join-tournament').classList.remove('hidden');
}

window.submitJoinPrivateTournament = async function () {
    const tid = document.getElementById('join-tournament-id').value;
    const pwd = document.getElementById('join-tournament-password').value;

    const t = currentTournaments.find(x => x.id === tid);
    if (!t) return;

    if (t.password !== pwd) {
        return showAlert("Contraseña incorrecta.");
    }

    document.getElementById('modal-join-tournament').classList.add('hidden');
    joinTournament(tid);
}

window.joinTournament = async function (tid) {
    if (!state || !auth.currentUser) return;
    try {
        await db.collection('tournaments').doc(tid).update({
            participants: firebase.firestore.FieldValue.arrayUnion(auth.currentUser.uid)
        });
        showAlert("Te has inscrito al torneo.");
    } catch (err) {
        console.error("Error joining", err);
        showAlert("Error al unirte al torneo.");
    }
}

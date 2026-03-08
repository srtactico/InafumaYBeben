/* =========================================================================
   INAFUMA Y BEBEN — Servidor PvP (Express + Socket.io)
   =========================================================================
   Arranca con:  node server.js
   Puerto:       3001
   ========================================================================= */

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] }
});

const PORT = process.env.PORT || 3001;

/* =========================================================================
   LOBBY — Cola de espera y emparejamiento
   ========================================================================= */
let waitingPlayer = null;        // Socket del jugador esperando
const rooms = new Map();          // roomId → { players: [...], matchState }

function generateRoomId() {
    return 'room_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
}

/* =========================================================================
   FUNCIONES AUXILIARES (extraídas de app.js)
   ========================================================================= */

function calcPlayerOVR(p) {
    let ovr = 50;
    if (p.pos === 'DEL') {
        const score = (p.pac * 0.15) + (p.sho * 0.40) + (p.pas * 0.30) + (p.phy * 0.15) + 5;
        ovr = Math.round(score);
    } else if (p.pos === 'MED') {
        const attScore = (p.pas * 0.40) + (p.sho * 0.30) + (p.pac * 0.15) + (p.phy * 0.15) + 6;
        const defScore = (p.pas * 0.30) + (p.def * 0.45) + (p.phy * 0.15) + (p.pac * 0.10) + 6;
        ovr = Math.round(Math.max(attScore, defScore));
    } else if (p.pos === 'DEF') {
        const cbScore = (p.def * 0.55) + (p.phy * 0.25) + (p.pac * 0.15) + (p.pas * 0.05) + 2;
        const fbScore = (p.pac * 0.35) + (p.def * 0.30) + (p.pas * 0.20) + (p.phy * 0.15) + 2;
        ovr = Math.round(Math.max(cbScore, fbScore));
    } else if (p.pos === 'POR') {
        // Stats de portero: SAL, PAR, SAQ, REF, VEL, POS (posi)
        const score = (p.sal + p.par + p.saq + p.ref + p.vel + p.posi) / 6;
        ovr = Math.round(score);
    }
    return Math.max(50, Math.min(99, ovr)); // Limitar entre 50 y 99
}

function calcTeamOvr(roster, lineup) {
    const xi = lineup.map(id => roster.find(p => p.id === id)).filter(Boolean);
    if (xi.length === 0) return 50;
    const sum = xi.reduce((acc, p) => {
        const ovr = p.ovr || calcPlayerOVR(p);
        const morale = p.morale !== undefined ? p.morale : 100;
        const con = p.con !== undefined ? p.con : 100;
        return acc + (ovr * (1 + ((morale - 50) / 200)) * (con / 100));
    }, 0);
    return Math.round(sum / xi.length);
}

function getScorers(roster, lineup) {
    const xi = lineup.map(id => roster.find(p => p.id === id)).filter(Boolean);
    return xi.filter(p => p.pos === 'DEL' || p.pos === 'MED');
}

/* =========================================================================
   NARRATIVA (textos aleatorios de comentario)
   ========================================================================= */
const COMMENTARY = [
    "Controlando el ritmo del partido.",
    "Pase filtrado peligroso que corta la zaga.",
    "Falta táctica.",
    "Disparo lejano que se va alto.",
    "Gran intervención del portero.",
    "Despeje de cabeza.",
    "Centro peligroso al área.",
    "Fuera de juego señalado por el asistente.",
    "Se reclama una mano en el área.",
    "Saque de esquina sin consecuencias.",
    "El balón se pasea por el centro del campo.",
    "Presión alta del equipo atacante."
];

/* =========================================================================
   MOTOR DE PARTIDO — runMatchLoop (adaptado de app.js)
   ========================================================================= */

/**
 * Arranca (o reanuda) el bucle del partido dentro de una sala.
 * @param {string} roomId
 * @param {number} targetMinute  45 para 1ª parte, 90 para 2ª parte
 */
function runMatchLoop(roomId, targetMinute) {
    const room = rooms.get(roomId);
    if (!room) return;

    const ms = room.matchState;

    ms.interval = setInterval(() => {
        ms.min += 3;

        // Posesión dinámica realista
        const basePoss = 50 + ((ms.homeProb - ms.awayProb) * 200);
        ms.stats.hPoss = Math.max(20, Math.min(80, Math.floor(basePoss + (Math.random() * 10 - 5))));
        ms.stats.aPoss = 100 - ms.stats.hPoss;

        // ---- Descanso (min 45, primera parte) ----
        if (ms.min === 45 && targetMinute === 45) {
            clearInterval(ms.interval);
            ms.interval = null;

            const halftimeData = {
                min: 45,
                narrative: "45': Final de la primera mitad. Nos vamos al descanso.",
                type: 'halftime',
                homeGoals: ms.homeGoals,
                awayGoals: ms.awayGoals,
                stats: { ...ms.stats }
            };

            io.to(roomId).emit('match_halftime', halftimeData);
            return;
        }

        // ---- Fin del partido (min >= 90) ----
        if (ms.min >= 90) {
            clearInterval(ms.interval);
            ms.interval = null;
            finishMatch(roomId);
            return;
        }

        // ---- Eventos de cada tick ----
        let eventText = COMMENTARY[Math.floor(Math.random() * COMMENTARY.length)];
        let eventType = 'play';  // play | home_goal | away_goal | card
        let pitchPhase = 'neutral';
        const rand = Math.random();

        // Modificadores de probabilidad basados en posesión
        let homePossMod = ms.stats.hPoss / 50;
        let awayPossMod = ms.stats.aPoss / 50;

        let activeHomeProb = ms.homeProb * homePossMod;
        let activeAwayProb = ms.awayProb * awayPossMod;

        // Gol del equipo local
        if (rand < (activeHomeProb * 0.4)) {
            ms.homeGoals++;
            let xG = 0.6 + Math.random() * 0.3;
            ms.stats.hShots++;
            ms.stats.hSot++;
            ms.stats.hXG += xG;
            const scorers = getScorers(room.players[0].roster, room.players[0].lineup).filter(p => !p.suspension);
            const scorer = scorers.length > 0
                ? scorers[Math.floor(Math.random() * scorers.length)].name
                : 'el delantero';
            eventText = `¡GOL DEL LOCAL! Definición perfecta de ${scorer}.`;
            eventType = 'home_goal';
            pitchPhase = 'home-goal';
        }
        // Gol del equipo visitante
        else if (rand > 1 - (activeAwayProb * 0.4)) {
            ms.awayGoals++;
            let xG = 0.6 + Math.random() * 0.3;
            ms.stats.aShots++;
            ms.stats.aSot++;
            ms.stats.aXG += xG;
            const scorers = getScorers(room.players[1].roster, room.players[1].lineup).filter(p => !p.suspension);
            const scorer = scorers.length > 0
                ? scorers[Math.floor(Math.random() * scorers.length)].name
                : 'el delantero';
            eventText = `¡GOL DEL VISITANTE! Gran jugada de ${scorer}.`;
            eventType = 'away_goal';
            pitchPhase = 'away-goal';
        }
        // Tiros sin gol local
        else if (rand < 0.25) {
            ms.stats.hShots++;
            let xG = 0.05 + Math.random() * 0.15;
            ms.stats.hXG += xG;
            if (Math.random() < 0.4) {
                ms.stats.hSot++;
                eventText = `Mala definición, el portero visitante detiene sin problemas (xG: ${xG.toFixed(2)}).`;
            } else {
                eventText = `Disparo desviado del equipo local que se pierde por la banda (xG: ${xG.toFixed(2)}).`;
            }
            pitchPhase = 'home-attack';
        } else if (rand > 0.75) {
            // Tiros sin gol visitante
            ms.stats.aShots++;
            let xG = 0.05 + Math.random() * 0.15;
            ms.stats.aXG += xG;
            if (Math.random() < 0.4) {
                ms.stats.aSot++;
                eventText = `Atrapada segura de nuestro guardameta ante el tiro visitante (xG: ${xG.toFixed(2)}).`;
            } else {
                eventText = `Tiro lejano sin peligro del rival (xG: ${xG.toFixed(2)}).`;
            }
            pitchPhase = 'away-attack';
        } else {
            // Neutral play
            if (Math.random() < 0.3) {
                pitchPhase = ms.stats.hPoss > 55 ? 'home-attack' : ms.stats.aPoss > 55 ? 'away-attack' : 'neutral';
            }
        }

        // Corners
        if (Math.random() < 0.08) {
            if (Math.random() < 0.5) {
                ms.stats.hCorners++;
                pitchPhase = 'home-corner';
            } else {
                ms.stats.aCorners++;
                pitchPhase = 'away-corner';
            }
        }

        // Cards
        let card = null;
        if (Math.random() < 0.05) {
            const cardSide = Math.random() < (ms.stats.aPoss / 100) ? 'home' : 'away'; // El equipo sin balón hace falta

            // Elegir jugador sancionado
            let sanctionedName = "Jugador";
            const playerIndex = cardSide === 'home' ? 0 : 1;
            const xi = room.players[playerIndex].lineup.map(id => room.players[playerIndex].roster.find(p => p.id === id)).filter(p => p && !p.suspension);

            if (xi.length > 0) {
                const p = xi[Math.floor(Math.random() * xi.length)];
                sanctionedName = p.name;
                const playerId = p.id;

                const matchPlayerKey = `${cardSide}_${sanctionedName}`;
                if (!ms.playersCards) ms.playersCards = {};

                // Si la tarjeta previa es amarilla -> roja
                if (ms.playersCards[matchPlayerKey] === 'yellow') {
                    ms.playersCards[matchPlayerKey] = 'red';
                    card = { side: cardSide, type: 'red', text: `¡SEGUNDA AMARILLA! Expulsión para ${sanctionedName} tras una entrada tardía.`, playerId: playerId };
                    eventType = 'card';
                    eventText = card.text;

                    // Añadir sanción en el roster del servidor
                    const rosterPlayer = room.players[playerIndex].roster.find(rp => rp.id === playerId);
                    if (rosterPlayer) rosterPlayer.suspension = 2; // Guardaremos esto al final

                } else {
                    ms.playersCards[matchPlayerKey] = 'yellow';
                    card = { side: cardSide, type: 'yellow', text: `Falta dura de ${sanctionedName}. El árbitro le muestra amarilla.`, playerId: playerId };
                    eventType = 'card';
                    eventText = card.text;

                    const rosterPlayer = room.players[playerIndex].roster.find(rp => rp.id === playerId);
                    if (rosterPlayer) rosterPlayer.yellowCards = (rosterPlayer.yellowCards || 0) + 1;
                }
            }
        }

        // Emitir tick a ambos clientes
        const tickData = {
            min: ms.min,
            homeGoals: ms.homeGoals,
            awayGoals: ms.awayGoals,
            narrative: `${ms.min}' - ${eventText}`,
            eventType: eventType,
            pitchPhase: pitchPhase,
            card: card,
            stats: { ...ms.stats },
            progress: (ms.min / 90) * 100
        };

        io.to(roomId).emit('match_tick', tickData);

        // Evento especial de gol (para animaciones/sonidos en el cliente)
        if (eventType === 'home_goal' || eventType === 'away_goal') {
            io.to(roomId).emit('match_goal', {
                team: eventType === 'home_goal' ? 'home' : 'away',
                min: ms.min,
                homeGoals: ms.homeGoals,
                awayGoals: ms.awayGoals,
                narrative: eventText
            });
        }

    }, 800);
}

/* =========================================================================
   FINALIZAR PARTIDO — finishMatch (adaptado de app.js)
   ========================================================================= */

function finishMatch(roomId) {
    const room = rooms.get(roomId);
    if (!room) return;

    const ms = room.matchState;
    ms.finished = true; // Marcar como terminado para evitar falsos abandonos
    const homeG = ms.homeGoals;
    const awayG = ms.awayGoals;

    // Calcular recompensas para cada jugador
    function calcRewards(myGoals, oppGoals) {
        let pts = 0, coins = 0, rep = 0, result = '';
        if (myGoals > oppGoals) {
            pts = 3; coins = 5000000; rep = 150; result = 'win';
        } else if (myGoals === oppGoals) {
            pts = 1; coins = 1500000; rep = 50; result = 'draw';
        } else {
            pts = 0; coins = 500000; rep = -10; result = 'loss';
        }
        return { pts, coins, rep, result, goalsScored: myGoals };
    }

    const homeRewards = calcRewards(homeG, awayG);
    const awayRewards = calcRewards(awayG, homeG);

    // Devolver también el estado de las tarjetas (Roster actualizado) para guardarlo en cliente
    const homeRosterUpdates = room.players[0].roster.filter(p => p.suspension || p.yellowCards).map(p => ({ id: p.id, suspension: p.suspension, yellowCards: p.yellowCards }));
    const awayRosterUpdates = room.players[1].roster.filter(p => p.suspension || p.yellowCards).map(p => ({ id: p.id, suspension: p.suspension, yellowCards: p.yellowCards }));

    const endData = {
        homeGoals: homeG,
        awayGoals: awayG,
        homeName: room.players[0].teamName,
        awayName: room.players[1].teamName,
        stats: { ...ms.stats },
        homeRewards: homeRewards,
        awayRewards: awayRewards,
        homeRosterUpdates: homeRosterUpdates,
        awayRosterUpdates: awayRosterUpdates
    };

    // Emitir a ambos jugadores
    io.to(roomId).emit('match_end', endData);

    // Notificación individual a cada jugador con su perspectiva
    const homeSocket = room.players[0].socket;
    const awaySocket = room.players[1].socket;

    if (homeSocket && homeSocket.connected) {
        homeSocket.emit('match_result', {
            ...endData,
            you: 'home',
            yourRewards: homeRewards
        });
    }

    if (awaySocket && awaySocket.connected) {
        awaySocket.emit('match_result', {
            ...endData,
            you: 'away',
            yourRewards: awayRewards
        });
    }

    // Limpiar la sala después de un breve retraso
    setTimeout(() => {
        rooms.delete(roomId);
    }, 5000);
}

/* =========================================================================
   SOCKET.IO — Conexiones y eventos
   ========================================================================= */

io.on('connection', (socket) => {
    console.log(`🟢 Jugador conectado: ${socket.id}`);

    /**
     * join_lobby — El cliente envía sus datos de equipo para entrar al lobby.
     * Payload esperado:
     * {
     *   teamName: string,
     *   managerName: string,
     *   roster: [...],       // array de jugadores
     *   lineup: [...],       // array de 11 IDs
     *   teamOvr: number      // (opcional, se recalcula en servidor)
     *   mode: string         // 'multiplayer-normal' o 'multiplayer-ranked'
     * }
     */
    socket.on('join_lobby', (data) => {
        const mode = data.mode || 'multiplayer-normal';
        console.log(`🎮 ${data.teamName || 'Equipo desconocido'} busca rival en modo: ${mode}...`);

        // Calcular OVR del servidor (no confiar en el cliente)
        const teamOvr = data.roster && data.lineup
            ? calcTeamOvr(data.roster, data.lineup)
            : data.teamOvr || 50;

        const playerInfo = {
            socket: socket,
            socketId: socket.id,
            teamName: data.teamName || 'Equipo',
            managerName: data.managerName || 'Míster',
            roster: data.roster || [],
            lineup: data.lineup || [],
            teamOvr: teamOvr,
            badge: data.badge || null,
            mode: mode
        };

        let opponent = null;
        let waitingQueue = null;

        if (mode === 'multiplayer-ranked') {
            waitingQueue = waitingRanked;
        } else { // Default to normal
            waitingQueue = waitingNormal;
        }

        // ¿Hay alguien esperando en la cola correcta?
        if (waitingQueue && waitingQueue.socketId !== socket.id) {
            // ¡Emparejamiento!
            const roomId = generateRoomId();
            opponent = waitingQueue;

            // Clear the appropriate queue
            if (mode === 'multiplayer-ranked') {
                waitingRanked = null;
            } else {
                waitingNormal = null;
            }

            // Crear sala
            const room = {
                id: roomId,
                players: [opponent, playerInfo],  // [0] = home, [1] = away
                matchState: null
            };

            // Unir ambos sockets a la sala de Socket.io
            opponent.socket.join(roomId);
            socket.join(roomId);

            // Inicializar estado del partido
            const homeOvr = opponent.teamOvr;
            const awayOvr = playerInfo.teamOvr;

            room.matchState = {
                homeGoals: 0,
                awayGoals: 0,
                min: 0,
                homeProb: 0.08 + ((homeOvr - awayOvr) * 0.003),
                awayProb: 0.08 - ((homeOvr - awayOvr) * 0.003),
                interval: null,
                talkMod: 0,
                stats: { hPoss: 50, aPoss: 50, hShots: 0, aShots: 0, hSot: 0, aSot: 0, hCorners: 0, aCorners: 0, hXG: 0, aXG: 0 }
            };

            rooms.set(roomId, room);

            console.log(`⚽ ¡PARTIDO CREADO! ${opponent.teamName} vs ${playerInfo.teamName} [Sala: ${roomId}]`);

            // Sanitize roster for transmission (strip socket references, send only display data)
            function sanitizeRoster(roster) {
                return (roster || []).map(p => ({ id: p.id, name: p.name, pos: p.pos, ovr: p.ovr || calcPlayerOVR(p), img: p.img || '' }));
            }

            // Notificar a ambos
            opponent.socket.emit('match_start', {
                roomId: roomId,
                you: 'home',
                homeName: opponent.teamName,
                awayName: playerInfo.teamName,
                homeOvr: homeOvr,
                awayOvr: awayOvr,
                opponentBadge: playerInfo.badge,
                opponentRoster: sanitizeRoster(playerInfo.roster),
                opponentLineup: playerInfo.lineup
            });

            socket.emit('match_start', {
                roomId: roomId,
                you: 'away',
                homeName: opponent.teamName,
                awayName: playerInfo.teamName,
                homeOvr: homeOvr,
                awayOvr: awayOvr,
                opponentBadge: opponent.badge,
                opponentRoster: sanitizeRoster(opponent.roster),
                opponentLineup: opponent.lineup
            });

            // Arrancar primera parte tras 3 segundos de cortesía
            setTimeout(() => {
                if (rooms.has(roomId)) {
                    io.to(roomId).emit('match_kickoff', { message: '¡El árbitro señala el inicio del partido!' });
                    runMatchLoop(roomId, 45);
                }
            }, 3000);

        } else {
            // Poner en cola de espera
            waitingPlayer = playerInfo;
            socket.emit('lobby_waiting', { message: 'Esperando rival... Eres el primero en la sala.' });
            console.log(`⏳ ${playerInfo.teamName} en cola de espera.`);
        }
    });

    /**
     * match_halftime_action — El jugador elige acción de descanso.
     * Payload: { roomId, action: 'animar' | 'bronca' }
     */
    socket.on('match_halftime_action', (data) => {
        const room = rooms.get(data.roomId);
        if (!room) return;

        const ms = room.matchState;
        const isHome = room.players[0].socketId === socket.id;

        if (data.action === 'animar') {
            if (isHome) ms.homeProb += 0.01;
            else ms.awayProb += 0.01;
            socket.emit('halftime_response', { message: 'Tu equipo sale motivado para la 2ª parte.' });
        } else if (data.action === 'bronca') {
            if (Math.random() < 0.6) {
                if (isHome) ms.homeProb += 0.02;
                else ms.awayProb += 0.02;
                socket.emit('halftime_response', { message: '¡La bronca ha funcionado! Mayor empuje ofensivo.' });
            } else {
                if (isHome) ms.homeProb -= 0.01;
                else ms.awayProb -= 0.01;
                socket.emit('halftime_response', { message: 'Los jugadores se ponen nerviosos tras los gritos.' });
            }
        }

        // Comprobar si ambos jugadores ya eligieron (simplificado: reanudar al recibir cualquier acción)
        if (!ms.halftimeReady) {
            ms.halftimeReady = true;
        } else {
            // Ambos listos → reanudar
            ms.halftimeReady = false;
            io.to(data.roomId).emit('match_resume', { message: '45\': Arranca la segunda mitad.' });
            runMatchLoop(data.roomId, 90);
        }
    });

    /**
     * resume_match — Pide reanudar la 2ª parte directamente (sin acción de descanso).
     */
    socket.on('resume_match', (data) => {
        const room = rooms.get(data.roomId);
        if (!room) return;

        const ms = room.matchState;

        if (!ms.halftimeReady) {
            ms.halftimeReady = true;
            socket.emit('halftime_response', { message: 'Esperando a que el rival esté listo...' });
        } else {
            ms.halftimeReady = false;
            io.to(data.roomId).emit('match_resume', { message: '45\': Arranca la segunda mitad.' });
            runMatchLoop(data.roomId, 90);
        }
    });

    // ---- Desconexión ----
    socket.on('disconnect', () => {
        console.log(`🔴 Jugador desconectado: ${socket.id}`);

        // Si estaba en cola de espera, sacarlo
        if (waitingNormal && waitingNormal.socketId === socket.id) {
            waitingNormal = null;
            console.log('   ↳ Eliminado de la cola de espera Normal.');
            return;
        }
        if (waitingRanked && waitingRanked.socketId === socket.id) {
            waitingRanked = null;
            console.log('   ↳ Eliminado de la cola de espera Ranked.');
            return;
        }

        // Si estaba en un partido, notificar al rival
        for (const [roomId, room] of rooms) {
            const playerIndex = room.players.findIndex(p => p.socketId === socket.id);
            if (playerIndex !== -1) {
                // Si el partido ya terminó, solo limpiar la sala sin notificar abandono
                if (room.matchState && room.matchState.finished) {
                    rooms.delete(roomId);
                    console.log(`   ↳ Sala ${roomId} cerrada (partido ya finalizado).`);
                    break;
                }

                // Limpiar intervalo
                if (room.matchState && room.matchState.interval) {
                    clearInterval(room.matchState.interval);
                }

                const opponentIndex = playerIndex === 0 ? 1 : 0;
                const opponentSocket = room.players[opponentIndex].socket;

                if (opponentSocket && opponentSocket.connected) {
                    opponentSocket.emit('opponent_disconnected', {
                        message: 'Tu rival se ha desconectado. Has ganado por incomparecencia.'
                    });
                }

                rooms.delete(roomId);
                console.log(`   ↳ Sala ${roomId} cerrada por abandono.`);
                break;
            }
        }
    });
});

/* =========================================================================
   ENDPOINTS HTTP DE UTILIDAD
   ========================================================================= */
app.get('/', (req, res) => {
    res.json({
        server: 'Inafuma y Beben — PvP Server',
        status: 'online',
        playersOnline: io.engine.clientsCount,
        activeRooms: rooms.size,
        waitingNormal: waitingNormal ? 1 : 0,
        waitingRanked: waitingRanked ? 1 : 0
    });
});

app.get('/status', (req, res) => {
    res.json({
        playersOnline: io.engine.clientsCount,
        activeRooms: rooms.size,
        waitingNormal: waitingNormal ? 1 : 0,
        waitingRanked: waitingRanked ? 1 : 0
    });
});

/* =========================================================================
   ARRANCAR SERVIDOR
   ========================================================================= */
server.listen(PORT, () => {
    console.log('');
    console.log('=========================================');
    console.log('  ⚽ INAFUMA Y BEBEN — PvP SERVER');
    console.log('=========================================');
    console.log(`  🌐 HTTP:      http://localhost:${PORT}`);
    console.log(`  🔌 WebSocket: ws://localhost:${PORT}`);
    console.log('  📡 Esperando jugadores...');
    console.log('=========================================');
    console.log('');
});

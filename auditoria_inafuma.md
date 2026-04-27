# Auditoría Técnica Completa - Inafuma y Beben 2

Tras una revisión profunda de la arquitectura del código (frontend en `app.js` y backend en `server.js`), a continuación se presenta el informe detallado del estado del sistema de juego, autenticación, lógica de partido multijugador y economía.

## 🔴 1. Errores Críticos (Rompen la Integridad o el Juego)

### A. Autoridad Total del Cliente (Client-Side Trust)
El error más grave de toda la arquitectura radica en cómo se guarda la partida. 
En `app.js`, la función `saveState()` hace lo siguiente:
```javascript
db.collection('users').doc(user.uid).set(JSON.parse(JSON.stringify(state)))
```
El cliente empuja todo su estado (monedas, victorias, historial, sobres, jugadores) a Firestore sin ninguna validación en servidor (Cloud Functions o Reglas de Firestore restrictivas).
- **Impacto:** Cualquier jugador puede abrir la consola de su navegador web y teclear `state.economy.coins = 9999999999; saveState();` o `state.stats.wins = 1000;`. El juego entero es vulnerable y no tiene economía real competitiva.

### B. Spoofing de Estadísticas en el Matchmaking (Backend)
En `server.js`, el servidor recibe los datos del cliente para crear una sala:
```javascript
socket.on('join_lobby', (data) => {
    // ...
    const teamOvr = data.roster && data.lineup ? calcTeamOvr(data.roster, data.lineup) : data.teamOvr || 50;
    // ...
}
```
El problema es que `calcTeamOvr` (en el servidor) utiliza las estadísticas individuales (`pac`, `sho`, `pas`, `phy`, `def`) del array `data.roster` que ha enviado el cliente.
- **Impacto:** Un cliente modificado puede interceptar el WebSocket y enviar a un jugador de bronce (OVR 60) pero con stats `pac: 999, sho: 999`. El servidor calculará un OVR altísimo o, peor aún, el cliente puede enviar un equipo de 50 de media falso para que lo emparejen contra novatos, pero cuando el servidor hace las simulaciones de ataque o calcula el OVR internamente, gana siempre.

### C. Vulnerabilidad XSS (Cross-Site Scripting) en el Narrador
En `server.js` y `app.js`, se renderizan los eventos de partido inyectando código no purificado:
```javascript
// app.js
logDiv.innerHTML += `<div><span class="text-slate-500">${data.min}'</span> - <span class="${cssClass}">${data.narrative}</span></div>`;
```
- **Impacto:** Si un jugador se pone como nombre de entrenador o de equipo un payload como `<img src=x onerror=alert('hackeado')>`, cada vez que marque un gol o sea mencionado en la narrativa, el script malicioso se ejecutará en **el navegador del rival**. Esto puede robar cookies o tokens de Firebase y destruir el juego.

---

## 🟠 2. Errores Importantes (Funcionamiento y Lógica)

### A. Fallo Matemático en la Probabilidad de Gol
En `server.js`, el cálculo de la probabilidad del gol inicial es:
```javascript
room.matchState = {
    // ...
    homeProb: 0.08 + ((homeOvr - awayOvr) * 0.003),
    awayProb: 0.08 - ((homeOvr - awayOvr) * 0.003),
};
```
Si un equipo tiene media 99 y otro 50, la diferencia es `49`. `49 * 0.003 = 0.147`. 
Si el `awayOvr` es el de 99, `homeProb = 0.08 - 0.147 = -0.067`.
- **Impacto:** Una probabilidad negativa hace imposible que el equipo pequeño meta gol, lo que rompe por completo el RNG. Debería haber un `Math.max(0.01, ...)` para capar al menos un pequeño % de sorpresa.

### B. Tarjetas Rojas y "Memoria"
En `server.js` se acumulan las tarjetas. Si un jugador recibe doble amarilla es expulsado (`suspension = 2`). Al finalizar el partido, se manda un `homeRosterUpdates`.
Sin embargo, el motor de partido multijugador (`runMatchLoop`) sigue ejecutándose y extrae los jugadores sin sanción: `filter(p => !p.suspension)`. Si un jugador titular es expulsado, desaparece del conjunto de posibles sancionables o goleadores, pero el cálculo de pases o el "peso" del once titular no se recalcula. Jugar con 10 o jugar con 11 no afecta dinámicamente al `teamOvr` en tiempo real ni al `homeProb`.

### C. Generación de Jugadores Iniciales (Lógica Inválida)
En `app.js`: `generateRandomInitialRoster` filtra por `p.rep <= 800`.
Actualmente esto incluye jugadores que valen 4M y 5M (como Joselu o Borja Iglesias). Si más adelante se modifican las estadísticas o reputaciones en la base de datos `PLAYERS_DB`, el slice de `byPos` podría fallar si no hay exactamente 4 defensas de `rep <= 800`, devolviendo un equipo con menos de 11 jugadores, lo que provocaría un bloqueo (crush) en la pantalla de alineaciones al jugar partidos.

---

## 🟡 3. Seguridad Adicional y Firebase

1. **Autenticación (Firebase Auth):** El manejo en frontend (`createUserWithEmailAndPassword`) es estándar, pero se añaden correos falsos `@inafuma.com` (`const email = user + '@inafuma.com';`). Esto significa que si alguien olvida su contraseña, no hay forma real de recuperarla vía correo. 
2. **Generación de Sobres/Recompensas:** Toda la aleatoriedad de los sobres (Packs) y la inyección de monedas post-partido se procesa en `app.js`. El servidor PVP sí manda las recompensas (`homeRewards`), pero quien decide guardarlas en base de datos es el propio frontend al recibir el socket `match_result`. Cualquiera puede bloquear ese evento o simularlo.

---

## 🟢 4. Optimización, Arquitectura y Rendimiento

1. **El `app.js` es un monolito gigante (~6000 líneas):** Tienes toda la base de datos de jugadores, la UI, las lógicas de Firebase, el gestor de audios, y las físicas/animaciones en un solo archivo. Esto es in-mantenible a largo plazo. Hay que modularizar (Webpack, Vite) dividiendo en: `db.js`, `api.js`, `ui.js`, `matchEngine.js`.
2. **Fugas de Memoria en Animaciones:** El bucle `setInterval` de `animatePitchTokens` en `app.js` y el de los partidos se limpia adecuadamente en muchos sitios, pero si el usuario navega frenéticamente entre pestañas, puede llegar a sobreescribirse si no se comprueba rigurosamente el estado del DOM.
3. **Optimización de OVR:** En el cliente, recalcular el OVR con `calcPlayerOVR` iterando todos los jugadores en repetidas ocasiones puede causar pequeños tirones en móviles antiguos. Sería ideal calcularlo 1 vez al cargar y cachearlo en el objeto del jugador.

---

## ⚖️ 5. Veredicto Final: ¿Está listo para producción/demo?

**❌ Para Producción / Lanzamiento al Mercado:** NO. 
Si lanzas esto ahora mismo, en 2 horas la comunidad de jugadores explotará el sistema modificando su `localStorage` / `estado`, inyectando jugadores con OVR infinito y rompiendo el mercado y las clasificatorias. El juego es 100% "Client-Authoritative" (confía ciegamente en el cliente). 

**✅ Para una DEMO cerrada o uso personal/Portfolio:** SÍ, ES UN PROYECTO EXCELENTE. 
A nivel visual, mecánico y de características (matchmaking, sobres, mercado, animaciones de partido), el proyecto es una hazaña brutal para un solo desarrollador/pequeño equipo. La estructura del servidor WebSockets es robusta (maneja colas independientes, limpieza al desconectarse, desconexiones limpias, control de estados de la sala, reinicio en el medio tiempo). 

### 🔧 Solución de Ejemplo: Validación Server-Side para el Matchmaking

Para parchear **ya** el problema crítico del servidor, en `server.js`, no calcules el OVR basándote en los números que envía el cliente. Confía solo en los IDs de los jugadores y compáralos con una copia maestra de `PLAYERS_DB` en el propio servidor:

**Código Corregido en `server.js`:**
```javascript
// Añade arriba del todo tu base de datos O léela de un JSON central:
// const SERVER_DB = [ ...tu json de jugadores... ];

function calcTeamOvrSeguro(clientLineupIds) {
    const xi = clientLineupIds.map(id => SERVER_DB.find(p => p.id === id)).filter(Boolean);
    if (xi.length === 0) return 50;
    
    // Aquí el servidor usa las stats intocables (SERVER_DB), no las que el cliente envía
    const sum = xi.reduce((acc, p) => {
        const ovr = p.ovr || calcPlayerOVR(p); 
        // Asume morale 100 y con 100 para evitar exploits del cliente,
        // o pide que el cliente envíe sólo stats no cruciales y valídalos.
        return acc + ovr;
    }, 0);
    return Math.round(sum / xi.length);
}

// En join_lobby:
const teamOvr = calcTeamOvrSeguro(data.lineup);
// Ignorar data.teamOvr y data.roster stats por completo.
```

### 🔧 Solución para el XSS en `app.js`

Nunca utilices `.innerHTML` directamente con nombres generados por usuarios. Utiliza `textContent` o un método de sanitizado.

**Código Corregido en `app.js`:**
```javascript
// NO HACER ESTO:
// logDiv.innerHTML += `<div><span class="text-slate-500">${data.min}'</span> - <span>${data.narrative}</span></div>`;

// HAZ ESTO (Sanitizado rápido):
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}

const safeNarrative = escapeHTML(data.narrative);
logDiv.innerHTML += `<div><span class="text-slate-500">${data.min}'</span> - <span class="${cssClass}">${safeNarrative}</span></div>`;
```

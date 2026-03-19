const fs = require('fs');
const appendCode = `\n/* =========================================================================
   RANKING GLOBAL COMPETITIVO (TOP ELO)
   ========================================================================= */
let unsubscribeCompLeaderboard = null;

window.renderCompLeaderboard = function () {
    const tbody = document.getElementById('comp-leaderboard-tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '<tr><td colspan="4" class="text-center py-4 text-slate-500 italic">Cargando datos del servidor...</td></tr>';

    if (unsubscribeCompLeaderboard) unsubscribeCompLeaderboard();

    unsubscribeCompLeaderboard = db.collection('users')
        .orderBy('competitive.points', 'desc')
        .limit(50)
        .onSnapshot(snap => {
            const users = [];
            snap.forEach(doc => {
                users.push({ id: doc.id, ...doc.data() });
            });

            if (users.length === 0) {
                tbody.innerHTML = '<tr><td colspan="4" class="text-center py-4 text-slate-500 italic">Nadie ha jugado aún</td></tr>';
                return;
            }

            // Mapeo inverso de Ranks para Iconos
            const iconMap = {
                'Novato I': '🌱', 'Novato II': '☘️', 'Novato III': '🍀',
                'Bronce I': '🥉', 'Bronce II': '🥉', 'Bronce III': '🥉',
                'Plata I': '🥈', 'Plata II': '🥈', 'Plata III': '🥈',
                'Oro I': '🥇', 'Oro II': '🥇', 'Oro III': '🥇',
                'Platino I': '💎', 'Platino II': '💎', 'Platino III': '💎',
                'Diamante I': '💠', 'Diamante II': '💠', 'Diamante III': '💠',
                'Campeón I': '🏆', 'Campeón II': '🏆', 'Campeón III': '🏆',
                'Leyenda': '👑'
            };

            tbody.innerHTML = users.map((u, index) => {
                const isMe = auth.currentUser && u.id === auth.currentUser.uid;
                const rowClass = isMe ? 'bg-purple-900/40 font-bold border-l-4 border-purple-500 shadow-inner' : 'hover:bg-[#1c1c28] border-b border-[#313145]';
                const nameColor = isMe ? 'text-purple-400' : 'text-slate-200';
                
                const comp = u.competitive || { points: 0, rank: 'Novato I' };
                const icon = iconMap[comp.rank] || '🌱';

                let posClass = 'text-slate-400 font-bold';
                if (index === 0) posClass = 'text-yellow-400 text-lg shadow-[0_0_10px_rgba(234,179,8,0.5)]';
                else if (index === 1) posClass = 'text-gray-300 text-lg shadow-[0_0_10px_rgba(209,213,219,0.3)]';
                else if (index === 2) posClass = 'text-amber-600 text-lg shadow-[0_0_10px_rgba(217,119,6,0.2)]';

                return \`
                <tr class="transition \${rowClass}">
                    <td class="text-center py-3 font-gaming \${posClass}">\${index + 1}</td>
                    <td class="text-left pl-2 \${nameColor} tracking-widest text-[10px] uppercase">\${u.auth ? u.auth.user : 'Desconocido'}</td>
                    <td class="text-center text-sm" title="\${comp.rank}">\${icon}</td>
                    <td class="text-right pr-2 text-yellow-400 font-mono font-bold">\${comp.points}</td>
                </tr>
                \`;
            }).join('');
        }, err => {
            console.error("Error Global Ranking:", err);
            tbody.innerHTML = '<tr><td colspan="4" class="text-center py-4 text-red-500 italic">Error de conexión</td></tr>';
        });
}\n`;

fs.appendFileSync('app.js', appendCode, 'utf8');
console.log('Appended leaderboard function to app.js');

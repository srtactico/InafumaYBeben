const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const target = `<div class="glass-panel p-6 border-t-4 border-blue-500">
                        <h3 class="text-lg font-gaming text-blue-400 uppercase tracking-widest mb-4">Historial de
                            Partidos (Clasificatorios)</h3>
                        <div id="comp-match-history"
                            class="space-y-3 bg-[#111119] p-4 rounded-xl border border-[#313145] min-h-[200px] flex flex-col items-center justify-center text-slate-500 text-sm uppercase tracking-widest text-center">
                            <!-- Empty state por defecto -->
                            <div>
                                <div class="text-3xl mb-2 opacity-50">⚽</div>
                                Aún no has jugado partidos clasificatorios
                            </div>
                        </div>
                    </div>`;

const replacement = `<div class="flex flex-col gap-6 h-full w-full">
    <div class="glass-panel p-6 border-t-4 border-blue-500">
        <h3 class="text-lg font-gaming text-blue-400 uppercase tracking-widest mb-4">Historial de Partidos</h3>
        <div id="comp-match-history" class="space-y-3 bg-[#111119] p-4 rounded-xl border border-[#313145] min-h-[140px] flex flex-col items-center justify-center text-slate-500 text-sm uppercase tracking-widest text-center">
            <div><div class="text-3xl mb-2 opacity-50">⚽</div>Aún no has jugado partidos clasificatorios</div>
        </div>
    </div>
    <div class="glass-panel p-6 border-t-4 border-purple-500 flex-1 flex flex-col min-h-[300px]">
        <h3 class="text-lg font-gaming text-purple-400 uppercase tracking-widest mb-4 flex justify-between items-center">
            <span>Ranking Global Top ELO</span>
            <button onclick="renderCompLeaderboard()" class="text-xs text-slate-400 hover:text-white transition">🔄 Refrescar</button>
        </h3>
        <div class="flex-1 overflow-auto bg-[#111119] rounded-xl border border-[#313145] p-2">
            <table class="fm-table text-xs w-full">
                <thead><tr><th class="text-center w-8">#</th><th class="text-left pl-2">Mánager</th><th class="text-center w-24">Liga</th><th class="text-right pr-2">PTS</th></tr></thead>
                <tbody id="comp-leaderboard-tbody"><tr><td colspan="4" class="text-center py-4 text-slate-500 italic">Cargando Clasificación...</td></tr></tbody>
            </table>
        </div>
    </div>
</div>`;

html = html.replace(target, replacement);
fs.writeFileSync('index.html', html, 'utf8');
console.log('Injected HTML leaderboard!');

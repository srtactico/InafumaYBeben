        renderFormationPanel('fm-formation-away', myPlayers, aTeam.c1 |function runMatchLoop(targetMinute) {
    matchState._targetMinute = targetMinute;
    const logDiv = document.getElementById('match-narrative');
    const commentary = [
        "Controlando el ritmo del partido.", "Pase filtrado peligroso que corta la zaga.",
        "Falta tÃ¡ctica en la medular.", "Disparo lejano que se va alto.",
        "Gran intervenciÃ³n del portero.", "Despeje de cabeza en el Ã¡rea.",
        "Centro desde la banda derecha.", "PosesiÃ³n tranquila en campo propio.",
        "PresiÃ³n alta del equipo rival.", "RecuperaciÃ³n en la medular.",
        "Lateral largo buscando al extremo.", "Tiro que rechaza la defensa."
    ];

    matchState.interval = setInterval(() => {
        matchState.min++;
        document.getElementById('match-time').textContent = `${matchState.min}'`;
        document.getElementById('match-progress').style.width = `${(matchState.min / 90) * 100}%`;

        // PosesiÃ³n dinÃ¡mica realista
        const basePoss = 50 + ((matchState.myProb - matchState.oppProb) * 200);
        matchState.stats.hPoss = Math.max(20, Math.min(80, Math.floor(basePoss + (Math.random() * 10 - 5))));
        matchState.stats.aPoss = 100 - matchState.stats.hPoss;

        if (matchState.min === 45 && targetMinute === 45) {
            clearInterval(matchState.interval);
            stopPitchAnimation();
            logDiv.innerHTML += `<div class="mt-4"><strong class="text-yellow-400 font-bold">45': Final de la primera mitad. Nos vamos al descanso.</strong></div>`;
            logDiv.scrollTop = logDiv.scrollHeight;
            document.getElementById('match-halftime').classList.remove('hidden');
            matchState.events.push({ min: 45, icon: 'â ±', text: 'Descanso', side: 'home' });
            updateMatchStatsUI();
            renderMatchEvents('home');
            const dugNarr = document.getElementById('fm-dugout-narrative');
            if (dugNarr) dugNarr.innerHTML = '<div class="text-yellow-400 text-[10px] font-bold">Medio tiempo â€” elige tus acciones en el dugout.</div>';
            return;
        }

        if (matchState.min >= 90) {
            clearInterval(matchState.interval);
            stopPitchAnimation();
            finishMatch(matchState.mG, matchState.oG);
            return;
        }

        let rand = Math.random();
        let homePossMod = matchState.stats.hPoss / 50;
        let awayPossMod = matchState.stats.aPoss / 50;
        let activeMyProb = (matchState.myProb + matchState.talkMod) * (matchState.isHome ? homePossMod : awayPossMod);
        let activeOppProb = matchState.oppProb * (matchState.isHome ? awayPossMod : homePossMod);

        // Factor cansancio: Si la condiciÃ³n es baja, el rendimiento baja
        const xi = getStartingXI();
        const avgCon = xi.reduce((acc, p) => acc + (p.con || 100), 0) / 11;
        activeMyProb *= (0.7 + (avgCon / 100) * 0.3);

        let isMyGoal = rand < (activeMyProb * 0.12);
        let isOppGoal = !isMyGoal && rand > 1 - (activeOppProb * 0.12);
        let eventText = "";

        if (isMyGoal) {
            matchState.mG++;
            let xG = 0.5 + Math.random() * 0.4;
            if (matchState.isHome) { matchState.stats.hShots++; matchState.stats.hSot++; matchState.stats.hXG += xG; }
            else { matchState.stats.aShots++; matchState.stats.aSot++; matchState.stats.aXG += xG; }
            const scorers = xi.filter(p => !p.suspension && (p.pos === 'DEL' || p.pos === 'MED' || p.pos === 'DEL'));
            const scorer = scorers.length > 0 ? scorers[Math.floor(Math.random() * scorers.length)] : { name: "el delantero" };
            const assist = scorers.length > 1 ? scorers.filter(p => p.id !== scorer.id)[Math.floor(Math.random() * (scorers.length - 1))] : null;
            eventText = `<span class="text-green-400 font-bold">Â¡GOL! DefiniciÃ³n perfecta de ${scorer.name}.</span>`;
            const goalSide = matchState.isHome ? 'home' : 'away';
            matchState.events.push({ min: matchState.min, icon: 'âš½', text: `GOL â€” ${scorer.name}`, side: goalSide });
            setPitchPhase(matchState.isHome ? 'home-goal' : 'away-goal', 4);
            playGoalAnimation(scorer.name, assist ? assist.name : null, matchState.min, matchState.isHome);
        } else if (isOppGoal) {
            matchState.oG++;
            let xG = 0.5 + Math.random() * 0.4;
            if (matchState.isHome) { matchState.stats.aShots++; matchState.stats.aSot++; matchState.stats.aXG += xG; }
            else { matchState.stats.hShots++; matchState.stats.hSot++; matchState.stats.hXG += xG; }
            const aiPlayers = generateAIPlayers(currentOpponent.name, currentOpponent.ovr);
            const scorers = aiPlayers.filter(p => p.pos === 'DEL' || p.pos === 'MED');
            const scorer = scorers.length > 0 ? scorers[Math.floor(Math.random() * scorers.length)].name : "el delantero";
            eventText = `<span class="text-red-400 font-bold">Â¡Gol del equipo rival! Grave error en defensa que aprovecha ${scorer}.</span>`;
            const goalSide = matchState.isHome ? 'away' : 'home';
            matchState.events.push({ min: matchState.min, icon: 'âš½', text: `GOL â€” ${scorer}`, side: goalSide });
            setPitchPhase(matchState.isHome ? 'away-goal' : 'home-goal', 4);
            playGoalAnimation(scorer, null, matchState.min, false);
        } else if (rand < 0.08) {
            // Ocasión local
            if (matchState.isHome) { matchState.stats.hShots++; matchState.stats.hXG += 0.1; if (Math.random() < 0.4) matchState.stats.hSot++; }
            else { matchState.stats.aShots++; matchState.stats.aXG += 0.1; if (Math.random() < 0.4) matchState.stats.aSot++; }
            eventText = commentary[Math.floor(Math.random() * commentary.length)];
            setPitchPhase(matchState.isHome ? 'home-attack' : 'away-attack', 2);
        } else if (rand > 0.92) {
            // Ocasión visitante
            if (matchState.isHome) { matchState.stats.aShots++; matchState.stats.aXG += 0.1; if (Math.random() < 0.4) matchState.stats.aSot++; }
            else { matchState.stats.hShots++; matchState.stats.hXG += 0.1; if (Math.random() < 0.4) matchState.stats.hSot++; }
            eventText = commentary[Math.floor(Math.random() * commentary.length)];
            setPitchPhase(matchState.isHome ? 'away-attack' : 'home-attack', 2);
        } else if (Math.random() < 0.015) {
            // Tarjeta random
            const cardSide = Math.random() < 0.5 ? 'home' : 'away';
            let sanctionedName = "Jugador";
            let isUserPlayer = false;
            let playerId = null;
            if ((cardSide === 'home' && matchState.isHome) || (cardSide === 'away' && !matchState.isHome)) {
                const xi_c = getStartingXI().filter(p => !p.suspension);
                if (xi_c.length > 0) { const p = xi_c[Math.floor(Math.random() * xi_c.length)]; sanctionedName = p.name; isUserPlayer = true; playerId = p.id; }
            } else {
                const aiPlayers = generateAIPlayers(currentOpponent.name, currentOpponent.ovr);
                if (aiPlayers.length > 0) sanctionedName = aiPlayers[Math.floor(Math.random() * aiPlayers.length)].name;
            }
            const matchPlayerKey = `${cardSide}_${sanctionedName}`;
            if (!matchState.playersCards) matchState.playersCards = {};
            if (matchState.playersCards[matchPlayerKey] === 'yellow') {
                matchState.playersCards[matchPlayerKey] = 'red';
                eventText = `<span class="text-red-500 font-bold">Â¡ROJA! ExpulsiÃ³n para ${sanctionedName}.</span>`;
                matchState.events.push({ min: matchState.min, icon: 'ðŸŸ¥', text: `Roja â€” ${sanctionedName}`, side: cardSide });
                if (isUserPlayer && state && state.roster) { const player = state.roster.find(p => p.id === playerId); if (player) { player.suspension = 2; addEmail('ComitÃ©', 'ExpulsiÃ³n', `${player.name} expulsado.`); } }
            } else {
                matchState.playersCards[matchPlayerKey] = 'yellow';
                eventText = `Amarilla para ${sanctionedName} por una falta técnica.`;
                matchState.events.push({ min: matchState.min, icon: 'ðŸŸ¨', text: `Amarilla â€” ${sanctionedName}`, side: cardSide });
                if (isUserPlayer && state && state.roster) { const player = state.roster.find(p => p.id === playerId); if (player) { player.yellowCards = (player.yellowCards || 0) + 1; if (player.yellowCards >= 5) { player.suspension = 1; player.yellowCards = 0; } } }
            }
        }

        if (eventText) {
            logDiv.innerHTML += `<div><span class="text-slate-500">${matchState.min}'</span> - ${eventText}</div>`;
            logDiv.scrollTop = logDiv.scrollHeight;
        }

        document.getElementById('sim-home-score').textContent = matchState.isHome ? matchState.mG : matchState.oG;
        document.getElementById('sim-away-score').textContent = matchState.isHome ? matchState.oG : matchState.mG;
        updateMatchStatsUI();
        renderMatchEvents('home');

    }, simSpeedMs / 3);
}
   setPitchPhase('away-corner', 2);
            }
        }

        logDiv.innerHTML += `<div><span class="text-slate-500">${matchState.min}'</span> - ${eventText}</div>`;
        logDiv.scrollTop = logDiv.scrollHeight;
        document.getElementById('sim-home-score').textContent = matchState.isHome ? matchState.mG : matchState.oG;
        document.getElementById('sim-away-score').textContent = matchState.isHome ? matchState.oG : matchState.mG;
        updateMatchStatsUI();
        renderMatchEvents('home');

    }, simSpeedMs);
}

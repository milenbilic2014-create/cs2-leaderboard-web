// Ista pravila kao u server.js: kill * 1.5 - death * 1.0 + win * 3.0
export const POINTS_PER_KILL = 1.5;
export const POINTS_PER_DEATH = 1.0;
export const POINTS_PER_WIN = 3.0;

export function scoreValue(player) {
    const kills = Number(player.kills) || 0;
    const deaths = Number(player.deaths) || 0;
    const wins = Number(player.wins) || 0;
    return kills * POINTS_PER_KILL - deaths * POINTS_PER_DEATH + wins * POINTS_PER_WIN;
}

export function rankValue(player, mode) {
    const kills = Number(player.kills) || 0;
    const deaths = Number(player.deaths) || 0;
    const wins = Number(player.wins) || 0;

    switch (mode) {
        case 'kills':
            return kills;
        case 'deaths':
            return deaths;
        case 'kd':
            return kills / Math.max(1, deaths);
        case 'wins':
            return wins;
        default:
            return scoreValue(player);
    }
}

export function sortPlayers(players, mode) {
    return [...players].sort((a, b) => {
        const diff = rankValue(b, mode) - rankValue(a, mode);
        if (Math.abs(diff) > 1e-9) return diff;
        return (
            (Number(b.wins) || 0) - (Number(a.wins) || 0) ||
            (Number(b.kills) || 0) - (Number(a.kills) || 0)
        );
    });
}

export function formatScore(value) {
    return (Number(value) || 0).toFixed(1);
}

export function formatDelta(value) {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}`;
}

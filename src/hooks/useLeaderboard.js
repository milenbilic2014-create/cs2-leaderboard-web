import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchState, POLL_INTERVAL_MS } from '../lib/api';
import { scoreValue, sortPlayers } from '../lib/score';

// Koliko dugo se prikazuje "+1.5" / "-1.0" animacija.
const DELTA_VISIBLE_MS = 1200;

export default function useLeaderboard() {
    const [players, setPlayers] = useState([]);
    const [ranking, setRanking] = useState('points');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updatedAt, setUpdatedAt] = useState(null);
    const [deltas, setDeltas] = useState({});

    const prevScores = useRef(null);
    const deltaTimers = useRef(new Map());

    const applyState = useCallback((state) => {
        const mode = state.ranking || 'points';
        const list = sortPlayers(Object.values(state.players || {}), mode);

        const nextScores = {};
        list.forEach((player) => {
            nextScores[String(player.steamid)] = scoreValue(player);
        });

        // Animacija promene bodova (ista logika kao u server.js UI-u).
        if (prevScores.current) {
            const changed = {};

            Object.entries(nextScores).forEach(([steamid, value]) => {
                const before = prevScores.current[steamid];
                if (before === undefined) return;

                const diff = value - before;
                if (Math.abs(diff) < 0.001) return;

                changed[steamid] = { value: diff, key: `${Date.now()}-${steamid}` };
            });

            if (Object.keys(changed).length > 0) {
                setDeltas((current) => ({ ...current, ...changed }));

                Object.keys(changed).forEach((steamid) => {
                    clearTimeout(deltaTimers.current.get(steamid));
                    deltaTimers.current.set(
                        steamid,
                        setTimeout(() => {
                            deltaTimers.current.delete(steamid);
                            setDeltas((current) => {
                                const next = { ...current };
                                delete next[steamid];
                                return next;
                            });
                        }, DELTA_VISIBLE_MS)
                    );
                });
            }
        }

        prevScores.current = nextScores;
        setPlayers(list);
        setRanking(mode);
        setUpdatedAt(Date.now());
    }, []);

    useEffect(() => {
        let cancelled = false;
        let running = false;
        let timer = null;
        let controller = null;
        const timerMap = deltaTimers.current;

        async function tick() {
            if (cancelled || running) return;
            running = true;
            clearTimeout(timer);

            controller = typeof AbortController !== 'undefined' ? new AbortController() : null;

            try {
                const state = await fetchState(controller ? controller.signal : undefined);
                if (cancelled) return;
                applyState(state);
                setError(null);
            } catch (err) {
                if (cancelled || (err && err.name === 'AbortError')) return;
                setError((err && err.message) || 'Nepoznata greška');
            } finally {
                if (!cancelled) {
                    setLoading(false);
                    running = false;
                    timer = setTimeout(tick, POLL_INTERVAL_MS);
                }
            }
        }

        // Odmah osveži kada se TV/vratimo na tab.
        function refreshIfVisible() {
            if (document.hidden) return;
            tick();
        }

        tick();
        document.addEventListener('visibilitychange', refreshIfVisible);
        window.addEventListener('focus', refreshIfVisible);

        return () => {
            cancelled = true;
            clearTimeout(timer);
            if (controller) controller.abort();
            document.removeEventListener('visibilitychange', refreshIfVisible);
            window.removeEventListener('focus', refreshIfVisible);

            const timers = timerMap;
            timers.forEach((t) => clearTimeout(t));
            timers.clear();
        };
    }, [applyState]);

    return { players, ranking, loading, error, updatedAt, deltas };
}

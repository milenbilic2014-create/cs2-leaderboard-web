// Adresa backend-a. Podrazumevano cita Cloudflare D1 worker.
// Za lokalni server.js stavi npr. REACT_APP_API_URL=http://localhost:3000 i REACT_APP_STATE_PATH=/api/state
const RAW_BASE =
    process.env.REACT_APP_API_URL || 'https://cs2-leaderboard.milenbilic2014.workers.dev';

export const API_BASE = RAW_BASE.replace(/\/+$/, '');
export const STATE_PATH = process.env.REACT_APP_STATE_PATH || '/state';
export const STATE_URL = `${API_BASE}${STATE_PATH}`;

export const POLL_INTERVAL_MS = Math.max(
    1000,
    Number(process.env.REACT_APP_POLL_MS) || 5000
);

export async function fetchState(signal) {
    const res = await fetch(STATE_URL, {
        cache: 'no-store',
        signal,
        headers: { Accept: 'application/json' },
    });

    if (!res.ok) {
        throw new Error(`Server je vratio HTTP ${res.status}`);
    }

    const data = await res.json();
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
        throw new Error('Neispravan odgovor servera');
    }
    return data;
}

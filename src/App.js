import React, { useEffect, useState } from 'react';
import './App.css';
import LeaderboardTable from './components/LeaderboardTable';
import useLeaderboard from './hooks/useLeaderboard';
import useTvMode from './hooks/useTvMode';

// Na TV-u se prikazuje najviše 20 igrača po strani.
const TV_PAGE_SIZE = 20;
const TV_PAGE_INTERVAL_MS = 12000;

function formatTime(timestamp) {
    if (!timestamp) return '—';
    return new Date(timestamp).toLocaleTimeString('sr-RS', { hour12: false });
}

export default function App() {
    const { players, loading, error, updatedAt, deltas } = useLeaderboard();
    const isOnline = !error;
    const isTv = useTvMode();
    const pageCount = isTv ? Math.max(1, Math.ceil(players.length / TV_PAGE_SIZE)) : 1;
    const [page, setPage] = useState(0);

    // Ako se broj igrača smanji, vrati se na postojeću stranu.
    useEffect(() => {
        setPage((current) => (current >= pageCount ? 0 : current));
    }, [pageCount]);

    // TV nema skrolovanje, pa se strane same smenjuju.
    useEffect(() => {
        if (pageCount <= 1) return undefined;

        const timer = setInterval(() => {
            setPage((current) => (current + 1) % pageCount);
        }, TV_PAGE_INTERVAL_MS);

        return () => clearInterval(timer);
    }, [pageCount]);

    const currentPage = pageCount > 1 ? Math.min(page, pageCount - 1) : 0;
    const pageStart = currentPage * TV_PAGE_SIZE;
    const visiblePlayers =
        pageCount > 1 ? players.slice(pageStart, pageStart + TV_PAGE_SIZE) : players;

    return (
        <div className="wrapper">
            <header className="header-box">
                <div className="cs2-logo">CS2</div>
                <div className="cs2-title">LEADERBOARD</div>
                <div className="weapons-divider" aria-hidden="true">
                    <span>⚔</span>
                    <span>⚔</span>
                    <span>⚔</span>
                    <span>⚔</span>
                </div>
            </header>

            <div className="board-card">
                <LeaderboardTable
                    players={visiblePlayers}
                    loading={loading}
                    error={error}
                    deltas={deltas}
                    rankOffset={pageStart}
                />
            </div>

            <div className="status-line" role="status">
                <span className={`status-dot ${isOnline ? '' : 'offline'}`} aria-hidden="true" />
                <span>
                    {players.length} {players.length === 1 ? 'igrač' : 'igrača'}
                </span>
                <span className="status-sep">•</span>
                <span>
                    {isOnline ? 'uživo' : 'nema veze sa bazom'} • osveženo {formatTime(updatedAt)}
                </span>
                {pageCount > 1 && (
                    <>
                        <span className="status-sep">•</span>
                        <span>
                            strana {currentPage + 1}/{pageCount}
                        </span>
                    </>
                )}
            </div>
        </div>
    );
}

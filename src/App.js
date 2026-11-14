import React from 'react';
import './App.css';
import LeaderboardTable from './components/LeaderboardTable';
import useLeaderboard from './hooks/useLeaderboard';

function formatTime(timestamp) {
    if (!timestamp) return '—';
    return new Date(timestamp).toLocaleTimeString('sr-RS', { hour12: false });
}

export default function App() {
    const { players, loading, error, updatedAt, deltas } = useLeaderboard();
    const isOnline = !error;

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
                    players={players}
                    loading={loading}
                    error={error}
                    deltas={deltas}
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
            </div>
        </div>
    );
}

import React from 'react';
import { formatDelta, formatScore, scoreValue } from '../lib/score';

const FALLBACK_AVATAR =
    'https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg';

function RankBadge({ rank }) {
    if (rank <= 3) {
        return <div className={`rank-badge rank-${rank}`}>{rank}.</div>;
    }
    return <div className="rank-normal">{rank}.</div>;
}

function PlayerRow({ player, rank, delta }) {
    const steamid = String(player.steamid);
    const score = scoreValue(player);
    const rowClass = delta ? (delta.value > 0 ? 'score-row-up' : 'score-row-down') : '';

    return (
        <tr className={rowClass} data-sid={steamid}>
            <td className="rank-box">
                <RankBadge rank={rank} />
            </td>
            <td className="text-left">
                <div className="player-flex">
                    <img
                        className="avatar"
                        src={player.avatar || FALLBACK_AVATAR}
                        alt=""
                        loading="lazy"
                        onError={(event) => {
                            event.currentTarget.style.visibility = 'hidden';
                        }}
                    />
                    <span className="player-name">{player.name || player.steamid}</span>
                </div>
            </td>
            <td className="text-center stat-num stat-kills">{Number(player.kills) || 0}</td>
            <td className="text-center stat-num stat-deaths">{Number(player.deaths) || 0}</td>
            <td className="text-center stat-num stat-wins">{Number(player.wins) || 0}</td>
            <td className="text-center stat-num stat-points">
                <div className="points-wrap">
                    <span>{formatScore(score)}</span>
                    {delta && (
                        <span
                            key={delta.key}
                            className={`score-delta ${delta.value > 0 ? 'up' : 'down'} show`}
                        >
                            {formatDelta(delta.value)}
                        </span>
                    )}
                </div>
            </td>
        </tr>
    );
}

export default function LeaderboardTable({ players, loading, error, deltas }) {
    let body;

    if (players.length === 0) {
        if (loading) {
            body = (
                <tr>
                    <td colSpan={6} className="table-message">
                        Učitavanje podataka iz baze...
                    </td>
                </tr>
            );
        } else if (error) {
            body = (
                <tr>
                    <td colSpan={6} className="table-message table-error">
                        Greška pri učitavanju igrača: {error}
                    </td>
                </tr>
            );
        } else {
            body = (
                <tr>
                    <td colSpan={6} className="table-message">
                        Nema registrovanih igrača u bazi...
                    </td>
                </tr>
            );
        }
    } else {
        body = players.map((player, index) => (
            <PlayerRow
                key={String(player.steamid)}
                player={player}
                rank={index + 1}
                delta={deltas[String(player.steamid)]}
            />
        ));
    }

    return (
        <table>
            <thead>
                <tr>
                    <th className="text-center" style={{ width: '10%' }} scope="col">
                        RANK
                    </th>
                    <th className="text-left" style={{ width: '35%' }} scope="col">
                        IGRAČ
                    </th>
                    <th className="text-center" style={{ width: '13%' }} scope="col">
                        KILLS
                    </th>
                    <th className="text-center" style={{ width: '13%' }} scope="col">
                        DEATHS
                    </th>
                    <th className="text-center" style={{ width: '13%' }} scope="col">
                        WINS
                    </th>
                    <th className="text-center" style={{ width: '16%' }} scope="col">
                        BODOVI
                    </th>
                </tr>
            </thead>
            <tbody>{body}</tbody>
        </table>
    );
}

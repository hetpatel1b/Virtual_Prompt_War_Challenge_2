import { useState, useEffect, memo } from 'react';
import { getLeaderboard } from '../../services/api';
import { Trophy, Medal } from 'lucide-react';

function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLeaderboard()
      .then((data) => setEntries(data.entries || []))
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-8 text-sm text-[var(--color-text-muted)]">Loading leaderboard…</div>;

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--color-border)]">
      <div className="flex items-center gap-2 px-4 py-3 bg-[var(--color-surface-alt)] border-b border-[var(--color-border)]">
        <Trophy size={16} className="text-amber-500" />
        <h3 className="font-heading font-bold text-sm text-[var(--color-text)]">Leaderboard</h3>
      </div>
      <table className="w-full text-sm" role="table">
        <thead>
          <tr className="text-left text-xs text-[var(--color-text-muted)] uppercase tracking-wider">
            <th className="px-4 py-2">Rank</th>
            <th className="px-4 py-2">Player</th>
            <th className="px-4 py-2 text-right">Score</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e) => (
            <tr key={e.rank} className="border-t border-[var(--color-border)] hover:bg-[var(--color-surface-alt)] transition">
              <td className="px-4 py-2.5 font-semibold">{medals[e.rank - 1] || e.rank}</td>
              <td className="px-4 py-2.5 text-[var(--color-text)]">{e.displayName}</td>
              <td className="px-4 py-2.5 text-right font-semibold text-primary-600 dark:text-primary-400">{e.percentage}%</td>
            </tr>
          ))}
          {entries.length === 0 && (
            <tr><td colSpan={3} className="px-4 py-6 text-center text-[var(--color-text-muted)]">No scores yet. Be the first!</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default memo(Leaderboard);

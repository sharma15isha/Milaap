import { leaderboard } from '../data/mockData.js'

const rankClass = { 1: 'rank-1', 2: 'rank-2', 3: 'rank-3' }

function Leaderboard() {
  return (
    <div className="page-with-navbar">
      <div className="container" style={{ maxWidth: 820 }}>
        <p className="eyebrow" style={{ marginBottom: 12 }}>AI Innovation Challenge 2026</p>
        <h1 style={{ fontSize: 36, marginBottom: 12 }}>🏆 Leaderboard</h1>
        <p className="text-dim" style={{ marginBottom: 34 }}>
          Live rankings, updated automatically as judges submit evaluations.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {leaderboard.map((row, i) => (
            <div className="card fade-up" key={row.rank} style={{ animationDelay: `${i * 0.06}s`, display: 'flex', alignItems: 'center', gap: 20 }}>
              <div className={`rank-circle ${rankClass[row.rank] || ''}`}>
                {row.rank}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 600, fontSize: 14 }}>{row.team}</p>
                <p className="text-faint" style={{ fontSize: 12, marginTop: 2 }}>{row.project}</p>
              </div>

              <div className="flex gap-md text-faint" style={{ fontSize: 11, fontFamily: 'monospace' }}>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ color: 'var(--ink)' }}>{row.innovation}</p>
                  <p>Innovation</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ color: 'var(--ink)' }}>{row.technical}</p>
                  <p>Technical</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ color: 'var(--ink)' }}>{row.presentation}</p>
                  <p>Presentation</p>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 22, fontWeight: 700, color: 'var(--coral-dark)', fontFamily: 'var(--font-heading)' }}>{row.total}</p>
                <p className="text-faint" style={{ fontSize: 10, textTransform: 'uppercase' }}>Total</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Leaderboard

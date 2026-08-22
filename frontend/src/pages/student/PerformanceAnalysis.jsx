import DashboardLayout from '../../components/DashboardLayout.jsx'
import StatCard from '../../components/StatCard.jsx'
import { BarChart, TrendChart } from '../../components/Charts.jsx'
import { performanceHistory, performanceTrend, skillPerformance } from '../../data/mockData.js'

function PerformanceAnalysis({ user, onLogout }) {
  const avg = Math.round(performanceHistory.reduce((a, b) => a + b.overall, 0) / performanceHistory.length)
  const best = Math.max(...performanceHistory.map((p) => p.overall))
  const trendDirection = performanceTrend.at(-1).score >= performanceTrend[0].score ? 'Improving' : 'Declining'

  const trendData = performanceTrend.map((p) => ({ label: p.name, value: p.score }))
  const skillData = skillPerformance.map((s) => ({ label: s.skill, value: s.score }))

  return (
    <DashboardLayout user={user} onLogout={onLogout}>
      <p className="eyebrow" style={{ marginBottom: 8 }}>My Performance Analysis</p>
      <h1 style={{ fontSize: 28, marginBottom: 28 }}>Your innovation journey, measured.</h1>

      <div className="grid grid-4" style={{ marginBottom: 28 }}>
        <StatCard label="Overall performance score" value={`${avg}%`} icon="📊" />
        <StatCard label="Performance trend" value={trendDirection} icon="📈" trend={trendDirection === 'Improving' ? '↑' : ''} />
        <StatCard label="Best score" value={`${best}%`} icon="🏆" />
        <StatCard label="Events completed" value={performanceHistory.length} icon="🎖️" />
      </div>

      <div className="grid grid-2" style={{ marginBottom: 24 }}>
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 14 }}>Performance trend</p>
          <p className="text-faint" style={{ fontSize: 12, marginBottom: 10 }}>
            Overall score across your last {trendData.length} events
          </p>
          <TrendChart data={trendData} />
        </div>

        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 14 }}>Skill performance</p>
          <p className="text-faint" style={{ fontSize: 12, marginBottom: 10 }}>
            Average score by category across all events
          </p>
          <BarChart data={skillData} />
        </div>
      </div>

      <div className="grid grid-2" style={{ marginBottom: 24 }}>
        <div className="card">
          <p style={{ fontWeight: 600, color: 'var(--green)', marginBottom: 8 }}>Strengths</p>
          <p className="text-dim" style={{ fontSize: 14, lineHeight: 1.7 }}>
            Your strongest area is <b style={{ color: 'var(--ink)' }}>Innovation</b>, averaging 88% across
            recent events — consistently your highest-scoring category.
          </p>
        </div>
        <div className="card">
          <p style={{ fontWeight: 600, color: 'var(--coral-dark)', marginBottom: 8 }}>Areas for improvement</p>
          <p className="text-dim" style={{ fontSize: 14, lineHeight: 1.7 }}>
            Your <b style={{ color: 'var(--ink)' }}>presentation scores</b> are consistently lower than
            your technical scores — practicing pitch delivery could lift your overall rank.
          </p>
        </div>
      </div>

      <p style={{ fontWeight: 600, marginBottom: 12 }}>Participation history</p>
      <div className="card table-wrap">
        <table>
          <thead>
            <tr>
              <th>Event</th>
              <th>Role</th>
              <th>Overall</th>
              <th>Rank</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {performanceHistory.map((p) => (
              <tr key={p.id}>
                <td>{p.event}</td>
                <td className="text-dim">{p.role}</td>
                <td className="text-dim" style={{ fontFamily: 'monospace' }}>{p.overall}%</td>
                <td className="text-dim" style={{ fontFamily: 'monospace' }}>#{p.rank}</td>
                <td>
                  <span className="badge" style={{ backgroundColor: 'var(--amber-tint)', color: 'var(--amber-dark)', borderColor: 'rgba(232,154,43,0.3)' }}>
                    {p.result}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  )
}

export default PerformanceAnalysis

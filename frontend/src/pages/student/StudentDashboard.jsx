import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import StatCard from '../../components/StatCard.jsx'
import ProgressBar from '../../components/ProgressBar.jsx'
import { SkillBadge } from '../../components/SkillBadge.jsx'
import { currentStudent, events, myTeams, performanceHistory, teammateCandidates, computeMatch } from '../../data/mockData.js'

function StudentDashboard({ user, onLogout }) {
  const upcoming = events.filter((e) => e.status !== 'Completed').slice(0, 3)
  const lastScore = performanceHistory[0]?.overall ?? 0
  const bestMatch = teammateCandidates
    .map((c) => ({ ...c, match: computeMatch(c) }))
    .sort((a, b) => b.match.score - a.match.score)[0]

  return (
    <DashboardLayout user={user} onLogout={onLogout}>
      <p className="eyebrow" style={{ marginBottom: 8 }}>Welcome back</p>
      <h1 style={{ fontSize: 28, marginBottom: 28 }}>
        Hey {user?.name || currentStudent.name.split(' ')[0]}, here's your innovation journey.
      </h1>

      <div className="grid grid-4" style={{ marginBottom: 28 }}>
        <StatCard label="Events registered" value={upcoming.length} icon="📅" />
        <StatCard label="Active teams" value={myTeams.length} icon="🤝" />
        <StatCard label="Last event score" value={`${lastScore}%`} icon="📈" trend="+3% vs prior" />
        <StatCard label="Best rank achieved" value="#4" icon="🏆" />
      </div>

      <div className="grid" style={{ gridTemplateColumns: '2fr 1fr' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="flex-between">
            <p style={{ fontWeight: 600, fontSize: 14 }}>Upcoming & registered events</p>
            <Link to="/events" style={{ color: 'var(--coral-dark)', fontSize: 12, fontWeight: 600 }}>View all →</Link>
          </div>
          {upcoming.map((e) => (
            <div className="card flex-between" key={e.id}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 500 }}>{e.title}</p>
                <p className="text-faint" style={{ fontSize: 12, marginTop: 4 }}>{e.type} · {e.startDate}</p>
              </div>
              <Link to={`/events/${e.id}`} className="text-dim" style={{ fontSize: 12 }}>Details</Link>
            </div>
          ))}

          <div className="flex-between" style={{ marginTop: 8 }}>
            <p style={{ fontWeight: 600, fontSize: 14 }}>Recommended teammate</p>
            <Link to="/teams" style={{ color: 'var(--coral-dark)', fontSize: 12, fontWeight: 600 }}>View hub →</Link>
          </div>
          {bestMatch && (
            <div className="card">
              <div className="flex-between" style={{ marginBottom: 10 }}>
                <p style={{ fontSize: 14, fontWeight: 500 }}>{bestMatch.name} · {bestMatch.preferredRole}</p>
                <span style={{ fontSize: 12, color: 'var(--coral-dark)', fontFamily: 'monospace' }}>{bestMatch.match.score}% match</span>
              </div>
              <div className="flex flex-wrap gap-sm">
                {bestMatch.skills.map((s) => (
                  <SkillBadge key={s}>{s}</SkillBadge>
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="card">
            <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 14 }}>Profile completion</p>
            <ProgressBar value={currentStudent.profileCompletion} />
            <Link to="/student/profile" style={{ color: 'var(--coral-dark)', fontSize: 12, marginTop: 12, display: 'inline-block' }}>
              Complete your profile →
            </Link>
          </div>

          <div className="card">
            <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 14 }}>Skill snapshot</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {currentStudent.skills.slice(0, 4).map((s) => (
                <ProgressBar key={s.name} value={s.level} label={s.name} color="amber" />
              ))}
            </div>
            <Link to="/student/performance" style={{ color: 'var(--coral-dark)', fontSize: 12, marginTop: 14, display: 'inline-block' }}>
              View full performance analysis →
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default StudentDashboard

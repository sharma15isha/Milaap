import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import StatCard from '../../components/StatCard.jsx'
import ProgressBar from '../../components/ProgressBar.jsx'
import { SkillBadge } from '../../components/SkillBadge.jsx'
import api from '../../services/api.js'

function StudentDashboard({ user, onLogout }) {
  const [profile, setProfile] = useState(null)
  const [registrations, setRegistrations] = useState([])
  const [upcomingEvents, setUpcomingEvents] = useState([])
  const [teams, setTeams] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [perfHistory, setPerfHistory] = useState([])
  const [recommended, setRecommended] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [
          profileRes,
          registrationsRes,
          eventsRes,
          teamsRes,
          analyticsRes,
          perfRes,
          recRes,
        ] = await Promise.allSettled([
          api.get('/students/me'),
          api.get('/events/my-registrations'),
          api.get('/events?status=Registration Open'),
          api.get('/teams/me'),
          api.get('/performance/analytics'),
          api.get('/performance/me'),
          api.get('/teams/recommendations'),
        ])

        if (profileRes.status === 'fulfilled') setProfile(profileRes.value.data)
        if (registrationsRes.status === 'fulfilled') setRegistrations(registrationsRes.value.data || [])
        if (eventsRes.status === 'fulfilled') setUpcomingEvents(eventsRes.value.data || [])
        if (teamsRes.status === 'fulfilled') setTeams(teamsRes.value.data || [])
        if (analyticsRes.status === 'fulfilled') setAnalytics(analyticsRes.value.data)
        if (perfRes.status === 'fulfilled') setPerfHistory(perfRes.value.data || [])
        if (recRes.status === 'fulfilled') setRecommended(recRes.value.data || [])
      } catch (err) {
        console.error('Error loading dashboard data:', err)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  const studentName = user?.name || profile?.userId?.name || 'Innovator'
  const firstName = studentName.split(' ')[0]

  const lastScore = analytics?.best || perfHistory[0]?.overall || 0
  const bestRank = perfHistory.find((p) => p.rank)?.rank ? `#${perfHistory.find((p) => p.rank).rank}` : '—'
  const bestTeammate = recommended[0] || null

  const displayEvents = registrations.length > 0
    ? registrations.map((r) => r.eventId).filter(Boolean)
    : upcomingEvents.slice(0, 3)

  const profileSkills = profile?.skills || []
  const completion = profile?.profileCompletion ?? 20

  return (
    <DashboardLayout user={user} onLogout={onLogout}>
      <p className="eyebrow" style={{ marginBottom: 8 }}>Student Dashboard</p>
      <h1 style={{ fontSize: 28, marginBottom: 28 }}>
        Hey {firstName}, here's your innovation journey.
      </h1>

      {/* STATS STRIP */}
      <div className="grid grid-4" style={{ marginBottom: 28 }}>
        <StatCard label="Events registered" value={registrations.length} icon="📅" />
        <StatCard label="Active teams" value={teams.length} icon="🤝" />
        <StatCard
          label="Last event score"
          value={lastScore > 0 ? `${lastScore}%` : 'New'}
          icon="📈"
          trend={analytics?.trend && analytics.trend !== 'No data yet' ? analytics.trend : ''}
        />
        <StatCard label="Best rank achieved" value={bestRank} icon="🏆" />
      </div>

      <div className="grid" style={{ gridTemplateColumns: '2fr 1fr' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* EVENTS LIST */}
          <div className="flex-between">
            <p style={{ fontWeight: 600, fontSize: 14 }}>
              {registrations.length > 0 ? 'Your registered events' : 'Featured upcoming events'}
            </p>
            <Link to="/events" style={{ color: 'var(--coral-dark)', fontSize: 12, fontWeight: 600 }}>
              View all →
            </Link>
          </div>

          {displayEvents.length === 0 ? (
            <div className="card text-center" style={{ padding: 24 }}>
              <p className="text-dim" style={{ fontSize: 14, marginBottom: 12 }}>
                You haven't registered for any events yet.
              </p>
              <Link to="/events" className="btn btn-primary btn-sm">
                Explore campus events
              </Link>
            </div>
          ) : (
            displayEvents.map((e) => (
              <div className="card flex-between" key={e._id || e.id}>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 500 }}>{e.title}</p>
                  <p className="text-faint" style={{ fontSize: 12, marginTop: 4 }}>
                    {e.type} · {e.startDate ? new Date(e.startDate).toLocaleDateString() : 'TBA'}
                  </p>
                </div>
                <Link to={`/events/${e._id || e.id}`} className="btn btn-secondary btn-sm">
                  Details
                </Link>
              </div>
            ))
          )}

          {/* RECOMMENDED TEAMMATES */}
          <div className="flex-between" style={{ marginTop: 8 }}>
            <p style={{ fontWeight: 600, fontSize: 14 }}>Recommended teammate</p>
            <Link to="/teams" style={{ color: 'var(--coral-dark)', fontSize: 12, fontWeight: 600 }}>
              View hub →
            </Link>
          </div>

          {bestTeammate ? (
            <div className="card">
              <div className="flex-between" style={{ marginBottom: 10 }}>
                <p style={{ fontSize: 14, fontWeight: 500 }}>
                  {bestTeammate.name} {bestTeammate.preferredRole ? `· ${bestTeammate.preferredRole}` : ''}
                </p>
                <span style={{ fontSize: 12, color: 'var(--coral-dark)', fontFamily: 'monospace' }}>
                  {bestTeammate.match?.score || 85}% match
                </span>
              </div>
              <div className="flex flex-wrap gap-sm">
                {(bestTeammate.skills || []).map((s) => (
                  <SkillBadge key={s}>{s}</SkillBadge>
                ))}
              </div>
            </div>
          ) : (
            <div className="card" style={{ padding: 18 }}>
              <p className="text-dim" style={{ fontSize: 13.5, marginBottom: 8 }}>
                Looking for teammates with complementary skills?
              </p>
              <Link to="/teams" className="btn btn-secondary btn-sm">
                Open Team Formation Hub
              </Link>
            </div>
          )}

          {/* LEARNING JOURNEY SHORTCUT */}
          <div className="card" style={{ borderColor: 'rgba(255, 107, 77, 0.3)', backgroundColor: 'rgba(255, 107, 77, 0.04)' }}>
            <div className="flex-between" style={{ flexWrap: 'wrap', gap: 12 }}>
              <div>
                <p style={{ fontWeight: 600, fontSize: 14, color: 'var(--coral-dark)' }}>
                  🚀 Innovation Learning Journey
                </p>
                <p className="text-dim" style={{ fontSize: 13, marginTop: 4 }}>
                  Follow the 5-phase roadmap from idea validation to pitch victory.
                </p>
              </div>
              <Link to="/student/learning-journey" className="btn btn-primary btn-sm">
                View Roadmap →
              </Link>
            </div>
          </div>
        </div>

        {/* SIDEBAR WIDGETS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 14 }}>Profile completion</p>
            <ProgressBar value={completion} />
            <Link
              to="/student/profile"
              style={{ color: 'var(--coral-dark)', fontSize: 12, marginTop: 12, display: 'inline-block', fontWeight: 600 }}
            >
              Update your profile & skills →
            </Link>
          </div>

          <div className="card">
            <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 14 }}>Skill snapshot</p>
            {profileSkills.length === 0 ? (
              <div>
                <p className="text-faint" style={{ fontSize: 13, marginBottom: 10 }}>
                  No skills listed yet. Add skills to get accurate teammate recommendations.
                </p>
                <Link to="/student/profile" className="btn btn-secondary btn-sm btn-block">
                  + Add Skills
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {profileSkills.slice(0, 4).map((s) => (
                  <ProgressBar key={s.name} value={s.level} label={s.name} color="amber" />
                ))}
              </div>
            )}
            <Link
              to="/student/performance"
              style={{ color: 'var(--coral-dark)', fontSize: 12, marginTop: 14, display: 'inline-block' }}
            >
              View full performance analysis →
            </Link>
          </div>

          <div className="card">
            <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 8 }}>Winner's Playbook</p>
            <p className="text-dim" style={{ fontSize: 13, lineHeight: 1.6, marginBottom: 12 }}>
              Winning pitch templates, rubric secrets, and GitHub repo checklists.
            </p>
            <Link to="/student/playbook" className="btn btn-secondary btn-sm btn-block">
              Open Playbook
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default StudentDashboard

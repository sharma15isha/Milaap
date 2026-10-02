import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import StatCard from '../../components/StatCard.jsx'
import { BarChart, TrendChart } from '../../components/Charts.jsx'
import api from '../../services/api.js'

function PerformanceAnalysis({ user, onLogout }) {
  const [analytics, setAnalytics] = useState(null)
  const [skills, setSkills] = useState([])
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPerformance() {
      try {
        const [anRes, skRes, histRes] = await Promise.allSettled([
          api.get('/performance/analytics'),
          api.get('/performance/skills'),
          api.get('/performance/me'),
        ])

        if (anRes.status === 'fulfilled') setAnalytics(anRes.value.data)
        if (skRes.status === 'fulfilled') setSkills(skRes.value.data || [])
        if (histRes.status === 'fulfilled') setHistory(histRes.value.data || [])
      } catch (err) {
        console.error('Failed to load performance metrics:', err)
      } finally {
        setLoading(false)
      }
    }

    loadPerformance()
  }, [])

  if (loading) {
    return (
      <DashboardLayout user={user} onLogout={onLogout}>
        <div className="flex-center" style={{ minHeight: '60vh' }}>
          <p className="empty-state">Loading your performance analytics...</p>
        </div>
      </DashboardLayout>
    )
  }

  const overallScore = analytics?.overall || 0
  const bestScore = analytics?.best || 0
  const trend = analytics?.trend || 'Stable'
  const totalCompleted = analytics?.totalEvents || history.length

  const trendData = (analytics?.trendSeries || []).map((t) => ({
    label: t.event ? t.event.split(' ').slice(0, 2).join(' ') : 'Event',
    value: t.score,
  }))

  const skillData = (skills || []).map((s) => ({
    label: s.skill.charAt(0).toUpperCase() + s.skill.slice(1),
    value: s.score,
  }))

  const highestSkill = skills.length > 0 ? [...skills].sort((a, b) => b.score - a.score)[0] : null
  const lowestSkill = skills.length > 1 ? [...skills].sort((a, b) => a.score - b.score)[0] : null

  return (
    <DashboardLayout user={user} onLogout={onLogout}>
      <p className="eyebrow" style={{ marginBottom: 8 }}>My Performance Analysis</p>
      <h1 style={{ fontSize: 28, marginBottom: 28 }}>Your innovation journey, measured.</h1>

      {/* STATS STRIP */}
      <div className="grid grid-4" style={{ marginBottom: 28 }}>
        <StatCard label="Overall performance score" value={overallScore > 0 ? `${overallScore}%` : 'New'} icon="📊" />
        <StatCard
          label="Performance trend"
          value={trend}
          icon="📈"
          trend={trend === 'Improving' ? '↑' : ''}
        />
        <StatCard label="Best score" value={bestScore > 0 ? `${bestScore}%` : '—'} icon="🏆" />
        <StatCard label="Events evaluated" value={totalCompleted} icon="🎖️" />
      </div>

      {totalCompleted === 0 ? (
        <div className="card text-center" style={{ padding: '40px 20px', marginBottom: 28 }}>
          <p style={{ fontSize: 32, marginBottom: 12 }}>🚀</p>
          <h2 style={{ fontSize: 20, marginBottom: 8 }}>No event evaluations yet</h2>
          <p className="text-dim" style={{ maxWidth: 480, margin: '0 auto 20px', lineHeight: 1.6 }}>
            Your scorecard will populate automatically once you submit a project for an event and the judges grade it across innovation, technical execution, and presentation.
          </p>
          <div className="flex gap-md" style={{ justifyContent: 'center' }}>
            <Link to="/events" className="btn btn-primary btn-sm">
              Discover Hackathons
            </Link>
            <Link to="/student/playbook" className="btn btn-secondary btn-sm">
              View Judging Rubric Secrets
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* CHARTS */}
          <div className="grid grid-2" style={{ marginBottom: 24 }}>
            <div className="card">
              <p style={{ fontWeight: 600, fontSize: 14 }}>Performance trend</p>
              <p className="text-faint" style={{ fontSize: 12, marginBottom: 10 }}>
                Score progression across your evaluated events
              </p>
              {trendData.length > 0 ? (
                <TrendChart data={trendData} />
              ) : (
                <p className="text-faint" style={{ padding: '20px 0', fontSize: 13 }}>No trend data yet.</p>
              )}
            </div>

            <div className="card">
              <p style={{ fontWeight: 600, fontSize: 14 }}>Category scores</p>
              <p className="text-faint" style={{ fontSize: 12, marginBottom: 10 }}>
                Average score by evaluation criterion
              </p>
              {skillData.length > 0 ? (
                <BarChart data={skillData} />
              ) : (
                <p className="text-faint" style={{ padding: '20px 0', fontSize: 13 }}>No category scores yet.</p>
              )}
            </div>
          </div>

          {/* STRENGTHS & IMPROVEMENTS */}
          <div className="grid grid-2" style={{ marginBottom: 24 }}>
            <div className="card">
              <p style={{ fontWeight: 600, color: 'var(--green)', marginBottom: 8 }}>Strengths</p>
              <p className="text-dim" style={{ fontSize: 14, lineHeight: 1.7 }}>
                {highestSkill ? (
                  <>
                    Your strongest evaluated area is <b style={{ color: 'var(--ink)' }}>{highestSkill.skill}</b>, averaging {highestSkill.score}% across submissions.
                  </>
                ) : (
                  'Complete more hackathons to unlock detailed strengths analytics.'
                )}
              </p>
            </div>

            <div className="card">
              <p style={{ fontWeight: 600, color: 'var(--coral-dark)', marginBottom: 8 }}>Areas for improvement</p>
              <p className="text-dim" style={{ fontSize: 14, lineHeight: 1.7 }}>
                {lowestSkill ? (
                  <>
                    Focus on lifting your <b style={{ color: 'var(--ink)' }}>{lowestSkill.skill}</b> scores (currently {lowestSkill.score}%). Review our Winner's Playbook guide to improve.
                  </>
                ) : (
                  'Rubric feedback from judges will appear here after evaluation.'
                )}
              </p>
            </div>
          </div>

          {/* PARTICIPATION HISTORY TABLE */}
          <p style={{ fontWeight: 600, marginBottom: 12 }}>Participation history</p>
          <div className="card table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Role</th>
                  <th>Overall</th>
                  <th>Rank</th>
                  <th>Feedback</th>
                </tr>
              </thead>
              <tbody>
                {history.map((p) => (
                  <tr key={p._id || p.id}>
                    <td>{p.eventId?.title || 'Event'}</td>
                    <td className="text-dim">{p.role || 'Contributor'}</td>
                    <td className="text-dim" style={{ fontFamily: 'monospace' }}>{p.overall}%</td>
                    <td className="text-dim" style={{ fontFamily: 'monospace' }}>
                      {p.rank ? `#${p.rank}` : (p.achievement || 'Evaluated')}
                    </td>
                    <td className="text-dim" style={{ fontSize: 12 }}>{p.feedback || 'Good job!'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </DashboardLayout>
  )
}

export default PerformanceAnalysis

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import { SkillBadge } from '../../components/SkillBadge.jsx'
import api from '../../services/api.js'

function SkillGapAnalysis({ user, onLogout }) {
  const [events, setEvents] = useState([])
  const [selectedEventId, setSelectedEventId] = useState('')
  const [gapData, setGapData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await api.get('/events')
        const allEvts = res.data || []
        setEvents(allEvts)
        if (allEvts.length > 0) {
          const openEvt = allEvts.find((e) => e.status === 'Registration Open') || allEvts[0]
          setSelectedEventId(openEvt._id)
        }
      } catch (err) {
        console.error('Failed to load events for skill gap analysis:', err)
      }
    }

    loadEvents()
  }, [])

  useEffect(() => {
    if (!selectedEventId) return

    async function loadSkillGap() {
      setLoading(true)
      try {
        const res = await api.get(`/performance/skill-gap?eventId=${selectedEventId}`)
        setGapData(res.data)
      } catch (err) {
        console.error('Failed to compute skill gap:', err)
      } finally {
        setLoading(false)
      }
    }

    loadSkillGap()
  }, [selectedEventId])

  const strong = gapData?.strong || []
  const gaps = gapData?.gaps || []
  const deadline = gapData?.deadline ? new Date(gapData.deadline).toLocaleDateString() : 'soon'

  return (
    <DashboardLayout user={user} onLogout={onLogout}>
      <p className="eyebrow" style={{ marginBottom: 8 }}>Skill Gap Analysis</p>
      <h1 style={{ fontSize: 28, marginBottom: 28 }}>Know exactly what to learn next.</h1>

      {/* TARGET EVENT SELECTOR */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="flex-between" style={{ flexWrap: 'wrap', gap: 14 }}>
          <div>
            <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>🎯 Target Event</p>
            <p className="text-dim" style={{ fontSize: 13.5 }}>
              Choose an event to compare your current profile skills against the organizer’s required skills.
            </p>
          </div>
          <select
            className="form-select"
            style={{ minWidth: 260 }}
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
          >
            {events.map((evt) => (
              <option key={evt._id} value={evt._id}>
                {evt.title} ({evt.status})
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="card text-center" style={{ padding: 40 }}>
          <p className="empty-state">Analyzing skill compatibility...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-2" style={{ marginBottom: 24 }}>
            <div className="card">
              <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 14 }}>✅ Your strong skills</p>
              {strong.length ? (
                <div className="flex flex-wrap gap-sm">
                  {strong.map((s) => (
                    <SkillBadge key={s} tone="strong">{s}</SkillBadge>
                  ))}
                </div>
              ) : (
                <div>
                  <p className="text-faint" style={{ fontSize: 13.5, marginBottom: 10 }}>
                    No matching skills on your profile yet.
                  </p>
                  <Link to="/student/profile" className="btn btn-secondary btn-sm">
                    + Add skills to your profile
                  </Link>
                </div>
              )}
            </div>

            <div className="card">
              <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 14 }}>⚠️ Missing / required skills</p>
              {gaps.length ? (
                <div className="flex flex-wrap gap-sm">
                  {gaps.map((s) => (
                    <SkillBadge key={s} tone="gap">{s}</SkillBadge>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--green)', fontSize: 14, fontWeight: 500 }}>
                  ✓ You cover every required skill for this competition!
                </p>
              )}
            </div>
          </div>

          {gaps.length > 0 ? (
            <div className="card" style={{ borderColor: 'rgba(255,107,77,0.3)', backgroundColor: 'rgba(255,107,77,0.04)' }}>
              <p style={{ fontSize: 14, lineHeight: 1.7, marginBottom: 14 }}>
                💡 <b>Strategic Recommendation:</b> To become a top contender for{' '}
                <b>{gapData?.event}</b>, focus on mastering{' '}
                <span style={{ color: 'var(--coral-dark)', fontWeight: 600 }}>{gaps.join(' and ')}</span>.
                Alternatively, use Milaap's <b>Team Formation Hub</b> to invite a teammate who brings these skills!
              </p>
              <div className="flex gap-md flex-wrap">
                <Link to="/teams" className="btn btn-primary btn-sm">
                  Find Teammate with {gaps[0] || 'skills'} →
                </Link>
                <Link to="/student/learning-journey" className="btn btn-secondary btn-sm">
                  View Innovation Roadmap
                </Link>
              </div>
            </div>
          ) : (
            <div className="card" style={{ borderColor: 'rgba(46, 196, 182, 0.3)', backgroundColor: 'rgba(46, 196, 182, 0.04)' }}>
              <p style={{ fontSize: 14, lineHeight: 1.7, marginBottom: 14 }}>
                🎉 <b>Ready to Compete:</b> Your profile matches all required skill domains for this event. Register now and assemble your team!
              </p>
              <Link to={`/events/${selectedEventId}`} className="btn btn-primary btn-sm">
                Register for Event →
              </Link>
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  )
}

export default SkillGapAnalysis

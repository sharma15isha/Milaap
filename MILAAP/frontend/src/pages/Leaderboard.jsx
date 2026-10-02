import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api.js'

const rankClass = { 1: 'rank-1', 2: 'rank-2', 3: 'rank-3' }

function Leaderboard() {
  const [events, setEvents] = useState([])
  const [selectedEventId, setSelectedEventId] = useState('')
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await api.get('/events')
        const allEvts = res.data || []
        setEvents(allEvts)
        if (allEvts.length > 0) {
          // Default to first completed event or first event
          const completed = allEvts.find((e) => e.status === 'Completed') || allEvts[0]
          setSelectedEventId(completed._id)
        }
      } catch (err) {
        console.error('Failed to load events for leaderboard:', err)
      }
    }

    loadEvents()
  }, [])

  useEffect(() => {
    if (!selectedEventId) return

    async function loadLeaderboard() {
      setLoading(true)
      try {
        const res = await api.get(`/events/${selectedEventId}/leaderboard`)
        setLeaderboard(res.data || [])
      } catch (err) {
        console.error('Failed to load event leaderboard:', err)
      } finally {
        setLoading(false)
      }
    }

    loadLeaderboard()
  }, [selectedEventId])

  const currentEvent = events.find((e) => e._id === selectedEventId)

  return (
    <div className="page-with-navbar">
      <div className="container" style={{ maxWidth: 880 }}>
        <div className="flex-between" style={{ flexWrap: 'wrap', gap: 14, marginBottom: 8 }}>
          <div>
            <p className="eyebrow" style={{ marginBottom: 6 }}>
              {currentEvent?.type || 'Innovation Challenge'} · Live Rankings
            </p>
            <h1 style={{ fontSize: 36 }}>🏆 Leaderboard</h1>
          </div>

          <select
            className="form-select"
            style={{ minWidth: 260, height: 44 }}
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

        <p className="text-dim" style={{ marginBottom: 30 }}>
          Live rankings, updated automatically as judges submit scores and evaluations across all criteria.
        </p>

        {loading ? (
          <div className="card text-center" style={{ padding: 40 }}>
            <p className="empty-state">Loading competition standings...</p>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="card text-center" style={{ padding: 40 }}>
            <p style={{ fontSize: 32, marginBottom: 12 }}>⚖️</p>
            <h2 style={{ fontSize: 18, marginBottom: 8 }}>No evaluations recorded yet</h2>
            <p className="text-dim" style={{ maxWidth: 440, margin: '0 auto 16px', lineHeight: 1.6 }}>
              Once judges begin reviewing project submissions for <b>{currentEvent?.title}</b>, the live leaderboard will calculate totals automatically.
            </p>
            <Link to="/events" className="btn btn-secondary btn-sm">
              Back to Events Feed
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {leaderboard.map((row, i) => (
              <div
                className="card fade-up"
                key={row.rank || i}
                style={{
                  animationDelay: `${i * 0.06}s`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 20,
                  flexWrap: 'wrap',
                }}
              >
                <div className={`rank-circle ${rankClass[row.rank] || ''}`}>
                  {row.rank}
                </div>

                <div style={{ flex: 1, minWidth: 180 }}>
                  <p style={{ fontWeight: 600, fontSize: 15 }}>{row.team}</p>
                  <p className="text-faint" style={{ fontSize: 13, marginTop: 2 }}>{row.project}</p>
                </div>

                <div className="flex gap-md text-faint" style={{ fontSize: 11, fontFamily: 'monospace' }}>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ color: 'var(--ink)', fontWeight: 600 }}>{row.innovation}%</p>
                    <p>Innovation</p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ color: 'var(--ink)', fontWeight: 600 }}>{row.technical}%</p>
                    <p>Technical</p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ color: 'var(--ink)', fontWeight: 600 }}>{row.presentation}%</p>
                    <p>Pitch</p>
                  </div>
                </div>

                <div style={{ textAlign: 'right', minWidth: 70 }}>
                  <p
                    style={{
                      fontSize: 22,
                      fontWeight: 700,
                      color: 'var(--coral-dark)',
                      fontFamily: 'var(--font-heading)',
                    }}
                  >
                    {row.total}%
                  </p>
                  <p className="text-faint" style={{ fontSize: 10, textTransform: 'uppercase' }}>Total</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Leaderboard

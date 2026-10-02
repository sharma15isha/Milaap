import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import StatCard from '../../components/StatCard.jsx'
import ProgressBar from '../../components/ProgressBar.jsx'
import api from '../../services/api.js'

function OrganizerDashboard({ user, onLogout }) {
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalRegistrations: 0,
    totalTeams: 0,
    totalSubmissions: 0,
    evaluationProgress: 0,
  })
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionMsg, setActionMsg] = useState('')

  useEffect(() => {
    async function loadOrganizerData() {
      try {
        const [statsRes, eventsRes] = await Promise.allSettled([
          api.get('/events/stats/organizer'),
          api.get('/events/organizer/my-events'),
        ])

        if (statsRes.status === 'fulfilled') {
          setStats(statsRes.value.data)
        }
        if (eventsRes.status === 'fulfilled') {
          setEvents(eventsRes.value.data || [])
        } else {
          // Fallback to all events
          const fallback = await api.get('/events')
          setEvents(fallback.data || [])
        }
      } catch (err) {
        console.error('Failed to load organizer dashboard data:', err)
      } finally {
        setLoading(false)
      }
    }

    loadOrganizerData()
  }, [])

  const handleDeleteEvent = async (eventId, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return

    try {
      await api.delete(`/events/${eventId}`)
      setEvents((prev) => prev.filter((e) => e._id !== eventId))
      setActionMsg(`✓ Event "${title}" deleted successfully.`)
      setTimeout(() => setActionMsg(''), 3000)
    } catch (err) {
      console.error('Delete event failed:', err)
      alert(err.response?.data?.message || 'Failed to delete event')
    }
  }

  return (
    <DashboardLayout user={user} onLogout={onLogout}>
      <div className="flex-between" style={{ marginBottom: 28, flexWrap: 'wrap', gap: 14 }}>
        <div>
          <p className="eyebrow" style={{ marginBottom: 8 }}>Organizer Dashboard</p>
          <h1 style={{ fontSize: 28 }}>{user?.name || 'Innovation Cell Organizer'}</h1>
        </div>
        <Link to="/organizer/create-event" className="btn btn-primary">
          + Create Event
        </Link>
      </div>

      {actionMsg && (
        <div className="card" style={{ marginBottom: 20, backgroundColor: 'rgba(46, 196, 182, 0.1)', borderColor: 'var(--green)', color: 'var(--green)', fontWeight: 600 }}>
          {actionMsg}
        </div>
      )}

      {/* STATS STRIP */}
      <div className="grid grid-4" style={{ marginBottom: 28 }}>
        <StatCard label="Total events" value={stats.totalEvents} icon="📅" />
        <StatCard label="Registrations" value={stats.totalRegistrations} icon="👥" />
        <StatCard label="Teams formed" value={stats.totalTeams} icon="🤝" />
        <StatCard label="Submissions" value={stats.totalSubmissions} icon="📁" />
      </div>

      <div className="card" style={{ marginBottom: 28 }}>
        <p style={{ fontWeight: 600, marginBottom: 14 }}>📊 Overall Evaluation Progress</p>
        <ProgressBar value={stats.evaluationProgress} label={`${stats.evaluationProgress}% of submissions evaluated`} />
      </div>

      <div className="flex-between" style={{ marginBottom: 14 }}>
        <p style={{ fontWeight: 600, fontSize: 16 }}>Manage Your Events</p>
        <span className="text-faint" style={{ fontSize: 13 }}>{events.length} events listed</span>
      </div>

      {loading ? (
        <div className="card text-center" style={{ padding: 40 }}>
          <p className="empty-state">Loading events...</p>
        </div>
      ) : events.length === 0 ? (
        <div className="card text-center" style={{ padding: 40 }}>
          <p className="text-dim" style={{ fontSize: 15, marginBottom: 12 }}>
            You haven't created any events yet.
          </p>
          <Link to="/organizer/create-event" className="btn btn-primary btn-sm">
            Publish your first competition or hackathon
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {events.map((e) => (
            <div className="card flex-between" key={e._id} style={{ flexWrap: 'wrap', gap: 12 }}>
              <div>
                <p style={{ fontSize: 15, fontWeight: 600 }}>{e.title}</p>
                <p className="text-faint" style={{ fontSize: 12, marginTop: 4 }}>
                  {e.type} · {new Date(e.startDate).toLocaleDateString()} · {e.mode} ·{' '}
                  <span style={{ color: 'var(--coral-dark)', fontWeight: 500 }}>{e.status}</span>
                </p>
              </div>
              <div className="flex gap-sm">
                <Link to={`/events/${e._id}`} className="btn btn-secondary btn-sm">
                  View Public Page
                </Link>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ color: 'var(--coral)' }}
                  onClick={() => handleDeleteEvent(e._id, e.title)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}

export default OrganizerDashboard

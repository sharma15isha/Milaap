import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../services/api.js'
import { SkillBadge } from '../components/SkillBadge.jsx'

function EventDetails({ user }) {
  const { id } = useParams()

  const [event, setEvent] = useState(null)
  const [isRegistered, setIsRegistered] = useState(false)
  const [registering, setRegistering] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [regMsg, setRegMsg] = useState('')

  useEffect(() => {
    async function fetchEventAndRegistration() {
      try {
        const eventRes = await api.get(`/events/${id}`)
        setEvent(eventRes.data)

        if (user && user.role === 'student') {
          try {
            const regRes = await api.get('/events/my-registrations')
            const registeredIds = (regRes.data || []).map((r) => r.eventId?._id || r.eventId)
            if (registeredIds.includes(id)) {
              setIsRegistered(true)
            }
          } catch (e) {
            console.warn(e)
          }
        }
      } catch (err) {
        console.error('Failed to fetch event:', err)
        setError('Unable to load event details.')
      } finally {
        setLoading(false)
      }
    }

    fetchEventAndRegistration()
  }, [id, user])

  const handleRegister = async () => {
    if (!user) {
      alert('Please log in as a student to register for events.')
      return
    }

    if (user.role !== 'student') {
      alert(`Accounts with role "${user.role}" cannot register as participants. Please log in with a student account.`)
      return
    }

    setRegistering(true)
    setRegMsg('')
    try {
      await api.post(`/events/${event._id}/register`)
      setIsRegistered(true)
      setRegMsg('✓ Successfully registered for this event! Form your team and prepare your submission.')
    } catch (err) {
      console.error('Registration failed:', err)
      setRegMsg(err.response?.data?.message || 'Registration failed')
    } finally {
      setRegistering(false)
    }
  }

  if (loading) {
    return (
      <div className="page-with-navbar">
        <div className="container">
          <p className="empty-state">Loading event details...</p>
        </div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="page-with-navbar">
        <div className="container">
          <p className="empty-state">{error || 'Event not found.'}</p>
          <div style={{ textAlign: 'center', marginTop: 14 }}>
            <Link to="/events" className="btn btn-secondary btn-sm">
              ← Return to Events
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const startDateFormatted = event.startDate ? new Date(event.startDate).toLocaleDateString() : 'TBA'
  const deadlineFormatted = event.registrationDeadline ? new Date(event.registrationDeadline).toLocaleDateString() : 'TBA'

  const infoRows = [
    { icon: '📅', label: 'Event date', value: startDateFormatted },
    { icon: '⏰', label: 'Registration closes', value: deadlineFormatted },
    { icon: '📍', label: 'Mode & venue', value: `${event.mode || 'Offline'} · ${event.venue || 'Campus'}` },
    { icon: '👥', label: 'Team size', value: event.teamSize || '1–4' },
    { icon: '🏆', label: 'Prize', value: event.prize || 'Certificates & Recognition' },
  ]

  return (
    <div className="page-with-navbar">
      <div className="container" style={{ maxWidth: 780 }}>
        <Link
          to="/events"
          className="text-dim"
          style={{
            fontSize: 14,
            display: 'inline-block',
            marginBottom: 24,
          }}
        >
          ← Back to events
        </Link>

        {regMsg && (
          <div
            className="card"
            style={{
              marginBottom: 20,
              backgroundColor: regMsg.startsWith('✓') ? 'rgba(46, 196, 182, 0.1)' : 'rgba(255, 107, 77, 0.1)',
              borderColor: regMsg.startsWith('✓') ? 'var(--green)' : 'var(--coral)',
              color: regMsg.startsWith('✓') ? 'var(--green)' : 'var(--coral-dark)',
              fontWeight: 600,
            }}
          >
            {regMsg}
          </div>
        )}

        <div className="flex-between" style={{ alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <p className="eyebrow" style={{ marginBottom: 8 }}>
              {event.type} · {event.organizerName || 'Chitkara Innovation Cell'}
            </p>
            <h1 style={{ fontSize: 34, marginBottom: 12 }}>{event.title}</h1>
          </div>
          <span className="badge" style={{ backgroundColor: 'var(--coral-tint)', color: 'var(--coral-dark)' }}>
            {event.status}
          </span>
        </div>

        <p className="text-dim" style={{ lineHeight: 1.8, marginBottom: 30, fontSize: 15 }}>
          {event.description}
        </p>

        <div className="grid grid-2" style={{ marginBottom: 30 }}>
          {infoRows.map((row) => (
            <div
              className="card"
              key={row.label}
              style={{
                display: 'flex',
                gap: 12,
                alignItems: 'flex-start',
              }}
            >
              <span style={{ fontSize: 20 }}>{row.icon}</span>
              <div>
                <p className="text-faint" style={{ fontSize: 12 }}>{row.label}</p>
                <p style={{ fontSize: 14, marginTop: 3, fontWeight: 500 }}>{row.value}</p>
              </div>
            </div>
          ))}
        </div>

        <p style={{ fontWeight: 600, marginBottom: 12 }}>Required & Target Skills</p>
        <div className="flex flex-wrap gap-sm" style={{ marginBottom: 34 }}>
          {(event.requiredSkills || []).map((s) => (
            <SkillBadge key={s}>{s}</SkillBadge>
          ))}
        </div>

        {event.rules && (
          <div className="card" style={{ marginBottom: 30 }}>
            <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 6 }}>Competition Rules & Eligibility</p>
            <p className="text-dim" style={{ fontSize: 13.5, lineHeight: 1.6 }}>{event.rules}</p>
          </div>
        )}

        {/* ACTIONS */}
        <div className="flex gap-md flex-wrap" style={{ alignItems: 'center' }}>
          {isRegistered ? (
            <div className="flex gap-sm" style={{ alignItems: 'center' }}>
              <span
                className="badge"
                style={{
                  backgroundColor: 'var(--green-tint)',
                  color: 'var(--green)',
                  fontSize: 14,
                  padding: '8px 16px',
                  fontWeight: 600,
                }}
              >
                ✓ You are registered
              </span>
              <Link to="/student/submissions" className="btn btn-primary">
                Submit Project →
              </Link>
            </div>
          ) : (
            <button
              className="btn btn-primary"
              onClick={handleRegister}
              disabled={registering}
            >
              {registering ? 'Registering...' : 'Register for this event'}
            </button>
          )}

          <Link to="/teams" className="btn btn-secondary">
            Find teammates for this event
          </Link>

          <Link to="/leaderboard" className="btn btn-secondary">
            View Live Leaderboard
          </Link>
        </div>
      </div>
    </div>
  )
}

export default EventDetails
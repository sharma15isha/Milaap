import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { events } from '../data/mockData.js'
import { SkillBadge } from '../components/SkillBadge.jsx'

function EventDetails() {
  const { id } = useParams()
  const event = events.find((e) => e.id === id)
  const [registered, setRegistered] = useState(false)

  if (!event) {
    return (
      <div className="page-with-navbar">
        <div className="container">
          <p className="empty-state">Event not found.</p>
        </div>
      </div>
    )
  }

  const infoRows = [
    { icon: '📅', label: 'Event date', value: event.startDate },
    { icon: '⏰', label: 'Registration closes', value: event.registrationDeadline },
    { icon: '📍', label: 'Mode & venue', value: `${event.mode} · ${event.venue}` },
    { icon: '👥', label: 'Team size', value: event.teamSize },
    { icon: '🏆', label: 'Prize', value: event.prize },
  ]

  return (
    <div className="page-with-navbar">
      <div className="container" style={{ maxWidth: 720 }}>
        <Link to="/events" className="text-dim" style={{ fontSize: 14, display: 'inline-block', marginBottom: 28 }}>
          ← Back to events
        </Link>

        <p className="eyebrow" style={{ marginBottom: 12 }}>{event.type} · {event.organizer}</p>
        <h1 style={{ fontSize: 34, marginBottom: 16 }}>{event.title}</h1>
        <p className="text-dim" style={{ lineHeight: 1.7, marginBottom: 30 }}>{event.description}</p>

        <div className="grid grid-2" style={{ marginBottom: 30 }}>
          {infoRows.map((row) => (
            <div className="card" key={row.label} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 18 }}>{row.icon}</span>
              <div>
                <p className="text-faint" style={{ fontSize: 12 }}>{row.label}</p>
                <p style={{ fontSize: 14, marginTop: 3 }}>{row.value}</p>
              </div>
            </div>
          ))}
        </div>

        <p style={{ fontWeight: 600, marginBottom: 12 }}>Required skills</p>
        <div className="flex flex-wrap gap-sm" style={{ marginBottom: 34 }}>
          {event.requiredSkills.map((s) => (
            <SkillBadge key={s}>{s}</SkillBadge>
          ))}
        </div>

        <div className="flex gap-md flex-wrap">
          {registered ? (
            <span style={{ color: 'var(--green)', fontWeight: 600, fontSize: 14 }}>
              ✓ You're registered for this event
            </span>
          ) : (
            <button className="btn btn-primary" onClick={() => setRegistered(true)}>
              Register for this event
            </button>
          )}
          <Link to="/teams" className="btn btn-secondary">
            Find teammates for this event
          </Link>
        </div>
      </div>
    </div>
  )
}

export default EventDetails

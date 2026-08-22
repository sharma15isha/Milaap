import { Link } from 'react-router-dom'
import { SkillBadge } from './SkillBadge.jsx'

const statusClass = {
  'Registration Open': 'badge-status-open',
  'Ongoing': 'badge-status-ongoing',
  'Completed': 'badge-status-completed',
}

// index prop is used only to stagger the fade-up animation delay
function EventCard({ event, index = 0 }) {
  return (
    <div
      className="card card-hover fade-up"
      style={{ animationDelay: `${index * 0.08}s`, display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      <div className="flex-between" style={{ marginBottom: 12 }}>
        <p className="eyebrow">{event.type}</p>
        <span className={`badge ${statusClass[event.status]}`}>{event.status}</span>
      </div>

      <h3 style={{ fontSize: 18, marginBottom: 8 }}>{event.title}</h3>
      <p className="text-dim" style={{ fontSize: 14, marginBottom: 16, flex: 1 }}>
        {event.description}
      </p>

      <div className="flex flex-wrap gap-sm" style={{ marginBottom: 16 }}>
        {event.requiredSkills.slice(0, 3).map((s) => (
          <SkillBadge key={s}>{s}</SkillBadge>
        ))}
      </div>

      <div className="text-faint" style={{ fontSize: 12, fontFamily: 'monospace', marginBottom: 18, lineHeight: 1.9 }}>
        <div>📅 {event.startDate}</div>
        <div>📍 {event.mode} · {event.venue}</div>
        <div>👥 Team size: {event.teamSize}</div>
      </div>

      <Link to={`/events/${event.id}`} className="btn btn-secondary btn-block">
        View details
      </Link>
    </div>
  )
}

export default EventCard

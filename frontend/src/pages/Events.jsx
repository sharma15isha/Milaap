import { useState } from 'react'
import EventCard from '../components/EventCard.jsx'
import { events, EVENT_TYPES } from '../data/mockData.js'

const STATUS_TABS = ['All', 'Registration Open', 'Ongoing', 'Completed']

function Events() {
  const [query, setQuery] = useState('')
  const [type, setType] = useState('All')
  const [status, setStatus] = useState('All')

  // Plain filtering — recalculated on every render, no useMemo needed
  // for a list this small.
  const filtered = events.filter((e) => {
    const matchesQuery = e.title.toLowerCase().includes(query.toLowerCase())
    const matchesType = type === 'All' || e.type === type
    const matchesStatus = status === 'All' || e.status === status
    return matchesQuery && matchesType && matchesStatus
  })

  return (
    <div className="page-with-navbar">
      <div className="container">
        <p className="eyebrow" style={{ marginBottom: 12 }}>Event Discovery</p>
        <h1 style={{ fontSize: 36, marginBottom: 12 }}>Every opportunity, one feed.</h1>
        <p className="text-dim" style={{ maxWidth: 480, marginBottom: 34 }}>
          Hackathons, competitions, workshops, and ideathons across campus —
          searchable and filterable.
        </p>

        <div className="flex gap-md" style={{ marginBottom: 20, flexWrap: 'wrap' }}>
          <input
            className="form-input"
            style={{ flex: 1, minWidth: 220 }}
            placeholder="Search events..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select className="form-select" style={{ width: 200 }} value={type} onChange={(e) => setType(e.target.value)}>
            <option>All</option>
            {EVENT_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="scroll-tabs" style={{ marginBottom: 34 }}>
          {STATUS_TABS.map((s) => (
            <button
              key={s}
              className={`filter-tab ${status === s ? 'active' : ''}`}
              onClick={() => setStatus(s)}
            >
              {s}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="empty-state">No events match your filters yet.</p>
        ) : (
          <div className="grid grid-3">
            {filtered.map((event, i) => (
              <EventCard key={event.id} event={event} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Events

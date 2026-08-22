import { useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import { EVENT_TYPES } from '../../data/mockData.js'

function CreateEvent({ user, onLogout }) {
  const [title, setTitle] = useState('')
  const [type, setType] = useState(EVENT_TYPES[0])
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState('')
  const [registrationDeadline, setRegistrationDeadline] = useState('')
  const [mode, setMode] = useState('Offline')
  const [venue, setVenue] = useState('')
  const [requiredSkills, setRequiredSkills] = useState('')
  const [teamSize, setTeamSize] = useState('')
  const [prize, setPrize] = useState('')
  const [created, setCreated] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setCreated(true)
    setTimeout(() => setCreated(false), 2500)
  }

  return (
    <DashboardLayout user={user} onLogout={onLogout}>
      <p className="eyebrow" style={{ marginBottom: 8 }}>Create Event</p>
      <h1 style={{ fontSize: 28, marginBottom: 28 }}>Publish a new opportunity.</h1>

      <div className="card" style={{ maxWidth: 640 }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Event title</label>
            <input className="form-input" placeholder="AI Innovation Challenge 2026" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Event type</label>
              <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
                {EVENT_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Mode</label>
              <select className="form-select" value={mode} onChange={(e) => setMode(e.target.value)}>
                <option>Offline</option>
                <option>Online</option>
                <option>Hybrid</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-textarea" rows={3} placeholder="What is this event about?" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Event date</label>
              <input type="date" className="form-input" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Registration deadline</label>
              <input type="date" className="form-input" value={registrationDeadline} onChange={(e) => setRegistrationDeadline(e.target.value)} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Venue</label>
            <input className="form-input" placeholder="Innovation Block, Chitkara University" value={venue} onChange={(e) => setVenue(e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Required skills (comma separated)</label>
            <input className="form-input" placeholder="Python, React, Machine Learning" value={requiredSkills} onChange={(e) => setRequiredSkills(e.target.value)} />
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Team size</label>
              <input className="form-input" placeholder="3–4" value={teamSize} onChange={(e) => setTeamSize(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Prize</label>
              <input className="form-input" placeholder="₹75,000 + Internship" value={prize} onChange={(e) => setPrize(e.target.value)} />
            </div>
          </div>

          <button type="submit" className="btn btn-primary">
            {created ? '✓ Event published' : 'Publish event'}
          </button>
        </form>
      </div>
    </DashboardLayout>
  )
}

export default CreateEvent

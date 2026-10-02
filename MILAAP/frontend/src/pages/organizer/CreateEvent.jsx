import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import api from '../../services/api.js'

const EVENT_TYPES = [
  'Hackathon',
  'Coding Competition',
  'Workshop',
  'Ideathon',
  'Innovation Challenge',
]

function CreateEvent({ user, onLogout }) {
  const [title, setTitle] = useState('')
  const [type, setType] = useState(EVENT_TYPES[0])
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [registrationDeadline, setRegistrationDeadline] = useState('')
  const [mode, setMode] = useState('Offline')
  const [venue, setVenue] = useState('Innovation Block, Chitkara University')
  const [requiredSkills, setRequiredSkills] = useState('')
  const [teamSize, setTeamSize] = useState('3–4')
  const [prize, setPrize] = useState('')
  const [rules, setRules] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    if (!title.trim() || !description.trim() || !startDate || !registrationDeadline) {
      setErrorMsg('Please fill in all required event details (Title, Description, Event Date, Registration Deadline).')
      return
    }

    setSubmitting(true)
    try {
      const skillsArray = requiredSkills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)

      const payload = {
        title: title.trim(),
        type,
        description: description.trim(),
        startDate,
        endDate: endDate || startDate,
        registrationDeadline,
        mode,
        venue: venue.trim(),
        requiredSkills: skillsArray,
        teamSize: teamSize.trim() || '1',
        prize: prize.trim(),
        rules: rules.trim(),
        status: 'Registration Open',
      }

      const res = await api.post('/events', payload)
      setSuccessMsg('✓ Event published successfully!')

      setTimeout(() => {
        navigate(`/events/${res.data._id}`)
      }, 1200)
    } catch (err) {
      console.error('Failed to create event:', err)
      setErrorMsg(err.response?.data?.message || 'Failed to create event. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <DashboardLayout user={user} onLogout={onLogout}>
      <p className="eyebrow" style={{ marginBottom: 8 }}>Event Organizer Hub</p>
      <h1 style={{ fontSize: 28, marginBottom: 28 }}>Publish a new campus opportunity.</h1>

      <div className="card" style={{ maxWidth: 680 }}>
        {successMsg && (
          <div className="card" style={{ marginBottom: 20, backgroundColor: 'rgba(46, 196, 182, 0.1)', borderColor: 'var(--green)', color: 'var(--green)', fontWeight: 600 }}>
            {successMsg}
          </div>
        )}

        {errorMsg && (
          <div className="card" style={{ marginBottom: 20, backgroundColor: 'rgba(255, 107, 77, 0.1)', borderColor: 'var(--coral)', color: 'var(--coral-dark)', fontWeight: 600 }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Event Title *</label>
            <input
              className="form-input"
              placeholder="e.g. AI Innovation Challenge 2026"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Event Type *</label>
              <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
                {EVENT_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
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
            <label className="form-label">Event Description & Themes *</label>
            <textarea
              className="form-textarea"
              rows={4}
              placeholder="What is the objective, scope, and problem focus for participants?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Start Date *</label>
              <input
                type="date"
                className="form-input"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Registration Deadline *</label>
              <input
                type="date"
                className="form-input"
                value={registrationDeadline}
                onChange={(e) => setRegistrationDeadline(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Venue / Room</label>
            <input
              className="form-input"
              placeholder="Innovation Block, Chitkara University"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Required / Target Skills (comma separated)</label>
            <input
              className="form-input"
              placeholder="Python, React, Machine Learning, UI/UX, IoT"
              value={requiredSkills}
              onChange={(e) => setRequiredSkills(e.target.value)}
            />
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Team Size</label>
              <input
                className="form-input"
                placeholder="e.g. 3–4, or 1 (Solo)"
                value={teamSize}
                onChange={(e) => setTeamSize(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Prizes & Incentives</label>
              <input
                className="form-input"
                placeholder="₹75,000 + Internship & Medals"
                value={prize}
                onChange={(e) => setPrize(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? 'Publishing event...' : 'Publish Event to Milaap'}
          </button>
        </form>
      </div>
    </DashboardLayout>
  )
}

export default CreateEvent

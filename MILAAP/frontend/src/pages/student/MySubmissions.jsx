import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import api from '../../services/api.js'

function MySubmissions({ user, onLogout }) {
  const [submissions, setSubmissions] = useState([])
  const [registeredEvents, setRegisteredEvents] = useState([])
  const [allEvents, setAllEvents] = useState([])
  const [myTeams, setMyTeams] = useState([])
  const [loading, setLoading] = useState(true)

  // Form fields
  const [title, setTitle] = useState('')
  const [selectedEventId, setSelectedEventId] = useState('')
  const [selectedTeamId, setSelectedTeamId] = useState('')
  const [description, setDescription] = useState('')
  const [problemStatement, setProblemStatement] = useState('')
  const [solution, setSolution] = useState('')
  const [technologies, setTechnologies] = useState('')
  const [githubUrl, setGithubUrl] = useState('')
  const [demoUrl, setDemoUrl] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    async function loadData() {
      try {
        const [subRes, regRes, allEvtRes, teamsRes] = await Promise.allSettled([
          api.get('/projects/me'),
          api.get('/events/my-registrations'),
          api.get('/events'),
          api.get('/teams/me'),
        ])

        if (subRes.status === 'fulfilled') setSubmissions(subRes.value.data || [])
        if (regRes.status === 'fulfilled') setRegisteredEvents(regRes.value.data || [])
        if (allEvtRes.status === 'fulfilled') setAllEvents(allEvtRes.value.data || [])
        if (teamsRes.status === 'fulfilled') setMyTeams(teamsRes.value.data || [])

        // Pre-select first registered or first open event
        const defaultEvt = regRes.status === 'fulfilled' && regRes.value.data?.[0]?.eventId?._id
          ? regRes.value.data[0].eventId._id
          : (allEvtRes.status === 'fulfilled' && allEvtRes.value.data?.[0]?._id) || ''
        setSelectedEventId(defaultEvt)
      } catch (err) {
        console.error('Error loading submissions data:', err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    if (!title.trim() || !selectedEventId) {
      setErrorMsg('Please enter a project title and select an event.')
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        title: title.trim(),
        eventId: selectedEventId,
        teamId: selectedTeamId || null,
        description: description.trim(),
        problemStatement: problemStatement.trim(),
        solution: solution.trim(),
        technologies: technologies.split(',').map((t) => t.trim()).filter(Boolean),
        githubUrl: githubUrl.trim(),
        demoUrl: demoUrl.trim(),
      }

      const res = await api.post('/projects', payload)
      setSuccessMsg('✓ Project submitted successfully for judging!')

      // Prepend to submissions list
      setSubmissions([res.data, ...submissions])

      // Clear form
      setTitle('')
      setDescription('')
      setProblemStatement('')
      setSolution('')
      setTechnologies('')
      setGithubUrl('')
      setDemoUrl('')
    } catch (err) {
      console.error('Submission failed:', err)
      setErrorMsg(err.response?.data?.message || 'Submission failed. Please check required fields.')
    } finally {
      setSubmitting(false)
    }
  }

  // Available events to submit for: preferred from user's registrations, fallback to open events
  const selectableEvents = registeredEvents.length > 0
    ? registeredEvents.map((r) => r.eventId).filter(Boolean)
    : allEvents

  return (
    <DashboardLayout user={user} onLogout={onLogout}>
      <p className="eyebrow" style={{ marginBottom: 8 }}>Project Submissions</p>
      <h1 style={{ fontSize: 28, marginBottom: 28 }}>
        Submit your project link & pitch.
      </h1>

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

      <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        {/* SUBMISSION FORM */}
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Project Title *</label>
              <input
                className="form-input"
                placeholder="e.g. CampusGuard AI, EduMatch"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">Target Event *</label>
                <select
                  className="form-select"
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  required
                >
                  <option value="">Select event...</option>
                  {selectableEvents.map((evt) => (
                    <option key={evt._id || evt.id} value={evt._id || evt.id}>
                      {evt.title} ({evt.type})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Submitting Team (or Solo)</label>
                <select
                  className="form-select"
                  value={selectedTeamId}
                  onChange={(e) => setSelectedTeamId(e.target.value)}
                >
                  <option value="">Solo Submission</option>
                  {myTeams.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.teamName} ({t.eventId?.title || 'Team'})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Brief Description & Problem Statement</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="What campus or civic problem does this solve?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            <div className="form-group">
              <label className="form-label">Key Technologies Used (comma separated)</label>
              <input
                className="form-input"
                placeholder="React, Node.js, Express, MongoDB, Python, TensorFlow"
                value={technologies}
                onChange={(e) => setTechnologies(e.target.value)}
              />
            </div>

            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">GitHub Repository URL</label>
                <input
                  className="form-input"
                  placeholder="https://github.com/..."
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Live Demo / Video Link</label>
                <input
                  className="form-input"
                  placeholder="https://yourdemo.vercel.app or YouTube"
                  value={demoUrl}
                  onChange={(e) => setDemoUrl(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Submitting project...' : 'Submit Project for Judging'}
            </button>
          </form>
        </div>

        {/* SUBMISSION HISTORY */}
        <div>
          <p style={{ fontWeight: 600, marginBottom: 14 }}>Your Submissions</p>
          {loading ? (
            <p className="text-faint" style={{ fontSize: 13 }}>Loading submissions...</p>
          ) : submissions.length === 0 ? (
            <div className="card text-center" style={{ padding: 24 }}>
              <p className="text-faint" style={{ fontSize: 13, marginBottom: 12 }}>
                No submissions made yet.
              </p>
              <p className="text-dim" style={{ fontSize: 12 }}>
                Pick an event, add your GitHub link, and submit your project.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {submissions.map((s) => (
                <div className="card" key={s._id || s.id}>
                  <div className="flex-between">
                    <p style={{ fontSize: 14, fontWeight: 600 }}>{s.title}</p>
                    <span
                      className="badge"
                      style={{
                        backgroundColor:
                          s.status === 'Evaluated'
                            ? 'var(--green-tint)'
                            : s.status === 'Submitted'
                            ? 'var(--coral-tint)'
                            : 'var(--surface-raised)',
                        color:
                          s.status === 'Evaluated'
                            ? 'var(--green)'
                            : s.status === 'Submitted'
                            ? 'var(--coral-dark)'
                            : 'var(--ink-faint)',
                      }}
                    >
                      {s.status}
                    </span>
                  </div>

                  <p className="text-faint" style={{ fontSize: 12, marginTop: 4 }}>
                    {s.eventId?.title || 'Event'}
                    {s.teamId?.teamName ? ` · ${s.teamId.teamName}` : ' · Solo'}
                  </p>

                  {s.githubUrl && (
                    <a
                      href={s.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-dim"
                      style={{ fontSize: 12, marginTop: 8, display: 'inline-block' }}
                    >
                      🔗 {s.githubUrl}
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* PLAYBOOK LINK */}
          <div className="card" style={{ marginTop: 20, borderColor: 'rgba(232, 154, 43, 0.3)' }}>
            <p style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--amber-dark)', marginBottom: 6 }}>
              💡 README & Demo Checklist
            </p>
            <p className="text-dim" style={{ fontSize: 12.5, lineHeight: 1.5, marginBottom: 10 }}>
              Before submitting, verify your GitHub repo meets the Winner's Playbook criteria.
            </p>
            <Link to="/student/playbook" className="text-dim" style={{ fontSize: 12, fontWeight: 600, color: 'var(--coral-dark)' }}>
              Open Checklist →
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default MySubmissions

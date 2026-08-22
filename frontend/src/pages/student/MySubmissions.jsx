import { useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import { submissions, myTeams, events } from '../../data/mockData.js'

function MySubmissions({ user, onLogout }) {
  const [project, setProject] = useState('')
  const [description, setDescription] = useState('')
  const [githubUrl, setGithubUrl] = useState('')
  const [demoUrl, setDemoUrl] = useState('')
  const [saved, setSaved] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <DashboardLayout user={user} onLogout={onLogout}>
      <p className="eyebrow" style={{ marginBottom: 8 }}>Project Submission</p>
      <h1 style={{ fontSize: 28, marginBottom: 28 }}>
        Submit for {myTeams[0]?.event || events[0].title}
      </h1>

      <div className="grid" style={{ gridTemplateColumns: '2fr 1fr' }}>
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Project name</label>
              <input className="form-input" placeholder="EduMatch" value={project} onChange={(e) => setProject(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Description / problem statement</label>
              <textarea
                className="form-textarea"
                rows={4}
                placeholder="What problem does this solve, and how?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">GitHub repo link</label>
                <input className="form-input" placeholder="https://github.com/..." value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Live demo link</label>
                <input className="form-input" placeholder="https://..." value={demoUrl} onChange={(e) => setDemoUrl(e.target.value)} />
              </div>
            </div>

            <button type="submit" className="btn btn-primary">
              {saved ? '✓ Saved' : 'Save submission'}
            </button>
          </form>
        </div>

        <div>
          <p style={{ fontWeight: 600, marginBottom: 12 }}>Previous submissions</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {submissions.map((s) => (
              <div className="card" key={s.id}>
                <p style={{ fontSize: 14, fontWeight: 500 }}>{s.project}</p>
                <p className="text-faint" style={{ fontSize: 12, marginTop: 4 }}>{s.event}</p>
                <span className="badge" style={{ marginTop: 10 }}>{s.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default MySubmissions

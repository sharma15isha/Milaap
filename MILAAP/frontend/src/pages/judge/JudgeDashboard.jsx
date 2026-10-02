import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import ProgressBar from '../../components/ProgressBar.jsx'
import api from '../../services/api.js'

const CRITERIA = [
  { key: 'innovationScore', label: 'Innovation' },
  { key: 'technicalScore', label: 'Technical Implementation' },
  { key: 'problemSolvingScore', label: 'Problem Solving' },
  { key: 'impactScore', label: 'User Impact & Viability' },
  { key: 'presentationScore', label: 'Pitch & Presentation' },
  { key: 'teamworkScore', label: 'Teamwork & Collaboration' },
]

function JudgeDashboard({ user, onLogout }) {
  const [projects, setProjects] = useState([])
  const [myEvaluations, setMyEvaluations] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  const [activeProject, setActiveProject] = useState(null)
  const [scores, setScores] = useState({
    innovationScore: 75,
    technicalScore: 75,
    problemSolvingScore: 75,
    impactScore: 75,
    presentationScore: 75,
    teamworkScore: 75,
  })
  const [feedback, setFeedback] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    async function loadJudgeData() {
      try {
        const [projRes, evalRes, evtsRes] = await Promise.allSettled([
          api.get('/projects'),
          api.get('/evaluations/judge/me'),
          api.get('/events'),
        ])

        if (projRes.status === 'fulfilled') setProjects(projRes.value.data || [])
        if (evalRes.status === 'fulfilled') setMyEvaluations(evalRes.value.data || [])
        if (evtsRes.status === 'fulfilled') setEvents(evtsRes.value.data || [])
      } catch (err) {
        console.error('Failed to load judge data:', err)
      } finally {
        setLoading(false)
      }
    }

    loadJudgeData()
  }, [])

  const evaluatedProjectIds = new Set(myEvaluations.map((e) => e.projectId?.toString() || e.projectId))

  const openEvaluation = (project) => {
    setActiveProject(project)
    setScores({
      innovationScore: 75,
      technicalScore: 75,
      problemSolvingScore: 75,
      impactScore: 75,
      presentationScore: 75,
      teamworkScore: 75,
    })
    setFeedback('')
    setErrorMsg('')
  }

  const updateScore = (key, value) => {
    setScores((prev) => ({ ...prev, [key]: Number(value) }))
  }

  const submitEvaluation = async () => {
    if (!activeProject) return
    setErrorMsg('')
    setSubmitting(true)

    try {
      const payload = {
        projectId: activeProject._id,
        ...scores,
        feedback: feedback.trim(),
      }

      const res = await api.post('/evaluations', payload)
      setMyEvaluations([...myEvaluations, res.data])

      // Mark project status in local state
      setProjects((prev) =>
        prev.map((p) => (p._id === activeProject._id ? { ...p, status: 'Evaluated' } : p))
      )

      setSuccessMsg(`✓ Successfully submitted evaluation for "${activeProject.title}"`)
      setTimeout(() => setSuccessMsg(''), 3500)
      setActiveProject(null)
    } catch (err) {
      console.error('Evaluation failed:', err)
      setErrorMsg(err.response?.data?.message || 'Failed to submit evaluation. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const totalEvaluated = myEvaluations.length
  const totalSubmissions = projects.length
  const progressPct = totalSubmissions > 0 ? Math.round((totalEvaluated / totalSubmissions) * 100) : 0

  return (
    <DashboardLayout user={user} onLogout={onLogout}>
      <div className="flex-between" style={{ marginBottom: 28, flexWrap: 'wrap', gap: 14 }}>
        <div>
          <p className="eyebrow" style={{ marginBottom: 8 }}>Judge Portal</p>
          <h1 style={{ fontSize: 28 }}>{user?.name || 'Evaluations Dashboard'}</h1>
        </div>

        <Link to="/playbook" className="btn btn-secondary btn-sm">
          📖 Review Scoring Rubric
        </Link>
      </div>

      {successMsg && (
        <div className="card" style={{ marginBottom: 20, backgroundColor: 'rgba(46, 196, 182, 0.1)', borderColor: 'var(--green)', color: 'var(--green)', fontWeight: 600 }}>
          {successMsg}
        </div>
      )}

      {/* PROGRESS CARD */}
      <div className="card" style={{ marginBottom: 28 }}>
        <div className="flex-between" style={{ marginBottom: 12 }}>
          <p style={{ fontWeight: 600, fontSize: 15 }}>Evaluation Progress</p>
          <span style={{ fontSize: 13, color: 'var(--coral-dark)', fontWeight: 600 }}>
            {totalEvaluated} of {totalSubmissions} submissions reviewed ({progressPct}%)
          </span>
        </div>
        <ProgressBar value={progressPct} />
      </div>

      <div className="flex-between" style={{ marginBottom: 14 }}>
        <p style={{ fontWeight: 600, fontSize: 16 }}>Submissions to Review</p>
        <span className="text-faint" style={{ fontSize: 13 }}>{projects.length} submissions in database</span>
      </div>

      {loading ? (
        <div className="card text-center" style={{ padding: 40 }}>
          <p className="empty-state">Loading submissions for evaluation...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="card text-center" style={{ padding: 40 }}>
          <p className="text-dim" style={{ fontSize: 14 }}>
            No project submissions have been uploaded for judging yet.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {projects.map((s) => {
            const isDone = evaluatedProjectIds.has(s._id) || s.status === 'Evaluated'
            return (
              <div className="card flex-between" key={s._id} style={{ flexWrap: 'wrap', gap: 14 }}>
                <div style={{ flex: 1, minWidth: 260 }}>
                  <div className="flex gap-sm" style={{ alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontSize: 16 }}>{isDone ? '✅' : '⚪'}</span>
                    <p style={{ fontSize: 15, fontWeight: 600 }}>{s.title}</p>
                    <span className="text-faint" style={{ fontSize: 13 }}>
                      — {s.teamId?.teamName || 'Solo submission'}
                    </span>
                  </div>

                  <p className="text-faint" style={{ fontSize: 12.5, lineHeight: 1.5, marginBottom: 8 }}>
                    {s.description || 'No description provided'}
                  </p>

                  <div className="flex gap-md text-faint" style={{ fontSize: 12 }}>
                    {s.githubUrl && (
                      <a href={s.githubUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--coral-dark)' }}>
                        🔗 GitHub Repository
                      </a>
                    )}
                    {s.demoUrl && (
                      <a href={s.demoUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--coral-dark)' }}>
                        🎥 Live Demo
                      </a>
                    )}
                  </div>
                </div>

                <div>
                  <button
                    className={isDone ? 'btn btn-secondary btn-sm' : 'btn btn-primary btn-sm'}
                    onClick={() => openEvaluation(s)}
                    disabled={isDone}
                  >
                    {isDone ? '✓ Evaluated' : 'Evaluate Project'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* EVALUATION MODAL */}
      {activeProject && (
        <div className="modal-overlay" onClick={() => setActiveProject(null)}>
          <div
            className="card modal-box"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 560, maxHeight: '90vh', overflowY: 'auto' }}
          >
            <p className="eyebrow" style={{ marginBottom: 6 }}>Submission Assessment</p>
            <h2 style={{ fontSize: 20, marginBottom: 4 }}>
              {activeProject.title}
            </h2>
            <p className="text-faint" style={{ fontSize: 12.5, marginBottom: 20 }}>
              Team: {activeProject.teamId?.teamName || 'Solo'} · Event: {activeProject.eventId?.title || 'Competition'}
            </p>

            {errorMsg && (
              <p className="form-error" style={{ marginBottom: 14 }}>{errorMsg}</p>
            )}

            {CRITERIA.map((c) => (
              <div className="score-row" key={c.key} style={{ marginBottom: 14 }}>
                <div className="progress-label" style={{ marginBottom: 4 }}>
                  <span className="text-dim" style={{ fontSize: 13.5 }}>{c.label}</span>
                  <span style={{ color: 'var(--coral-dark)', fontFamily: 'monospace', fontWeight: 600 }}>
                    {scores[c.key]}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={scores[c.key]}
                  onChange={(e) => updateScore(c.key, e.target.value)}
                  className="score-slider"
                />
              </div>
            ))}

            <div className="form-group" style={{ marginTop: 16 }}>
              <label className="form-label">Judge Feedback & Suggestions</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="What did the team execute well? What can they improve for their next hackathon?"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              ></textarea>
            </div>

            <div className="flex gap-md" style={{ marginTop: 20 }}>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ flex: 1 }}
                onClick={() => setActiveProject(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                style={{ flex: 1 }}
                onClick={submitEvaluation}
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Evaluation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

export default JudgeDashboard

import { useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import ProgressBar from '../../components/ProgressBar.jsx'
import { judgeAssignedEvents, judgeSubmissions } from '../../data/mockData.js'

const CRITERIA = ['Innovation', 'Technical Implementation', 'Problem Solving', 'User Impact', 'Presentation', 'Teamwork']

function JudgeDashboard({ user, onLogout }) {
  const [activeSubmission, setActiveSubmission] = useState(null)
  const [scores, setScores] = useState({})
  const [feedback, setFeedback] = useState('')
  const [submittedIds, setSubmittedIds] = useState({})

  const openEvaluation = (sub) => {
    setActiveSubmission(sub)
    const startingScores = {}
    CRITERIA.forEach((c) => (startingScores[c] = 70))
    setScores(startingScores)
    setFeedback('')
  }

  const updateScore = (criterion, value) => {
    setScores({ ...scores, [criterion]: Number(value) })
  }

  const submitEvaluation = () => {
    setSubmittedIds({ ...submittedIds, [activeSubmission.id]: true })
    setActiveSubmission(null)
  }

  return (
    <DashboardLayout user={user} onLogout={onLogout}>
      <p className="eyebrow" style={{ marginBottom: 8 }}>Judge Dashboard</p>
      <h1 style={{ fontSize: 28, marginBottom: 28 }}>Assigned events & evaluations.</h1>

      <div className="grid grid-2" style={{ marginBottom: 30 }}>
        {judgeAssignedEvents.map((e) => (
          <div className="card" key={e.id}>
            <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 12 }}>{e.title}</p>
            <ProgressBar value={Math.round((e.evaluated / e.submissions) * 100)} label={`${e.evaluated}/${e.submissions} evaluated`} />
          </div>
        ))}
      </div>

      <p style={{ fontWeight: 600, marginBottom: 12 }}>Submissions to review</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {judgeSubmissions.map((s) => {
          const done = s.evaluated || submittedIds[s.id]
          return (
            <div className="card flex-between" key={s.id} style={{ flexWrap: 'wrap', gap: 14 }}>
              <div style={{ flex: 1, minWidth: 240 }}>
                <p style={{ fontSize: 14, fontWeight: 500 }}>
                  {done ? '✅' : '⚪'} {s.project} — {s.team}
                </p>
                <p className="text-faint" style={{ fontSize: 12.5, marginTop: 4, lineHeight: 1.6 }}>{s.description}</p>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => openEvaluation(s)} disabled={done}>
                {done ? 'Evaluated' : 'Evaluate'}
              </button>
            </div>
          )
        })}
      </div>

      {activeSubmission && (
        <div className="modal-overlay" onClick={() => setActiveSubmission(null)}>
          <div className="card modal-box" onClick={(e) => e.stopPropagation()}>
            <p className="eyebrow" style={{ marginBottom: 8 }}>Evaluate</p>
            <h2 style={{ fontSize: 20, marginBottom: 20 }}>
              {activeSubmission.project} — {activeSubmission.team}
            </h2>

            {CRITERIA.map((c) => (
              <div className="score-row" key={c}>
                <div className="progress-label">
                  <span className="text-dim">{c}</span>
                  <span style={{ color: 'var(--coral-dark)', fontFamily: 'monospace' }}>{scores[c]}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={scores[c]}
                  onChange={(e) => updateScore(c, e.target.value)}
                  className="score-slider"
                />
              </div>
            ))}

            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Feedback for the team..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              style={{ marginBottom: 20 }}
            ></textarea>

            <div className="flex gap-md">
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setActiveSubmission(null)}>Cancel</button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={submitEvaluation}>Submit evaluation</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

export default JudgeDashboard

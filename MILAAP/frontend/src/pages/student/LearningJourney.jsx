import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import ProgressBar from '../../components/ProgressBar.jsx'
import api from '../../services/api.js'

const PHASES = [
  {
    id: 1,
    title: 'Phase 1: Problem Discovery & Ideation',
    tagline: 'Define a high-impact, real-world university or civic challenge',
    icon: '💡',
    estimatedTime: 'Days 1–3',
    tasks: [
      { id: 'p1_1', text: 'Validate the problem with 3+ real students or stakeholders' },
      { id: 'p1_2', text: 'Verify existing solutions and articulate your unique differentiator' },
      { id: 'p1_3', text: 'Select an upcoming innovation challenge or hackathon' },
    ],
    proTip: 'Judges care about genuine problem urgency. A simple solution to a real, painful problem always beats a complex solution to an imaginary one.',
  },
  {
    id: 2,
    title: 'Phase 2: Team Formation & Skill Balance',
    tagline: 'Form a cross-functional squad with complementary strengths',
    icon: '🤝',
    estimatedTime: 'Days 4–7',
    tasks: [
      { id: 'p2_1', text: 'Turn on "Looking for Team" on Milaap Team Formation Hub' },
      { id: 'p2_2', text: 'Ensure team covers: Frontend, Backend/ML, and Pitch/Design' },
      { id: 'p2_3', text: 'Assign clear ownership of features and presentation before coding' },
    ],
    proTip: 'Avoid teams of 4 pure frontend devs or 4 pure backend devs. Teams with defined UI, Logic, and Pitch owners win 3x more often.',
  },
  {
    id: 3,
    title: 'Phase 3: Rapid Prototyping & Architecture',
    tagline: 'Build the core Minimum Viable Product with working happy path',
    icon: '⚡',
    estimatedTime: 'Hackathon Hours 1–24',
    tasks: [
      { id: 'p3_1', text: 'Implement the single most impressive user interaction first' },
      { id: 'p3_2', text: 'Keep environment variables and API endpoints modular' },
      { id: 'p3_3', text: 'Deploy live preview early (Vercel, Render, or Netlify)' },
    ],
    proTip: 'Never leave deployment to the last 30 minutes. Ship a working "Hello World" deploy in hour 2.',
  },
  {
    id: 4,
    title: 'Phase 4: Pitch Deck, Video & Repo Polish',
    tagline: 'Craft a compelling narrative and clean documentation',
    icon: '🎬',
    estimatedTime: 'Hackathon Hours 24–32',
    tasks: [
      { id: 'p4_1', text: 'Prepare a 7-slide pitch deck using the Winner\'s Playbook' },
      { id: 'p4_2', text: 'Record a crisp 2-minute Loom or video walkthrough' },
      { id: 'p4_3', text: 'Write a comprehensive GitHub README with screenshots & architecture' },
    ],
    proTip: 'Judges review 20+ projects in under an hour. A 60-second video demo or GIF at the top of your README guarantees attention.',
  },
  {
    id: 5,
    title: 'Phase 5: Evaluation & Growth Post-Mortem',
    tagline: 'Analyze scorecards, identify skill gaps, and level up',
    icon: '🏆',
    estimatedTime: 'Post-Event',
    tasks: [
      { id: 'p5_1', text: 'Review detailed category scores on Milaap Performance Analysis' },
      { id: 'p5_2', text: 'Inspect missing skills in Skill Gap Analysis for the next event' },
      { id: 'p5_3', text: 'Update your Milaap profile with newly acquired skills & certificates' },
    ],
    proTip: 'Top student innovators treat every evaluation as training data for their next hackathon win.',
  },
]

function LearningJourney({ user, onLogout }) {
  const [completedTasks, setCompletedTasks] = useState(() => {
    try {
      const saved = localStorage.getItem(`milap_journey_${user?._id || user?.id || 'guest'}`)
      return saved ? JSON.parse(saved) : ['p1_1', 'p1_3', 'p2_1']
    } catch {
      return ['p1_1', 'p1_3', 'p2_1']
    }
  })

  const [activePhase, setActivePhase] = useState(1)

  const toggleTask = (taskId) => {
    const next = completedTasks.includes(taskId)
      ? completedTasks.filter((id) => id !== taskId)
      : [...completedTasks, taskId]
    setCompletedTasks(next)
    try {
      localStorage.setItem(`milap_journey_${user?._id || user?.id || 'guest'}`, JSON.stringify(next))
    } catch (e) {
      console.warn(e)
    }
  }

  const allTasksCount = PHASES.reduce((acc, p) => acc + p.tasks.length, 0)
  const progressPercent = Math.round((completedTasks.length / allTasksCount) * 100)

  return (
    <DashboardLayout user={user} onLogout={onLogout}>
      <div className="flex-between" style={{ marginBottom: 24, flexWrap: 'wrap', gap: 14 }}>
        <div>
          <p className="eyebrow" style={{ marginBottom: 8 }}>Student Innovation Roadmap</p>
          <h1 style={{ fontSize: 28 }}>Learning Journey</h1>
          <p className="text-dim" style={{ fontSize: 14, marginTop: 4 }}>
            Step-by-step master roadmap from first idea to the winner’s podium.
          </p>
        </div>
        <Link to="/student/playbook" className="btn btn-secondary">
          📖 Winner's Playbook →
        </Link>
      </div>

      {/* OVERALL PROGRESS CARD */}
      <div className="card" style={{ marginBottom: 28, background: 'var(--surface-raised)' }}>
        <div className="flex-between" style={{ marginBottom: 12 }}>
          <div>
            <p style={{ fontWeight: 600, fontSize: 15 }}>Overall Innovation Journey Progress</p>
            <p className="text-faint" style={{ fontSize: 12 }}>
              {completedTasks.length} of {allTasksCount} milestones checked off
            </p>
          </div>
          <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--coral-dark)', fontFamily: 'var(--font-heading)' }}>
            {progressPercent}%
          </span>
        </div>
        <ProgressBar value={progressPercent} color="coral" />
      </div>

      {/* PHASE TABS */}
      <div className="scroll-tabs" style={{ marginBottom: 24 }}>
        {PHASES.map((phase) => {
          const phaseTaskIds = phase.tasks.map((t) => t.id)
          const phaseDone = phaseTaskIds.every((id) => completedTasks.includes(id))
          return (
            <button
              key={phase.id}
              className={`filter-tab ${activePhase === phase.id ? 'active' : ''}`}
              onClick={() => setActivePhase(phase.id)}
            >
              <span>{phase.icon}</span> Phase {phase.id} {phaseDone ? '✓' : ''}
            </button>
          )
        })}
      </div>

      {/* ACTIVE PHASE DETAILS */}
      {(() => {
        const current = PHASES.find((p) => p.id === activePhase) || PHASES[0]
        const phaseCompletedCount = current.tasks.filter((t) => completedTasks.includes(t.id)).length
        const phasePercent = Math.round((phaseCompletedCount / current.tasks.length) * 100)

        return (
          <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: 24 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div className="card">
                <div className="flex-between" style={{ marginBottom: 8 }}>
                  <p className="eyebrow">{current.estimatedTime}</p>
                  <span className="badge" style={{ backgroundColor: 'var(--coral-tint)', color: 'var(--coral-dark)' }}>
                    {phasePercent}% Complete
                  </span>
                </div>
                <h2 style={{ fontSize: 22, marginBottom: 6 }}>{current.title}</h2>
                <p className="text-dim" style={{ fontSize: 14, marginBottom: 20 }}>{current.tagline}</p>

                <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}>Action Checklist</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {current.tasks.map((task) => {
                    const isChecked = completedTasks.includes(task.id)
                    return (
                      <label
                        key={task.id}
                        className="card"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                          cursor: 'pointer',
                          backgroundColor: isChecked ? 'rgba(46, 196, 182, 0.06)' : 'var(--surface)',
                          borderColor: isChecked ? 'rgba(46, 196, 182, 0.3)' : 'var(--border)',
                          padding: '12px 16px',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleTask(task.id)}
                          style={{ width: 18, height: 18, accentColor: 'var(--coral-dark)', cursor: 'pointer' }}
                        />
                        <span
                          style={{
                            fontSize: 14,
                            textDecoration: isChecked ? 'line-through' : 'none',
                            color: isChecked ? 'var(--ink-faint)' : 'var(--ink)',
                            flex: 1,
                          }}
                        >
                          {task.text}
                        </span>
                        {isChecked && <span style={{ color: 'var(--green)', fontSize: 13, fontWeight: 600 }}>Done</span>}
                      </label>
                    )
                  })}
                </div>
              </div>

              {/* PRO TIP */}
              <div className="card" style={{ borderColor: 'rgba(232, 154, 43, 0.35)', backgroundColor: 'rgba(232, 154, 43, 0.05)' }}>
                <p style={{ fontWeight: 600, color: 'var(--amber-dark)', marginBottom: 6, fontSize: 13.5 }}>
                  ⭐ Insider Strategy Tip
                </p>
                <p className="text-dim" style={{ fontSize: 13.5, lineHeight: 1.6 }}>
                  {current.proTip}
                </p>
              </div>
            </div>

            {/* QUICK ACTIONS & LINKS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="card">
                <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}>Connected Resources</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <Link to="/events" className="btn btn-secondary btn-sm btn-block">
                    🔍 Discover Campus Events
                  </Link>
                  <Link to="/teams" className="btn btn-secondary btn-sm btn-block">
                    🤝 Find Complementary Teammates
                  </Link>
                  <Link to="/student/submissions" className="btn btn-secondary btn-sm btn-block">
                    📁 Submit Your Project
                  </Link>
                  <Link to="/student/skill-gap" className="btn btn-secondary btn-sm btn-block">
                    🎯 View Target Skill Gaps
                  </Link>
                </div>
              </div>

              <div className="card">
                <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 8 }}>Need inspiration?</p>
                <p className="text-dim" style={{ fontSize: 13, lineHeight: 1.6, marginBottom: 14 }}>
                  Check out the Winner's Playbook for 7-slide pitch deck templates, judging rubric secrets, and repo checklists.
                </p>
                <Link to="/student/playbook" className="btn btn-primary btn-sm btn-block">
                  Open Winner's Playbook
                </Link>
              </div>
            </div>
          </div>
        )
      })()}
    </DashboardLayout>
  )
}

export default LearningJourney

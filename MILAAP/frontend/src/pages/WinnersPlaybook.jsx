import { useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../components/DashboardLayout.jsx'

const TABS = [
  { id: 'pitch', label: '🎤 7-Slide Pitch Deck' },
  { id: 'rubric', label: '⚖️ Judging Rubric Secrets' },
  { id: 'repo', label: '💻 GitHub Repo Gold Standard' },
  { id: 'tactics', label: '⚡ Hackathon Winning Tactics' },
]

function WinnersPlaybookContent() {
  const [activeTab, setActiveTab] = useState('pitch')

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: 24, flexWrap: 'wrap', gap: 14 }}>
        <div>
          <p className="eyebrow" style={{ marginBottom: 8 }}>Chitkara Innovation Cell · Field Manual</p>
          <h1 style={{ fontSize: 32 }}>Winner's Playbook</h1>
          <p className="text-dim" style={{ fontSize: 14.5, marginTop: 4 }}>
            The exact frameworks, pitching formulas, and technical standards that win top prizes.
          </p>
        </div>
        <Link to="/events" className="btn btn-primary">
          Browse Upcoming Events →
        </Link>
      </div>

      <div className="scroll-tabs" style={{ marginBottom: 28 }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`filter-tab ${activeTab === t.id ? 'active' : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'pitch' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card" style={{ borderColor: 'rgba(255, 107, 77, 0.3)' }}>
            <h2 style={{ fontSize: 20, marginBottom: 8 }}>The 3-Minute Pitch Framework (7 Slides Maximum)</h2>
            <p className="text-dim" style={{ fontSize: 14, lineHeight: 1.7 }}>
              Judges decide within the first 60 seconds if they believe in your idea. Structure your pitch around the problem-to-solution narrative, not endless setup code.
            </p>
          </div>

          <div className="grid grid-2">
            <div className="card">
              <span className="badge" style={{ marginBottom: 10 }}>Slide 1</span>
              <h3 style={{ fontSize: 16, marginBottom: 6 }}>The Hook & Problem Urgency</h3>
              <p className="text-dim" style={{ fontSize: 13.5, lineHeight: 1.6 }}>
                State who experiences this pain point and how many hours or rupees it wastes weekly. Quote one real user or statistic.
              </p>
            </div>

            <div className="card">
              <span className="badge" style={{ marginBottom: 10 }}>Slide 2</span>
              <h3 style={{ fontSize: 16, marginBottom: 6 }}>Your Unique Solution</h3>
              <p className="text-dim" style={{ fontSize: 13.5, lineHeight: 1.6 }}>
                One-sentence value proposition: "We built X so that Y can do Z without friction."
              </p>
            </div>

            <div className="card" style={{ border: '2px solid var(--coral)' }}>
              <span className="badge" style={{ marginBottom: 10, backgroundColor: 'var(--coral)', color: '#fff' }}>Slide 3 · Live Demo</span>
              <h3 style={{ fontSize: 16, marginBottom: 6 }}>Show, Don’t Tell (The 60s Demo)</h3>
              <p className="text-dim" style={{ fontSize: 13.5, lineHeight: 1.6 }}>
                Cut straight to the killer feature. Never demo the login screen. Show the core workflow working live on screen.
              </p>
            </div>

            <div className="card">
              <span className="badge" style={{ marginBottom: 10 }}>Slide 4</span>
              <h3 style={{ fontSize: 16, marginBottom: 6 }}>Technical Architecture</h3>
              <p className="text-dim" style={{ fontSize: 13.5, lineHeight: 1.6 }}>
                Clear system diagram: React frontend, Express REST APIs, MongoDB models, and any integrated AI/ML or IoT services.
              </p>
            </div>

            <div className="card">
              <span className="badge" style={{ marginBottom: 10 }}>Slide 5</span>
              <h3 style={{ fontSize: 16, marginBottom: 6 }}>Feasibility & Business/Campus Impact</h3>
              <p className="text-dim" style={{ fontSize: 13.5, lineHeight: 1.6 }}>
                How does this scale across Chitkara University or beyond? Cost to deploy, potential partner clubs, or pilot readiness.
              </p>
            </div>

            <div className="card">
              <span className="badge" style={{ marginBottom: 10 }}>Slide 6 & 7</span>
              <h3 style={{ fontSize: 16, marginBottom: 6 }}>Roadmap & The Team</h3>
              <p className="text-dim" style={{ fontSize: 13.5, lineHeight: 1.6 }}>
                Next 3 milestones (v2 features) and who built what (Frontend, Backend, ML, Design). End with GitHub & Demo links.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'rubric' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="card">
            <h2 style={{ fontSize: 20, marginBottom: 6 }}>How Judges Grade Your Submission (6 Key Criteria)</h2>
            <p className="text-dim" style={{ fontSize: 14 }}>
              Milaap uses standardized 6-dimension evaluation. Understanding each metric unlocks higher scores.
            </p>
          </div>

          <div className="grid grid-3">
            <div className="card">
              <p style={{ fontSize: 24, marginBottom: 8 }}>💡</p>
              <h3 style={{ fontSize: 16, marginBottom: 6 }}>Innovation (20%)</h3>
              <p className="text-dim" style={{ fontSize: 13, lineHeight: 1.6 }}>
                Does this solve a problem in a fresh, creative way, or is it another generic todo/clone app? Focus on original workflow improvements.
              </p>
            </div>

            <div className="card">
              <p style={{ fontSize: 24, marginBottom: 8 }}>⚙️</p>
              <h3 style={{ fontSize: 16, marginBottom: 6 }}>Technical Depth (20%)</h3>
              <p className="text-dim" style={{ fontSize: 13, lineHeight: 1.6 }}>
                Code quality, appropriate stack choices, secure API design, database schemas, and handling edge cases gracefully.
              </p>
            </div>

            <div className="card">
              <p style={{ fontSize: 24, marginBottom: 8 }}>🎯</p>
              <h3 style={{ fontSize: 16, marginBottom: 6 }}>Problem Solving (15%)</h3>
              <p className="text-dim" style={{ fontSize: 13, lineHeight: 1.6 }}>
                Did the team thoroughly understand the root cause of the prompt before building? Is the solution practical?
              </p>
            </div>

            <div className="card">
              <p style={{ fontSize: 24, marginBottom: 8 }}>🌍</p>
              <h3 style={{ fontSize: 16, marginBottom: 6 }}>User Impact (15%)</h3>
              <p className="text-dim" style={{ fontSize: 13, lineHeight: 1.6 }}>
                Can real students, faculty, or citizens use this tomorrow? Measurable value proposition and viability.
              </p>
            </div>

            <div className="card">
              <p style={{ fontSize: 24, marginBottom: 8 }}>🎤</p>
              <h3 style={{ fontSize: 16, marginBottom: 6 }}>Presentation (15%)</h3>
              <p className="text-dim" style={{ fontSize: 13, lineHeight: 1.6 }}>
                Time management (stopping within the allotted window), confident Q&A handling, and clear, energetic delivery.
              </p>
            </div>

            <div className="card">
              <p style={{ fontSize: 24, marginBottom: 8 }}>🤝</p>
              <h3 style={{ fontSize: 16, marginBottom: 6 }}>Teamwork (15%)</h3>
              <p className="text-dim" style={{ fontSize: 13, lineHeight: 1.6 }}>
                Balanced contributions where multiple team members present their domain expertise rather than one person talking alone.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'repo' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="card">
            <h2 style={{ fontSize: 20, marginBottom: 8 }}>GitHub Repository Gold Standard Checklist</h2>
            <p className="text-dim" style={{ fontSize: 14 }}>
              Judges inspect your GitHub link before and after your presentation. Make your repository look like a production open-source project.
            </p>
          </div>

          <div className="grid grid-2">
            <div className="card">
              <h3 style={{ fontSize: 16, marginBottom: 12 }}>Must-Have README Sections</h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <li className="text-dim" style={{ fontSize: 13.5 }}>✅ <b>Project Title & 1-line Pitch</b>: Bold elevator statement.</li>
                <li className="text-dim" style={{ fontSize: 13.5 }}>✅ <b>Live Demo Link & Video Walkthrough</b>: Clickable link at the top.</li>
                <li className="text-dim" style={{ fontSize: 13.5 }}>✅ <b>Screenshots / Architecture Diagram</b>: Visual proof of what was built.</li>
                <li className="text-dim" style={{ fontSize: 13.5 }}>✅ <b>Tech Stack Badges</b>: React, Node, Express, MongoDB.</li>
                <li className="text-dim" style={{ fontSize: 13.5 }}>✅ <b>Local Setup Instructions</b>: Clear `npm install` and `.env.example`.</li>
              </ul>
            </div>

            <div className="card">
              <h3 style={{ fontSize: 16, marginBottom: 12 }}>Repo Cleanliness Rules</h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <li className="text-dim" style={{ fontSize: 13.5 }}>🛡️ <b>Never commit secrets</b>: Add `.env` to `.gitignore`.</li>
                <li className="text-dim" style={{ fontSize: 13.5 }}>🧹 <b>No node_modules in git</b>: Verify `.gitignore` exists in root.</li>
                <li className="text-dim" style={{ fontSize: 13.5 }}>📝 <b>Meaningful Commit Messages</b>: Avoid "fix bug", use "feat: auth".</li>
                <li className="text-dim" style={{ fontSize: 13.5 }}>📜 <b>License File</b>: MIT or Apache 2.0 license added.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'tactics' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="grid grid-3">
            <div className="card">
              <h3 style={{ fontSize: 16, marginBottom: 8 }}>The 80/20 UI Rule</h3>
              <p className="text-dim" style={{ fontSize: 13.5, lineHeight: 1.6 }}>
                A slick, responsive, high-contrast UI with smooth transitions makes your project look 10x more polished than a raw terminal or basic HTML app.
              </p>
            </div>

            <div className="card">
              <h3 style={{ fontSize: 16, marginBottom: 8 }}>Have a Backup Video</h3>
              <p className="text-dim" style={{ fontSize: 13.5, lineHeight: 1.6 }}>
                Campus Wi-Fi fails at the worst moments. Always keep an offline screen-recording of your demo ready on your laptop.
              </p>
            </div>

            <div className="card">
              <h3 style={{ fontSize: 16, marginBottom: 8 }}>Seed Realistic Data</h3>
              <p className="text-dim" style={{ fontSize: 13.5, lineHeight: 1.6 }}>
                Never demo with "test1", "asdf", or empty lists. Seed 5–10 realistic data rows to showcase what the product looks like at scale.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function WinnersPlaybook({ user, onLogout }) {
  if (user) {
    return (
      <DashboardLayout user={user} onLogout={onLogout}>
        <WinnersPlaybookContent />
      </DashboardLayout>
    )
  }

  return (
    <div className="page-with-navbar">
      <div className="container" style={{ maxWidth: 960 }}>
        <WinnersPlaybookContent />
      </div>
    </div>
  )
}

export default WinnersPlaybook

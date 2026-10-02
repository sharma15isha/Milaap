import { Link } from 'react-router-dom'

function About() {
  return (
    <div className="page-with-navbar">
      <div className="container" style={{ maxWidth: 840 }}>
        <p className="eyebrow" style={{ marginBottom: 12 }}>Chitkara University · Student Innovation</p>
        <h1 style={{ fontSize: 36, marginBottom: 16 }}>About Milaap</h1>
        <p className="text-dim" style={{ fontSize: 16, lineHeight: 1.8, marginBottom: 34 }}>
          Milaap was built to solve a simple, persistent problem on campus:
          student opportunities are scattered across WhatsApp groups, notice boards, and unofficial channels.
          Teams form by luck rather than skill balance, and students walk away from hackathons without clear feedback on how to improve.
        </p>

        <div className="grid grid-2" style={{ marginBottom: 34 }}>
          <div className="card">
            <h3 style={{ fontSize: 18, marginBottom: 8 }}>🎯 The Mission</h3>
            <p className="text-dim" style={{ fontSize: 14, lineHeight: 1.6 }}>
              Centralize every university hackathon, coding competition, and workshop into one live feed — while empowering students to assemble high-performing teams matched by complementary skills.
            </p>
          </div>

          <div className="card">
            <h3 style={{ fontSize: 18, marginBottom: 8 }}>💡 Measurable Growth</h3>
            <p className="text-dim" style={{ fontSize: 14, lineHeight: 1.6 }}>
              Every submission evaluated on Milaap receives standardized rubric scoring across 6 dimensions, giving participants their own performance analytics and target skill gap roadmap.
            </p>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 34, borderColor: 'rgba(255, 107, 77, 0.3)' }}>
          <h2 style={{ fontSize: 20, marginBottom: 12 }}>Key Pillars of Milaap</h2>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <li className="text-dim" style={{ fontSize: 14, lineHeight: 1.6 }}>
              📅 <b>Event Discovery:</b> Filter hackathons, ideathons, coding contests, and workshops by mode, deadline, and eligibility.
            </li>
            <li className="text-dim" style={{ fontSize: 14, lineHeight: 1.6 }}>
              🤝 <b>Skill-Balanced Team Formation:</b> Algorithms match complementary skill sets (UI/UX + Backend + AI/ML) rather than duplicate roles.
            </li>
            <li className="text-dim" style={{ fontSize: 14, lineHeight: 1.6 }}>
              🚀 <b>Learning Journey & Winner's Playbook:</b> Step-by-step milestone tracking, pitch deck frameworks, and GitHub repo standards.
            </li>
            <li className="text-dim" style={{ fontSize: 14, lineHeight: 1.6 }}>
              🏆 <b>Transparent Judging & Leaderboards:</b> Real-time leaderboards calculated directly from judges' multi-criteria evaluations.
            </li>
          </ul>
        </div>

        <div className="card" style={{ marginBottom: 34, backgroundColor: 'var(--surface-raised)' }}>
          <h2 style={{ fontSize: 20, marginBottom: 8 }}>Development & Engineering</h2>
          <p className="text-faint" style={{ fontSize: 13, marginBottom: 14 }}>
            B.Tech Computer Science & Engineering · Chitkara University
          </p>
          <div className="flex gap-md" style={{ flexWrap: 'wrap' }}>
            <div className="card" style={{ flex: 1, minWidth: 200, padding: 14 }}>
              <p style={{ fontWeight: 600, fontSize: 14 }}>Isha Sharma</p>
              <p className="text-faint" style={{ fontSize: 12 }}>Lead Developer & Architect</p>
            </div>
            <div className="card" style={{ flex: 1, minWidth: 200, padding: 14 }}>
              <p style={{ fontWeight: 600, fontSize: 14 }}>Aditi</p>
              <p className="text-faint" style={{ fontSize: 12 }}>Developer & Collaborator</p>
            </div>
          </div>
        </div>

        <div className="flex gap-md">
          <Link to="/events" className="btn btn-primary">
            Explore Events Feed →
          </Link>
          <Link to="/playbook" className="btn btn-secondary">
            Read Winner's Playbook
          </Link>
        </div>
      </div>
    </div>
  )
}

export default About

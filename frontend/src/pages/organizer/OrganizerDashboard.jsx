import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import StatCard from '../../components/StatCard.jsx'
import ProgressBar from '../../components/ProgressBar.jsx'
import { organizerStats, events } from '../../data/mockData.js'

function OrganizerDashboard({ user, onLogout }) {
  return (
    <DashboardLayout user={user} onLogout={onLogout}>
      <div className="flex-between" style={{ marginBottom: 28, flexWrap: 'wrap', gap: 14 }}>
        <div>
          <p className="eyebrow" style={{ marginBottom: 8 }}>Organizer Dashboard</p>
          <h1 style={{ fontSize: 28 }}>Chitkara Innovation Cell</h1>
        </div>
        <Link to="/organizer/create-event" className="btn btn-primary">
          + Create event
        </Link>
      </div>

      <div className="grid grid-4" style={{ marginBottom: 28 }}>
        <StatCard label="Total events" value={organizerStats.totalEvents} icon="📅" />
        <StatCard label="Registrations" value={organizerStats.totalRegistrations} icon="👥" />
        <StatCard label="Teams formed" value={organizerStats.totalTeams} icon="🤝" />
        <StatCard label="Submissions" value={organizerStats.totalSubmissions} icon="📁" />
      </div>

      <div className="card" style={{ marginBottom: 28 }}>
        <p style={{ fontWeight: 600, marginBottom: 14 }}>📊 Evaluation progress</p>
        <ProgressBar value={organizerStats.evaluationProgress} label="Submissions evaluated" />
      </div>

      <p style={{ fontWeight: 600, marginBottom: 12 }}>Manage events</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {events.map((e) => (
          <div className="card flex-between" key={e.id} style={{ flexWrap: 'wrap', gap: 12 }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 500 }}>{e.title}</p>
              <p className="text-faint" style={{ fontSize: 12, marginTop: 4 }}>{e.type} · {e.startDate} · {e.status}</p>
            </div>
            <div className="flex gap-sm">
              <button className="btn btn-secondary btn-sm">Edit</button>
              <button className="btn btn-secondary btn-sm">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  )
}

export default OrganizerDashboard

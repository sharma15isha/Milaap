import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import NotificationPanel from './NotificationPanel.jsx'

const NAV_BY_ROLE = {
  student: [
    { to: '/student/dashboard', label: 'Dashboard', icon: '🏠' },
    { to: '/events', label: 'Discover Events', icon: '🔍' },
    { to: '/teams', label: 'Team Formation', icon: '🤝' },
    { to: '/student/performance', label: 'Performance Analysis', icon: '📈' },
    { to: '/student/skill-gap', label: 'Skill Gap Analysis', icon: '🎯' },
    { to: '/student/submissions', label: 'My Submissions', icon: '📁' },
    { to: '/leaderboard', label: 'Leaderboard', icon: '🏆' },
    { to: '/student/profile', label: 'My Profile', icon: '👤' },
  ],
  organizer: [
    { to: '/organizer/dashboard', label: 'Dashboard', icon: '🏠' },
    { to: '/organizer/create-event', label: 'Create Event', icon: '➕' },
    { to: '/organizer/events', label: 'Manage Events', icon: '📋' },
    { to: '/leaderboard', label: 'Leaderboard', icon: '🏆' },
  ],
  judge: [
    { to: '/judge/dashboard', label: 'Assigned Events', icon: '⚖️' },
    { to: '/leaderboard', label: 'Leaderboard', icon: '🏆' },
  ],
  admin: [{ to: '/admin/dashboard', label: 'Dashboard', icon: '🏠' }],
}

// This layout receives `user` and `onLogout` as props from App.jsx —
// no Context API used. It owns two local pieces of UI state via useState:
// whether the mobile sidebar is open, and whether the notification panel is open.
function DashboardLayout({ user, onLogout, children }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const navigate = useNavigate()

  const links = NAV_BY_ROLE[user?.role] || []

  const handleLogout = () => {
    onLogout()
    navigate('/login')
  }

  return (
    <div className="dashboard-layout">
      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo">
            <span className="logo-dot"></span>
            Milap
          </div>
        </div>

        <nav className="sidebar-nav">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <span>{link.icon}</span> {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="avatar-circle">{user?.name?.[0]?.toUpperCase() || '?'}</div>
            <div>
              <p style={{ fontSize: 13 }}>{user?.name}</p>
              <p className="text-faint" style={{ fontSize: 11, textTransform: 'capitalize' }}>{user?.role}</p>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            ⎋ Log out
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <div className="mobile-topbar">
          <button className="icon-btn" onClick={() => setMobileOpen(true)}>☰</button>
        </div>

        <div className="dashboard-topbar" style={{ position: 'relative' }}>
          <button className="icon-btn" onClick={() => setNotifOpen(!notifOpen)}>
            🔔
            <span className="notif-dot"></span>
          </button>
          {notifOpen && <NotificationPanel onClose={() => setNotifOpen(false)} />}
        </div>

        {children}
      </main>
    </div>
  )
}

export default DashboardLayout

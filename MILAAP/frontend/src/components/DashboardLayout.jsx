import { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import NotificationPanel from './NotificationPanel.jsx'
import api from '../services/api.js'

const NAV_BY_ROLE = {
  student: [
    { to: '/student/dashboard', label: 'Dashboard', icon: '🏠' },
    { to: '/events', label: 'Discover Events', icon: '🔍' },
    { to: '/teams', label: 'Team Formation', icon: '🤝' },
    { to: '/student/learning-journey', label: 'Learning Journey', icon: '🚀' },
    { to: '/student/performance', label: 'Performance Analysis', icon: '📈' },
    { to: '/student/skill-gap', label: 'Skill Gap Analysis', icon: '🎯' },
    { to: '/student/submissions', label: 'My Submissions', icon: '📁' },
    { to: '/student/playbook', label: "Winner's Playbook", icon: '📖' },
    { to: '/leaderboard', label: 'Leaderboard', icon: '🏆' },
    { to: '/student/profile', label: 'My Profile', icon: '👤' },
  ],
  organizer: [
    { to: '/organizer/dashboard', label: 'Dashboard', icon: '🏠' },
    { to: '/organizer/create-event', label: 'Create Event', icon: '➕' },
    { to: '/events', label: 'Browse All Events', icon: '🔍' },
    { to: '/leaderboard', label: 'Leaderboard', icon: '🏆' },
    { to: '/playbook', label: "Winner's Playbook", icon: '📖' },
  ],
  judge: [
    { to: '/judge/dashboard', label: 'Assigned Evaluations', icon: '⚖️' },
    { to: '/leaderboard', label: 'Leaderboard', icon: '🏆' },
    { to: '/playbook', label: "Rubric & Playbook", icon: '📖' },
  ],
  admin: [
    { to: '/admin/dashboard', label: 'Admin Console', icon: '⚡' },
    { to: '/organizer/dashboard', label: 'Organizer Portal', icon: '🏠' },
    { to: '/events', label: 'Events Hub', icon: '🔍' },
    { to: '/leaderboard', label: 'Leaderboard', icon: '🏆' },
    { to: '/playbook', label: "Winner's Playbook", icon: '📖' },
  ],
}

function DashboardLayout({ user, onLogout, children }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    async function checkNotifications() {
      try {
        const res = await api.get('/notifications')
        const unread = (res.data || []).filter((n) => !n.readStatus).length
        setUnreadCount(unread)
      } catch (err) {
        // silent fail if unauthenticated
      }
    }
    checkNotifications()
  }, [notifOpen])

  const links = NAV_BY_ROLE[user?.role] || []

  const handleLogout = () => {
    const wasAdmin = user?.role === 'admin'
    onLogout()
    navigate(wasAdmin ? '/admin/login' : '/login')
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
          <button className="icon-btn" onClick={() => setNotifOpen(!notifOpen)} title="Notifications">
            🔔
            {unreadCount > 0 && <span className="notif-dot"></span>}
          </button>
          {notifOpen && <NotificationPanel onClose={() => setNotifOpen(false)} />}
        </div>

        {children}
      </main>
    </div>
  )
}

export default DashboardLayout

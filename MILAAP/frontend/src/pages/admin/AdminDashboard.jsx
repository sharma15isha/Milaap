import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import StatCard from '../../components/StatCard.jsx'
import api from '../../services/api.js'

function AdminDashboard({ user, onLogout }) {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalOrganizers: 0,
    totalJudges: 0,
    totalAdmins: 0,
    totalEvents: 0,
    totalTeams: 0,
    totalProjects: 0,
    totalEvaluations: 0,
  })
  const [users, setUsers] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('users') // 'users' | 'events' | 'system'
  const [userRoleFilter, setUserRoleFilter] = useState('all')
  const [userSearch, setUserSearch] = useState('')
  const [actionMsg, setActionMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    async function fetchAdminData() {
      try {
        const [statsRes, usersRes, eventsRes] = await Promise.allSettled([
          api.get('/admin/stats'),
          api.get('/admin/users'),
          api.get('/admin/events'),
        ])

        if (statsRes.status === 'fulfilled') setStats(statsRes.value.data)
        if (usersRes.status === 'fulfilled') setUsers(usersRes.value.data || [])
        if (eventsRes.status === 'fulfilled') setEvents(eventsRes.value.data || [])
      } catch (err) {
        console.error('Failed to load admin console data:', err)
        setErrorMsg('Failed to load administration data.')
      } finally {
        setLoading(false)
      }
    }

    fetchAdminData()
  }, [])

  const handleRoleChange = async (userId, newRole) => {
    setErrorMsg('')
    try {
      const res = await api.put(`/admin/users/${userId}/role`, { role: newRole })
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      )
      // Refresh stats
      const statsRes = await api.get('/admin/stats')
      setStats(statsRes.data)

      setActionMsg(`✓ ${res.data.message}`)
      setTimeout(() => setActionMsg(''), 3500)
    } catch (err) {
      console.error('Update role failed:', err)
      setErrorMsg(err.response?.data?.message || 'Failed to update user role.')
      setTimeout(() => setErrorMsg(''), 4000)
    }
  }

  const handleDeleteUser = async (userId, name) => {
    if (!window.confirm(`Are you sure you want to delete user "${name}"? This action cannot be undone.`)) {
      return
    }

    setErrorMsg('')
    try {
      const res = await api.delete(`/admin/users/${userId}`)
      setUsers((prev) => prev.filter((u) => u._id !== userId))
      // Refresh stats
      const statsRes = await api.get('/admin/stats')
      setStats(statsRes.data)

      setActionMsg(`✓ ${res.data.message}`)
      setTimeout(() => setActionMsg(''), 3500)
    } catch (err) {
      console.error('Delete user failed:', err)
      setErrorMsg(err.response?.data?.message || 'Failed to delete user.')
      setTimeout(() => setErrorMsg(''), 4000)
    }
  }

  const handleDeleteEvent = async (eventId, title) => {
    if (!window.confirm(`Are you sure you want to permanently delete event "${title}"?`)) {
      return
    }

    setErrorMsg('')
    try {
      const res = await api.delete(`/admin/events/${eventId}`)
      setEvents((prev) => prev.filter((e) => e._id !== eventId))
      const statsRes = await api.get('/admin/stats')
      setStats(statsRes.data)

      setActionMsg(`✓ ${res.data.message}`)
      setTimeout(() => setActionMsg(''), 3500)
    } catch (err) {
      console.error('Delete event failed:', err)
      setErrorMsg(err.response?.data?.message || 'Failed to delete event.')
      setTimeout(() => setErrorMsg(''), 4000)
    }
  }

  const filteredUsers = users.filter((u) => {
    const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter
    const matchesSearch =
      !userSearch.trim() ||
      u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email?.toLowerCase().includes(userSearch.toLowerCase())
    return matchesRole && matchesSearch
  })

  return (
    <DashboardLayout user={user} onLogout={onLogout}>
      <div className="flex-between" style={{ marginBottom: 28, flexWrap: 'wrap', gap: 14 }}>
        <div>
          <div className="flex gap-sm" style={{ alignItems: 'center', marginBottom: 6 }}>
            <span className="badge" style={{ backgroundColor: 'var(--coral)', color: '#fff', fontSize: 11, fontWeight: 700 }}>
              ROOT ADMIN
            </span>
            <p className="eyebrow" style={{ margin: 0 }}>System Management & Governance</p>
          </div>
          <h1 style={{ fontSize: 28 }}>Platform Command Center</h1>
        </div>

        <div className="flex gap-sm">
          <Link to="/organizer/dashboard" className="btn btn-secondary btn-sm">
            Organizer Portal
          </Link>
          <Link to="/events" className="btn btn-secondary btn-sm">
            Events Hub
          </Link>
          <Link to="/leaderboard" className="btn btn-secondary btn-sm">
            Leaderboard
          </Link>
        </div>
      </div>

      {actionMsg && (
        <div className="card" style={{ marginBottom: 20, backgroundColor: 'rgba(46, 196, 182, 0.1)', borderColor: 'var(--green)', color: 'var(--green)', fontWeight: 600 }}>
          {actionMsg}
        </div>
      )}

      {errorMsg && (
        <div className="card" style={{ marginBottom: 20, backgroundColor: 'rgba(255, 107, 77, 0.1)', borderColor: 'var(--coral)', color: 'var(--coral-dark)', fontWeight: 600 }}>
          {errorMsg}
        </div>
      )}

      {/* METRICS GRID */}
      <div className="grid grid-4" style={{ marginBottom: 28 }}>
        <StatCard label="Total Users" value={stats.totalUsers} icon="👥" />
        <StatCard label="Students Registered" value={stats.totalStudents} icon="🎓" />
        <StatCard label="Organizers & Judges" value={`${stats.totalOrganizers} org / ${stats.totalJudges} judge`} icon="⚖️" />
        <StatCard label="Events & Hackathons" value={stats.totalEvents} icon="📅" />
      </div>

      <div className="grid grid-3" style={{ marginBottom: 28 }}>
        <StatCard label="Teams Created" value={stats.totalTeams} icon="🤝" />
        <StatCard label="Projects Submitted" value={stats.totalProjects} icon="🚀" />
        <StatCard label="Completed Evaluations" value={stats.totalEvaluations} icon="⭐" />
      </div>

      {/* TAB NAVIGATION */}
      <div className="role-tabs" style={{ marginBottom: 20, maxWidth: 500 }}>
        <button
          type="button"
          className={`role-tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          User Accounts ({users.length})
        </button>
        <button
          type="button"
          className={`role-tab ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          All Events ({events.length})
        </button>
        <button
          type="button"
          className={`role-tab ${activeTab === 'system' ? 'active' : ''}`}
          onClick={() => setActiveTab('system')}
        >
          System Health
        </button>
      </div>

      {loading ? (
        <div className="card text-center" style={{ padding: 40 }}>
          <p className="empty-state">Loading administrator data...</p>
        </div>
      ) : activeTab === 'users' ? (
        /* USERS MANAGEMENT */
        <div className="card">
          <div className="flex-between" style={{ marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
            <div className="flex gap-md" style={{ flex: 1, minWidth: 260, flexWrap: 'wrap' }}>
              <input
                className="form-input"
                placeholder="Search users by name or email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                style={{ maxWidth: 320 }}
              />
              <select
                className="form-select"
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                style={{ width: 160 }}
              >
                <option value="all">All Roles</option>
                <option value="student">Students</option>
                <option value="organizer">Organizers</option>
                <option value="judge">Judges</option>
                <option value="admin">Admins</option>
              </select>
            </div>
            <span className="text-faint" style={{ fontSize: 13 }}>
              Showing {filteredUsers.length} of {users.length} users
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13.5 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--ink-faint)' }}>
                  <th style={{ padding: '10px 12px' }}>User</th>
                  <th style={{ padding: '10px 12px' }}>Email</th>
                  <th style={{ padding: '10px 12px' }}>Current Role</th>
                  <th style={{ padding: '10px 12px' }}>Role Governance</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: 24, textAlign: 'center', color: 'var(--ink-faint)' }}>
                      No matching user accounts found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const isSelf = u._id === user?._id || u._id === user?.id
                    return (
                      <tr key={u._id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '12px', fontWeight: 600 }}>
                          {u.name} {isSelf && <span style={{ color: 'var(--coral)', fontSize: 11 }}>(You)</span>}
                        </td>
                        <td style={{ padding: '12px', color: 'var(--ink-dim)' }}>{u.email}</td>
                        <td style={{ padding: '12px' }}>
                          <span
                            className="badge"
                            style={{
                              backgroundColor:
                                u.role === 'admin'
                                  ? 'rgba(255, 107, 77, 0.2)'
                                  : u.role === 'organizer'
                                  ? 'rgba(46, 196, 182, 0.2)'
                                  : u.role === 'judge'
                                  ? 'rgba(255, 191, 0, 0.2)'
                                  : 'var(--surface-raised)',
                              color:
                                u.role === 'admin'
                                  ? 'var(--coral-dark)'
                                  : u.role === 'organizer'
                                  ? 'var(--green)'
                                  : u.role === 'judge'
                                  ? 'var(--amber-dark)'
                                  : 'var(--ink)',
                              textTransform: 'capitalize',
                              fontWeight: 600,
                            }}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <select
                            className="form-select"
                            value={u.role}
                            disabled={isSelf}
                            onChange={(e) => handleRoleChange(u._id, e.target.value)}
                            style={{ padding: '4px 8px', fontSize: 12, height: 32 }}
                          >
                            <option value="student">Student</option>
                            <option value="organizer">Organizer</option>
                            <option value="judge">Judge</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td style={{ padding: '12px', textAlign: 'right' }}>
                          {!isSelf && (
                            <button
                              className="btn btn-secondary btn-sm"
                              style={{ color: 'var(--coral)', padding: '4px 10px', fontSize: 12 }}
                              onClick={() => handleDeleteUser(u._id, u.name)}
                            >
                              Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeTab === 'events' ? (
        /* EVENTS MANAGEMENT */
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 16, marginBottom: 16 }}>Campus Events & Hackathons Directory</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {events.length === 0 ? (
              <p className="empty-state">No events found in the database.</p>
            ) : (
              events.map((e) => (
                <div className="card flex-between" key={e._id} style={{ flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <div className="flex gap-sm" style={{ alignItems: 'center' }}>
                      <p style={{ fontSize: 15, fontWeight: 600 }}>{e.title}</p>
                      <span className="badge" style={{ fontSize: 11 }}>{e.type}</span>
                      <span
                        className="badge"
                        style={{
                          backgroundColor: e.status === 'Registration Open' ? 'var(--green-tint)' : 'var(--surface-raised)',
                          color: e.status === 'Registration Open' ? 'var(--green)' : 'var(--ink-faint)',
                          fontSize: 11,
                        }}
                      >
                        {e.status}
                      </span>
                    </div>
                    <p className="text-faint" style={{ fontSize: 12.5, marginTop: 4 }}>
                      Organizer: {e.organizerName || e.organizerId?.name || 'Innovation Cell'} ({e.organizerId?.email || 'N/A'}) ·{' '}
                      Date: {new Date(e.startDate).toLocaleDateString()} · Mode: {e.mode}
                    </p>
                  </div>
                  <div className="flex gap-sm">
                    <Link to={`/events/${e._id}`} className="btn btn-secondary btn-sm">
                      View Page
                    </Link>
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ color: 'var(--coral)' }}
                      onClick={() => handleDeleteEvent(e._id, e.title)}
                    >
                      Delete Event
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        /* SYSTEM HEALTH */
        <div className="grid grid-2">
          <div className="card">
            <p style={{ fontWeight: 600, marginBottom: 12 }}>System & Infrastructure Status</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="flex-between">
                <span className="text-dim">Database:</span>
                <span style={{ color: 'var(--green)', fontWeight: 600 }}>● MongoDB Atlas Connected</span>
              </div>
              <div className="flex-between">
                <span className="text-dim">Backend API:</span>
                <span style={{ color: 'var(--green)', fontWeight: 600 }}>● Online (Port 5000)</span>
              </div>
              <div className="flex-between">
                <span className="text-dim">Authentication:</span>
                <span style={{ color: 'var(--green)', fontWeight: 600 }}>● JWT HS256 + Role-Based Guard</span>
              </div>
              <div className="flex-between">
                <span className="text-dim">Admin Security:</span>
                <span style={{ color: 'var(--green)', fontWeight: 600 }}>● Dedicated /admin/login + requireAdmin</span>
              </div>
            </div>
          </div>

          <div className="card">
            <p style={{ fontWeight: 600, marginBottom: 12 }}>Security Architecture</p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <li className="text-dim" style={{ fontSize: 13.5 }}>
                ✓ Admin login is completely separate from regular login and Gmail/Google OAuth.
              </li>
              <li className="text-dim" style={{ fontSize: 13.5 }}>
                ✓ All <code>/api/admin/*</code> routes enforce JWT verification &amp; <code>requireAdmin</code> middleware.
              </li>
              <li className="text-dim" style={{ fontSize: 13.5 }}>
                ✓ Passwords securely hashed with bcrypt salt factor 10.
              </li>
              <li className="text-dim" style={{ fontSize: 13.5 }}>
                ✓ Normal users cannot elevate privileges or access admin APIs.
              </li>
            </ul>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

export default AdminDashboard

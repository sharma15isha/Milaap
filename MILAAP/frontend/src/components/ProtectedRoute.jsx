import { Navigate } from 'react-router-dom'

// Instead of reading auth state from a Context, this component receives
// the current user as a prop from App.jsx and decides whether to render
// krna h children pe ya redirect krena h
function ProtectedRoute({ user, allowedRole, loading, children }) {
  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '80vh', flexDirection: 'column' }}>
        <p className="empty-state">Authenticating session...</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to={allowedRole === 'admin' ? '/admin/login' : '/login'} replace />
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={`/${user.role}/dashboard`} replace />
  }

  return children
}

export default ProtectedRoute

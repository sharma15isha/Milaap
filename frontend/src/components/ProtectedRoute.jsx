import { Navigate } from 'react-router-dom'

// Instead of reading auth state from a Context, this component receives
// the current user as a prop from App.jsx and decides whether to render
// its children or redirect.
function ProtectedRoute({ user, allowedRole, children }) {
  if (!user) return <Navigate to="/login" replace />

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={`/${user.role}/dashboard`} replace />
  }

  return children
}

export default ProtectedRoute

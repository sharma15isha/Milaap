import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ROLES } from '../data/constants.js'

// onLogin is passed down from App.jsx as a prop — this component doesn't
// manage global auth state itself, it just calls the function it was given.
function Login({ onLogin }) {
  const [role, setRole] = useState('student')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please fill in both fields.')
      return
    }

    setSubmitting(true)
    // TODO: replace this with a real API call once the backend is ready:
    // const res = await api.post('/auth/login', { email, password, role })
    const user = { name: email.split('@')[0], email, role }
    onLogin(user)
    navigate(`/${role}/dashboard`)
    setSubmitting(false)
  }

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <Link to="/" className="logo" style={{ marginBottom: 24 }}>
          <span className="logo-dot"></span>
          Milap
        </Link>

        <h1 style={{ fontSize: 24, marginBottom: 6 }}>Welcome back</h1>
        <p className="text-dim" style={{ fontSize: 14, marginBottom: 26 }}>
          Log in to pick up where you left off.
        </p>

        <div className="role-tabs">
          {ROLES.map((r) => (
            <button
              key={r.id}
              type="button"
              className={`role-tab ${role === r.id ? 'active' : ''}`}
              onClick={() => setRole(r.id)}
            >
              {r.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              className="form-input"
              placeholder="you@chitkara.edu.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? 'Logging in...' : `Log in as ${role}`}
          </button>
        </form>

        <p className="text-dim" style={{ textAlign: 'center', fontSize: 14, marginTop: 24 }}>
          New to Milap?{' '}
          <Link to="/register" style={{ color: 'var(--coral-dark)', fontWeight: 600 }}>
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login

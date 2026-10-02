import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../services/api.js'

function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Both admin email and password are required.')
      return
    }

    setSubmitting(true)

    try {
      // Calls dedicated Admin Login endpoint
      const response = await api.post('/admin/login', {
        email: email.trim().toLowerCase(),
        password,
      })

      const { token, user } = response.data

      if (user.role !== 'admin') {
        throw new Error('Unauthorized role')
      }

      localStorage.setItem('milap_token', token)
      localStorage.setItem('milap_user', JSON.stringify(user))

      if (onLogin) onLogin(user)

      navigate('/admin/dashboard')
    } catch (err) {
      console.error('Admin login error:', err)
      setError(
        err.response?.data?.message ||
        err.message ||
        'Authentication failed. Please verify your admin credentials.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card card" style={{ maxWidth: 440, borderColor: 'rgba(255, 107, 77, 0.4)' }}>
        <div className="flex-between" style={{ marginBottom: 20 }}>
          <Link to="/" className="logo">
            <span className="logo-dot" style={{ backgroundColor: 'var(--coral)' }}></span>
            Milap
          </Link>
          <span
            className="badge"
            style={{
              backgroundColor: 'rgba(255, 107, 77, 0.15)',
              color: 'var(--coral-dark)',
              fontSize: 11,
              letterSpacing: '0.05em',
              fontWeight: 700,
              textTransform: 'uppercase',
            }}
          >
            Admin Portal
          </span>
        </div>

        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>
            Administrator Console
          </h1>
          <p className="text-dim" style={{ fontSize: 13.5, lineHeight: 1.5 }}>
            Restricted environment for platform governance, event oversight, and user administration.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" style={{ fontSize: 12.5, fontWeight: 600 }}>
              Admin Email Address
            </label>
            <input
              type="email"
              className="form-input"
              placeholder="admin@milaap.edu.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontSize: 12.5, fontWeight: 600 }}>
              Admin Secret Key / Password
            </label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <div
              className="form-error"
              style={{
                marginBottom: 16,
                padding: '10px 12px',
                borderRadius: 8,
                backgroundColor: 'rgba(255, 107, 77, 0.1)',
                border: '1px solid var(--coral)',
                fontSize: 13,
              }}
            >
              ⚠ {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={submitting}
            style={{ marginTop: 8, height: 44, fontWeight: 600 }}
          >
            {submitting ? 'Verifying Admin Authority...' : 'Log In to Admin Console'}
          </button>
        </form>

        <div
          style={{
            marginTop: 26,
            paddingTop: 16,
            borderTop: '1px solid var(--border)',
            textAlign: 'center',
          }}
        >
          <Link
            to="/login"
            className="text-dim"
            style={{ fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            ← Return to Standard Student & Faculty Login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin

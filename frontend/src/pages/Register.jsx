import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ROLES } from '../data/constants.js'

function Register({ onRegister }) {
  const [role, setRole] = useState('student')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [university, setUniversity] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!name || !email || !password) {
      setError('Please fill in all required fields.')
      return
    }

    setSubmitting(true)
    // TODO: replace with a real API call once the backend is ready:
    // const res = await api.post('/auth/register', { name, email, password, university, role })
    const user = { name, email, university, role }
    onRegister(user)
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

        <h1 style={{ fontSize: 24, marginBottom: 6 }}>Create your profile</h1>
        <p className="text-dim" style={{ fontSize: 14, marginBottom: 26 }}>
          Takes two minutes. Skills can be added after.
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
            <input className="form-input" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="form-group">
            <input type="email" className="form-input" placeholder="you@chitkara.edu.in" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <input className="form-input" placeholder="University" value={university} onChange={(e) => setUniversity(e.target.value)} />
          </div>
          <div className="form-group">
            <input type="password" className="form-input" placeholder="Create a password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? 'Creating account...' : `Create ${role} account`}
          </button>
        </form>

        <p className="text-dim" style={{ textAlign: 'center', fontSize: 14, marginTop: 24 }}>
          Already on Milap?{' '}
          <Link to="/login" style={{ color: 'var(--coral-dark)', fontWeight: 600 }}>
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register

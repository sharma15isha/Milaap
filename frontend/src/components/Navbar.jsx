import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

// Simple public navbar. No external animation library —
// the mobile menu just toggles visibility using useState.
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="navbar scrolled">
      <div className="container navbar-inner">
        <Link to="/" className="logo">
          <span className="logo-dot"></span>
          Milap
        </Link>

        <nav className="nav-links">
          <NavLink to="/events">Events</NavLink>
          <NavLink to="/teams">Teams</NavLink>
          <NavLink to="/leaderboard">Leaderboard</NavLink>
          <NavLink to="/about">About</NavLink>
        </nav>

        <div className="navbar-actions">
          <Link to="/login" className="text-dim" style={{ fontSize: 14, fontWeight: 500 }}>
            Log in
          </Link>
          <Link to="/register" className="btn btn-primary btn-sm">
            Get started
          </Link>
          <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="container mobile-menu-dropdown">
          <Link to="/events" onClick={() => setMenuOpen(false)}>Events</Link>
          <Link to="/teams" onClick={() => setMenuOpen(false)}>Teams</Link>
          <Link to="/leaderboard" onClick={() => setMenuOpen(false)}>Leaderboard</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
        </div>
      )}
    </header>
  )
}

export default Navbar

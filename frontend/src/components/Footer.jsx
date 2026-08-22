import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner grid grid-4">
        <div style={{ gridColumn: 'span 2' }}>
          <div className="logo" style={{ marginBottom: 14 }}>
            <span className="logo-dot"></span>
            Milap
          </div>
          <p className="text-dim" style={{ maxWidth: 340, fontSize: 14, lineHeight: 1.6 }}>
            The innovation network for Chitkara University — every event, every
            team, every scorecard, in one place.
          </p>
        </div>

        <div>
          <p className="footer-heading">Platform</p>
          <ul className="footer-links">
            <li><Link to="/events">Events</Link></li>
            <li><Link to="/teams">Team formation</Link></li>
            <li><Link to="/leaderboard">Leaderboard</Link></li>
          </ul>
        </div>

        <div>
          <p className="footer-heading">Account</p>
          <ul className="footer-links">
            <li><Link to="/login">Log in</Link></li>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/about">About Milap</Link></li>
          </ul>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>© {new Date().getFullYear()} Milap · Chitkara University</p>
        <p>Discover. Connect. Innovate.</p>
      </div>
    </footer>
  )
}

export default Footer

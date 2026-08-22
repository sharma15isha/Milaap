import { Link } from 'react-router-dom'
import HeroGraphic from '../components/HeroGraphic.jsx'
import { STATS, FEATURES, HOW_IT_WORKS } from '../data/constants.js'

const featureIcons = ['🔍', '🤝', '📁', '📈']

function LandingPage() {
  return (
    <div>
      {/* HERO */}
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <p className="eyebrow fade-up" style={{ marginBottom: 18 }}>
              Chitkara University · Student Innovation Network
            </p>
            <h1 className="fade-up fade-up-1">
              Where builders <br />
              meet their <span className="text-gradient">team.</span>
            </h1>
            <p className="lead fade-up fade-up-2">
              Milap brings every hackathon, teammate, and scorecard on campus
              into one place — so you spend less time searching WhatsApp
              groups and more time building.
            </p>
            <div className="flex gap-md fade-up fade-up-3">
              <Link to="/register" className="btn btn-primary">
                Join Milap →
              </Link>
              <Link to="/events" className="btn btn-secondary">
                Browse events
              </Link>
            </div>
          </div>

          <div className="fade-up fade-up-2">
            <HeroGraphic />
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="stats-strip">
        <div className="container grid grid-4">
          {STATS.map((s) => (
            <div className="stat-item" key={s.label}>
              <p className="stat-value">{s.value}</p>
              <p className="stat-label">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PROBLEM / SOLUTION */}
      <section className="section">
        <div className="container grid grid-2">
          <div>
            <p className="eyebrow" style={{ marginBottom: 14 }}>The problem</p>
            <h2 style={{ fontSize: 32, marginBottom: 16 }}>
              Opportunities are scattered. Teams form by luck.
            </h2>
            <p className="text-dim" style={{ lineHeight: 1.7 }}>
              Events get buried in WhatsApp groups and college notices.
              Students who want to build often can't find teammates with the
              right skills — or miss the event entirely before they even hear
              about it.
            </p>
          </div>
          <div>
            <p className="eyebrow" style={{ marginBottom: 14 }}>The fix</p>
            <h2 style={{ fontSize: 32, marginBottom: 16 }}>
              One network for discovery and teams.
            </h2>
            <p className="text-dim" style={{ lineHeight: 1.7 }}>
              Milap centralizes every event on campus, matches students by
              skill and interest, and gives every participant a scorecard to
              learn from after each submission.
            </p>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="section" style={{ backgroundColor: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <p className="eyebrow" style={{ textAlign: 'center', marginBottom: 14 }}>What Milap does</p>
          <h2 style={{ fontSize: 34, textAlign: 'center', marginBottom: 50 }}>Four pieces. One journey.</h2>

          <div className="grid grid-2">
            {FEATURES.map((f, i) => (
              <div className="card card-hover" key={f.title}>
                <div className="feature-icon">{featureIcons[i]}</div>
                <p className="eyebrow" style={{ marginBottom: 6 }}>{f.tag}</p>
                <h3 style={{ fontSize: 19, marginBottom: 8 }}>{f.title}</h3>
                <p className="text-dim" style={{ fontSize: 14, lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section">
        <div className="container">
          <p className="eyebrow" style={{ textAlign: 'center', marginBottom: 14 }}>How it works</p>
          <h2 style={{ fontSize: 34, textAlign: 'center', marginBottom: 50 }}>From profile to podium.</h2>

          <div className="grid grid-4">
            {HOW_IT_WORKS.map((h, i) => (
              <div key={h.step}>
                <div className="step-number">0{i + 1}</div>
                <h3 style={{ fontSize: 16, marginBottom: 6 }}>{h.step}</h3>
                <p className="text-dim" style={{ fontSize: 13.5, lineHeight: 1.6 }}>{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container">
          <div className="cta-box">
            <h2 style={{ fontSize: 36, maxWidth: 560, margin: '0 auto 18px' }}>
              Your next team is already on Milap.
            </h2>
            <p style={{ maxWidth: 420, margin: '0 auto 34px' }}>
              Set up your profile in two minutes and see every event
              happening across campus right now.
            </p>
            <Link to="/register" className="btn btn-primary">
              Create your profile →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage

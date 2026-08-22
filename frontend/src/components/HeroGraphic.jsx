// The nodes represent students; the lines converging to the center
// represent "Milap" (meeting/union). Animation is done with plain
// CSS keyframes (see .hero-line / .hero-node in App.css) — no library.
const nodes = [
  { x: 60, y: 60 },
  { x: 340, y: 40 },
  { x: 40, y: 260 },
  { x: 360, y: 280 },
  { x: 90, y: 340 },
  { x: 310, y: 350 },
  { x: 20, y: 150 },
  { x: 380, y: 160 },
]

const center = { x: 200, y: 200 }

function HeroGraphic() {
  return (
    <div className="hero-graphic float-anim">
      <div className="ring"></div>
      <svg viewBox="0 0 400 400" width="100%" height="100%">
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C1502E" />
            <stop offset="100%" stopColor="#D9A441" />
          </linearGradient>
        </defs>

        {nodes.map((n, i) => (
          <line
            key={`line-${i}`}
            x1={n.x}
            y1={n.y}
            x2={center.x}
            y2={center.y}
            stroke="url(#lineGrad)"
            strokeWidth="1.6"
            strokeLinecap="round"
            className="hero-line"
            style={{ animationDelay: `${i * 0.12}s` }}
          />
        ))}

        {nodes.map((n, i) => (
          <circle
            key={`node-${i}`}
            cx={n.x}
            cy={n.y}
            r="6"
            fill="#3A2A1D"
            className="hero-node"
            style={{ animationDelay: `${0.1 + i * 0.08}s` }}
          />
        ))}

        <circle cx={center.x} cy={center.y} r="14" fill="#C1502E" className="hero-node" style={{ animationDelay: '1.2s' }} />
        <circle cx={center.x} cy={center.y} r="24" fill="none" stroke="#D9A441" strokeWidth="1.5" className="hero-center-pulse" />
      </svg>
    </div>
  )
}

export default HeroGraphic

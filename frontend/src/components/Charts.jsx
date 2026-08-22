// A basic bar chart built with plain <div>s. `data` is an array of
// { label, value } objects, passed in as a prop. Height % is set with
// inline style and animated via the growHeight CSS keyframe.
export function BarChart({ data }) {
  return (
    <div className="bar-chart">
      {data.map((d) => (
        <div className="bar-chart-col" key={d.label}>
          <span className="bar-chart-value">{d.value}</span>
          <div className="bar-chart-bar" style={{ height: `${d.value}%` }}></div>
          <span className="bar-chart-label">{d.label}</span>
        </div>
      ))}
    </div>
  )
}

// A basic trend visual using dots + small vertical bars instead of a real
// line chart library. `data` is an array of { label, value }.
export function TrendChart({ data }) {
  const max = Math.max(...data.map((d) => d.value))
  return (
    <div className="trend-row">
      {data.map((d) => (
        <div className="trend-col" key={d.label}>
          <span className="trend-value">{d.value}</span>
          <span className="trend-dot"></span>
          <div className="trend-bar" style={{ height: `${(d.value / max) * 100}px` }}></div>
          <span className="trend-label">{d.label}</span>
        </div>
      ))}
    </div>
  )
}

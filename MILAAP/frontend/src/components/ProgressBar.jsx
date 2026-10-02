// A simple progress bar. Takes the value as a prop and animates
// via a plain CSS keyframe (growWidth) defined in App.css.
function ProgressBar({ value, label, color = 'coral' }) {
  return (
    <div>
      {label && (
        <div className="progress-label">
          <span className="text-dim">{label}</span>
          <span style={{ fontFamily: 'monospace' }}>{value}%</span>
        </div>
      )}
      <div className="progress-track">
        <div
          className={`progress-fill ${color === 'coral' ? '' : color}`}
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  )
}

export default ProgressBar

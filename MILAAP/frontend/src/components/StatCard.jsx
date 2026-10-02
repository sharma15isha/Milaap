// Displays one dashboard metric. `icon` is just an emoji/text passed as a prop
// so we don't need an icon library.
function StatCard({ label, value, icon, trend }) {
  return (
    <div className="card card-hover">
      <div className="flex-between" style={{ marginBottom: 4 }}>
        {icon && <div className="stat-card-icon">{icon}</div>}
        {trend && <span className="stat-card-trend">{trend}</span>}
      </div>
      <p className="stat-card-value">{value}</p>
      <p className="stat-card-label">{label}</p>
    </div>
  )
}

export default StatCard

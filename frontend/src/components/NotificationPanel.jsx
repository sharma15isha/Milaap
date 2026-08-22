import { notifications } from '../data/mockData.js'

const icons = {
  invitation: '👤',
  deadline: '⏰',
  evaluation: '✅',
  announcement: '📣',
}

// onClose is a function passed down as a prop so the parent (which
// owns the open/closed useState) can close this panel.
function NotificationPanel({ onClose }) {
  return (
    <div className="card notif-panel pop-in">
      <div className="flex-between" style={{ padding: '4px 4px 10px' }}>
        <p style={{ fontWeight: 600, fontSize: 14 }}>Notifications</p>
        <button onClick={onClose} className="text-faint" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12 }}>
          Close
        </button>
      </div>
      {notifications.map((n) => (
        <div key={n.id} className={`notif-item ${!n.read ? 'unread' : ''}`}>
          <div className="notif-icon">{icons[n.type] || '📣'}</div>
          <p style={{ fontSize: 12.5, color: n.read ? 'var(--ink-faint)' : 'var(--ink)' }}>{n.message}</p>
        </div>
      ))}
    </div>
  )
}

export default NotificationPanel

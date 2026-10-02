import { useState, useEffect } from 'react'
import api from '../services/api.js'

const icons = {
  invitation: '👤',
  deadline: '⏰',
  evaluation: '✅',
  announcement: '📣',
  registration: '🎟️',
  achievement: '🏆',
}

function NotificationPanel({ onClose }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = await api.get('/notifications')
        setItems(res.data || [])
      } catch (err) {
        console.error('Failed to load notifications:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchNotifications()
  }, [])

  const markRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`)
      setItems((prev) =>
        prev.map((item) => (item._id === id ? { ...item, readStatus: true } : item))
      )
    } catch (err) {
      console.error('Failed to mark read:', err)
    }
  }

  return (
    <div className="card notif-panel pop-in">
      <div className="flex-between" style={{ padding: '4px 4px 10px' }}>
        <p style={{ fontWeight: 600, fontSize: 14 }}>Notifications</p>
        <button onClick={onClose} className="text-faint" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12 }}>
          Close
        </button>
      </div>

      {loading && <p className="text-faint" style={{ fontSize: 13, padding: '12px 8px' }}>Loading...</p>}

      {!loading && items.length === 0 && (
        <p className="text-faint" style={{ fontSize: 13, padding: '12px 8px' }}>No notifications yet.</p>
      )}

      {items.map((n) => {
        const isUnread = !n.readStatus
        return (
          <div
            key={n._id}
            className={`notif-item ${isUnread ? 'unread' : ''}`}
            onClick={() => isUnread && markRead(n._id)}
            style={{ cursor: isUnread ? 'pointer' : 'default' }}
            title={isUnread ? 'Click to mark as read' : ''}
          >
            <div className="notif-icon">{icons[n.type] || '📣'}</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 12.5, color: isUnread ? 'var(--ink)' : 'var(--ink-faint)', fontWeight: isUnread ? 600 : 400 }}>
                {n.message}
              </p>
              <p className="text-faint" style={{ fontSize: 10, marginTop: 2 }}>
                {new Date(n.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default NotificationPanel


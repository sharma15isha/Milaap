import DashboardLayout from '../../components/DashboardLayout.jsx'
import ProgressBar from '../../components/ProgressBar.jsx'
import { SkillBadge } from '../../components/SkillBadge.jsx'
import { currentStudent } from '../../data/mockData.js'

function Profile({ user, onLogout }) {
  const s = currentStudent

  return (
    <DashboardLayout user={user} onLogout={onLogout}>
      <div className="flex gap-md" style={{ alignItems: 'center', marginBottom: 28 }}>
        <div className="avatar-circle" style={{ width: 64, height: 64, fontSize: 22, backgroundColor: 'var(--coral-tint)', color: 'var(--coral-dark)' }}>
          {s.name[0]}
        </div>
        <div>
          <h1 style={{ fontSize: 22 }}>{s.name}</h1>
          <p className="text-faint" style={{ fontSize: 13, marginTop: 3 }}>
            {s.university} · {s.department} · {s.year}
          </p>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '2fr 1fr' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <p style={{ fontWeight: 600, marginBottom: 8 }}>Bio</p>
            <p className="text-dim" style={{ fontSize: 14, lineHeight: 1.7 }}>{s.bio}</p>
          </div>

          <div className="card">
            <p style={{ fontWeight: 600, marginBottom: 14 }}>Skills</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {s.skills.map((sk) => (
                <ProgressBar key={sk.name} value={sk.level} label={sk.name} color="amber" />
              ))}
            </div>
          </div>

          <div className="card">
            <p style={{ fontWeight: 600, marginBottom: 12 }}>Interests</p>
            <div className="flex flex-wrap gap-sm">
              {s.interests.map((i) => (
                <SkillBadge key={i}>{i}</SkillBadge>
              ))}
            </div>
          </div>

          <div className="card">
            <p style={{ fontWeight: 600, marginBottom: 10 }}>🏅 Achievements</p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {s.achievements.map((a) => (
                <li key={a} className="text-dim" style={{ fontSize: 14 }}>· {a}</li>
              ))}
            </ul>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <p style={{ fontWeight: 600, marginBottom: 12 }}>Profile completion</p>
            <ProgressBar value={s.profileCompletion} />
          </div>

          <div className="card">
            <p style={{ fontWeight: 600, marginBottom: 8 }}>💼 Preferred role</p>
            <p className="text-dim" style={{ fontSize: 14 }}>{s.preferredRole}</p>
          </div>

          <div className="card">
            <p style={{ fontWeight: 600, marginBottom: 8 }}>🔗 Links</p>
            <p className="text-dim" style={{ fontSize: 14, wordBreak: 'break-all' }}>{s.github}</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Profile

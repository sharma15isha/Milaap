import DashboardLayout from '../../components/DashboardLayout.jsx'
import { SkillBadge } from '../../components/SkillBadge.jsx'
import { events, computeSkillGap, currentStudent } from '../../data/mockData.js'

function SkillGapAnalysis({ user, onLogout }) {
  const targetEvent = events.find((e) => e.status === 'Registration Open') || events[0]
  const { strong, gaps } = computeSkillGap(currentStudent, {
    event: targetEvent.title,
    required: targetEvent.requiredSkills,
  })

  return (
    <DashboardLayout user={user} onLogout={onLogout}>
      <p className="eyebrow" style={{ marginBottom: 8 }}>Skill Gap Analysis</p>
      <h1 style={{ fontSize: 28, marginBottom: 28 }}>Know exactly what to learn next.</h1>

      <div className="card" style={{ marginBottom: 24 }}>
        <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>🎯 Target event</p>
        <p className="text-dim" style={{ fontSize: 14 }}>{targetEvent.title}</p>
      </div>

      <div className="grid grid-2" style={{ marginBottom: 24 }}>
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 14 }}>✅ Your strong skills</p>
          {strong.length ? (
            <div className="flex flex-wrap gap-sm">
              {strong.map((s) => (
                <SkillBadge key={s} tone="strong">{s}</SkillBadge>
              ))}
            </div>
          ) : (
            <p className="text-faint" style={{ fontSize: 14 }}>
              No overlapping skills yet — start building toward this event.
            </p>
          )}
        </div>

        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 14 }}>⚠️ Missing skills</p>
          {gaps.length ? (
            <div className="flex flex-wrap gap-sm">
              {gaps.map((s) => (
                <SkillBadge key={s} tone="gap">{s}</SkillBadge>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--green)', fontSize: 14 }}>
              You cover every required skill for this event.
            </p>
          )}
        </div>
      </div>

      {gaps.length > 0 && (
        <div className="card" style={{ borderColor: 'rgba(255,107,77,0.3)' }}>
          <p style={{ fontSize: 14, lineHeight: 1.7 }}>
            💡 <b>Recommendation:</b> Improve{' '}
            <span style={{ color: 'var(--coral-dark)' }}>{gaps.join(' and ')}</span> to become a stronger
            candidate for {targetEvent.title}. Consider a short project or workshop that uses these
            skills before the registration deadline on {targetEvent.registrationDeadline}.
          </p>
        </div>
      )}
    </DashboardLayout>
  )
}

export default SkillGapAnalysis

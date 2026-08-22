import { useState } from 'react'
import { teammateCandidates, computeMatch, currentStudent, myTeams } from '../data/mockData.js'
import { SkillBadge, MatchBadge } from '../components/SkillBadge.jsx'

function TeamFormationHub() {
  const [lookingForTeam, setLookingForTeam] = useState(currentStudent.lookingForTeam)
  const [invited, setInvited] = useState({}) // { [candidateId]: true }

  const ranked = teammateCandidates
    .map((c) => ({ ...c, match: computeMatch(c) }))
    .sort((a, b) => b.match.score - a.match.score)

  const sendInvite = (id) => {
    setInvited({ ...invited, [id]: true })
  }

  return (
    <div className="page-with-navbar">
      <div className="container">
        <p className="eyebrow" style={{ marginBottom: 12 }}>Team Formation Hub</p>
        <h1 style={{ fontSize: 36, marginBottom: 12 }}>Find your ideal team.</h1>
        <p className="text-dim" style={{ maxWidth: 500, marginBottom: 34 }}>
          Ranked by complementary skills, not duplicates — students who fill
          the gaps in your profile surface first.
        </p>

        {/* Looking for team toggle */}
        <div className="card flex-between" style={{ marginBottom: 24 }}>
          <div>
            <p style={{ fontWeight: 600, fontSize: 14 }}>Looking for Team</p>
            <p className="text-faint" style={{ fontSize: 12, marginTop: 3 }}>
              When on, other students can discover and invite you.
            </p>
          </div>
          <button
            onClick={() => setLookingForTeam(!lookingForTeam)}
            className="btn btn-secondary btn-sm"
            style={lookingForTeam ? { backgroundColor: 'var(--coral)', color: '#fff', borderColor: 'var(--coral)' } : {}}
          >
            {lookingForTeam ? 'ON' : 'OFF'}
          </button>
        </div>

        {/* My current team */}
        {myTeams.length > 0 && (
          <div style={{ marginBottom: 34 }}>
            <p style={{ fontWeight: 600, marginBottom: 12 }}>My team</p>
            {myTeams.map((team) => (
              <div className="card flex-between" key={team.id} style={{ flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <p style={{ fontWeight: 600 }}>{team.name}</p>
                  <p className="text-faint" style={{ fontSize: 12, marginTop: 4 }}>{team.event}</p>
                  <div className="flex flex-wrap gap-sm" style={{ marginTop: 10 }}>
                    {team.members.map((m) => (
                      <SkillBadge key={m.name}>{m.name} · {m.role}</SkillBadge>
                    ))}
                  </div>
                </div>
                <span style={{ fontSize: 12, color: 'var(--amber-dark)', fontFamily: 'monospace' }}>{team.status}</span>
              </div>
            ))}
          </div>
        )}

        {/* Recommended teammates */}
        <p style={{ fontWeight: 600, marginBottom: 20 }}>✨ Find My Ideal Team — recommended for you</p>

        <div className="grid grid-3">
          {ranked.map((c, i) => (
            <div className="card card-hover fade-up" key={c.id} style={{ animationDelay: `${i * 0.08}s`, display: 'flex', flexDirection: 'column' }}>
              <div className="flex-between" style={{ marginBottom: 14 }}>
                <div className="flex gap-sm" style={{ alignItems: 'center' }}>
                  <div className="avatar-circle" style={{ backgroundColor: 'var(--coral-tint)', color: 'var(--coral-dark)' }}>
                    {c.name[0]}
                  </div>
                  <div>
                    <p style={{ fontSize: 13.5, fontWeight: 600 }}>{c.name}</p>
                    <p className="text-faint" style={{ fontSize: 11.5 }}>{c.preferredRole}</p>
                  </div>
                </div>
                <MatchBadge score={c.match.score} />
              </div>

              <div className="flex flex-wrap gap-sm" style={{ marginBottom: 14 }}>
                {c.skills.map((s) => (
                  <SkillBadge key={s}>{s}</SkillBadge>
                ))}
              </div>

              <ul style={{ marginBottom: 18, flex: 1, listStyle: 'none' }}>
                {c.match.reasons.map((r) => (
                  <li key={r} className="text-faint" style={{ fontSize: 12, marginBottom: 6 }}>
                    · {r}
                  </li>
                ))}
              </ul>

              {invited[c.id] ? (
                <span style={{ color: 'var(--green)', textAlign: 'center', fontSize: 14, fontWeight: 600, padding: '10px 0' }}>
                  ✓ Invite sent
                </span>
              ) : (
                <button className="btn btn-primary btn-block" onClick={() => sendInvite(c.id)}>
                  Invite to team
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TeamFormationHub

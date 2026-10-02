import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { SkillBadge, MatchBadge } from '../components/SkillBadge.jsx'
import api from '../services/api.js'

function TeamFormationHub({ user }) {
  const [lookingForTeam, setLookingForTeam] = useState(false)
  const [candidates, setCandidates] = useState([])
  const [myTeams, setMyTeams] = useState([])
  const [events, setEvents] = useState([])
  const [invited, setInvited] = useState({})
  const [loading, setLoading] = useState(true)

  // Quick Team Creation Modal state
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false)
  const [teamName, setTeamName] = useState('')
  const [selectedEventId, setSelectedEventId] = useState('')
  const [leaderRole, setLeaderRole] = useState('Team Lead')
  const [creatingTeam, setCreatingTeam] = useState(false)
  const [modalCandidateToInvite, setModalCandidateToInvite] = useState(null)
  const [teamError, setTeamError] = useState('')

  useEffect(() => {
    async function loadData() {
      try {
        const [profileRes, teamsRes, recsRes, eventsRes] = await Promise.allSettled([
          api.get('/students/me'),
          api.get('/teams/me'),
          api.get('/teams/recommendations'),
          api.get('/events'),
        ])

        if (profileRes.status === 'fulfilled') {
          setLookingForTeam(!!profileRes.value.data?.lookingForTeam)
        }
        if (teamsRes.status === 'fulfilled') {
          setMyTeams(teamsRes.value.data || [])
        }
        if (recsRes.status === 'fulfilled') {
          setCandidates(recsRes.value.data || [])
        }
        if (eventsRes.status === 'fulfilled') {
          const evts = eventsRes.value.data || []
          setEvents(evts)
          if (evts.length > 0) setSelectedEventId(evts[0]._id)
        }
      } catch (err) {
        console.error('Error loading team hub data:', err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [user])

  const toggleLookingForTeam = async () => {
    const nextState = !lookingForTeam
    setLookingForTeam(nextState)

    if (user?._id || user?.id) {
      try {
        await api.put(`/students/${user._id || user.id}`, { lookingForTeam: nextState })
      } catch (err) {
        console.error('Failed to update lookingForTeam:', err)
      }
    }
  }

  const handleInviteClick = async (candidate) => {
    // If user already has a team, send invite directly to their first team
    if (myTeams.length > 0) {
      try {
        const targetTeam = myTeams[0]
        await api.post(`/teams/${targetTeam._id}/invite`, { receiverId: candidate.id })
        setInvited((prev) => ({ ...prev, [candidate.id]: true }))
      } catch (err) {
        console.error('Invite failed:', err)
        alert(err.response?.data?.message || 'Failed to send invite')
      }
    } else {
      // Prompt user to create a team first
      setModalCandidateToInvite(candidate)
      setShowCreateTeamModal(true)
    }
  }

  const handleCreateTeam = async (e) => {
    e.preventDefault()
    setTeamError('')
    if (!teamName.trim() || !selectedEventId) {
      setTeamError('Please provide a team name and select an event.')
      return
    }

    setCreatingTeam(true)
    try {
      const res = await api.post('/teams', {
        teamName: teamName.trim(),
        eventId: selectedEventId,
        leaderRole: leaderRole.trim() || 'Team Lead',
      })

      const newTeam = res.data
      setMyTeams([...myTeams, newTeam])

      // If user triggered this by clicking "Invite" on a candidate, send invite now
      if (modalCandidateToInvite) {
        await api.post(`/teams/${newTeam._id}/invite`, { receiverId: modalCandidateToInvite.id })
        setInvited((prev) => ({ ...prev, [modalCandidateToInvite.id]: true }))
      }

      setShowCreateTeamModal(false)
      setTeamName('')
      setModalCandidateToInvite(null)
    } catch (err) {
      console.error('Team creation failed:', err)
      setTeamError(err.response?.data?.message || 'Team creation failed')
    } finally {
      setCreatingTeam(false)
    }
  }

  return (
    <div className="page-with-navbar">
      <div className="container">
        <div className="flex-between" style={{ flexWrap: 'wrap', gap: 14, marginBottom: 12 }}>
          <div>
            <p className="eyebrow" style={{ marginBottom: 6 }}>Team Formation Hub</p>
            <h1 style={{ fontSize: 36 }}>Find your ideal team.</h1>
          </div>

          <button className="btn btn-primary" onClick={() => setShowCreateTeamModal(true)}>
            + Create New Team
          </button>
        </div>

        <p className="text-dim" style={{ maxWidth: 540, marginBottom: 34 }}>
          Ranked by complementary skills, not duplicates — students who fill
          the gaps in your profile surface first.
        </p>

        {/* LOOKING FOR TEAM TOGGLE */}
        <div className="card flex-between" style={{ marginBottom: 28, flexWrap: 'wrap', gap: 14 }}>
          <div>
            <p style={{ fontWeight: 600, fontSize: 15 }}>Looking for Team Status</p>
            <p className="text-faint" style={{ fontSize: 13, marginTop: 3 }}>
              When ON, other students and team leads can discover and invite you into their hackathon squads.
            </p>
          </div>
          <button
            onClick={toggleLookingForTeam}
            className="btn btn-secondary btn-sm"
            style={
              lookingForTeam
                ? { backgroundColor: 'var(--coral)', color: '#fff', borderColor: 'var(--coral)', fontWeight: 600 }
                : { fontWeight: 600 }
            }
          >
            {lookingForTeam ? '✓ ACTIVE (ON)' : 'PAUSED (OFF)'}
          </button>
        </div>

        {/* MY ACTIVE TEAMS */}
        {myTeams.length > 0 && (
          <div style={{ marginBottom: 34 }}>
            <p style={{ fontWeight: 600, marginBottom: 12 }}>Your Active Teams</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {myTeams.map((team) => (
                <div className="card flex-between" key={team._id} style={{ flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 15 }}>{team.teamName}</p>
                    <p className="text-faint" style={{ fontSize: 12, marginTop: 4 }}>
                      {team.eventId?.title || 'Innovation Event'} · Lead: {team.leaderId?.name || 'You'}
                    </p>
                    <div className="flex flex-wrap gap-sm" style={{ marginTop: 10 }}>
                      {(team.members || []).map((m, idx) => (
                        <SkillBadge key={idx}>
                          {m.userId?.name || 'Member'} {m.role ? `· ${m.role}` : ''}
                        </SkillBadge>
                      ))}
                    </div>
                  </div>
                  <span
                    className="badge"
                    style={{
                      backgroundColor: team.status === 'locked' ? 'var(--surface-raised)' : 'var(--amber-tint)',
                      color: team.status === 'locked' ? 'var(--ink-faint)' : 'var(--amber-dark)',
                    }}
                  >
                    {team.status || 'recruiting'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RECOMMENDED TEAMMATES */}
        <div className="flex-between" style={{ marginBottom: 20 }}>
          <p style={{ fontWeight: 600, fontSize: 16 }}>
            ✨ Recommended Teammates (Complementary Skill Match)
          </p>
          <span className="text-faint" style={{ fontSize: 13 }}>
            {candidates.length} active builders
          </span>
        </div>

        {loading ? (
          <div className="card text-center" style={{ padding: 40 }}>
            <p className="empty-state">Loading candidate recommendations...</p>
          </div>
        ) : candidates.length === 0 ? (
          <div className="card text-center" style={{ padding: 30 }}>
            <p className="text-dim" style={{ fontSize: 14 }}>
              No other students currently have "Looking for Team" enabled.
            </p>
            <p className="text-faint" style={{ fontSize: 13, marginTop: 6 }}>
              Share Milaap with your batchmates or invite them directly to your team!
            </p>
          </div>
        ) : (
          <div className="grid grid-3">
            {candidates.map((c, i) => (
              <div
                className="card card-hover fade-up"
                key={c.id}
                style={{ animationDelay: `${i * 0.08}s`, display: 'flex', flexDirection: 'column' }}
              >
                <div className="flex-between" style={{ marginBottom: 14 }}>
                  <div className="flex gap-sm" style={{ alignItems: 'center' }}>
                    <div
                      className="avatar-circle"
                      style={{ backgroundColor: 'var(--coral-tint)', color: 'var(--coral-dark)' }}
                    >
                      {c.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p style={{ fontSize: 13.5, fontWeight: 600 }}>{c.name}</p>
                      <p className="text-faint" style={{ fontSize: 11.5 }}>{c.preferredRole || 'Developer'}</p>
                    </div>
                  </div>
                  <MatchBadge score={c.match?.score || 80} />
                </div>

                <div className="flex flex-wrap gap-sm" style={{ marginBottom: 14 }}>
                  {(c.skills || []).map((s) => (
                    <SkillBadge key={s}>{s}</SkillBadge>
                  ))}
                </div>

                <ul style={{ marginBottom: 18, flex: 1, listStyle: 'none' }}>
                  {(c.match?.reasons || []).map((r) => (
                    <li key={r} className="text-faint" style={{ fontSize: 12, marginBottom: 6 }}>
                      · {r}
                    </li>
                  ))}
                </ul>

                {invited[c.id] ? (
                  <span style={{ color: 'var(--green)', textAlign: 'center', fontSize: 14, fontWeight: 600, padding: '10px 0' }}>
                    ✓ Invitation Sent
                  </span>
                ) : (
                  <button className="btn btn-primary btn-block" onClick={() => handleInviteClick(c)}>
                    Invite to team
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CREATE TEAM MODAL */}
      {showCreateTeamModal && (
        <div className="modal-overlay" onClick={() => setShowCreateTeamModal(false)}>
          <div className="card modal-box" onClick={(e) => e.stopPropagation()}>
            <p className="eyebrow" style={{ marginBottom: 8 }}>Team Formation</p>
            <h2 style={{ fontSize: 20, marginBottom: 16 }}>Create a New Team</h2>

            {teamError && (
              <p className="form-error" style={{ marginBottom: 14 }}>{teamError}</p>
            )}

            <form onSubmit={handleCreateTeam}>
              <div className="form-group">
                <label className="form-label">Team Name *</label>
                <input
                  className="form-input"
                  placeholder="e.g. Team Nexus, AlphaCoders"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Target Event *</label>
                <select
                  className="form-select"
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  required
                >
                  {events.map((evt) => (
                    <option key={evt._id} value={evt._id}>
                      {evt.title} ({evt.type})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Your Role in the Team</label>
                <input
                  className="form-input"
                  placeholder="e.g. Team Lead, Frontend, ML Engineer"
                  value={leaderRole}
                  onChange={(e) => setLeaderRole(e.target.value)}
                />
              </div>

              <div className="flex gap-md" style={{ marginTop: 20 }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => setShowCreateTeamModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  disabled={creatingTeam}
                >
                  {creatingTeam ? 'Creating...' : 'Create Team'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default TeamFormationHub

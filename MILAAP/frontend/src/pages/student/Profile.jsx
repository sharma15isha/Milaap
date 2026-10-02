import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import ProgressBar from '../../components/ProgressBar.jsx'
import { SkillBadge } from '../../components/SkillBadge.jsx'
import api from '../../services/api.js'

function Profile({ user, onLogout }) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [statusMsg, setStatusMsg] = useState('')

  // Form edit states
  const [name, setName] = useState('')
  const [university, setUniversity] = useState('')
  const [department, setDepartment] = useState('')
  const [year, setYear] = useState('')
  const [bio, setBio] = useState('')
  const [preferredRole, setPreferredRole] = useState('')
  const [github, setGithub] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [portfolio, setPortfolio] = useState('')
  const [interestsStr, setInterestsStr] = useState('')
  const [achievementsStr, setAchievementsStr] = useState('')

  // Skills state: array of { name, level }
  const [skills, setSkills] = useState([])
  const [newSkillName, setNewSkillName] = useState('')
  const [newSkillLevel, setNewSkillLevel] = useState(80)

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await api.get('/students/me')
        const p = res.data
        setProfile(p)
        setName(p.userId?.name || user?.name || '')
        setUniversity(p.university || 'Chitkara University')
        setDepartment(p.department || '')
        setYear(p.year || '')
        setBio(p.bio || '')
        setPreferredRole(p.preferredRole || '')
        setGithub(p.socialLinks?.github || '')
        setLinkedin(p.socialLinks?.linkedin || '')
        setPortfolio(p.socialLinks?.portfolio || '')
        setInterestsStr((p.interests || []).join(', '))
        setAchievementsStr((p.achievements || []).join('\n'))
        setSkills(p.skills || [])
      } catch (err) {
        console.error('Error fetching student profile:', err)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [user])

  const handleAddSkill = (e) => {
    e.preventDefault()
    if (!newSkillName.trim()) return
    const updated = [...skills, { name: newSkillName.trim(), level: Number(newSkillLevel) }]
    setSkills(updated)
    setNewSkillName('')
    setNewSkillLevel(80)
  }

  const handleRemoveSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index))
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setSaving(true)
    setStatusMsg('')

    try {
      const interests = interestsStr.split(',').map((s) => s.trim()).filter(Boolean)
      const achievements = achievementsStr.split('\n').map((s) => s.trim()).filter(Boolean)

      const payload = {
        name,
        university,
        department,
        year,
        bio,
        preferredRole,
        socialLinks: { github, linkedin, portfolio },
        interests,
        achievements,
        skills,
      }

      const targetId = user?._id || user?.id || profile?.userId?._id
      const res = await api.put(`/students/${targetId}`, payload)

      setProfile(res.data)
      setIsEditing(false)
      setStatusMsg('✓ Profile updated successfully')
      setTimeout(() => setStatusMsg(''), 3000)

      // Update stored user name if changed
      if (name && user) {
        const updatedUser = { ...user, name }
        localStorage.setItem('milap_user', JSON.stringify(updatedUser))
      }
    } catch (err) {
      console.error('Failed to update profile:', err)
      setStatusMsg(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout user={user} onLogout={onLogout}>
        <div className="flex-center" style={{ minHeight: '60vh' }}>
          <p className="empty-state">Loading student profile...</p>
        </div>
      </DashboardLayout>
    )
  }

  const displayName = profile?.userId?.name || user?.name || name || 'Student'
  const completion = profile?.profileCompletion ?? 25

  return (
    <DashboardLayout user={user} onLogout={onLogout}>
      {/* HEADER */}
      <div className="flex-between" style={{ marginBottom: 28, flexWrap: 'wrap', gap: 14 }}>
        <div className="flex gap-md" style={{ alignItems: 'center' }}>
          <div
            className="avatar-circle"
            style={{ width: 64, height: 64, fontSize: 24, backgroundColor: 'var(--coral-tint)', color: 'var(--coral-dark)' }}
          >
            {displayName[0]?.toUpperCase() || 'S'}
          </div>
          <div>
            <h1 style={{ fontSize: 24 }}>{displayName}</h1>
            <p className="text-faint" style={{ fontSize: 13, marginTop: 3 }}>
              {profile?.university || 'Chitkara University'} · {profile?.department || 'Engineering'} · {profile?.year || 'Student'}
            </p>
          </div>
        </div>

        <button
          className={isEditing ? 'btn btn-secondary' : 'btn btn-primary'}
          onClick={() => {
            setIsEditing(!isEditing)
            setStatusMsg('')
          }}
        >
          {isEditing ? 'Cancel Edit' : '✎ Edit Profile'}
        </button>
      </div>

      {statusMsg && (
        <div
          className="card"
          style={{
            marginBottom: 20,
            backgroundColor: statusMsg.startsWith('✓') ? 'rgba(46, 196, 182, 0.1)' : 'rgba(255, 107, 77, 0.1)',
            borderColor: statusMsg.startsWith('✓') ? 'var(--green)' : 'var(--coral)',
            color: statusMsg.startsWith('✓') ? 'var(--green)' : 'var(--coral-dark)',
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          {statusMsg}
        </div>
      )}

      {isEditing ? (
        /* EDIT FORM */
        <form onSubmit={handleSaveProfile} className="card" style={{ maxWidth: 840 }}>
          <h2 style={{ fontSize: 18, marginBottom: 18 }}>Edit Profile Details</h2>

          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="form-group">
              <label className="form-label">University</label>
              <input className="form-input" value={university} onChange={(e) => setUniversity(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Department / Branch</label>
              <input className="form-input" placeholder="Computer Science & Engineering" value={department} onChange={(e) => setDepartment(e.target.value)} />
            </div>

            <div className="form-group">
              <label className="form-label">Year of Study</label>
              <input className="form-input" placeholder="3rd Year" value={year} onChange={(e) => setYear(e.target.value)} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Preferred Role (e.g. Frontend Lead, Backend, AI/ML, UI/UX, Pitch & Strategy)</label>
            <input className="form-input" placeholder="Full-stack / Frontend" value={preferredRole} onChange={(e) => setPreferredRole(e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Bio</label>
            <textarea className="form-textarea" rows={3} placeholder="Tell potential teammates what you build..." value={bio} onChange={(e) => setBio(e.target.value)} />
          </div>

          {/* SKILLS SECTION IN FORM */}
          <div className="card" style={{ marginBottom: 20, backgroundColor: 'var(--surface-raised)' }}>
            <p style={{ fontWeight: 600, marginBottom: 12 }}>Skills & Proficiencies</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
              {skills.map((sk, index) => (
                <div key={index} className="flex-between card" style={{ padding: '8px 14px' }}>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{sk.name}</span>
                  <div className="flex gap-md" style={{ alignItems: 'center' }}>
                    <span style={{ fontSize: 13, color: 'var(--amber-dark)', fontFamily: 'monospace' }}>{sk.level}%</span>
                    <button type="button" onClick={() => handleRemoveSkill(index)} style={{ background: 'none', border: 'none', color: 'var(--coral)', cursor: 'pointer', fontSize: 16 }}>
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-md" style={{ flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div style={{ flex: 2, minWidth: 160 }}>
                <label className="form-label">Add New Skill</label>
                <input className="form-input" placeholder="e.g. React.js, Python, Figma" value={newSkillName} onChange={(e) => setNewSkillName(e.target.value)} />
              </div>
              <div style={{ flex: 1, minWidth: 120 }}>
                <label className="form-label">Level ({newSkillLevel}%)</label>
                <input type="range" min="10" max="100" value={newSkillLevel} onChange={(e) => setNewSkillLevel(e.target.value)} className="score-slider" />
              </div>
              <button type="button" onClick={handleAddSkill} className="btn btn-secondary btn-sm" style={{ height: 42 }}>
                + Add Skill
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Interests (comma separated)</label>
            <input className="form-input" placeholder="Web Development, AI/ML, Cloud, IoT" value={interestsStr} onChange={(e) => setInterestsStr(e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">GitHub Username / URL</label>
            <input className="form-input" placeholder="github.com/yourhandle" value={github} onChange={(e) => setGithub(e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Achievements & Certifications (one per line)</label>
            <textarea className="form-textarea" rows={3} placeholder="SIH 2024 Finalist&#10;AWS Cloud Practitioner" value={achievementsStr} onChange={(e) => setAchievementsStr(e.target.value)} />
          </div>

          <div className="flex gap-md">
            <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving changes...' : 'Save Profile'}
            </button>
          </div>
        </form>
      ) : (
        /* VIEW MODE */
        <div className="grid" style={{ gridTemplateColumns: '2fr 1fr' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card">
              <p style={{ fontWeight: 600, marginBottom: 8 }}>Bio</p>
              <p className="text-dim" style={{ fontSize: 14, lineHeight: 1.7 }}>
                {profile?.bio || 'No bio written yet. Click "Edit Profile" to introduce yourself.'}
              </p>
            </div>

            <div className="card">
              <p style={{ fontWeight: 600, marginBottom: 14 }}>Skills</p>
              {(profile?.skills || []).length === 0 ? (
                <p className="text-faint" style={{ fontSize: 13 }}>
                  No skills added yet. Add skills to match with hackathon teams.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {profile.skills.map((sk) => (
                    <ProgressBar key={sk.name} value={sk.level} label={sk.name} color="amber" />
                  ))}
                </div>
              )}
            </div>

            <div className="card">
              <p style={{ fontWeight: 600, marginBottom: 12 }}>Interests</p>
              {(profile?.interests || []).length === 0 ? (
                <p className="text-faint" style={{ fontSize: 13 }}>No interests listed.</p>
              ) : (
                <div className="flex flex-wrap gap-sm">
                  {profile.interests.map((i) => (
                    <SkillBadge key={i}>{i}</SkillBadge>
                  ))}
                </div>
              )}
            </div>

            <div className="card">
              <p style={{ fontWeight: 600, marginBottom: 10 }}>🏅 Achievements & Hackathons</p>
              {(profile?.achievements || []).length === 0 ? (
                <p className="text-faint" style={{ fontSize: 13 }}>No achievements recorded yet.</p>
              ) : (
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {profile.achievements.map((a) => (
                    <li key={a} className="text-dim" style={{ fontSize: 14 }}>· {a}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card">
              <p style={{ fontWeight: 600, marginBottom: 12 }}>Profile completion</p>
              <ProgressBar value={completion} />
              <p className="text-faint" style={{ fontSize: 12, marginTop: 8 }}>
                {completion}% of profile criteria fulfilled
              </p>
            </div>

            <div className="card">
              <p style={{ fontWeight: 600, marginBottom: 8 }}>💼 Preferred Role</p>
              <p className="text-dim" style={{ fontSize: 14 }}>
                {profile?.preferredRole || 'Not specified'}
              </p>
            </div>

            <div className="card">
              <p style={{ fontWeight: 600, marginBottom: 8 }}>🔗 Links</p>
              {profile?.socialLinks?.github ? (
                <p className="text-dim" style={{ fontSize: 14, wordBreak: 'break-all' }}>
                  🐙 {profile.socialLinks.github}
                </p>
              ) : (
                <p className="text-faint" style={{ fontSize: 13 }}>No GitHub profile linked</p>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

export default Profile

// Small badge for displaying a skill. `tone` prop controls the color style.
export function SkillBadge({ children, tone = 'default' }) {
  const toneClass = tone === 'strong' ? 'badge-strong' : tone === 'gap' ? 'badge-gap' : ''
  return <span className={`badge ${toneClass}`}>{children}</span>
}

// Shows the skill-match percentage between the current student and a candidate.
export function MatchBadge({ score }) {
  let toneClass = 'match-low'
  if (score >= 85) toneClass = 'match-high'
  else if (score >= 70) toneClass = 'match-mid'

  return <span className={`match-badge ${toneClass}`}>{score}% Match</span>
}

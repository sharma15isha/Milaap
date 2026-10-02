// This mirrors the computeMatch()/computeSkillGap() logic used in the
// frontend's mockData.js, so swapping mock data for real API responses
// produces the same shape of result.

// Compares a candidate student's skills against the current student's
// skills, and scores them higher for *complementary* (non-overlapping)
// skills rather than duplicate ones.
export function computeMatch(baseSkills, candidate) {
  const baseSkillNames = new Set(baseSkills.map((s) => s.name.toLowerCase()))
  const candSkillNames = (candidate.skills || []).map((s) => s.name.toLowerCase())

  const overlap = candSkillNames.filter((s) => baseSkillNames.has(s)).length
  const complementary = candSkillNames.length - overlap
  const previousParticipation = candidate.previousParticipation || 0

  const score = Math.min(98, 55 + complementary * 12 + previousParticipation * 3)

  const reasons = []
  if (complementary > 0) {
    reasons.push(`Adds ${complementary} skill${complementary > 1 ? 's' : ''} you don't have`)
  }
  if (candidate.preferredRole) {
    reasons.push(`Fits an open ${candidate.preferredRole} role`)
  }
  if (previousParticipation >= 3) {
    reasons.push('Experienced — 3+ past events')
  }

  return { score, reasons }
}

// Compares a student's current skills against an event's required skills
// and returns which ones they already have (strong) vs. which are missing (gaps).
export function computeSkillGap(studentSkills, requiredSkills) {
  const owned = new Set(studentSkills.map((s) => s.name))
  const strong = requiredSkills.filter((s) => owned.has(s))
  const gaps = requiredSkills.filter((s) => !owned.has(s))
  return { strong, gaps }
}

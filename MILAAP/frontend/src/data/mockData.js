// Mock data layer — mirrors the future MongoDB schema so it's a drop-in
// swap for real API calls later (see src/services/api.js).

export const currentStudent = {
  id: 'stu_01',
  name: 'Isha Sharma',
  university: 'Chitkara University',
  department: 'Computer Science & Engineering',
  year: '3rd Year',
  bio: 'Full-stack builder who likes shipping fast and clean UI.',
  profileCompletion: 78,
  lookingForTeam: true,
  preferredRole: 'Frontend / Full-stack',
  skills: [
    { name: 'React.js', level: 90 },
    { name: 'JavaScript', level: 88 },
    { name: 'Node.js', level: 70 },
    { name: 'MongoDB', level: 65 },
    { name: 'UI/UX', level: 80 },
  ],
  interests: ['Web Development', 'AI/ML', 'Product Design'],
  achievements: ['SIH 2024 — Top 30 Nationally', 'HackIndia — Top 10 (HP)', 'Azure AI Fundamentals Certified'],
  github: 'github.com/isha15sharma',
}

export const EVENT_TYPES = ['Hackathon', 'Coding Competition', 'Workshop', 'Ideathon', 'Innovation Challenge']

export const events = [
  {
    id: 'evt_01',
    title: 'AI Innovation Challenge 2026',
    type: 'Hackathon',
    organizer: 'Chitkara Innovation Cell',
    university: 'Chitkara University',
    description: 'Build an AI-first product that solves a real campus or civic problem in 36 hours.',
    startDate: '2026-08-14',
    registrationDeadline: '2026-08-08',
    mode: 'Offline',
    venue: 'Innovation Block, Chitkara University',
    requiredSkills: ['Python', 'Machine Learning', 'React', 'Data Analysis'],
    teamSize: '3–4',
    prize: '₹75,000 + Internship offers',
    status: 'Registration Open',
  },
  {
    id: 'evt_02',
    title: 'CodeSprint — Competitive Programming',
    type: 'Coding Competition',
    organizer: 'ACM Student Chapter',
    university: 'Chitkara University',
    description: 'Solo, timed DSA contest across three rounds — algorithmic depth over breadth.',
    startDate: '2026-08-05',
    registrationDeadline: '2026-08-03',
    mode: 'Online',
    venue: '—',
    requiredSkills: ['DSA', 'C++', 'Java'],
    teamSize: '1',
    prize: '₹25,000',
    status: 'Registration Open',
  },
  {
    id: 'evt_03',
    title: 'Design Systems Workshop',
    type: 'Workshop',
    organizer: 'UX Guild',
    university: 'Chitkara University',
    description: 'Hands-on session on building scalable design tokens and component libraries.',
    startDate: '2026-08-02',
    registrationDeadline: '2026-08-01',
    mode: 'Hybrid',
    venue: 'Design Lab, Block C',
    requiredSkills: ['Figma', 'UI/UX'],
    teamSize: '1',
    prize: 'Certificate of Completion',
    status: 'Registration Open',
  },
  {
    id: 'evt_04',
    title: 'FinTech Ideathon',
    type: 'Ideathon',
    organizer: 'E-Cell Chitkara',
    university: 'Chitkara University',
    description: 'Pitch a financial inclusion idea backed by a working prototype or wireframe.',
    startDate: '2026-07-20',
    registrationDeadline: '2026-07-15',
    mode: 'Offline',
    venue: 'Auditorium 2',
    requiredSkills: ['Business Strategy', 'Presentation', 'Figma'],
    teamSize: '2–5',
    prize: '₹40,000',
    status: 'Ongoing',
  },
  {
    id: 'evt_05',
    title: 'Smart Campus Hackathon',
    type: 'Hackathon',
    organizer: 'Chitkara Innovation Cell',
    university: 'Chitkara University',
    description: 'IoT + software solutions for a smarter, safer campus.',
    startDate: '2026-06-10',
    registrationDeadline: '2026-06-05',
    mode: 'Offline',
    venue: 'Innovation Block',
    requiredSkills: ['IoT', 'Node.js', 'React'],
    teamSize: '3–4',
    prize: '₹50,000',
    status: 'Completed',
  },
  {
    id: 'evt_06',
    title: 'Innovate-a-thon: Sustainability Edition',
    type: 'Innovation Challenge',
    organizer: 'Green Tech Club',
    university: 'Chitkara University',
    description: 'Build tech-driven solutions for sustainability and climate impact.',
    startDate: '2026-04-18',
    registrationDeadline: '2026-04-12',
    mode: 'Offline',
    venue: 'Innovation Block',
    requiredSkills: ['Python', 'Data Analysis', 'React'],
    teamSize: '3–4',
    prize: '₹35,000',
    status: 'Completed',
  },
]

// Students visible in the Team Formation Hub ("Looking for Team")
export const teammateCandidates = [
  {
    id: 'stu_02',
    name: 'Raghav Mehta',
    university: 'Chitkara University',
    skills: ['Node.js', 'Express.js', 'MongoDB'],
    preferredRole: 'Backend',
    previousParticipation: 4,
    lookingForTeam: true,
  },
  {
    id: 'stu_03',
    name: 'Ananya Kapoor',
    university: 'Chitkara University',
    skills: ['Python', 'Machine Learning', 'Data Science'],
    preferredRole: 'AI/ML',
    previousParticipation: 3,
    lookingForTeam: true,
  },
  {
    id: 'stu_04',
    name: 'Dev Malhotra',
    university: 'Chitkara University',
    skills: ['Public Speaking', 'Presentation', 'Business Strategy'],
    preferredRole: 'Pitch & Strategy',
    previousParticipation: 2,
    lookingForTeam: true,
  },
  {
    id: 'stu_05',
    name: 'Simran Kaur',
    university: 'Chitkara University',
    skills: ['UI/UX', 'Figma', 'React'],
    preferredRole: 'Design',
    previousParticipation: 5,
    lookingForTeam: true,
  },
  {
    id: 'stu_06',
    name: 'Aarav Chopra',
    university: 'Chitkara University',
    skills: ['Python', 'Data Analysis', 'React'],
    preferredRole: 'Full-stack',
    previousParticipation: 1,
    lookingForTeam: true,
  },
]

// Compute a simple complementary-skill match score against the current student
export function computeMatch(candidate, base = currentStudent) {
  const baseSkills = new Set(base.skills.map((s) => s.name.toLowerCase()))
  const candSkills = candidate.skills.map((s) => s.toLowerCase())
  const overlap = candSkills.filter((s) => baseSkills.has(s)).length
  const complementary = candSkills.length - overlap

  // Complementary skills score higher than duplicate/overlapping skills
  const score = Math.min(98, 55 + complementary * 12 + candidate.previousParticipation * 3)
  const reasons = []
  if (complementary > 0) reasons.push(`Adds ${complementary} skill${complementary > 1 ? 's' : ''} you don't have`)
  if (candidate.preferredRole) reasons.push(`Fits an open ${candidate.preferredRole} role`)
  if (candidate.previousParticipation >= 3) reasons.push('Experienced — 3+ past events')
  return { score, reasons }
}

export const myTeams = [
  {
    id: 'team_01',
    name: 'Team Nimbus',
    event: 'AI Innovation Challenge 2026',
    members: [
      { name: 'Isha Sharma', role: 'Frontend / Full-stack' },
      { name: 'Raghav Mehta', role: 'Backend' },
    ],
    status: 'Recruiting — needs 1 AI/ML teammate',
  },
]

export const performanceHistory = [
  {
    id: 'perf_01',
    event: 'Smart Campus Hackathon',
    date: '2026-06-10',
    role: 'Frontend Lead',
    skillsUsed: ['React', 'Node.js', 'IoT'],
    scores: { innovation: 82, technical: 75, problemSolving: 80, presentation: 68, teamwork: 90 },
    overall: 79,
    rank: 4,
    result: 'Finalist',
  },
  {
    id: 'perf_02',
    event: 'Innovate-a-thon: Sustainability Edition',
    date: '2026-04-18',
    role: 'Full-stack Developer',
    skillsUsed: ['Python', 'React', 'Data Analysis'],
    scores: { innovation: 88, technical: 70, problemSolving: 74, presentation: 65, teamwork: 84 },
    overall: 76,
    rank: 6,
    result: 'Participated',
  },
  {
    id: 'perf_03',
    event: 'HackIndia (Himachal Pradesh)',
    date: '2026-02-02',
    role: 'Frontend Developer',
    skillsUsed: ['React', 'UI/UX'],
    scores: { innovation: 79, technical: 72, problemSolving: 70, presentation: 74, teamwork: 88 },
    overall: 77,
    rank: 8,
    result: 'Top 10',
  },
]

// Aggregated skill-category performance for the radar/bar view
export const skillPerformance = [
  { skill: 'Frontend', score: 82 },
  { skill: 'Backend', score: 65 },
  { skill: 'Problem Solving', score: 78 },
  { skill: 'Innovation', score: 88 },
  { skill: 'Presentation', score: 69 },
]

export const performanceTrend = performanceHistory
  .slice()
  .reverse()
  .map((p) => ({ name: p.event.split(' ').slice(0, 2).join(' '), score: p.overall }))

export const skillGapTarget = {
  event: 'AI Innovation Challenge 2026',
  required: ['Python', 'Machine Learning', 'React', 'Data Analysis'],
}

export function computeSkillGap(student = currentStudent, target = skillGapTarget) {
  const owned = new Set(student.skills.map((s) => s.name))
  const strong = target.required.filter((s) => owned.has(s))
  const gaps = target.required.filter((s) => !owned.has(s))
  return { strong, gaps }
}

export const leaderboard = [
  { rank: 1, team: 'Team Vertex', project: 'CampusGuard AI', total: 94, innovation: 96, technical: 92, presentation: 93 },
  { rank: 2, team: 'Team Nimbus', project: 'EduMatch', total: 91, innovation: 90, technical: 93, presentation: 88 },
  { rank: 3, team: 'ByteForce', project: 'SafeRoute', total: 89, innovation: 85, technical: 91, presentation: 90 },
  { rank: 4, team: 'Team Cipher', project: 'GreenGrid', total: 85, innovation: 88, technical: 80, presentation: 86 },
  { rank: 5, team: 'Quantum Coders', project: 'HealthLink', total: 81, innovation: 79, technical: 83, presentation: 80 },
]

export const submissions = [
  {
    id: 'sub_01',
    team: 'Team Nimbus',
    event: 'AI Innovation Challenge 2026',
    project: 'EduMatch',
    githubUrl: 'https://github.com/example/edumatch',
    demoUrl: '',
    status: 'Draft',
  },
]

export const notifications = [
  { id: 'n1', type: 'invitation', message: 'Ananya Kapoor invited you to join Team Vertex', read: false },
  { id: 'n2', type: 'deadline', message: 'AI Innovation Challenge 2026 registration closes in 3 days', read: false },
  { id: 'n3', type: 'evaluation', message: 'Your Smart Campus Hackathon submission was evaluated', read: true },
  { id: 'n4', type: 'announcement', message: 'Chitkara Innovation Cell posted a new announcement', read: true },
]

export const organizerStats = {
  totalEvents: 6,
  totalRegistrations: 482,
  totalTeams: 96,
  totalSubmissions: 71,
  evaluationProgress: 68,
}

export const judgeAssignedEvents = [
  { id: 'evt_01', title: 'AI Innovation Challenge 2026', submissions: 12, evaluated: 5 },
  { id: 'evt_04', title: 'FinTech Ideathon', submissions: 8, evaluated: 8 },
]

export const judgeSubmissions = [
  {
    id: 'sub_j1',
    team: 'Team Vertex',
    project: 'CampusGuard AI',
    description: 'On-device object detection to flag hidden cameras in shared spaces.',
    githubUrl: 'https://github.com/example/campusguard',
    demoUrl: 'https://campusguard.demo',
    evaluated: false,
  },
  {
    id: 'sub_j2',
    team: 'ByteForce',
    project: 'SafeRoute',
    description: 'Crowd-sourced safe-route mapping for students walking at night.',
    githubUrl: 'https://github.com/example/saferoute',
    demoUrl: 'https://saferoute.demo',
    evaluated: true,
  },
]

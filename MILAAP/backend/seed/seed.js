import dotenv from 'dotenv'
import connectDB from '../config/db.js'
import mongoose from 'mongoose'

import User from '../models/User.js'
import StudentProfile from '../models/StudentProfile.js'
import Event from '../models/Event.js'
import Team from '../models/Team.js'
import Project from '../models/Project.js'
import Evaluation from '../models/Evaluation.js'
import PerformanceHistory from '../models/PerformanceHistory.js'
import Notification from '../models/Notification.js'
import Registration from '../models/Registration.js'
import TeamInvitation from '../models/TeamInvitation.js'

dotenv.config()

async function seed() {
  await connectDB()
  console.log('Clearing existing data...')

  await Promise.all([
    User.deleteMany(),
    StudentProfile.deleteMany(),
    Event.deleteMany(),
    Team.deleteMany(),
    Project.deleteMany(),
    Evaluation.deleteMany(),
    PerformanceHistory.deleteMany(),
    Notification.deleteMany(),
    Registration.deleteMany(),
    TeamInvitation.deleteMany(),
  ])

  console.log('Creating users...')

  const student1 = await User.create({ name: 'Isha Sharma', email: 'isha@chitkara.edu.in', password: 'password123', role: 'student' })
  const student2 = await User.create({ name: 'Raghav Mehta', email: 'raghav@chitkara.edu.in', password: 'password123', role: 'student' })
  const student3 = await User.create({ name: 'Ananya Kapoor', email: 'ananya@chitkara.edu.in', password: 'password123', role: 'student' })
  const student4 = await User.create({ name: 'Dev Malhotra', email: 'dev@chitkara.edu.in', password: 'password123', role: 'student' })
  const student5 = await User.create({ name: 'Simran Kaur', email: 'simran@chitkara.edu.in', password: 'password123', role: 'student' })

  const organizer = await User.create({ name: 'Chitkara Innovation Cell', email: 'organizer@chitkara.edu.in', password: 'password123', role: 'organizer' })
  const judge = await User.create({ name: 'Dr. Nikhil Verma', email: 'judge@chitkara.edu.in', password: 'password123', role: 'judge' })
  const admin = await User.create({ name: 'Milaap Administrator', email: 'admin@milaap.edu.in', password: 'Admin@Milaap2026', role: 'admin' })

  console.log('Creating student profiles...')

  await StudentProfile.create({
    userId: student1._id,
    university: 'Chitkara University',
    department: 'Computer Science & Engineering',
    year: '3rd Year',
    bio: 'Full-stack builder who likes shipping fast and clean UI.',
    skills: [
      { name: 'React.js', level: 90 },
      { name: 'JavaScript', level: 88 },
      { name: 'Node.js', level: 70 },
      { name: 'MongoDB', level: 65 },
      { name: 'UI/UX', level: 80 },
    ],
    interests: ['Web Development', 'AI/ML', 'Product Design'],
    preferredRole: 'Frontend / Full-stack',
    lookingForTeam: true,
    achievements: ['SIH 2024 — Top 30 Nationally', 'HackIndia — Top 10 (HP)', 'Azure AI Fundamentals Certified'],
    socialLinks: { github: 'github.com/isha15sharma' },
  })

  await StudentProfile.create({
    userId: student2._id,
    skills: [{ name: 'Node.js', level: 85 }, { name: 'Express.js', level: 80 }, { name: 'MongoDB', level: 78 }],
    preferredRole: 'Backend',
    lookingForTeam: true,
  })

  await StudentProfile.create({
    userId: student3._id,
    skills: [{ name: 'Python', level: 88 }, { name: 'Machine Learning', level: 82 }, { name: 'Data Science', level: 75 }],
    preferredRole: 'AI/ML',
    lookingForTeam: true,
  })

  await StudentProfile.create({
    userId: student4._id,
    skills: [{ name: 'Public Speaking', level: 90 }, { name: 'Presentation', level: 88 }, { name: 'Business Strategy', level: 70 }],
    preferredRole: 'Pitch & Strategy',
    lookingForTeam: true,
  })

  await StudentProfile.create({
    userId: student5._id,
    skills: [{ name: 'UI/UX', level: 85 }, { name: 'Figma', level: 90 }, { name: 'React', level: 70 }],
    preferredRole: 'Design',
    lookingForTeam: true,
  })

  console.log('Creating events...')

  const event1 = await Event.create({
    title: 'AI Innovation Challenge 2026',
    type: 'Hackathon',
    organizerId: organizer._id,
    organizerName: organizer.name,
    description: 'Build an AI-first product that solves a real campus or civic problem in 36 hours.',
    startDate: new Date('2026-08-14'),
    registrationDeadline: new Date('2026-08-08'),
    mode: 'Offline',
    venue: 'Innovation Block, Chitkara University',
    requiredSkills: ['Python', 'Machine Learning', 'React', 'Data Analysis'],
    teamSize: '3–4',
    prize: '₹75,000 + Internship offers',
    status: 'Registration Open',
  })

  const event2 = await Event.create({
    title: 'Smart Campus Hackathon',
    type: 'Hackathon',
    organizerId: organizer._id,
    organizerName: organizer.name,
    description: 'IoT + software solutions for a smarter, safer campus.',
    startDate: new Date('2026-06-10'),
    registrationDeadline: new Date('2026-06-05'),
    mode: 'Offline',
    venue: 'Innovation Block',
    requiredSkills: ['IoT', 'Node.js', 'React'],
    teamSize: '3–4',
    prize: '₹50,000',
    status: 'Completed',
  })

  await Event.create({
    title: 'CodeSprint — Competitive Programming',
    type: 'Coding Competition',
    organizerId: organizer._id,
    organizerName: organizer.name,
    description: 'Solo, timed DSA contest across three rounds.',
    startDate: new Date('2026-08-05'),
    registrationDeadline: new Date('2026-08-03'),
    mode: 'Online',
    requiredSkills: ['DSA', 'C++', 'Java'],
    teamSize: '1',
    prize: '₹25,000',
    status: 'Registration Open',
  })

  console.log('Creating a team + submission + evaluation for demo data...')

  const team = await Team.create({
    eventId: event2._id,
    teamName: 'Team Nimbus',
    leaderId: student1._id,
    members: [
      { userId: student1._id, role: 'Frontend Lead' },
      { userId: student2._id, role: 'Backend' },
    ],
    status: 'locked',
  })

  const project = await Project.create({
    teamId: team._id,
    eventId: event2._id,
    title: 'EduMatch',
    description: 'A smart campus companion connecting students to safety alerts and lost & found.',
    technologies: ['React', 'Node.js', 'IoT'],
    githubUrl: 'https://github.com/example/edumatch',
    demoUrl: 'https://edumatch.demo',
    status: 'Evaluated',
  })

  const evaluation = await Evaluation.create({
    projectId: project._id,
    judgeId: judge._id,
    innovationScore: 82,
    technicalScore: 75,
    problemSolvingScore: 80,
    impactScore: 78,
    presentationScore: 68,
    teamworkScore: 90,
    feedback: 'Strong execution, work on your pitch delivery next time.',
  })

  await PerformanceHistory.insertMany(
    team.members.map((m) => ({
      studentId: m.userId,
      eventId: event2._id,
      teamId: team._id,
      role: m.role,
      skillsUsed: project.technologies,
      scores: {
        innovation: evaluation.innovationScore,
        technical: evaluation.technicalScore,
        problemSolving: evaluation.problemSolvingScore,
        presentation: evaluation.presentationScore,
        teamwork: evaluation.teamworkScore,
      },
      overall: evaluation.totalScore,
      rank: 4,
      achievement: 'Finalist',
      feedback: evaluation.feedback,
    }))
  )

  console.log('Creating sample notifications...')

  await Notification.insertMany([
    { userId: student1._id, type: 'invitation', message: 'Ananya Kapoor invited you to join Team Vertex' },
    { userId: student1._id, type: 'deadline', message: 'AI Innovation Challenge 2026 registration closes in 3 days' },
    { userId: student1._id, type: 'evaluation', message: 'Your Smart Campus Hackathon submission was evaluated', readStatus: true },
  ])

  console.log('\nSeed complete! Demo logins:')
  console.log('  student   -> isha@chitkara.edu.in       / password123')
  console.log('  organizer -> organizer@chitkara.edu.in  / password123')
  console.log('  judge     -> judge@chitkara.edu.in      / password123')
  console.log('  admin     -> admin@milaap.edu.in        / Admin@Milaap2026')

  await mongoose.connection.close()
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})

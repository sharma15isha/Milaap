import { useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

import LandingPage from './pages/LandingPage.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Placeholder from './pages/Placeholder.jsx'
import Events from './pages/Events.jsx'
import EventDetails from './pages/EventDetails.jsx'
import TeamFormationHub from './pages/TeamFormationHub.jsx'
import Leaderboard from './pages/Leaderboard.jsx'

import StudentDashboard from './pages/student/StudentDashboard.jsx'
import PerformanceAnalysis from './pages/student/PerformanceAnalysis.jsx'
import SkillGapAnalysis from './pages/student/SkillGapAnalysis.jsx'
import Profile from './pages/student/Profile.jsx'
import MySubmissions from './pages/student/MySubmissions.jsx'

import OrganizerDashboard from './pages/organizer/OrganizerDashboard.jsx'
import CreateEvent from './pages/organizer/CreateEvent.jsx'

import JudgeDashboard from './pages/judge/JudgeDashboard.jsx'

// Routes that use the dashboard sidebar layout instead of the public navbar/footer
const DASHBOARD_PREFIXES = ['/login', '/register', '/student', '/organizer', '/judge', '/admin']

function App() {
  // All auth state lives right here in one useState — no Context API.
  // It gets passed down to pages as plain props.
  const [user, setUser] = useState(null)

  const handleLogin = (userData) => setUser(userData)
  const handleRegister = (userData) => setUser(userData)
  const handleLogout = () => setUser(null)

  const location = useLocation()
  const isDashboardRoute = DASHBOARD_PREFIXES.some((prefix) => location.pathname.startsWith(prefix))

  return (
    <>
      {!isDashboardRoute && <Navbar />}

      <Routes>
        {/* Public pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register onRegister={handleRegister} />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/teams" element={<TeamFormationHub />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/about" element={<Placeholder title="About Milap" />} />

        {/* Student dashboard */}
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute user={user} allowedRole="student">
              <StudentDashboard user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/performance"
          element={
            <ProtectedRoute user={user} allowedRole="student">
              <PerformanceAnalysis user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/skill-gap"
          element={
            <ProtectedRoute user={user} allowedRole="student">
              <SkillGapAnalysis user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/submissions"
          element={
            <ProtectedRoute user={user} allowedRole="student">
              <MySubmissions user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/profile"
          element={
            <ProtectedRoute user={user} allowedRole="student">
              <Profile user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        {/* Organizer dashboard */}
        <Route
          path="/organizer/dashboard"
          element={
            <ProtectedRoute user={user} allowedRole="organizer">
              <OrganizerDashboard user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer/create-event"
          element={
            <ProtectedRoute user={user} allowedRole="organizer">
              <CreateEvent user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer/events"
          element={
            <ProtectedRoute user={user} allowedRole="organizer">
              <OrganizerDashboard user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        {/* Judge dashboard */}
        <Route
          path="/judge/dashboard"
          element={
            <ProtectedRoute user={user} allowedRole="judge">
              <JudgeDashboard user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Placeholder title="Page not found" />} />
      </Routes>

      {!isDashboardRoute && <Footer />}
    </>
  )
}

export default App

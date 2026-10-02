import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import api from './services/api.js'

import LandingPage from './pages/LandingPage.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Placeholder from './pages/Placeholder.jsx'
import About from './pages/About.jsx'
import Events from './pages/Events.jsx'
import EventDetails from './pages/EventDetails.jsx'
import TeamFormationHub from './pages/TeamFormationHub.jsx'
import Leaderboard from './pages/Leaderboard.jsx'
import WinnersPlaybook from './pages/WinnersPlaybook.jsx'

import StudentDashboard from './pages/student/StudentDashboard.jsx'
import PerformanceAnalysis from './pages/student/PerformanceAnalysis.jsx'
import SkillGapAnalysis from './pages/student/SkillGapAnalysis.jsx'
import Profile from './pages/student/Profile.jsx'
import MySubmissions from './pages/student/MySubmissions.jsx'
import LearningJourney from './pages/student/LearningJourney.jsx'

import OrganizerDashboard from './pages/organizer/OrganizerDashboard.jsx'
import CreateEvent from './pages/organizer/CreateEvent.jsx'

import JudgeDashboard from './pages/judge/JudgeDashboard.jsx'
import AdminLogin from './pages/admin/AdminLogin.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'

// Routes that use the dashboard sidebar layout instead of the public navbar/footer
const DASHBOARD_PREFIXES = ['/login', '/register', '/student', '/organizer', '/judge', '/admin']

function App() {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('milap_user')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })
  const [loadingAuth, setLoadingAuth] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('milap_token')
    if (token) {
      api.get('/auth/me')
        .then((res) => {
          if (res.data?.user) {
            setUser(res.data.user)
            localStorage.setItem('milap_user', JSON.stringify(res.data.user))
          }
        })
        .catch((err) => {
          console.warn('Session expired or invalid:', err?.response?.data?.message || err.message)
          localStorage.removeItem('milap_token')
          localStorage.removeItem('milap_user')
          setUser(null)
        })
        .finally(() => setLoadingAuth(false))
    } else {
      setLoadingAuth(false)
    }
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    if (userData) {
      localStorage.setItem('milap_user', JSON.stringify(userData))
    }
  }

  const handleRegister = (userData) => {
    setUser(userData)
    if (userData) {
      localStorage.setItem('milap_user', JSON.stringify(userData))
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('milap_token')
    localStorage.removeItem('milap_user')
    setUser(null)
  }

  const location = useLocation()
  const isDashboardRoute = DASHBOARD_PREFIXES.some((prefix) => location.pathname.startsWith(prefix))

  return (
    <>
      {!isDashboardRoute && <Navbar user={user} onLogout={handleLogout} />}

      <Routes>
        {/* Public pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register onRegister={handleRegister} />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetails user={user} />} />
        <Route path="/teams" element={<TeamFormationHub user={user} />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/playbook" element={<WinnersPlaybook user={user} onLogout={handleLogout} />} />
        <Route path="/about" element={<About />} />

        {/* Student dashboard */}
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute user={user} allowedRole="student" loading={loadingAuth}>
              <StudentDashboard user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/performance"
          element={
            <ProtectedRoute user={user} allowedRole="student" loading={loadingAuth}>
              <PerformanceAnalysis user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/skill-gap"
          element={
            <ProtectedRoute user={user} allowedRole="student" loading={loadingAuth}>
              <SkillGapAnalysis user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/submissions"
          element={
            <ProtectedRoute user={user} allowedRole="student" loading={loadingAuth}>
              <MySubmissions user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/profile"
          element={
            <ProtectedRoute user={user} allowedRole="student" loading={loadingAuth}>
              <Profile user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/learning-journey"
          element={
            <ProtectedRoute user={user} allowedRole="student" loading={loadingAuth}>
              <LearningJourney user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/playbook"
          element={
            <ProtectedRoute user={user} allowedRole="student" loading={loadingAuth}>
              <WinnersPlaybook user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        {/* Organizer dashboard */}
        <Route
          path="/organizer/dashboard"
          element={
            <ProtectedRoute user={user} allowedRole="organizer" loading={loadingAuth}>
              <OrganizerDashboard user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer/create-event"
          element={
            <ProtectedRoute user={user} allowedRole="organizer" loading={loadingAuth}>
              <CreateEvent user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer/events"
          element={
            <ProtectedRoute user={user} allowedRole="organizer" loading={loadingAuth}>
              <OrganizerDashboard user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        {/* Judge dashboard */}
        <Route
          path="/judge/dashboard"
          element={
            <ProtectedRoute user={user} allowedRole="judge" loading={loadingAuth}>
              <JudgeDashboard user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        {/* Dedicated Admin Portal & Dashboard */}
        <Route path="/admin/login" element={<AdminLogin onLogin={handleLogin} />} />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute user={user} allowedRole="admin" loading={loadingAuth}>
              <AdminDashboard user={user} onLogout={handleLogout} />
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

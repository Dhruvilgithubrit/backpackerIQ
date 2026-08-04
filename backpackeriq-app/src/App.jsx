import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import PlanTripPage from './pages/PlanTripPage'
import ResultsPage from './pages/ResultsPage'
import SavedTripsPage from './pages/SavedTripsPage'
import AdminLoginPage from './pages/admin/AdminLoginPage'
import AdminDashboard from './pages/admin/AdminDashboard'

/** Blocks non-authenticated users from user routes */
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="loading-gate">BackpackerIQ</div>
  if (!user) return <Navigate to="/login" replace />
  return children
}

/** Admin auth is completely separate — session token stored in sessionStorage */
function AdminRoute({ children }) {
  const isAdmin = !!sessionStorage.getItem('biq_admin_token')
  if (!isAdmin) return <Navigate to="/admin/login" replace />
  return children
}

function ScrollToTop() {
  const { pathname, search } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname, search])

  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          {/* ── Public ── */}
          <Route path="/login" element={<LoginPage />} />

          {/* ── Protected user routes ── */}
          <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/plan" element={<ProtectedRoute><PlanTripPage /></ProtectedRoute>} />
          <Route path="/results" element={<ProtectedRoute><ResultsPage /></ProtectedRoute>} />
          <Route path="/saved" element={<ProtectedRoute><SavedTripsPage /></ProtectedRoute>} />

          {/* ── Admin — completely separate, never linked from public app ── */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

          {/* ── Fallback ── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

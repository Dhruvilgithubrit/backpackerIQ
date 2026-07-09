import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import PlanTripPage from './pages/PlanTripPage'
import ResultsPage from './pages/ResultsPage'
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

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* ── Public ── */}
          <Route path="/login" element={<LoginPage />} />

          {/* ── Protected user routes ── */}
          <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/plan" element={<ProtectedRoute><PlanTripPage /></ProtectedRoute>} />
          <Route path="/results" element={<ProtectedRoute><ResultsPage /></ProtectedRoute>} />

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

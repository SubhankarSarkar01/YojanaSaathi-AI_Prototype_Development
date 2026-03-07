import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { useAuthStore } from './store/authStore'

// Layouts
import MainLayout from './components/layouts/MainLayout'

// Pages
import HomePageModern from './pages/HomePageModern'
import AuthPage from './pages/auth/AuthPage'
import ProfilePage from './pages/profile/ProfilePage'
import ProfileCreatePage from './pages/profile/ProfileCreatePage'
import SchemesPage from './pages/schemes/SchemesPage'
import SchemeDetailPage from './pages/schemes/SchemeDetailPage'
import SchemeComparePage from './pages/schemes/SchemeComparePage'
import ApplicationsPage from './pages/applications/ApplicationsPage'
import ApplicationDetailPage from './pages/applications/ApplicationDetailPage'
import NewApplicationPage from './pages/applications/NewApplicationPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminSchemes from './pages/admin/AdminSchemes'
import ChatbotWidget from './components/chatbot/ChatbotWidget'

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />
  }
  
  return <>{children}</>
}

// Admin Route Component
function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuthStore()
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />
  }
  
  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />
  }
  
  return <>{children}</>
}

function App() {
  return (
    <>
      <Routes>
        {/* Auth Route */}
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/login" element={<Navigate to="/auth" replace />} />
        <Route path="/register" element={<Navigate to="/auth" replace />} />

        {/* Protected Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePageModern />} />
          <Route path="/schemes" element={<SchemesPage />} />
          <Route path="/schemes/:id" element={<SchemeDetailPage />} />
          <Route path="/schemes/compare" element={<SchemeComparePage />} />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          
          <Route path="/profile/create" element={
            <ProtectedRoute>
              <ProfileCreatePage />
            </ProtectedRoute>
          } />
          
          <Route path="/applications" element={
            <ProtectedRoute>
              <ApplicationsPage />
            </ProtectedRoute>
          } />
          
          <Route path="/applications/:id" element={
            <ProtectedRoute>
              <ApplicationDetailPage />
            </ProtectedRoute>
          } />
          
          <Route path="/applications/new/:schemeId" element={
            <ProtectedRoute>
              <NewApplicationPage />
            </ProtectedRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
          
          <Route path="/admin/schemes" element={
            <AdminRoute>
              <AdminSchemes />
            </AdminRoute>
          } />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Global Components */}
      <ChatbotWidget />
      <Toaster position="top-right" richColors />
    </>
  )
}

export default App

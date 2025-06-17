import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { Layout } from './components/Layout'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { ResetPasswordPage } from './pages/ResetPasswordPage'
import { DashboardPage } from './pages/DashboardPage'
import { ProfilePage } from './pages/ProfilePage'
import { CreateProjectPage } from './pages/CreateProjectPage'
import { AdminPage } from './pages/AdminPage'
import { ExplorerPage } from './pages/ExplorerPage'
import './App.css'

// Componente para proteger rotas que requerem autenticação
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  return <Layout>{children}</Layout>
}

// Componente para rotas públicas (redireciona se já estiver logado)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }
  
  if (user) {
    return <Navigate to="/dashboard" replace />
  }
  
  return children
}

function AppRoutes() {
  return (
    <Routes>
      {/* Rotas públicas */}
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } 
      />
      <Route 
        path="/register" 
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        } 
      />
      <Route 
        path="/reset-password" 
        element={
          <PublicRoute>
            <ResetPasswordPage />
          </PublicRoute>
        } 
      />
      
      {/* Rotas protegidas */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } 
      />
      
      {/* Placeholder para outras rotas protegidas */}
      <Route 
        path="/perfil" 
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/criar" 
        element={
          <ProtectedRoute>
            <CreateProjectPage />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/meus-projetos" 
        element={
          <ProtectedRoute>
            <div className="container mx-auto px-4 py-8">
              <h1 className="text-2xl font-bold">Meus Projetos</h1>
              <p>Página em desenvolvimento...</p>
            </div>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute>
            <AdminPage />
          </ProtectedRoute>
        } 
      />
      
      {/* Rota pública */}
      <Route path="/explorer" element={<ExplorerPage />} />
      
      {/* Rota padrão */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      {/* Rota 404 */}
      <Route 
        path="*" 
        element={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
              <p className="text-gray-600 mb-8">Página não encontrada</p>
              <a 
                href="/dashboard" 
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md"
              >
                Voltar ao Dashboard
              </a>
            </div>
          </div>
        } 
      />
    </Routes>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  )
}

export default App


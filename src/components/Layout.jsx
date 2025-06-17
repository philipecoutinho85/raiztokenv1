import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.jsx'
import { LogOut, User, Settings, Coins, Shield } from 'lucide-react'
import { useState, useEffect } from 'react'

export const Layout = ({ children }) => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [userProfile, setUserProfile] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return

      try {
        const { data, error } = await supabase
          .from("usuarios")
          .select("role, tokens_disponiveis")
          .eq("id", user.id)
          .single()

        if (data && !error) {
          setUserProfile(data)
          setIsAdmin(data.role === 'admin')
        } else {
          console.error('Error fetching user profile:', error)
        }
      } catch (err) {
        console.error('Exception fetching user profile:', err)
      }
    }

    fetchUserProfile()
  }, [user])

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  if (!user) {
    return children
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header/Navigation */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Brand */}
            <div className="flex items-center">
              <Link to="/dashboard" className="text-2xl font-bold text-[#FF5A5F]">
                $RAIZ
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link 
                to="/dashboard" 
                className="text-gray-700 hover:text-[#FF5A5F] px-3 py-2 rounded-md text-sm font-medium"
              >
                Dashboard
              </Link>
              <Link 
                to="/criar" 
                className="text-gray-700 hover:text-[#FF5A5F] px-3 py-2 rounded-md text-sm font-medium"
              >
                Criar Projeto
              </Link>
              <Link 
                to="/meus-projetos" 
                className="text-gray-700 hover:text-[#FF5A5F] px-3 py-2 rounded-md text-sm font-medium"
              >
                Meus Projetos
              </Link>
              <Link 
                to="/perfil" 
                className="text-gray-700 hover:text-[#FF5A5F] px-3 py-2 rounded-md text-sm font-medium"
              >
                Meu Perfil
              </Link>
              {isAdmin && (
                <Link 
                  to="/admin" 
                  className="bg-[#FF5A5F] text-white hover:bg-[#484848] px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1"
                >
                  <Shield className="h-4 w-4" />
                  <span>Admin</span>
                </Link>
              )}
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {/* Tokens Display */}
              <div className="flex items-center space-x-2 bg-[#FF5A5F] px-3 py-2 rounded-full text-white">
                <Coins className="h-4 w-4 text-white" />
                <span className="text-sm font-medium text-white">
                  {userProfile?.tokens_disponiveis || 0} tokens
                </span>
              </div>

              {/* User Avatar and Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.foto_perfil_url} alt={user?.nome} />
                      <AvatarFallback>
                        {user?.nome?.charAt(0)?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem asChild>
                    <Link to="/perfil" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Perfil</span>
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="flex items-center">
                        <Shield className="mr-2 h-4 w-4" />
                        <span>Painel Admin</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            <Link 
              to="/dashboard" 
              className="text-gray-700 hover:text-[#FF5A5F] block px-3 py-2 rounded-md text-base font-medium"
            >
              Dashboard
            </Link>
            <Link 
              to="/criar" 
              className="text-gray-700 hover:text-[#FF5A5F] block px-3 py-2 rounded-md text-base font-medium"
            >
              Criar Projeto
            </Link>
            <Link 
              to="/meus-projetos" 
              className="text-gray-700 hover:text-[#FF5A5F] block px-3 py-2 rounded-md text-base font-medium"
            >
              Meus Projetos
            </Link>
            <Link 
              to="/perfil" 
              className="text-gray-700 hover:text-[#FF5A5F] block px-3 py-2 rounded-md text-base font-medium"
            >
              Meu Perfil
            </Link>
            {isAdmin && (
              <Link 
                to="/admin" 
                className="bg-[#FF5A5F] text-white hover:bg-[#484848] block px-3 py-2 rounded-md text-base font-medium flex items-center space-x-1"
              >
                <Shield className="h-4 w-4" />
                <span>Painel Admin</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[#484848] text-white py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm">
              Desenvolvido por{' '}
              <a 
                href="https://pcoutinho.com.br" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#FF5A5F] hover:text-white font-medium transition-colors"
              >
                Philipe Coutinho
              </a>
            </p>
            <p className="text-xs text-gray-400 mt-1">
              © {new Date().getFullYear()} $RAIZ - Plataforma de Impacto Social
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}


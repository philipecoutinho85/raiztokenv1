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
import { Sidebar } from './ui/sidebar'

export const Layout = ({ children }) => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return
      try {
        const { data } = await supabase
          .from("usuarios")
          .select("role")
          .eq("id", user.id)
          .single()
        if (data?.role === "admin") {
          setIsAdmin(true)
        }
      } catch (err) {
        console.error('Erro ao buscar perfil', err)
      }
    }
    fetchUserProfile()
  }, [user])

  const handleLogout = async () => {
    await signOut()
    navigate('/LoginPage')
  }

  return (
    <div className="flex h-screen">
      <Sidebar isAdmin={isAdmin} />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}

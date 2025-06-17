import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { 
  Users, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Shield, 
  Ban,
  Search,
  Eye
} from 'lucide-react'

export const AdminPage = () => {
  const { user } = useAuth()
  const [users, setUsers] = useState([])
  const [projects, setProjects] = useState([])
  const [stats, setStats] = useState({
    totalPropostas: 0,
    aprovadas: 0,
    rejeitadas: 0,
    usuariosAtivos: 0,
    usuariosBanidos: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProject, setSelectedProject] = useState(null)
  const [rejectionReason, setRejectionReason] = useState('')

  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!user) return

      // Verificar se o usuário é admin
      const { data: userData, error: userError } = await supabase
        .from('usuarios')
        .select('role')
        .eq('id', user.id)
        .single()

      if (userError || userData?.role !== 'admin') {
        setError('Acesso negado. Você não tem permissões de administrador.')
        setLoading(false)
        return
      }

      await fetchData()
    }

    checkAdminAccess()
  }, [user])

  const fetchData = async () => {
    try {
      // Buscar usuários
      const { data: usersData, error: usersError } = await supabase
        .from('usuarios')
        .select('*')
        .order('created_at', { ascending: false })

      if (usersError) throw usersError

      // Buscar projetos
      const { data: projectsData, error: projectsError } = await supabase
        .from('projetos')
        .select(`
          *,
          usuario:usuarios(nome, sobrenome, email)
        `)
        .order('created_at', { ascending: false })

      if (projectsError) throw projectsError

      setUsers(usersData)
      setProjects(projectsData)

      // Calcular estatísticas
      const totalPropostas = projectsData.length
      const aprovadas = projectsData.filter(p => p.status === 'aprovado').length
      const rejeitadas = projectsData.filter(p => p.status === 'rejeitado').length
      const usuariosAtivos = usersData.filter(u => !u.banido).length
      const usuariosBanidos = usersData.filter(u => u.banido).length

      setStats({
        totalPropostas,
        aprovadas,
        rejeitadas,
        usuariosAtivos,
        usuariosBanidos
      })

    } catch (err) {
      console.error('Erro ao carregar dados:', err)
      setError('Erro ao carregar dados do painel administrativo.')
    } finally {
      setLoading(false)
    }
  }

  const handleUserAction = async (userId, action) => {
    try {
      let updates = {}
      
      if (action === 'promote') {
        updates = { role: 'admin' }
      } else if (action === 'ban') {
        updates = { banido: true }
      } else if (action === 'unban') {
        updates = { banido: false }
      }

      const { error } = await supabase
        .from('usuarios')
        .update(updates)
        .eq('id', userId)

      if (error) throw error

      await fetchData() // Recarregar dados
      
    } catch (err) {
      console.error('Erro ao atualizar usuário:', err)
      alert('Erro ao atualizar usuário: ' + err.message)
    }
  }

  const handleProjectAction = async (projectId, action, reason = '') => {
    try {
      let updates = { status: action }
      
      if (action === 'rejeitado' && reason) {
        updates.justificativa_rejeicao = reason
      }

      const { error } = await supabase
        .from('projetos')
        .update(updates)
        .eq('id', projectId)

      if (error) throw error

      await fetchData() // Recarregar dados
      setSelectedProject(null)
      setRejectionReason('')
      
    } catch (err) {
      console.error('Erro ao atualizar projeto:', err)
      alert('Erro ao atualizar projeto: ' + err.message)
    }
  }

  const filteredUsers = users.filter(user => 
    user.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.sobrenome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredProjects = projects.filter(project =>
    project.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.usuario?.nome?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando painel administrativo...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
        <p className="text-gray-600 mt-2">Gerencie usuários e propostas da plataforma</p>
      </div>

      {/* BigNumbers */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Propostas</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPropostas}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprovadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.aprovadas}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejeitadas</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.rejeitadas}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.usuariosAtivos}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Banidos</CardTitle>
            <Ban className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.usuariosBanidos}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs para usuários e propostas */}
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="projects">Propostas</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nome ou e-mail..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <Card key={user.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="font-semibold">
                          {user.nome} {user.sobrenome}
                        </h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                            {user.role === 'admin' ? 'Admin' : 'Usuário'}
                          </Badge>
                          {user.banido && (
                            <Badge variant="destructive">Banido</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {user.role !== 'admin' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUserAction(user.id, 'promote')}
                        >
                          <Shield className="h-4 w-4 mr-1" />
                          Promover
                        </Button>
                      )}
                      {!user.banido ? (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleUserAction(user.id, 'ban')}
                        >
                          <Ban className="h-4 w-4 mr-1" />
                          Banir
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUserAction(user.id, 'unban')}
                        >
                          Desbanir
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por título ou criador..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="space-y-4">
            {filteredProjects.map((project) => (
              <Card key={project.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold">{project.titulo}</h3>
                        <Badge 
                          variant={
                            project.status === 'aprovado' ? 'default' :
                            project.status === 'rejeitado' ? 'destructive' : 'secondary'
                          }
                        >
                          {project.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Por: {project.usuario.nome} {project.usuario.sobrenome}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        Bairro: {project.bairro} | Meta: {project.tokens_necessarios} tokens
                      </p>
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {project.descricao}
                      </p>
                      {project.justificativa_rejeicao && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                          <p className="text-sm text-red-700">
                            <strong>Motivo da rejeição:</strong> {project.justificativa_rejeicao}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            Ver
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>{project.titulo}</DialogTitle>
                            <DialogDescription>
                              Detalhes completos do projeto
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            {project.imagem_url && (
                              <img 
                                src={project.imagem_url} 
                                alt={project.titulo}
                                className="w-full h-48 object-cover rounded"
                              />
                            )}
                            <div>
                              <h4 className="font-semibold">Descrição:</h4>
                              <p className="text-sm text-gray-700">{project.descricao}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <strong>Criador:</strong> {project.usuario.nome} {project.usuario.sobrenome}
                              </div>
                              <div>
                                <strong>Bairro:</strong> {project.bairro}
                              </div>
                              <div>
                                <strong>Meta:</strong> {project.tokens_necessarios} tokens
                              </div>
                              <div>
                                <strong>Data Limite:</strong> {new Date(project.data_limite).toLocaleDateString('pt-BR')}
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      {project.status === 'pendente' && (
                        <>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleProjectAction(project.id, 'aprovado')}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Aprovar
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => setSelectedProject(project)}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Rejeitar
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Rejeitar Projeto</DialogTitle>
                                <DialogDescription>
                                  Informe o motivo da rejeição do projeto "{project.titulo}"
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <Textarea
                                  placeholder="Motivo da rejeição..."
                                  value={rejectionReason}
                                  onChange={(e) => setRejectionReason(e.target.value)}
                                  rows={4}
                                />
                                <div className="flex justify-end space-x-2">
                                  <Button
                                    variant="outline"
                                    onClick={() => {
                                      setSelectedProject(null)
                                      setRejectionReason('')
                                    }}
                                  >
                                    Cancelar
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    onClick={() => handleProjectAction(project.id, 'rejeitado', rejectionReason)}
                                    disabled={!rejectionReason.trim()}
                                  >
                                    Rejeitar
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}


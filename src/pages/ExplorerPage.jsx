import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  MapPin, 
  Calendar, 
  Coins, 
  Search, 
  Filter,
  Target,
  Users,
  TrendingUp
} from 'lucide-react'

export const ExplorerPage = () => {
  const [projects, setProjects] = useState([])
  const [filteredProjects, setFilteredProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBairro, setSelectedBairro] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [bairros, setBairros] = useState([])

  useEffect(() => {
    fetchProjects()
  }, [])

  useEffect(() => {
    filterProjects()
  }, [projects, searchTerm, selectedBairro, selectedStatus])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      
      // Buscar apenas projetos aprovados
      const { data: projectsData, error: projectsError } = await supabase
        .from('projetos')
        .select(`
          *,
          usuario:usuarios(nome, sobrenome),
          apoios(quantidade_tokens)
        `)
        .eq('status', 'aprovado')
        .order('created_at', { ascending: false })

      if (projectsError) throw projectsError

      // Calcular estatísticas para cada projeto
      const projectsWithStats = projectsData.map(project => {
        const tokensArrecadados = project.apoios.reduce((total, apoio) => total + apoio.quantidade_tokens, 0)
        const progresso = (tokensArrecadados / project.tokens_necessarios) * 100
        const isCompleted = progresso >= 100
        const isNearDeadline = new Date(project.data_limite) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 dias
        
        return {
          ...project,
          tokens_arrecadados: tokensArrecadados,
          progresso: Math.min(progresso, 100),
          is_completed: isCompleted,
          is_near_deadline: isNearDeadline && !isCompleted
        }
      })

      setProjects(projectsWithStats)

      // Extrair bairros únicos para o filtro
      const uniqueBairros = [...new Set(projectsWithStats.map(p => p.bairro))].sort()
      setBairros(uniqueBairros)

    } catch (err) {
      console.error('Erro ao carregar projetos:', err)
      setError('Erro ao carregar projetos.')
    } finally {
      setLoading(false)
    }
  }

  const filterProjects = () => {
    let filtered = projects

    // Filtro por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.usuario.sobrenome.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtro por bairro
    if (selectedBairro) {
      filtered = filtered.filter(project => project.bairro === selectedBairro)
    }

    // Filtro por status
    if (selectedStatus) {
      if (selectedStatus === 'completed') {
        filtered = filtered.filter(project => project.is_completed)
      } else if (selectedStatus === 'active') {
        filtered = filtered.filter(project => !project.is_completed)
      } else if (selectedStatus === 'urgent') {
        filtered = filtered.filter(project => project.is_near_deadline)
      }
    }

    setFilteredProjects(filtered)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedBairro('')
    setSelectedStatus('')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando projetos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header público */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-green-600">$RAIZ</h1>
              <span className="ml-2 text-gray-600">Explorer</span>
            </div>
            <div className="flex items-center space-x-4">
              <a 
                href="/login" 
                className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Entrar
              </a>
              <a 
                href="/register" 
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Cadastrar
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Explore Projetos de Impacto Social
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubra iniciativas que estão transformando comunidades e apoie causas que fazem a diferença.
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Filtros */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filtros de Busca
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar projetos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={selectedBairro} onValueChange={setSelectedBairro}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar bairro" />
                </SelectTrigger>
                <SelectContent>
                  {bairros.map(bairro => (
                    <SelectItem key={bairro} value={bairro}>
                      {bairro}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status do projeto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativos</SelectItem>
                  <SelectItem value="completed">Concluídos</SelectItem>
                  <SelectItem value="urgent">Urgentes</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={clearFilters}>
                Limpar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Projetos Ativos</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {projects.filter(p => !p.is_completed).length}
              </div>
              <p className="text-xs text-muted-foreground">
                precisando de apoio
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Projetos Concluídos</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {projects.filter(p => p.is_completed).length}
              </div>
              <p className="text-xs text-muted-foreground">
                metas atingidas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Tokens</CardTitle>
              <Coins className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {projects.reduce((total, p) => total + p.tokens_arrecadados, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                tokens arrecadados
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Grid de projetos */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {filteredProjects.length} projeto(s) encontrado(s)
          </h2>
          
          {filteredProjects.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-gray-600 text-lg">
                  Nenhum projeto encontrado com os filtros aplicados.
                </p>
                <Button 
                  variant="outline" 
                  onClick={clearFilters}
                  className="mt-4"
                >
                  Limpar Filtros
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <Card key={project.id} className="hover:shadow-lg transition-shadow">
                  {project.imagem_url && (
                    <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                      <img 
                        src={project.imagem_url} 
                        alt={project.titulo}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg line-clamp-2">{project.titulo}</CardTitle>
                      <div className="flex flex-col space-y-1">
                        {project.is_completed && (
                          <Badge variant="default">Concluído</Badge>
                        )}
                        {project.is_near_deadline && (
                          <Badge variant="destructive">Urgente</Badge>
                        )}
                      </div>
                    </div>
                    <CardDescription className="line-clamp-3">
                      {project.descricao}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Informações do projeto */}
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-1" />
                        {project.bairro}
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(project.data_limite).toLocaleDateString('pt-BR')}
                      </div>

                      {/* Progresso */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progresso</span>
                          <span>{project.progresso.toFixed(1)}%</span>
                        </div>
                        <Progress value={project.progresso} className="h-2" />
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>{project.tokens_arrecadados} tokens</span>
                          <span>Meta: {project.tokens_necessarios}</span>
                        </div>
                      </div>

                      {/* Criador */}
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="h-4 w-4 mr-1" />
                        {project.usuario.nome} {project.usuario.sobrenome}
                      </div>

                      {/* Call to action */}
                      <div className="pt-2">
                        <a 
                          href="/register"
                          className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium inline-block text-center"
                        >
                          Cadastre-se para Apoiar
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


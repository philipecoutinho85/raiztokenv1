import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, MapPin, Calendar, Coins, Users, Target } from 'lucide-react'

export const DashboardPage = () => {
  const { user } = useAuth()
  const [projects, setProjects] = useState([])
  const [userStats, setUserStats] = useState({
    tokensDisponiveis: 0,
    projetosCriados: 0,
    projetosApoiados: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return

      setLoading(true)
      try {
        // Buscar projetos aprovados
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

        // Calcular tokens arrecadados para cada projeto
        const projectsWithStats = projectsData.map(project => {
          const tokensArrecadados = project.apoios.reduce((total, apoio) => total + apoio.quantidade_tokens, 0)
          const progresso = (tokensArrecadados / project.tokens_necessarios) * 100
          return {
            ...project,
            tokens_arrecadados: tokensArrecadados,
            progresso: Math.min(progresso, 100)
          }
        })

        setProjects(projectsWithStats)

        // Buscar estatísticas do usuário
        const { data: userData, error: userError } = await supabase
          .from('usuarios')
          .select('tokens_disponiveis')
          .eq('id', user.id)
          .single()

        if (userError) throw userError

        // Contar projetos criados pelo usuário
        const { count: projetosCriados, error: countError } = await supabase
          .from('projetos')
          .select('*', { count: 'exact', head: true })
          .eq('usuario_id', user.id)

        if (countError) throw countError

        // Contar projetos apoiados pelo usuário
        const { count: projetosApoiados, error: apoiosError } = await supabase
          .from('apoios')
          .select('*', { count: 'exact', head: true })
          .eq('usuario_id', user.id)

        if (apoiosError) throw apoiosError

        setUserStats({
          tokensDisponiveis: userData.tokens_disponiveis || 0,
          projetosCriados: projetosCriados || 0,
          projetosApoiados: projetosApoiados || 0
        })

      } catch (err) {
        console.error('Erro ao carregar dados:', err)
        setError('Erro ao carregar dados do dashboard.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  const handleSupport = async (projectId, tokensToSupport) => {
    if (!user) return

    try {
      // Verificar se o usuário tem tokens suficientes
      if (userStats.tokensDisponiveis < tokensToSupport) {
        alert('Você não tem tokens suficientes para apoiar este projeto.')
        return
      }

      // Registrar o apoio
      const { error: apoioError } = await supabase
        .from('apoios')
        .insert({
          usuario_id: user.id,
          projeto_id: projectId,
          quantidade_tokens: tokensToSupport
        })

      if (apoioError) throw apoioError

      // Atualizar tokens do usuário
      const { error: updateError } = await supabase
        .from('usuarios')
        .update({ tokens_disponiveis: userStats.tokensDisponiveis - tokensToSupport })
        .eq('id', user.id)

      if (updateError) throw updateError

      // Recarregar dados
      window.location.reload()

    } catch (err) {
      console.error('Erro ao apoiar projeto:', err)
      alert('Erro ao apoiar projeto: ' + err.message)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Bem-vindo, {user?.user_metadata?.nome || 'Usuário'}!
        </h1>
        <p className="text-gray-600 mt-2">
          Explore projetos de impacto social em sua comunidade
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Estatísticas do usuário */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Seus Tokens</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {userStats.tokensDisponiveis}
            </div>
            <p className="text-xs text-muted-foreground">
              tokens disponíveis
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projetos Criados</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userStats.projetosCriados}
            </div>
            <p className="text-xs text-muted-foreground">
              projetos seus
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projetos Apoiados</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userStats.projetosApoiados}
            </div>
            <p className="text-xs text-muted-foreground">
              projetos apoiados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Grid de projetos */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Projetos em Destaque</h2>
        {projects.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-600">
                Nenhum projeto aprovado encontrado. Seja o primeiro a criar um projeto!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
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
                    <Badge variant={project.progresso >= 100 ? "default" : "secondary"}>
                      {project.status}
                    </Badge>
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
                    <div className="text-sm text-gray-600">
                      Por: {project.usuario.nome} {project.usuario.sobrenome}
                    </div>

                    {/* Botão de apoio */}
                    {project.progresso < 100 && (
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={() => {
                          const tokens = prompt('Quantos tokens você deseja doar para este projeto?')
                          if (tokens && !isNaN(tokens) && parseInt(tokens) > 0) {
                            handleSupport(project.id, parseInt(tokens))
                          }
                        }}
                      >
                        <Coins className="h-4 w-4 mr-2" />
                        Apoiar Projeto
                      </Button>
                    )}
                    {project.progresso >= 100 && (
                      <Badge variant="default" className="w-full justify-center py-2">
                        Meta Atingida!
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


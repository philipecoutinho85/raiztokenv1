import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'

export const CreateProjectPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    meta: '',
    tokensNecessarios: '',
    bairro: '',
    dataLimite: '',
    imagem: null,
    youtubeLink: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      imagem: e.target.files[0]
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (!user) {
      setError('Você precisa estar logado para criar um projeto.')
      setLoading(false)
      return
    }

    try {
      let imageUrl = null
      if (formData.imagem) {
        const fileExt = formData.imagem.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random()}.${fileExt}`
        const filePath = `project_images/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('project_images')
          .upload(filePath, formData.imagem, { cacheControl: '3600', upsert: false })

        if (uploadError) {
          throw uploadError
        }

        const { data: publicUrlData } = supabase.storage
          .from('project_images')
          .getPublicUrl(filePath)
        
        imageUrl = publicUrlData.publicUrl
      }

      const { data, error: insertError } = await supabase
        .from('projetos')
        .insert({
          titulo: formData.titulo,
          descricao: formData.descricao,
          meta: parseInt(formData.meta),
          tokens_necessarios: parseInt(formData.tokensNecessarios),
          bairro: formData.bairro,
          data_limite: formData.dataLimite,
          usuario_id: user.id,
          imagem_url: imageUrl,
          youtube_link: formData.youtubeLink,
          status: 'pendente', // Status inicial
        })
        .select()

      if (insertError) {
        throw insertError
      }

      setSuccess('Projeto criado com sucesso e enviado para aprovação!')
      setFormData({
        titulo: '',
        descricao: '',
        meta: '',
        tokensNecessarios: '',
        bairro: '',
        dataLimite: '',
        imagem: null,
        youtubeLink: '',
      })
      navigate('/dashboard') // Redirecionar para o dashboard após a criação

    } catch (err) {
      console.error('Erro ao criar projeto:', err)
      setError('Erro ao criar projeto: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-900">Criar Novo Projeto</CardTitle>
          <CardDescription>Preencha os detalhes do seu projeto de impacto social.</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="bg-green-100 text-green-800 border-green-200 mb-4">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="titulo">Título do Projeto *</Label>
              <Input
                id="titulo"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                placeholder="Ex: Horta Comunitária no Bairro X"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição *</Label>
              <Textarea
                id="descricao"
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                placeholder="Descreva detalhadamente o seu projeto, seus objetivos e impacto esperado."
                rows={5}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="youtubeLink">Link do YouTube *</Label>
              <Input
                id="youtubeLink"
                name="youtubeLink"
                type="url"
                value={formData.youtubeLink}
                onChange={handleChange}
                placeholder="https://www.youtube.com/watch?v=..."
                required
              />
              <p className="text-sm text-gray-600">
                Adicione um vídeo no YouTube apresentando você e explicando seu projeto. 
                Isso ajuda a comunidade a conhecer melhor quem você é e a confiar na sua proposta.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="meta">Meta de Tokens *</Label>
                <Input
                  id="meta"
                  name="meta"
                  type="number"
                  value={formData.meta}
                  onChange={handleChange}
                  placeholder="Ex: 1000"
                  min="1"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tokensNecessarios">Tokens Necessários (inicial) *</Label>
                <Input
                  id="tokensNecessarios"
                  name="tokensNecessarios"
                  type="number"
                  value={formData.tokensNecessarios}
                  onChange={handleChange}
                  placeholder="Ex: 1000"
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bairro">Bairro *</Label>
                <Input
                  id="bairro"
                  name="bairro"
                  value={formData.bairro}
                  onChange={handleChange}
                  placeholder="Ex: Centro"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dataLimite">Data Limite *</Label>
                <Input
                  id="dataLimite"
                  name="dataLimite"
                  type="date"
                  value={formData.dataLimite}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="imagem">Imagem do Projeto (Opcional)</Label>
              <Input
                id="imagem"
                name="imagem"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-[#FF5A5F] hover:bg-[#484848]"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando Projeto...
                </>
              ) : (
                'Criar Projeto'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}


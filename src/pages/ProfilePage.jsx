import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'

export const ProfilePage = () => {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [nome, setNome] = useState("")
  const [sobrenome, setSobrenome] = useState("")
  const [celular, setCelular] = useState("")
  const [cep, setCep] = useState("")
  const [endereco, setEndereco] = useState("")
  const [numero, setNumero] = useState("")
  const [complemento, setComplemento] = useState("")
  const [bairro, setBairro] = useState("")
  const [cidade, setCidade] = useState("")
  const [estado, setEstado] = useState("")
  const [fotoPerfilUrl, setFotoPerfilUrl] = useState("")

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return

      setLoading(true)
      const { data, error } = await supabase
        .from("usuarios")
        .select("*, auth_user:auth.users(*)")
        .eq("id", user.id)
        .single()

      if (error) {
        console.error("Erro ao buscar perfil:", error)
        setError("Erro ao carregar seu perfil.")
      } else if (data) {
        setProfile(data)
        setNome(data.nome || "")
        setSobrenome(data.sobrenome || "")
        setCelular(data.celular || "")
        setCep(data.cep || "")
        setEndereco(data.endereco || "")
        setNumero(data.numero || "")
        setComplemento(data.complemento || "")
        setBairro(data.bairro || "")
        setCidade(data.cidade || "")
        setEstado(data.estado || "")
        setFotoPerfilUrl(data.foto_perfil_url || "")
      }
      setLoading(false)
    }

    fetchProfile()
  }, [user])

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setUpdating(true)
    setError("")
    setSuccess("")

    try {
      const updates = {
        nome,
        sobrenome,
        celular,
        cep,
        endereco,
        numero,
        complemento,
        bairro,
        cidade,
        estado,
        foto_perfil_url: fotoPerfilUrl, // Incluir a URL da foto de perfil
      }

      const { error } = await supabase
        .from("usuarios")
        .update(updates)
        .eq("id", user.id)

      if (error) {
        throw error
      } else {
        setSuccess("Perfil atualizado com sucesso!")
      }
    } catch (err) {
      console.error("Erro ao atualizar perfil:", err)
      setError("Erro ao atualizar perfil: " + err.message)
    } finally {
      setUpdating(false)
    }
  }

  const handleFileChange = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    setUpdating(true)
    setError("")
    setSuccess("")

    const fileExt = file.name.split(".").pop()
    const fileName = `${user.id}-${Math.random()}.${fileExt}`
    const filePath = `avatars/${fileName}`

    try {
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { cacheControl: "3600", upsert: false })

      if (uploadError) {
        throw uploadError
      }

      const { data: publicUrlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath)

      if (publicUrlData) {
        setFotoPerfilUrl(publicUrlData.publicUrl)
        // Atualizar o perfil do usuário com a nova URL da foto
        const { error: updateError } = await supabase
          .from("usuarios")
          .update({ foto_perfil_url: publicUrlData.publicUrl })
          .eq("id", user.id)

        if (updateError) {
          throw updateError
        }
        setSuccess("Foto de perfil atualizada com sucesso!")
      }
    } catch (err) {
      console.error("Erro ao fazer upload da foto:", err)
      setError("Erro ao fazer upload da foto: " + err.message)
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando perfil...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-900">Meu Perfil</CardTitle>
          <CardDescription>Gerencie suas informações pessoais e foto de perfil.</CardDescription>
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

          <div className="flex flex-col items-center mb-6">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={fotoPerfilUrl || `https://ui-avatars.com/api/?name=${nome}+${sobrenome}&background=random`} alt={nome} />
              <AvatarFallback>
                {nome?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <Label htmlFor="file-input" className="cursor-pointer text-green-600 hover:text-green-700 font-medium">
              Alterar Foto
            </Label>
            <Input
              id="file-input"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={updating}
            />
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Seu nome"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sobrenome">Sobrenome</Label>
                <Input
                  id="sobrenome"
                  value={sobrenome}
                  onChange={(e) => setSobrenome(e.target.value)}
                  placeholder="Seu sobrenome"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="celular">Celular</Label>
              <Input
                id="celular"
                value={celular}
                onChange={(e) => setCelular(e.target.value)}
                placeholder="(XX) XXXXX-XXXX"
                required
              />
            </div>

            {/* Seção de Moedas/Tokens */}
            <div className="border-t pt-6 mt-6">
              <div className="bg-gradient-to-r from-[#FF5A5F] to-[#484848] p-6 rounded-lg text-white mb-6">
                <h3 className="text-xl font-bold mb-2">Seus Tokens $RAIZ</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold">{profile?.tokens_disponiveis || 0}</p>
                    <p className="text-sm opacity-90">Tokens disponíveis</p>
                  </div>
                  <Button 
                    type="button" 
                    className="bg-white text-[#FF5A5F] hover:bg-gray-100 font-semibold px-6 py-2"
                    onClick={() => window.open('https://checkout.stripe.com/pay/cs_test_example', '_blank')}
                  >
                    Comprar Tokens
                  </Button>
                </div>
                <div className="mt-4 text-sm opacity-90">
                  <p>• Use tokens para apoiar projetos da sua comunidade</p>
                  <p>• Cada token representa R$ 1,00 de apoio</p>
                  <p>• Compre tokens com segurança via integração de pagamento</p>
                </div>
              </div>
            </div>

            <div className="border-t pt-6 mt-6">
              <h3 className="text-lg font-medium mb-4">Endereço</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cep">CEP</Label>
                  <Input
                    id="cep"
                    value={cep}
                    onChange={(e) => setCep(e.target.value)}
                    placeholder="XXXXX-XXX"
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="endereco">Endereço</Label>
                  <Input
                    id="endereco"
                    value={endereco}
                    onChange={(e) => setEndereco(e.target.value)}
                    placeholder="Rua, Avenida, etc."
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="numero">Número</Label>
                  <Input
                    id="numero"
                    value={numero}
                    onChange={(e) => setNumero(e.target.value)}
                    placeholder="123"
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="complemento">Complemento</Label>
                  <Input
                    id="complemento"
                    value={complemento}
                    onChange={(e) => setComplemento(e.target.value)}
                    placeholder="Apto, Bloco, etc."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="bairro">Bairro</Label>
                  <Input
                    id="bairro"
                    value={bairro}
                    onChange={(e) => setBairro(e.target.value)}
                    placeholder="Seu bairro"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cidade">Cidade</Label>
                  <Input
                    id="cidade"
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                    placeholder="Sua cidade"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estado">Estado</Label>
                  <Input
                    id="estado"
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                    placeholder="UF"
                    maxLength={2}
                    required
                  />
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-[#FF5A5F] hover:bg-[#484848]"
              disabled={updating}
            >
              {updating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Atualizando...
                </>
              ) : (
                'Atualizar Perfil'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}


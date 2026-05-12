'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Truck, Shield, Smartphone, Eye, EyeOff, Loader as Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useStore()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState('admin')
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const success = await login(formData.email, formData.password)
      if (success) {
        toast.success('Login realizado com sucesso!')
        if (activeTab === 'driver') {
          router.push('/motorista')
        } else {
          router.push('/dashboard')
        }
      } else {
        toast.error('Credenciais inválidas')
      }
    } catch {
      toast.error('Erro ao realizar login')
    } finally {
      setIsLoading(false)
    }
  }

  const features = [
    {
      icon: <Truck className="h-6 w-6" />,
      title: 'Gestão Completa',
      description: 'Controle total da sua frota em uma única plataforma',
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Segurança',
      description: 'Dados protegidos com criptografia de ponta',
    },
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: 'Acesso Mobile',
      description: 'Motoristas podem acessar de qualquer lugar',
    },
  ]

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" />
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>
        
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
              <Truck className="h-7 w-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">OLIVEIRA FROTAS</h1>
              <p className="text-sm text-muted-foreground">Gestão de Frotas</p>
            </div>
          </div>
          
          <h2 className="text-4xl xl:text-5xl font-bold text-foreground mb-6 leading-tight text-balance">
            Gerencie sua frota com{' '}
            <span className="text-primary">inteligência</span>
          </h2>
          
          <p className="text-lg text-muted-foreground mb-12 max-w-md">
            Controle completo de veículos, motoristas, manutenções e rotas em uma plataforma moderna e intuitiva.
          </p>
          
          <div className="space-y-6">
            {features.map((feature, index) => (
              <div key={index} className={`flex items-start gap-4 animate-slide-up stagger-${index + 1}`}>
                <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center text-primary shrink-0 transition-transform hover:scale-110">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex items-center justify-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Truck className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">OLIVEIRA FROTAS</h1>
          </div>

          <Card className="border-border/50 shadow-2xl animate-scale-in">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl">Bem-vindo de volta</CardTitle>
              <CardDescription>
                Faça login para acessar o sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="admin">Administração</TabsTrigger>
                  <TabsTrigger value="driver">Motorista</TabsTrigger>
                </TabsList>
                
                <TabsContent value="admin">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="h-11"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password">Senha</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          required
                          className="h-11 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded border-border" />
                        <span className="text-muted-foreground">Lembrar-me</span>
                      </label>
                      <button type="button" className="text-primary hover:underline">
                        Esqueci a senha
                      </button>
                    </div>

                    <Button type="submit" className="w-full h-11" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Entrando...
                        </>
                      ) : (
                        'Entrar'
                      )}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="driver">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="driver-email">E-mail ou CPF</Label>
                      <Input
                        id="driver-email"
                        type="text"
                        placeholder="seu@email.com ou 000.000.000-00"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="h-11"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="driver-password">Senha</Label>
                      <div className="relative">
                        <Input
                          id="driver-password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          required
                          className="h-11 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <Button type="submit" className="w-full h-11" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Entrando...
                        </>
                      ) : (
                        'Acessar Portal do Motorista'
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              <div className="mt-6 p-4 rounded-lg bg-secondary/50 border border-border/50">
                <p className="text-xs text-muted-foreground text-center">
                  <strong className="text-foreground">Demo:</strong> Use qualquer e-mail e senha para acessar.
                  <br />
                  Para admin: admin@empresa.com | Para motorista: driver@empresa.com
                </p>
              </div>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground mt-6">
            &copy; 2025 OLIVEIRA FROTAS. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  )
}

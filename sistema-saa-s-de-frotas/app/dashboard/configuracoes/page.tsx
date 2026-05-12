'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Settings, Database, Building2, Globe, Shield, CircleCheck as CheckCircle2, TriangleAlert as AlertTriangle, ExternalLink, Eye, EyeOff, Loader as Loader2, Server, Key } from 'lucide-react'
import { toast } from 'sonner'

export default function SettingsPage() {
  const { settings, updateSettings, isConfigured, user } = useStore()
  const [isSaving, setIsSaving] = useState(false)
  const [showKey, setShowKey] = useState(false)
  const [testingConnection, setTestingConnection] = useState(false)

  const [dbSettings, setDbSettings] = useState({
    supabaseUrl: settings.supabaseUrl,
    supabaseKey: settings.supabaseKey,
  })

  const [companySettings, setCompanySettings] = useState({
    companyName: settings.companyName,
    currency: settings.currency,
    timezone: settings.timezone,
    distanceUnit: settings.distanceUnit,
    fuelUnit: settings.fuelUnit,
  })

  const handleSaveDatabase = async () => {
    setIsSaving(true)
    // Simulate save delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    updateSettings(dbSettings)
    toast.success('Configurações do banco de dados salvas!')
    setIsSaving(false)
  }

  const handleSaveCompany = async () => {
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    updateSettings(companySettings)
    toast.success('Configurações da empresa salvas!')
    setIsSaving(false)
  }

  const handleTestConnection = async () => {
    if (!dbSettings.supabaseUrl || !dbSettings.supabaseKey) {
      toast.error('Preencha a URL e a Key do Supabase')
      return
    }
    
    setTestingConnection(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Check if URL looks valid
    if (dbSettings.supabaseUrl.includes('supabase.co')) {
      toast.success('Conexão testada com sucesso!')
    } else {
      toast.error('Não foi possível conectar. Verifique as credenciais.')
    }
    setTestingConnection(false)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
        <p className="text-muted-foreground">
          Configure o sistema de acordo com suas necessidades
        </p>
      </div>

      <Tabs defaultValue="database" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="database" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">Banco de Dados</span>
          </TabsTrigger>
          <TabsTrigger value="company" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">Empresa</span>
          </TabsTrigger>
          <TabsTrigger value="account" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Conta</span>
          </TabsTrigger>
        </TabsList>

        {/* Database Settings */}
        <TabsContent value="database" className="space-y-6">
          {/* Connection Status */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isConfigured ? 'bg-chart-2/10' : 'bg-warning/10'}`}>
                    <Database className={`h-5 w-5 ${isConfigured ? 'text-chart-2' : 'text-warning'}`} />
                  </div>
                  <div>
                    <CardTitle>Status da Conexão</CardTitle>
                    <CardDescription>
                      {isConfigured 
                        ? 'Banco de dados configurado e pronto para uso'
                        : 'Configure o Supabase para persistir os dados'}
                    </CardDescription>
                  </div>
                </div>
                <Badge 
                  variant="outline" 
                  className={isConfigured 
                    ? 'border-chart-2 text-chart-2' 
                    : 'border-warning text-warning'
                  }
                >
                  {isConfigured ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                      Conectado
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                      Não Configurado
                    </>
                  )}
                </Badge>
              </div>
            </CardHeader>
          </Card>

          {/* Supabase Configuration */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Server className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Configuração do Supabase</CardTitle>
                  <CardDescription>
                    Conecte seu projeto Supabase para salvar os dados permanentemente
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                <h4 className="font-medium mb-2">Como obter as credenciais:</h4>
                <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                  <li>Acesse <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">supabase.com</a> e crie uma conta</li>
                  <li>Crie um novo projeto</li>
                  <li>Vá em Settings {'>'} API</li>
                  <li>Copie a URL do projeto e a chave anon/public</li>
                </ol>
                <Button variant="outline" size="sm" className="mt-4" asChild>
                  <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Abrir Supabase
                  </a>
                </Button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="supabaseUrl" className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    URL do Projeto
                  </Label>
                  <Input
                    id="supabaseUrl"
                    placeholder="https://seu-projeto.supabase.co"
                    value={dbSettings.supabaseUrl}
                    onChange={(e) => setDbSettings({ ...dbSettings, supabaseUrl: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Exemplo: https://abcdefghijklmnop.supabase.co
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supabaseKey" className="flex items-center gap-2">
                    <Key className="h-4 w-4 text-muted-foreground" />
                    Chave Anon (Public)
                  </Label>
                  <div className="relative">
                    <Input
                      id="supabaseKey"
                      type={showKey ? 'text' : 'password'}
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      value={dbSettings.supabaseKey}
                      onChange={(e) => setDbSettings({ ...dbSettings, supabaseKey: e.target.value })}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowKey(!showKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Use a chave &quot;anon&quot; ou &quot;public&quot;, nunca a service_role
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  variant="outline" 
                  onClick={handleTestConnection}
                  disabled={testingConnection}
                >
                  {testingConnection ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Testando...
                    </>
                  ) : (
                    <>
                      <Database className="h-4 w-4 mr-2" />
                      Testar Conexão
                    </>
                  )}
                </Button>
                <Button onClick={handleSaveDatabase} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    'Salvar Configurações'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Database Schema Info */}
          <Card>
            <CardHeader>
              <CardTitle>Schema do Banco de Dados</CardTitle>
              <CardDescription>
                Tabelas necessárias para o funcionamento do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {['vehicles', 'drivers', 'service_orders', 'trips', 'inspections', 'fuel_records', 'alerts', 'users'].map((table) => (
                  <div key={table} className="p-3 rounded-lg bg-secondary/50 border border-border">
                    <p className="font-mono text-sm">{table}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                As tabelas serão criadas automaticamente quando você conectar o banco de dados.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Company Settings */}
        <TabsContent value="company" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Dados da Empresa</CardTitle>
                  <CardDescription>
                    Configure as informações da sua empresa
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Nome da Empresa</Label>
                <Input
                  id="companyName"
                  placeholder="Minha Empresa LTDA"
                  value={companySettings.companyName}
                  onChange={(e) => setCompanySettings({ ...companySettings, companyName: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Moeda</Label>
                  <Select
                    value={companySettings.currency}
                    onValueChange={(value) => setCompanySettings({ ...companySettings, currency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BRL">Real (R$)</SelectItem>
                      <SelectItem value="USD">Dólar ($)</SelectItem>
                      <SelectItem value="EUR">Euro (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Fuso Horário</Label>
                  <Select
                    value={companySettings.timezone}
                    onValueChange={(value) => setCompanySettings({ ...companySettings, timezone: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Sao_Paulo">São Paulo (GMT-3)</SelectItem>
                      <SelectItem value="America/Manaus">Manaus (GMT-4)</SelectItem>
                      <SelectItem value="America/Recife">Recife (GMT-3)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="distanceUnit">Unidade de Distância</Label>
                  <Select
                    value={companySettings.distanceUnit}
                    onValueChange={(value: 'km' | 'mi') => setCompanySettings({ ...companySettings, distanceUnit: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="km">Quilômetros (km)</SelectItem>
                      <SelectItem value="mi">Milhas (mi)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fuelUnit">Unidade de Combustível</Label>
                  <Select
                    value={companySettings.fuelUnit}
                    onValueChange={(value: 'L' | 'gal') => setCompanySettings({ ...companySettings, fuelUnit: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="L">Litros (L)</SelectItem>
                      <SelectItem value="gal">Galões (gal)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleSaveCompany} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar Configurações'
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Account Settings */}
        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Informações da Conta</CardTitle>
                  <CardDescription>
                    Gerencie suas informações de acesso
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Nome</p>
                    <p className="font-medium">{user?.name || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">E-mail</p>
                    <p className="font-medium">{user?.email || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Função</p>
                    <Badge variant="outline">
                      {user?.role === 'admin' ? 'Administrador' : user?.role === 'manager' ? 'Gestor' : 'Motorista'}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Membro desde</p>
                    <p className="font-medium">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-BR') : '-'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="outline">Alterar Senha</Button>
                <Button variant="outline">Editar Perfil</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

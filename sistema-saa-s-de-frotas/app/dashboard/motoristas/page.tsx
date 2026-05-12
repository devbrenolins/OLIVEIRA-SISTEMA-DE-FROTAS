'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Users, Plus, Search, MoveHorizontal as MoreHorizontal, CreditCard as Edit, Trash2, Eye, ListFilter as Filter, Phone, Mail, CreditCard, Calendar, Car, MapPin } from 'lucide-react'
import { toast } from 'sonner'
import type { Driver } from '@/lib/types'

const driverStatus = {
  active: { label: 'Ativo', color: 'bg-chart-2/20 text-chart-2' },
  inactive: { label: 'Inativo', color: 'bg-muted text-muted-foreground' },
  on_trip: { label: 'Em Viagem', color: 'bg-primary/20 text-primary' },
  on_leave: { label: 'Afastado', color: 'bg-warning/20 text-warning' },
}

const cnhCategories = ['A', 'B', 'C', 'D', 'E', 'AB', 'AC', 'AD', 'AE'] as const

export default function DriversPage() {
  const { drivers, vehicles, addDriver, updateDriver, deleteDriver } = useStore()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null)
  const [viewingDriver, setViewingDriver] = useState<Driver | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    cnh: '',
    cnhCategory: 'B' as Driver['cnhCategory'],
    cnhExpiry: '',
    status: 'active' as Driver['status'],
    hireDate: '',
  })

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = 
      driver.name.toLowerCase().includes(search.toLowerCase()) ||
      driver.email.toLowerCase().includes(search.toLowerCase()) ||
      driver.cpf.includes(search)
    const matchesStatus = statusFilter === 'all' || driver.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const driverData = {
      ...formData,
      cnhExpiry: new Date(formData.cnhExpiry),
      hireDate: new Date(formData.hireDate),
    }
    if (editingDriver) {
      updateDriver(editingDriver.id, driverData)
      toast.success('Motorista atualizado com sucesso!')
    } else {
      addDriver(driverData)
      toast.success('Motorista adicionado com sucesso!')
    }
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      cpf: '',
      cnh: '',
      cnhCategory: 'B',
      cnhExpiry: '',
      status: 'active',
      hireDate: '',
    })
    setEditingDriver(null)
    setIsAddDialogOpen(false)
  }

  const handleEdit = (driver: Driver) => {
    setFormData({
      name: driver.name,
      email: driver.email,
      phone: driver.phone,
      cpf: driver.cpf,
      cnh: driver.cnh,
      cnhCategory: driver.cnhCategory,
      cnhExpiry: new Date(driver.cnhExpiry).toISOString().split('T')[0],
      status: driver.status,
      hireDate: new Date(driver.hireDate).toISOString().split('T')[0],
    })
    setEditingDriver(driver)
    setIsAddDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    deleteDriver(id)
    toast.success('Motorista removido com sucesso!')
  }

  const getAssignedVehicle = (driverId: string) => {
    return vehicles.find(v => v.assignedDriverId === driverId)
  }

  const formatCPF = (value: string) => {
    const digits = value.replace(/\D/g, '')
    return digits
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1')
  }

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '')
    return digits
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1')
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Motoristas</h1>
          <p className="text-muted-foreground">
            Gerencie os motoristas da sua frota
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setIsAddDialogOpen(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Motorista
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingDriver ? 'Editar Motorista' : 'Adicionar Novo Motorista'}
              </DialogTitle>
              <DialogDescription>
                Preencha os dados do motorista abaixo
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  placeholder="Ex: João Silva"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@exemplo.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    placeholder="(00) 00000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: formatPhone(e.target.value) })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    placeholder="000.000.000-00"
                    value={formData.cpf}
                    onChange={(e) => setFormData({ ...formData, cpf: formatCPF(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cnh">CNH</Label>
                  <Input
                    id="cnh"
                    placeholder="00000000000"
                    value={formData.cnh}
                    onChange={(e) => setFormData({ ...formData, cnh: e.target.value.replace(/\D/g, '').slice(0, 11) })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cnhCategory">Categoria CNH</Label>
                  <Select
                    value={formData.cnhCategory}
                    onValueChange={(value) => setFormData({ ...formData, cnhCategory: value as Driver['cnhCategory'] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {cnhCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cnhExpiry">Validade CNH</Label>
                  <Input
                    id="cnhExpiry"
                    type="date"
                    value={formData.cnhExpiry}
                    onChange={(e) => setFormData({ ...formData, cnhExpiry: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value as Driver['status'] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(driverStatus).map(([key, { label }]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hireDate">Data de Contratação</Label>
                  <Input
                    id="hireDate"
                    type="date"
                    value={formData.hireDate}
                    onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingDriver ? 'Salvar Alterações' : 'Adicionar Motorista'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{drivers.length}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-chart-2/10">
                <Users className="h-5 w-5 text-chart-2" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {drivers.filter(d => d.status === 'active').length}
                </p>
                <p className="text-sm text-muted-foreground">Ativos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-chart-5/10">
                <MapPin className="h-5 w-5 text-chart-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {drivers.filter(d => d.status === 'on_trip').length}
                </p>
                <p className="text-sm text-muted-foreground">Em Viagem</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <Calendar className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {drivers.filter(d => {
                    const expiry = new Date(d.cnhExpiry)
                    const now = new Date()
                    const diff = expiry.getTime() - now.getTime()
                    return diff < 90 * 24 * 60 * 60 * 1000 && diff > 0
                  }).length}
                </p>
                <p className="text-sm text-muted-foreground">CNH a Vencer</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, email ou CPF..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {Object.entries(driverStatus).map(([key, { label }]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/50">
                  <TableHead>Motorista</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>CNH</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Veículo</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDrivers.map((driver) => {
                  const status = driverStatus[driver.status]
                  const assignedVehicle = getAssignedVehicle(driver.id)
                  return (
                    <TableRow key={driver.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              {driver.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{driver.name}</p>
                            <p className="text-sm text-muted-foreground">{driver.cpf}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                            {driver.email}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Phone className="h-3.5 w-3.5" />
                            {driver.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1">
                            <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-sm font-medium">Cat. {driver.cnhCategory}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Venc: {new Date(driver.cnhExpiry).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${status.color} border-0`}>
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {assignedVehicle ? (
                          <div className="flex items-center gap-1 text-sm">
                            <Car className="h-4 w-4 text-muted-foreground" />
                            {assignedVehicle.plate}
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setViewingDriver(driver)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Ver detalhes
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(driver)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(driver.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {filteredDrivers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Users className="h-8 w-8 opacity-50" />
                        <p>Nenhum motorista encontrado</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Driver Details Dialog */}
      <Dialog open={!!viewingDriver} onOpenChange={() => setViewingDriver(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detalhes do Motorista</DialogTitle>
          </DialogHeader>
          {viewingDriver && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                    {viewingDriver.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold">{viewingDriver.name}</h3>
                  <p className="text-muted-foreground">{viewingDriver.cpf}</p>
                </div>
                <Badge className={`ml-auto ${driverStatus[viewingDriver.status].color} border-0`}>
                  {driverStatus[viewingDriver.status].label}
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">E-mail</span>
                  </div>
                  <p className="font-medium">{viewingDriver.email}</p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Telefone</span>
                  </div>
                  <p className="font-medium">{viewingDriver.phone}</p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">CNH</span>
                  </div>
                  <p className="font-medium">Cat. {viewingDriver.cnhCategory}</p>
                  <p className="text-sm text-muted-foreground">
                    Venc: {new Date(viewingDriver.cnhExpiry).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Contratação</span>
                  </div>
                  <p className="font-medium">
                    {new Date(viewingDriver.hireDate).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setViewingDriver(null)}>
                  Fechar
                </Button>
                <Button onClick={() => {
                  setViewingDriver(null)
                  handleEdit(viewingDriver)
                }}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

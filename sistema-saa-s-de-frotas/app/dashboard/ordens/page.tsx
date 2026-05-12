'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
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
import { Wrench, Plus, Search, MoveHorizontal as MoreHorizontal, CreditCard as Edit, Trash2, Eye, ListFilter as Filter, Calendar, Clock, CircleCheck as CheckCircle2, TriangleAlert as AlertTriangle, CircleDot, Circle as XCircle, Car } from 'lucide-react'
import { toast } from 'sonner'
import type { ServiceOrder } from '@/lib/types'

const orderTypes = {
  preventive: { label: 'Preventiva', color: 'bg-chart-2/20 text-chart-2' },
  corrective: { label: 'Corretiva', color: 'bg-warning/20 text-warning' },
  inspection: { label: 'Inspeção', color: 'bg-info/20 text-info' },
}

const orderStatus = {
  pending: { label: 'Pendente', color: 'bg-muted text-muted-foreground', icon: Clock },
  in_progress: { label: 'Em Andamento', color: 'bg-primary/20 text-primary', icon: CircleDot },
  completed: { label: 'Concluída', color: 'bg-chart-2/20 text-chart-2', icon: CheckCircle2 },
  cancelled: { label: 'Cancelada', color: 'bg-destructive/20 text-destructive', icon: XCircle },
}

const orderPriority = {
  low: { label: 'Baixa', color: 'border-muted-foreground text-muted-foreground' },
  medium: { label: 'Média', color: 'border-info text-info' },
  high: { label: 'Alta', color: 'border-warning text-warning' },
  urgent: { label: 'Urgente', color: 'border-destructive text-destructive' },
}

export default function ServiceOrdersPage() {
  const { serviceOrders, vehicles, addServiceOrder, updateServiceOrder } = useStore()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingOrder, setEditingOrder] = useState<ServiceOrder | null>(null)
  const [viewingOrder, setViewingOrder] = useState<ServiceOrder | null>(null)

  const [formData, setFormData] = useState({
    vehicleId: '',
    type: 'preventive' as ServiceOrder['type'],
    status: 'pending' as ServiceOrder['status'],
    priority: 'medium' as ServiceOrder['priority'],
    title: '',
    description: '',
    scheduledDate: '',
    cost: 0,
    odometerAtService: 0,
  })

  const filteredOrders = serviceOrders.filter(order => {
    const vehicle = vehicles.find(v => v.id === order.vehicleId)
    const matchesSearch = 
      order.title.toLowerCase().includes(search.toLowerCase()) ||
      vehicle?.plate.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const orderData = {
      ...formData,
      scheduledDate: new Date(formData.scheduledDate),
      createdById: 'admin',
    }
    if (editingOrder) {
      updateServiceOrder(editingOrder.id, orderData)
      toast.success('Ordem de serviço atualizada!')
    } else {
      addServiceOrder(orderData)
      toast.success('Ordem de serviço criada!')
    }
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      vehicleId: '',
      type: 'preventive',
      status: 'pending',
      priority: 'medium',
      title: '',
      description: '',
      scheduledDate: '',
      cost: 0,
      odometerAtService: 0,
    })
    setEditingOrder(null)
    setIsAddDialogOpen(false)
  }

  const handleEdit = (order: ServiceOrder) => {
    setFormData({
      vehicleId: order.vehicleId,
      type: order.type,
      status: order.status,
      priority: order.priority,
      title: order.title,
      description: order.description,
      scheduledDate: new Date(order.scheduledDate).toISOString().split('T')[0],
      cost: order.cost || 0,
      odometerAtService: order.odometerAtService || 0,
    })
    setEditingOrder(order)
    setIsAddDialogOpen(true)
  }

  const pendingCount = serviceOrders.filter(o => o.status === 'pending').length
  const inProgressCount = serviceOrders.filter(o => o.status === 'in_progress').length
  const completedCount = serviceOrders.filter(o => o.status === 'completed').length
  const urgentCount = serviceOrders.filter(o => o.priority === 'urgent' && o.status !== 'completed').length

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Ordens de Serviço</h1>
          <p className="text-muted-foreground">
            Gerencie manutenções e reparos dos veículos
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setIsAddDialogOpen(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Ordem
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingOrder ? 'Editar Ordem de Serviço' : 'Nova Ordem de Serviço'}
              </DialogTitle>
              <DialogDescription>
                Preencha os dados da ordem de serviço
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="vehicle">Veículo</Label>
                <Select
                  value={formData.vehicleId}
                  onValueChange={(value) => setFormData({ ...formData, vehicleId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um veículo" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.plate} - {vehicle.brand} {vehicle.model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  placeholder="Ex: Troca de óleo"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value as ServiceOrder['type'] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(orderTypes).map(([key, { label }]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Prioridade</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => setFormData({ ...formData, priority: value as ServiceOrder['priority'] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(orderPriority).map(([key, { label }]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value as ServiceOrder['status'] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(orderStatus).map(([key, { label }]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scheduledDate">Data Agendada</Label>
                  <Input
                    id="scheduledDate"
                    type="date"
                    value={formData.scheduledDate}
                    onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cost">Custo Estimado (R$)</Label>
                  <Input
                    id="cost"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="odometer">Hodômetro (km)</Label>
                  <Input
                    id="odometer"
                    type="number"
                    min="0"
                    value={formData.odometerAtService}
                    onChange={(e) => setFormData({ ...formData, odometerAtService: parseInt(e.target.value) })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  placeholder="Descreva o serviço a ser realizado..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingOrder ? 'Salvar Alterações' : 'Criar Ordem'}
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
              <div className="p-2 rounded-lg bg-muted">
                <Clock className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingCount}</p>
                <p className="text-sm text-muted-foreground">Pendentes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <CircleDot className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{inProgressCount}</p>
                <p className="text-sm text-muted-foreground">Em Andamento</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-chart-2/10">
                <CheckCircle2 className="h-5 w-5 text-chart-2" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completedCount}</p>
                <p className="text-sm text-muted-foreground">Concluídas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">{urgentCount}</p>
                <p className="text-sm text-muted-foreground">Urgentes</p>
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
                placeholder="Buscar por título ou placa..."
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
                {Object.entries(orderStatus).map(([key, { label }]) => (
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
                  <TableHead>Ordem</TableHead>
                  <TableHead>Veículo</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Prioridade</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => {
                  const vehicle = vehicles.find(v => v.id === order.vehicleId)
                  const type = orderTypes[order.type]
                  const status = orderStatus[order.status]
                  const priority = orderPriority[order.priority]
                  const StatusIcon = status.icon
                  return (
                    <TableRow key={order.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.title}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {order.description}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {vehicle ? (
                          <div className="flex items-center gap-2">
                            <Car className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{vehicle.plate}</span>
                          </div>
                        ) : '-'}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${type.color} border-0`}>
                          {type.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${status.color} border-0`}>
                          <StatusIcon className="h-3.5 w-3.5 mr-1" />
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={priority.color}>
                          {priority.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {new Date(order.scheduledDate).toLocaleDateString('pt-BR')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setViewingOrder(order)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Ver detalhes
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(order)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {filteredOrders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Wrench className="h-8 w-8 opacity-50" />
                        <p>Nenhuma ordem de serviço encontrada</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={!!viewingOrder} onOpenChange={() => setViewingOrder(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detalhes da Ordem de Serviço</DialogTitle>
          </DialogHeader>
          {viewingOrder && (
            <div className="space-y-6">
              {(() => {
                const vehicle = vehicles.find(v => v.id === viewingOrder.vehicleId)
                const type = orderTypes[viewingOrder.type]
                const status = orderStatus[viewingOrder.status]
                const priority = orderPriority[viewingOrder.priority]
                return (
                  <>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold">{viewingOrder.title}</h3>
                        <p className="text-muted-foreground">
                          {vehicle?.plate} - {vehicle?.brand} {vehicle?.model}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={`${type.color} border-0`}>{type.label}</Badge>
                        <Badge className={`${status.color} border-0`}>{status.label}</Badge>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-secondary/50">
                      <p className="text-sm">{viewingOrder.description}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-secondary/50">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Data Agendada</span>
                        </div>
                        <p className="font-medium">
                          {new Date(viewingOrder.scheduledDate).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-secondary/50">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Prioridade</span>
                        </div>
                        <Badge variant="outline" className={priority.color}>
                          {priority.label}
                        </Badge>
                      </div>
                      {viewingOrder.cost && (
                        <div className="p-4 rounded-lg bg-secondary/50">
                          <p className="text-sm text-muted-foreground mb-2">Custo</p>
                          <p className="text-lg font-semibold">
                            R$ {viewingOrder.cost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                      )}
                      {viewingOrder.odometerAtService && (
                        <div className="p-4 rounded-lg bg-secondary/50">
                          <p className="text-sm text-muted-foreground mb-2">Hodômetro</p>
                          <p className="text-lg font-semibold">
                            {viewingOrder.odometerAtService.toLocaleString('pt-BR')} km
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setViewingOrder(null)}>
                        Fechar
                      </Button>
                      <Button onClick={() => {
                        setViewingOrder(null)
                        handleEdit(viewingOrder)
                      }}>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                    </div>
                  </>
                )
              })()}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

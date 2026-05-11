'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
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
import {
  MapPin,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Eye,
  Filter,
  Calendar,
  Clock,
  CheckCircle2,
  CircleDot,
  XCircle,
  Car,
  User,
  Navigation,
  ArrowRight,
} from 'lucide-react'
import { toast } from 'sonner'
import type { Trip } from '@/lib/types'

const tripStatus = {
  scheduled: { label: 'Agendada', color: 'bg-muted text-muted-foreground', icon: Clock },
  in_progress: { label: 'Em Andamento', color: 'bg-primary/20 text-primary', icon: CircleDot },
  completed: { label: 'Concluída', color: 'bg-chart-2/20 text-chart-2', icon: CheckCircle2 },
  cancelled: { label: 'Cancelada', color: 'bg-destructive/20 text-destructive', icon: XCircle },
}

export default function TripsPage() {
  const { trips, vehicles, drivers, addTrip, updateTrip } = useStore()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null)
  const [viewingTrip, setViewingTrip] = useState<Trip | null>(null)

  const [formData, setFormData] = useState({
    vehicleId: '',
    driverId: '',
    status: 'scheduled' as Trip['status'],
    originAddress: '',
    destinationAddress: '',
    scheduledStart: '',
    scheduledEnd: '',
  })

  const filteredTrips = trips.filter(trip => {
    const vehicle = vehicles.find(v => v.id === trip.vehicleId)
    const driver = drivers.find(d => d.id === trip.driverId)
    const matchesSearch = 
      vehicle?.plate.toLowerCase().includes(search.toLowerCase()) ||
      driver?.name.toLowerCase().includes(search.toLowerCase()) ||
      trip.destination.address.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || trip.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const tripData = {
      vehicleId: formData.vehicleId,
      driverId: formData.driverId,
      status: formData.status,
      origin: { address: formData.originAddress, lat: 0, lng: 0 },
      destination: { address: formData.destinationAddress, lat: 0, lng: 0 },
      scheduledStart: new Date(formData.scheduledStart),
      scheduledEnd: new Date(formData.scheduledEnd),
    }
    if (editingTrip) {
      updateTrip(editingTrip.id, tripData)
      toast.success('Viagem atualizada!')
    } else {
      addTrip(tripData)
      toast.success('Viagem agendada!')
    }
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      vehicleId: '',
      driverId: '',
      status: 'scheduled',
      originAddress: '',
      destinationAddress: '',
      scheduledStart: '',
      scheduledEnd: '',
    })
    setEditingTrip(null)
    setIsAddDialogOpen(false)
  }

  const handleEdit = (trip: Trip) => {
    setFormData({
      vehicleId: trip.vehicleId,
      driverId: trip.driverId,
      status: trip.status,
      originAddress: trip.origin.address,
      destinationAddress: trip.destination.address,
      scheduledStart: new Date(trip.scheduledStart).toISOString().slice(0, 16),
      scheduledEnd: new Date(trip.scheduledEnd).toISOString().slice(0, 16),
    })
    setEditingTrip(trip)
    setIsAddDialogOpen(true)
  }

  const scheduledCount = trips.filter(t => t.status === 'scheduled').length
  const inProgressCount = trips.filter(t => t.status === 'in_progress').length
  const completedCount = trips.filter(t => t.status === 'completed').length

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Viagens</h1>
          <p className="text-muted-foreground">
            Planeje e acompanhe as viagens da frota
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setIsAddDialogOpen(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Viagem
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingTrip ? 'Editar Viagem' : 'Agendar Nova Viagem'}
              </DialogTitle>
              <DialogDescription>
                Preencha os dados da viagem
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicle">Veículo</Label>
                  <Select
                    value={formData.vehicleId}
                    onValueChange={(value) => setFormData({ ...formData, vehicleId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicles.filter(v => v.status === 'available').map((vehicle) => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                          {vehicle.plate}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="driver">Motorista</Label>
                  <Select
                    value={formData.driverId}
                    onValueChange={(value) => setFormData({ ...formData, driverId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {drivers.filter(d => d.status === 'active').map((driver) => (
                        <SelectItem key={driver.id} value={driver.id}>
                          {driver.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="origin">Origem</Label>
                <Input
                  id="origin"
                  placeholder="Endereço de origem"
                  value={formData.originAddress}
                  onChange={(e) => setFormData({ ...formData, originAddress: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="destination">Destino</Label>
                <Input
                  id="destination"
                  placeholder="Endereço de destino"
                  value={formData.destinationAddress}
                  onChange={(e) => setFormData({ ...formData, destinationAddress: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start">Saída</Label>
                  <Input
                    id="start"
                    type="datetime-local"
                    value={formData.scheduledStart}
                    onChange={(e) => setFormData({ ...formData, scheduledStart: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end">Chegada Prevista</Label>
                  <Input
                    id="end"
                    type="datetime-local"
                    value={formData.scheduledEnd}
                    onChange={(e) => setFormData({ ...formData, scheduledEnd: e.target.value })}
                    required
                  />
                </div>
              </div>
              {editingTrip && (
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value as Trip['status'] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(tripStatus).map(([key, { label }]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <DialogFooter>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingTrip ? 'Salvar Alterações' : 'Agendar Viagem'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{trips.length}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted">
                <Clock className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{scheduledCount}</p>
                <p className="text-sm text-muted-foreground">Agendadas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-chart-5/10">
                <Navigation className="h-5 w-5 text-chart-5" />
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
      </div>

      {/* Map Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5 text-primary" />
            Mapa de Viagens em Tempo Real
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] rounded-lg bg-secondary/50 border border-border flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-muted-foreground">
                Integração com mapa será disponibilizada após configurar o banco de dados
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {inProgressCount} viagem(s) em andamento
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por placa, motorista ou destino..."
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
                {Object.entries(tripStatus).map(([key, { label }]) => (
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
                  <TableHead>Rota</TableHead>
                  <TableHead>Veículo</TableHead>
                  <TableHead>Motorista</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Horário</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTrips.map((trip) => {
                  const vehicle = vehicles.find(v => v.id === trip.vehicleId)
                  const driver = drivers.find(d => d.id === trip.driverId)
                  const status = tripStatus[trip.status]
                  const StatusIcon = status.icon
                  return (
                    <TableRow key={trip.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm truncate">{trip.origin.address}</p>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <ArrowRight className="h-3 w-3 shrink-0" />
                              <p className="text-sm truncate">{trip.destination.address}</p>
                            </div>
                          </div>
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
                        {driver ? (
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{driver.name}</span>
                          </div>
                        ) : '-'}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${status.color} border-0`}>
                          <StatusIcon className="h-3.5 w-3.5 mr-1" />
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                            {new Date(trip.scheduledStart).toLocaleDateString('pt-BR')}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {new Date(trip.scheduledStart).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            {' - '}
                            {new Date(trip.scheduledEnd).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </div>
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
                            <DropdownMenuItem onClick={() => setViewingTrip(trip)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Ver detalhes
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(trip)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {filteredTrips.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <MapPin className="h-8 w-8 opacity-50" />
                        <p>Nenhuma viagem encontrada</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Trip Details Dialog */}
      <Dialog open={!!viewingTrip} onOpenChange={() => setViewingTrip(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detalhes da Viagem</DialogTitle>
          </DialogHeader>
          {viewingTrip && (
            <div className="space-y-6">
              {(() => {
                const vehicle = vehicles.find(v => v.id === viewingTrip.vehicleId)
                const driver = drivers.find(d => d.id === viewingTrip.driverId)
                const status = tripStatus[viewingTrip.status]
                return (
                  <>
                    <div className="flex items-center justify-between">
                      <Badge className={`${status.color} border-0`}>{status.label}</Badge>
                      <div className="text-sm text-muted-foreground">
                        {new Date(viewingTrip.scheduledStart).toLocaleDateString('pt-BR')}
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-secondary/50 space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-3 h-3 rounded-full bg-chart-2 mt-1.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Origem</p>
                          <p className="font-medium">{viewingTrip.origin.address}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-3 h-3 rounded-full bg-primary mt-1.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Destino</p>
                          <p className="font-medium">{viewingTrip.destination.address}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-secondary/50">
                        <div className="flex items-center gap-2 mb-2">
                          <Car className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Veículo</span>
                        </div>
                        <p className="font-medium">{vehicle?.plate}</p>
                        <p className="text-sm text-muted-foreground">{vehicle?.brand} {vehicle?.model}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-secondary/50">
                        <div className="flex items-center gap-2 mb-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Motorista</span>
                        </div>
                        <p className="font-medium">{driver?.name}</p>
                        <p className="text-sm text-muted-foreground">{driver?.phone}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-secondary/50">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Saída</span>
                        </div>
                        <p className="font-medium">
                          {new Date(viewingTrip.scheduledStart).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-secondary/50">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Chegada Prevista</span>
                        </div>
                        <p className="font-medium">
                          {new Date(viewingTrip.scheduledEnd).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setViewingTrip(null)}>
                        Fechar
                      </Button>
                      <Button onClick={() => {
                        setViewingTrip(null)
                        handleEdit(viewingTrip)
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

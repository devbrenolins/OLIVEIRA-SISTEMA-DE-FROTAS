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
  Car,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Truck,
  Filter,
  SortAsc,
  Wrench,
  Calendar,
  Gauge,
} from 'lucide-react'
import { toast } from 'sonner'
import type { Vehicle } from '@/lib/types'

const vehicleTypes = {
  car: 'Carro',
  truck: 'Caminhão',
  van: 'Van',
  motorcycle: 'Moto',
  bus: 'Ônibus',
}

const vehicleStatus = {
  available: { label: 'Disponível', color: 'bg-chart-2/20 text-chart-2' },
  in_use: { label: 'Em Uso', color: 'bg-primary/20 text-primary' },
  maintenance: { label: 'Manutenção', color: 'bg-warning/20 text-warning' },
  inactive: { label: 'Inativo', color: 'bg-muted text-muted-foreground' },
}

const fuelTypes = {
  gasoline: 'Gasolina',
  diesel: 'Diesel',
  electric: 'Elétrico',
  hybrid: 'Híbrido',
  ethanol: 'Etanol',
}

export default function VehiclesPage() {
  const { vehicles, drivers, addVehicle, updateVehicle, deleteVehicle } = useStore()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null)
  const [viewingVehicle, setViewingVehicle] = useState<Vehicle | null>(null)

  const [formData, setFormData] = useState({
    plate: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    type: 'car' as Vehicle['type'],
    status: 'available' as Vehicle['status'],
    fuelType: 'gasoline' as Vehicle['fuelType'],
    currentOdometer: 0,
  })

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = 
      vehicle.plate.toLowerCase().includes(search.toLowerCase()) ||
      vehicle.brand.toLowerCase().includes(search.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingVehicle) {
      updateVehicle(editingVehicle.id, formData)
      toast.success('Veículo atualizado com sucesso!')
    } else {
      addVehicle(formData)
      toast.success('Veículo adicionado com sucesso!')
    }
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      plate: '',
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      type: 'car',
      status: 'available',
      fuelType: 'gasoline',
      currentOdometer: 0,
    })
    setEditingVehicle(null)
    setIsAddDialogOpen(false)
  }

  const handleEdit = (vehicle: Vehicle) => {
    setFormData({
      plate: vehicle.plate,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      type: vehicle.type,
      status: vehicle.status,
      fuelType: vehicle.fuelType,
      currentOdometer: vehicle.currentOdometer,
    })
    setEditingVehicle(vehicle)
    setIsAddDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    deleteVehicle(id)
    toast.success('Veículo removido com sucesso!')
  }

  const getAssignedDriver = (vehicleId: string) => {
    return drivers.find(d => d.assignedVehicleId === vehicleId)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Veículos</h1>
          <p className="text-muted-foreground">
            Gerencie todos os veículos da sua frota
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setIsAddDialogOpen(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Veículo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingVehicle ? 'Editar Veículo' : 'Adicionar Novo Veículo'}
              </DialogTitle>
              <DialogDescription>
                Preencha os dados do veículo abaixo
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="plate">Placa</Label>
                  <Input
                    id="plate"
                    placeholder="ABC-1234"
                    value={formData.plate}
                    onChange={(e) => setFormData({ ...formData, plate: e.target.value.toUpperCase() })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Ano</Label>
                  <Input
                    id="year"
                    type="number"
                    min="1990"
                    max={new Date().getFullYear() + 1}
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand">Marca</Label>
                  <Input
                    id="brand"
                    placeholder="Ex: Volkswagen"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Modelo</Label>
                  <Input
                    id="model"
                    placeholder="Ex: Delivery 11.180"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value as Vehicle['type'] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(vehicleTypes).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fuelType">Combustível</Label>
                  <Select
                    value={formData.fuelType}
                    onValueChange={(value) => setFormData({ ...formData, fuelType: value as Vehicle['fuelType'] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(fuelTypes).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value as Vehicle['status'] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(vehicleStatus).map(([key, { label }]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="odometer">Hodômetro (km)</Label>
                  <Input
                    id="odometer"
                    type="number"
                    min="0"
                    value={formData.currentOdometer}
                    onChange={(e) => setFormData({ ...formData, currentOdometer: parseInt(e.target.value) })}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingVehicle ? 'Salvar Alterações' : 'Adicionar Veículo'}
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
                <Car className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{vehicles.length}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-chart-2/10">
                <Car className="h-5 w-5 text-chart-2" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {vehicles.filter(v => v.status === 'available').length}
                </p>
                <p className="text-sm text-muted-foreground">Disponíveis</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <Wrench className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {vehicles.filter(v => v.status === 'maintenance').length}
                </p>
                <p className="text-sm text-muted-foreground">Em Manutenção</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-chart-5/10">
                <Truck className="h-5 w-5 text-chart-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {vehicles.filter(v => v.status === 'in_use').length}
                </p>
                <p className="text-sm text-muted-foreground">Em Uso</p>
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
                placeholder="Buscar por placa, marca ou modelo..."
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
                {Object.entries(vehicleStatus).map(([key, { label }]) => (
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
                  <TableHead>Veículo</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Motorista</TableHead>
                  <TableHead>Hodômetro</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVehicles.map((vehicle) => {
                  const status = vehicleStatus[vehicle.status]
                  const assignedDriver = getAssignedDriver(vehicle.id)
                  return (
                    <TableRow key={vehicle.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                            <Car className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium">{vehicle.plate}</p>
                            <p className="text-sm text-muted-foreground">
                              {vehicle.brand} {vehicle.model}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{vehicleTypes[vehicle.type]}</span>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${status.color} border-0`}>
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {assignedDriver ? (
                          <span className="text-sm">{assignedDriver.name}</span>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Gauge className="h-4 w-4 text-muted-foreground" />
                          {vehicle.currentOdometer.toLocaleString('pt-BR')} km
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
                            <DropdownMenuItem onClick={() => setViewingVehicle(vehicle)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Ver detalhes
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(vehicle)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(vehicle.id)}
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
                {filteredVehicles.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Car className="h-8 w-8 opacity-50" />
                        <p>Nenhum veículo encontrado</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Details Dialog */}
      <Dialog open={!!viewingVehicle} onOpenChange={() => setViewingVehicle(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detalhes do Veículo</DialogTitle>
          </DialogHeader>
          {viewingVehicle && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-secondary flex items-center justify-center">
                  <Car className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{viewingVehicle.plate}</h3>
                  <p className="text-muted-foreground">
                    {viewingVehicle.brand} {viewingVehicle.model} ({viewingVehicle.year})
                  </p>
                </div>
                <Badge className={`ml-auto ${vehicleStatus[viewingVehicle.status].color} border-0`}>
                  {vehicleStatus[viewingVehicle.status].label}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Gauge className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Hodômetro</span>
                  </div>
                  <p className="text-lg font-semibold">
                    {viewingVehicle.currentOdometer.toLocaleString('pt-BR')} km
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Car className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Tipo</span>
                  </div>
                  <p className="text-lg font-semibold">
                    {vehicleTypes[viewingVehicle.type]}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Próxima Manutenção</span>
                  </div>
                  <p className="text-lg font-semibold">
                    {viewingVehicle.nextMaintenanceDate
                      ? new Date(viewingVehicle.nextMaintenanceDate).toLocaleDateString('pt-BR')
                      : '-'}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Venc. Seguro</span>
                  </div>
                  <p className="text-lg font-semibold">
                    {viewingVehicle.insuranceExpiry
                      ? new Date(viewingVehicle.insuranceExpiry).toLocaleDateString('pt-BR')
                      : '-'}
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setViewingVehicle(null)}>
                  Fechar
                </Button>
                <Button onClick={() => {
                  setViewingVehicle(null)
                  handleEdit(viewingVehicle)
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

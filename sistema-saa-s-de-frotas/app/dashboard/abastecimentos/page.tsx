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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import {
  Fuel,
  Plus,
  Search,
  Filter,
  Calendar,
  Car,
  User,
  TrendingUp,
  DollarSign,
  Gauge,
  Droplets,
} from 'lucide-react'
import { toast } from 'sonner'
import { mockFuelRecords, fuelCostData } from '@/lib/mock-data'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

export default function FuelPage() {
  const { vehicles, drivers } = useStore()
  const [search, setSearch] = useState('')
  const [vehicleFilter, setVehicleFilter] = useState<string>('all')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const [formData, setFormData] = useState({
    vehicleId: '',
    driverId: '',
    date: '',
    quantity: 0,
    unitPrice: 0,
    odometer: 0,
    fuelType: 'diesel',
    station: '',
  })

  const fuelRecords = mockFuelRecords

  const filteredRecords = fuelRecords.filter(record => {
    const vehicle = vehicles.find(v => v.id === record.vehicleId)
    const driver = drivers.find(d => d.id === record.driverId)
    const matchesSearch = 
      vehicle?.plate.toLowerCase().includes(search.toLowerCase()) ||
      driver?.name.toLowerCase().includes(search.toLowerCase()) ||
      record.station?.toLowerCase().includes(search.toLowerCase())
    const matchesVehicle = vehicleFilter === 'all' || record.vehicleId === vehicleFilter
    return matchesSearch && matchesVehicle
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('Abastecimento registrado!')
    setIsAddDialogOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      vehicleId: '',
      driverId: '',
      date: '',
      quantity: 0,
      unitPrice: 0,
      odometer: 0,
      fuelType: 'diesel',
      station: '',
    })
  }

  const totalLiters = fuelRecords.reduce((acc, r) => acc + r.quantity, 0)
  const totalCost = fuelRecords.reduce((acc, r) => acc + r.totalCost, 0)
  const avgPrice = totalCost / totalLiters

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Abastecimentos</h1>
          <p className="text-muted-foreground">
            Registre e acompanhe os abastecimentos da frota
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Abastecimento
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Registrar Abastecimento</DialogTitle>
              <DialogDescription>
                Preencha os dados do abastecimento
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
                      {vehicles.map((vehicle) => (
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
                      {drivers.map((driver) => (
                        <SelectItem key={driver.id} value={driver.id}>
                          {driver.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Data/Hora</Label>
                  <Input
                    id="date"
                    type="datetime-local"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fuelType">Combustível</Label>
                  <Select
                    value={formData.fuelType}
                    onValueChange={(value) => setFormData({ ...formData, fuelType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="diesel">Diesel</SelectItem>
                      <SelectItem value="gasoline">Gasolina</SelectItem>
                      <SelectItem value="ethanol">Etanol</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Litros</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.quantity || ''}
                    onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unitPrice">Preço/Litro (R$)</Label>
                  <Input
                    id="unitPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.unitPrice || ''}
                    onChange={(e) => setFormData({ ...formData, unitPrice: parseFloat(e.target.value) })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="odometer">Hodômetro (km)</Label>
                  <Input
                    id="odometer"
                    type="number"
                    min="0"
                    value={formData.odometer || ''}
                    onChange={(e) => setFormData({ ...formData, odometer: parseInt(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="station">Posto (opcional)</Label>
                  <Input
                    id="station"
                    placeholder="Nome do posto"
                    value={formData.station}
                    onChange={(e) => setFormData({ ...formData, station: e.target.value })}
                  />
                </div>
              </div>
              {formData.quantity > 0 && formData.unitPrice > 0 && (
                <div className="p-4 rounded-lg bg-secondary/50">
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold text-primary">
                    R$ {(formData.quantity * formData.unitPrice).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              )}
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Registrar</Button>
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
                <Droplets className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalLiters.toFixed(0)}</p>
                <p className="text-sm text-muted-foreground">Litros Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-chart-2/10">
                <DollarSign className="h-5 w-5 text-chart-2" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  R$ {totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </p>
                <p className="text-sm text-muted-foreground">Custo Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <TrendingUp className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">R$ {avgPrice.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Preço Médio/L</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-chart-5/10">
                <Fuel className="h-5 w-5 text-chart-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{fuelRecords.length}</p>
                <p className="text-sm text-muted-foreground">Registros</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Evolução de Custos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={fuelCostData}>
                <defs>
                  <linearGradient id="colorFuel" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.85 0.18 90)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="oklch(0.85 0.18 90)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.005 250)" />
                <XAxis dataKey="name" stroke="oklch(0.65 0 0)" fontSize={12} />
                <YAxis stroke="oklch(0.65 0 0)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'oklch(0.18 0.005 250)',
                    border: '1px solid oklch(0.28 0.005 250)',
                    borderRadius: '8px',
                    color: 'oklch(0.95 0 0)',
                  }}
                  formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Custo']}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="oklch(0.85 0.18 90)"
                  strokeWidth={2}
                  fill="url(#colorFuel)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por placa, motorista ou posto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={vehicleFilter} onValueChange={setVehicleFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Veículo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {vehicles.map((vehicle) => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.plate}
                  </SelectItem>
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
                  <TableHead>Data</TableHead>
                  <TableHead>Veículo</TableHead>
                  <TableHead>Motorista</TableHead>
                  <TableHead>Combustível</TableHead>
                  <TableHead>Litros</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Hodômetro</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => {
                  const vehicle = vehicles.find(v => v.id === record.vehicleId)
                  const driver = drivers.find(d => d.id === record.driverId)
                  return (
                    <TableRow key={record.id}>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {new Date(record.date).toLocaleDateString('pt-BR')}
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
                        <Badge variant="outline" className="capitalize">
                          {record.fuelType === 'diesel' ? 'Diesel' : record.fuelType === 'gasoline' ? 'Gasolina' : 'Etanol'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{record.quantity} L</span>
                        <span className="text-xs text-muted-foreground ml-1">
                          @ R$ {record.unitPrice.toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-primary">
                          R$ {record.totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Gauge className="h-4 w-4 text-muted-foreground" />
                          {record.odometer.toLocaleString('pt-BR')} km
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {filteredRecords.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Fuel className="h-8 w-8 opacity-50" />
                        <p>Nenhum abastecimento encontrado</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

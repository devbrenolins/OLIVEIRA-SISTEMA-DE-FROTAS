'use client'

import { useStore } from '@/lib/store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Car, Users, Wrench, MapPin, TrendingUp, TrendingDown, TriangleAlert as AlertTriangle, Fuel, Activity, Clock, CircleCheck as CheckCircle2, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { mockDashboardStats, monthlyKmData, fuelCostData, vehicleStatusData } from '@/lib/mock-data'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

const stats = [
  {
    name: 'Total de Veículos',
    value: mockDashboardStats.totalVehicles,
    change: '+2',
    trend: 'up',
    icon: Car,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    name: 'Motoristas Ativos',
    value: mockDashboardStats.activeDrivers,
    change: '+1',
    trend: 'up',
    icon: Users,
    color: 'text-chart-2',
    bgColor: 'bg-chart-2/10',
  },
  {
    name: 'Em Manutenção',
    value: mockDashboardStats.inMaintenance,
    change: '-1',
    trend: 'down',
    icon: Wrench,
    color: 'text-warning',
    bgColor: 'bg-warning/10',
  },
  {
    name: 'Viagens Hoje',
    value: mockDashboardStats.completedTripsToday,
    change: '+5',
    trend: 'up',
    icon: MapPin,
    color: 'text-chart-5',
    bgColor: 'bg-chart-5/10',
  },
]

const COLORS = ['oklch(0.85 0.18 90)', 'oklch(0.65 0.15 160)', 'oklch(0.7 0.2 30)']

export default function DashboardPage() {
  const { vehicles, drivers, serviceOrders, trips, alerts } = useStore()

  const activeTrips = trips.filter(t => t.status === 'in_progress')
  const pendingOrders = serviceOrders.filter(o => o.status === 'pending' || o.status === 'in_progress')
  const criticalAlerts = alerts.filter(a => a.severity === 'critical' && !a.read)

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral da sua frota em tempo real
        </p>
      </div>

      {/* Critical Alerts Banner */}
      {criticalAlerts.length > 0 && (
        <Card className="border-destructive/50 bg-destructive/10">
          <CardContent className="py-4">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-full bg-destructive/20">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">
                  {criticalAlerts.length} alerta(s) crítico(s) requer(em) atenção imediata
                </p>
                <p className="text-sm text-muted-foreground">
                  {criticalAlerts[0]?.message}
                </p>
              </div>
              <Button variant="destructive" size="sm">
                Ver Alertas
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={stat.name} className={`relative overflow-hidden animate-slide-up stagger-${index + 1}`}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{stat.name}</p>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  <div className="flex items-center gap-1 text-sm">
                    {stat.trend === 'up' ? (
                      <ArrowUpRight className="h-4 w-4 text-chart-2" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-destructive" />
                    )}
                    <span className={stat.trend === 'up' ? 'text-chart-2' : 'text-destructive'}>
                      {stat.change}
                    </span>
                    <span className="text-muted-foreground">vs mês anterior</span>
                  </div>
                </div>
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kilometers Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Quilometragem Mensal
            </CardTitle>
            <CardDescription>
              Comparativo com o período anterior
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyKmData}>
                  <defs>
                    <linearGradient id="colorKm" x1="0" y1="0" x2="0" y2="1">
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
                    formatter={(value: number) => [`${value.toLocaleString('pt-BR')} km`, 'Quilometragem']}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="oklch(0.85 0.18 90)"
                    strokeWidth={2}
                    fill="url(#colorKm)"
                  />
                  <Area
                    type="monotone"
                    dataKey="previous"
                    stroke="oklch(0.65 0 0)"
                    strokeWidth={1}
                    strokeDasharray="5 5"
                    fill="transparent"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Fuel Costs Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Fuel className="h-5 w-5 text-chart-2" />
              Custos de Combustível
            </CardTitle>
            <CardDescription>
              Distribuição por tipo de combustível
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={fuelCostData}>
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
                    formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, '']}
                  />
                  <Bar dataKey="diesel" stackId="a" fill="oklch(0.65 0.15 160)" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="gasoline" stackId="a" fill="oklch(0.85 0.18 90)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-chart-2" />
                <span className="text-sm text-muted-foreground">Diesel</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-sm text-muted-foreground">Gasolina</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vehicle Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5 text-primary" />
              Status dos Veículos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={vehicleStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {vehicleStatusData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'oklch(0.18 0.005 250)',
                      border: '1px solid oklch(0.28 0.005 250)',
                      borderRadius: '8px',
                      color: 'oklch(0.95 0 0)',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 mt-4">
              {vehicleStatusData.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index] }}
                    />
                    <span className="text-sm text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Trips */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-chart-5" />
                Viagens em Andamento
              </CardTitle>
              <Badge variant="secondary">{activeTrips.length}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeTrips.slice(0, 3).map((trip) => {
                const vehicle = vehicles.find(v => v.id === trip.vehicleId)
                const driver = drivers.find(d => d.id === trip.driverId)
                return (
                  <div key={trip.id} className="p-3 rounded-lg bg-secondary/50 border border-border/50">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-sm">{vehicle?.plate}</p>
                        <p className="text-xs text-muted-foreground">{driver?.name}</p>
                      </div>
                      <Badge className="bg-chart-2/20 text-chart-2 border-0">
                        Em trânsito
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{trip.destination.address}</span>
                    </div>
                    <Progress value={65} className="h-1.5 mt-2" />
                  </div>
                )
              })}
              {activeTrips.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Nenhuma viagem em andamento</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pending Service Orders */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5 text-warning" />
                Ordens de Serviço
              </CardTitle>
              <Badge variant="secondary">{pendingOrders.length}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingOrders.slice(0, 3).map((order) => {
                const vehicle = vehicles.find(v => v.id === order.vehicleId)
                return (
                  <div key={order.id} className="p-3 rounded-lg bg-secondary/50 border border-border/50">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-sm">{order.title}</p>
                        <p className="text-xs text-muted-foreground">{vehicle?.plate} - {vehicle?.model}</p>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          order.priority === 'urgent'
                            ? 'border-destructive text-destructive'
                            : order.priority === 'high'
                            ? 'border-warning text-warning'
                            : 'border-muted-foreground'
                        }
                      >
                        {order.priority === 'urgent' ? 'Urgente' : order.priority === 'high' ? 'Alta' : 'Normal'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(order.scheduledDate).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="flex items-center gap-1">
                        {order.status === 'in_progress' ? (
                          <>
                            <Activity className="h-3 w-3 text-chart-2" />
                            <span className="text-chart-2">Em andamento</span>
                          </>
                        ) : (
                          <>
                            <Clock className="h-3 w-3" />
                            Pendente
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
              {pendingOrders.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle2 className="h-8 w-8 mx-auto mb-2 opacity-50 text-chart-2" />
                  <p className="text-sm">Todas as ordens concluídas!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

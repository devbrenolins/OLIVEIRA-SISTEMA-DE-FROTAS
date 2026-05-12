'use client'

import { useStore } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'
import { Car, MapPin, ClipboardCheck, Fuel, Calendar, Clock, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle2, Navigation, Phone } from 'lucide-react'

export default function DriverHomePage() {
  const { user, vehicles, trips, alerts } = useStore()

  // Get assigned vehicle (mock - first available vehicle)
  const assignedVehicle = vehicles.find(v => v.status === 'in_use') || vehicles[0]
  
  // Get current trip (mock - first in_progress trip)
  const currentTrip = trips.find(t => t.status === 'in_progress')

  // Get driver alerts
  const driverAlerts = alerts.filter(a => !a.read).slice(0, 3)

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Olá, {user?.name?.split(' ')[0] || 'Motorista'}!
        </h1>
        <p className="text-muted-foreground">
          {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link href="/motorista/inspecao">
          <Card className="cursor-pointer hover:border-primary/50 hover:shadow-lg transition-all h-full">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3 transition-transform group-hover:scale-110">
                <ClipboardCheck className="h-6 w-6 text-primary" />
              </div>
              <p className="font-medium">Nova Inspeção</p>
              <p className="text-xs text-muted-foreground">Pré ou pós viagem</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/motorista/abastecimento">
          <Card className="cursor-pointer hover:border-primary/50 hover:shadow-lg transition-all h-full">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
              <div className="w-12 h-12 rounded-xl bg-chart-2/10 flex items-center justify-center mb-3 transition-transform group-hover:scale-110">
                <Fuel className="h-6 w-6 text-chart-2" />
              </div>
              <p className="font-medium">Abastecimento</p>
              <p className="text-xs text-muted-foreground">Registrar abastecimento</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Assigned Vehicle */}
      {assignedVehicle && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Car className="h-4 w-4 text-primary" />
              Meu Veículo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-secondary flex items-center justify-center">
                <Car className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xl font-bold">{assignedVehicle.plate}</p>
                <p className="text-sm text-muted-foreground">
                  {assignedVehicle.brand} {assignedVehicle.model}
                </p>
                <Badge variant="outline" className="mt-1">
                  {assignedVehicle.year}
                </Badge>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-secondary/50">
                <p className="text-xs text-muted-foreground">Hodômetro</p>
                <p className="font-semibold">
                  {assignedVehicle.currentOdometer.toLocaleString('pt-BR')} km
                </p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/50">
                <p className="text-xs text-muted-foreground">Próx. Manutenção</p>
                <p className="font-semibold">
                  {assignedVehicle.nextMaintenanceDate
                    ? new Date(assignedVehicle.nextMaintenanceDate).toLocaleDateString('pt-BR')
                    : '-'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Trip */}
      {currentTrip && (
        <Card className="border-primary/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Navigation className="h-4 w-4 text-chart-2" />
                Viagem em Andamento
              </CardTitle>
              <Badge className="bg-chart-2/20 text-chart-2 border-0">
                Em trânsito
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 rounded-full bg-chart-2 mt-1.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Origem</p>
                  <p className="font-medium text-sm">{currentTrip.origin.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 rounded-full bg-primary mt-1.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Destino</p>
                  <p className="font-medium text-sm">{currentTrip.destination.address}</p>
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Progresso estimado</span>
                <span className="font-medium">65%</span>
              </div>
              <Progress value={65} className="h-2" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-secondary/50">
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                  <Clock className="h-3 w-3" />
                  Saída
                </div>
                <p className="font-semibold text-sm">
                  {new Date(currentTrip.actualStart || currentTrip.scheduledStart).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/50">
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                  <Calendar className="h-3 w-3" />
                  Previsão
                </div>
                <p className="font-semibold text-sm">
                  {new Date(currentTrip.scheduledEnd).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>

            <Link href="/motorista/viagem">
              <Button className="w-full">
                <MapPin className="h-4 w-4 mr-2" />
                Ver Detalhes da Viagem
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Alerts */}
      {driverAlerts.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" />
              Avisos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {driverAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50"
              >
                <div className={`mt-0.5 p-1.5 rounded-full ${
                  alert.severity === 'critical' 
                    ? 'bg-destructive/20 text-destructive' 
                    : alert.severity === 'warning'
                    ? 'bg-warning/20 text-warning'
                    : 'bg-info/20 text-info'
                }`}>
                  <AlertTriangle className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{alert.title}</p>
                  <p className="text-xs text-muted-foreground">{alert.message}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Today's Checklist */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-chart-2" />
            Checklist do Dia
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-chart-2/10 border border-chart-2/20">
            <CheckCircle2 className="h-5 w-5 text-chart-2" />
            <span className="text-sm">Inspeção pré-viagem realizada</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
            <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30" />
            <span className="text-sm text-muted-foreground">Inspeção pós-viagem pendente</span>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contact */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                <Phone className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="font-medium text-sm">Emergência</p>
                <p className="text-xs text-muted-foreground">Central de Apoio 24h</p>
              </div>
            </div>
            <Button variant="outline" size="sm" asChild>
              <a href="tel:08001234567">
                Ligar
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

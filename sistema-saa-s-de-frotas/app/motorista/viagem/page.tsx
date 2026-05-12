'use client'

import { useStore } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { MapPin, Navigation, Clock, Calendar, Car, Gauge, CircleCheck as CheckCircle2, TriangleAlert as AlertTriangle, Phone, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'

export default function ViagemPage() {
  const { trips, vehicles, drivers } = useStore()

  const currentTrip = trips.find(t => t.status === 'in_progress')
  const vehicle = currentTrip ? vehicles.find(v => v.id === currentTrip.vehicleId) : null
  const driver = currentTrip ? drivers.find(d => d.id === currentTrip.driverId) : null

  const handleStartTrip = () => {
    toast.success('Viagem iniciada!')
  }

  const handleEndTrip = () => {
    toast.success('Viagem finalizada com sucesso!')
  }

  const handleReportIssue = () => {
    toast.success('Ocorrência registrada!')
  }

  if (!currentTrip) {
    return (
      <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Minha Viagem</h1>
          <p className="text-muted-foreground">Nenhuma viagem em andamento</p>
        </div>

        <Card>
          <CardContent className="p-8 flex flex-col items-center text-center">
            <MapPin className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Sem viagem ativa</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Nenhuma viagem foi atribuída a você no momento. Aguarde a liberação pela administração.
            </p>
            <Button variant="outline" onClick={() => toast.info('Solicitação enviada à administração')}>
              Solicitar Viagem
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Minha Viagem</h1>
          <p className="text-muted-foreground">Detalhes e acompanhamento</p>
        </div>
        <Badge className="bg-chart-2/20 text-chart-2 border-0">
          <Navigation className="h-3.5 w-3.5 mr-1" />
          Em trânsito
        </Badge>
      </div>

      {/* Route Info */}
      <Card className="border-primary/50">
        <CardContent className="p-4 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-3 h-3 rounded-full bg-chart-2 mt-1.5 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Origem</p>
              <p className="font-medium">{currentTrip.origin.address}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 pl-1">
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex items-start gap-3">
            <div className="w-3 h-3 rounded-full bg-primary mt-1.5 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Destino</p>
              <p className="font-medium">{currentTrip.destination.address}</p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progresso estimado</span>
              <span className="font-medium">65%</span>
            </div>
            <Progress value={65} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Trip Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Saída</span>
            </div>
            <p className="font-semibold text-lg">
              {new Date(currentTrip.actualStart || currentTrip.scheduledStart).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </p>
            <p className="text-xs text-muted-foreground">
              {new Date(currentTrip.scheduledStart).toLocaleDateString('pt-BR')}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Previsão</span>
            </div>
            <p className="font-semibold text-lg">
              {new Date(currentTrip.scheduledEnd).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </p>
            <p className="text-xs text-muted-foreground">
              {new Date(currentTrip.scheduledEnd).toLocaleDateString('pt-BR')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Vehicle Info */}
      {vehicle && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Car className="h-4 w-4 text-primary" />
              Veículo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center">
                <Car className="h-7 w-7 text-muted-foreground" />
              </div>
              <div>
                <p className="text-lg font-bold">{vehicle.plate}</p>
                <p className="text-sm text-muted-foreground">
                  {vehicle.brand} {vehicle.model}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <div className="p-3 rounded-lg bg-secondary/50">
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                  <Gauge className="h-3 w-3" />
                  Hodômetro
                </div>
                <p className="font-semibold">
                  {vehicle.currentOdometer.toLocaleString('pt-BR')} km
                </p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/50">
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                  <Car className="h-3 w-3" />
                  Combustível
                </div>
                <p className="font-semibold capitalize">{vehicle.fuelType}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="space-y-3">
        <Button className="w-full h-12" onClick={handleEndTrip}>
          <CheckCircle2 className="h-5 w-5 mr-2" />
          Finalizar Viagem
        </Button>
        <Button variant="outline" className="w-full" onClick={handleReportIssue}>
          <AlertTriangle className="h-4 w-4 mr-2" />
          Registrar Ocorrência
        </Button>
      </div>

      {/* Emergency */}
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
              <a href="tel:08001234567">Ligar</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

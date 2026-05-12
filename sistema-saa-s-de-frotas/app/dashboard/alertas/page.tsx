'use client'

import { useStore } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Bell, TriangleAlert as AlertTriangle, Info, CircleCheck as CheckCircle2, Car, Users, Wrench, Fuel, MapPin, FileText } from 'lucide-react'
import Link from 'next/link'

const alertIcons: Record<string, typeof AlertTriangle> = {
  maintenance: Wrench,
  document: FileText,
  license: FileText,
  insurance: FileText,
  fuel: Fuel,
  trip: MapPin,
  inspection: CheckCircle2,
}

const severityStyles = {
  critical: 'bg-destructive/20 text-destructive',
  warning: 'bg-warning/20 text-warning',
  info: 'bg-info/20 text-info',
}

export default function AlertasPage() {
  const { alerts, markAlertAsRead } = useStore()

  const unreadAlerts = alerts.filter(a => !a.read)
  const readAlerts = alerts.filter(a => a.read)

  const handleMarkAsRead = (id: string) => {
    markAlertAsRead(id)
  }

  const handleMarkAllAsRead = () => {
    alerts.filter(a => !a.read).forEach(a => markAlertAsRead(a.id))
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Alertas</h1>
          <p className="text-muted-foreground">
            {unreadAlerts.length} notificação(ões) não lida(s)
          </p>
        </div>
        {unreadAlerts.length > 0 && (
          <Button variant="outline" onClick={handleMarkAllAsRead}>
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Marcar todas como lidas
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <span className="text-sm text-muted-foreground">Críticos</span>
            </div>
            <p className="text-2xl font-bold">
              {alerts.filter(a => a.severity === 'critical' && !a.read).length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <span className="text-sm text-muted-foreground">Avisos</span>
            </div>
            <p className="text-2xl font-bold">
              {alerts.filter(a => a.severity === 'warning' && !a.read).length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Info className="h-4 w-4 text-info" />
              <span className="text-sm text-muted-foreground">Info</span>
            </div>
            <p className="text-2xl font-bold">
              {alerts.filter(a => a.severity === 'info' && !a.read).length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Unread Alerts */}
      {unreadAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Não Lidas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {unreadAlerts.map((alert) => {
              const Icon = alertIcons[alert.type] || AlertTriangle
              return (
                <div
                  key={alert.id}
                  className="flex items-start gap-3 p-4 rounded-lg bg-secondary/50 border border-border/50"
                >
                  <div className={`p-2 rounded-lg shrink-0 ${severityStyles[alert.severity]}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium">{alert.title}</p>
                      <Badge
                        variant="outline"
                        className={
                          alert.severity === 'critical'
                            ? 'border-destructive text-destructive shrink-0'
                            : alert.severity === 'warning'
                            ? 'border-warning text-warning shrink-0'
                            : 'border-info text-info shrink-0'
                        }
                      >
                        {alert.severity === 'critical' ? 'Crítico' : alert.severity === 'warning' ? 'Aviso' : 'Info'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-muted-foreground">
                        {new Date(alert.createdAt).toLocaleString('pt-BR')}
                      </span>
                      {alert.actionUrl && (
                        <Link href={alert.actionUrl} className="text-xs text-primary hover:underline">
                          Ver detalhes
                        </Link>
                      )}
                      <button
                        onClick={() => handleMarkAsRead(alert.id)}
                        className="text-xs text-muted-foreground hover:text-foreground"
                      >
                        Marcar como lida
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}

      {/* Read Alerts */}
      {readAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-muted-foreground">Lidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {readAlerts.map((alert) => {
              const Icon = alertIcons[alert.type] || AlertTriangle
              return (
                <div
                  key={alert.id}
                  className="flex items-start gap-3 p-3 rounded-lg opacity-60"
                >
                  <div className="p-1.5 rounded-lg bg-muted shrink-0">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{alert.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{alert.message}</p>
                    <span className="text-xs text-muted-foreground">
                      {new Date(alert.createdAt).toLocaleString('pt-BR')}
                    </span>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}

      {alerts.length === 0 && (
        <Card>
          <CardContent className="p-8 flex flex-col items-center text-center">
            <Bell className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum alerta</h3>
            <p className="text-sm text-muted-foreground">
              Todos os alertas foram verificados
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

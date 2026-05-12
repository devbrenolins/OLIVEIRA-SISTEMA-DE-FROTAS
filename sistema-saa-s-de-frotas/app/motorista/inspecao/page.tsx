'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ClipboardCheck, Car, CircleCheck as CheckCircle2, TriangleAlert as AlertTriangle, Circle as XCircle, ChevronRight, Fuel, Gauge } from 'lucide-react'
import { toast } from 'sonner'
import { inspectionTemplateItems } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

type ItemStatus = 'ok' | 'attention' | 'critical' | 'na'

export default function InspecaoPage() {
  const { vehicles } = useStore()
  const assignedVehicle = vehicles.find(v => v.status === 'in_use') || vehicles[0]

  const [inspectionType, setInspectionType] = useState<'pre_trip' | 'post_trip' | null>(null)
  const [odometer, setOdometer] = useState('')
  const [fuelLevel, setFuelLevel] = useState(75)
  const [items, setItems] = useState<Record<string, ItemStatus>>({})
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const allItemKeys = inspectionTemplateItems.flatMap(cat =>
    cat.items.map(item => `${cat.category}-${item}`)
  )

  const checkedCount = Object.keys(items).length
  const totalCount = allItemKeys.length
  const progress = totalCount > 0 ? (checkedCount / totalCount) * 100 : 0

  const criticalCount = Object.values(items).filter(s => s === 'critical').length
  const attentionCount = Object.values(items).filter(s => s === 'attention').length

  const handleSetStatus = (key: string, status: ItemStatus) => {
    setItems(prev => ({ ...prev, [key]: status }))
  }

  const handleSubmit = async () => {
    if (!inspectionType) {
      toast.error('Selecione o tipo de inspeção')
      return
    }
    if (!odometer) {
      toast.error('Informe o hodômetro')
      return
    }
    if (checkedCount < totalCount) {
      toast.error('Verifique todos os itens antes de enviar')
      return
    }

    setIsSubmitting(true)
    await new Promise(r => setTimeout(r, 1000))

    if (criticalCount > 0) {
      toast.error(`Inspeção registrada com ${criticalCount} item(ns) crítico(s). Veículo bloqueado para operação.`)
    } else {
      toast.success('Inspeção registrada com sucesso!')
    }
    setIsSubmitting(false)
    setInspectionType(null)
    setItems({})
    setNotes({})
    setOdometer('')
  }

  if (!inspectionType) {
    return (
      <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Inspeção de Veículo</h1>
          <p className="text-muted-foreground">Selecione o tipo de inspeção</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card
            className="cursor-pointer hover:border-primary/50 transition-all hover:shadow-lg"
            onClick={() => setInspectionType('pre_trip')}
          >
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <ClipboardCheck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Pré-Viagem</h3>
              <p className="text-sm text-muted-foreground">
                Checklist obrigatório antes de iniciar a viagem
              </p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:border-primary/50 transition-all hover:shadow-lg"
            onClick={() => setInspectionType('post_trip')}
          >
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-xl bg-chart-2/10 flex items-center justify-center mb-4">
                <CheckCircle2 className="h-8 w-8 text-chart-2" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Pós-Viagem</h3>
              <p className="text-sm text-muted-foreground">
                Checklist ao retornar da viagem
              </p>
            </CardContent>
          </Card>
        </div>

        {assignedVehicle && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <Car className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">{assignedVehicle.plate}</p>
                  <p className="text-sm text-muted-foreground">
                    {assignedVehicle.brand} {assignedVehicle.model}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {inspectionType === 'pre_trip' ? 'Inspeção Pré-Viagem' : 'Inspeção Pós-Viagem'}
          </h1>
          <p className="text-muted-foreground">
            {assignedVehicle?.plate} - {assignedVehicle?.brand} {assignedVehicle?.model}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setInspectionType(null)}>
          Voltar
        </Button>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Progresso</span>
            <span className="text-sm font-medium">{checkedCount}/{totalCount}</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex gap-4 mt-3">
            {criticalCount > 0 && (
              <Badge className="bg-destructive/20 text-destructive border-0">
                <XCircle className="h-3 w-3 mr-1" />
                {criticalCount} crítico(s)
              </Badge>
            )}
            {attentionCount > 0 && (
              <Badge className="bg-warning/20 text-warning border-0">
                <AlertTriangle className="h-3 w-3 mr-1" />
                {attentionCount} atenção
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Odometer & Fuel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Gauge className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Hodômetro (km)</span>
            </div>
            <input
              type="number"
              value={odometer}
              onChange={(e) => setOdometer(e.target.value)}
              placeholder="0"
              className="w-full bg-transparent text-2xl font-bold outline-none border-b border-border pb-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Fuel className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Nível de Combustível</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="100"
                value={fuelLevel}
                onChange={(e) => setFuelLevel(parseInt(e.target.value))}
                className="flex-1 accent-primary"
              />
              <span className="text-lg font-bold w-12 text-right">{fuelLevel}%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Checklist Items */}
      {inspectionTemplateItems.map((category) => (
        <Card key={category.category}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{category.category}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {category.items.map((item) => {
              const key = `${category.category}-${item}`
              const status = items[key]
              return (
                <div
                  key={key}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg bg-secondary/50"
                >
                  <span className="text-sm">{item}</span>
                  <div className="flex gap-1 flex-wrap">
                    {(['ok', 'attention', 'critical', 'na'] as ItemStatus[]).map((s) => (
                      <button
                        key={s}
                        onClick={() => handleSetStatus(key, s)}
                        className={cn(
                          'px-2.5 py-1 rounded text-xs font-medium transition-colors',
                          status === s
                            ? s === 'ok'
                              ? 'bg-chart-2/20 text-chart-2'
                              : s === 'attention'
                              ? 'bg-warning/20 text-warning'
                              : s === 'critical'
                              ? 'bg-destructive/20 text-destructive'
                              : 'bg-muted text-muted-foreground'
                            : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                        )}
                      >
                        {s === 'ok' ? 'OK' : s === 'attention' ? 'Atenção' : s === 'critical' ? 'Crítico' : 'N/A'}
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      ))}

      {/* Submit */}
      <Button
        className="w-full h-12"
        onClick={handleSubmit}
        disabled={isSubmitting || checkedCount < totalCount}
      >
        {isSubmitting ? 'Enviando...' : 'Enviar Inspeção'}
      </Button>
    </div>
  )
}


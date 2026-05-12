'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Fuel, Gauge, Droplets, DollarSign, CircleCheck as CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

export default function AbastecimentoPage() {
  const { vehicles } = useStore()
  const assignedVehicle = vehicles.find(v => v.status === 'in_use') || vehicles[0]

  const [formData, setFormData] = useState({
    date: new Date().toISOString().slice(0, 16),
    quantity: '',
    unitPrice: '',
    odometer: '',
    fuelType: assignedVehicle?.fuelType || 'diesel',
    station: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const quantity = parseFloat(formData.quantity) || 0
  const unitPrice = parseFloat(formData.unitPrice) || 0
  const totalCost = quantity * unitPrice

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.quantity || !formData.unitPrice || !formData.odometer) {
      toast.error('Preencha todos os campos obrigatórios')
      return
    }

    setIsSubmitting(true)
    await new Promise(r => setTimeout(r, 1000))
    toast.success('Abastecimento registrado com sucesso!')
    setIsSubmitting(false)

    setFormData({
      date: new Date().toISOString().slice(0, 16),
      quantity: '',
      unitPrice: '',
      odometer: '',
      fuelType: assignedVehicle?.fuelType || 'diesel',
      station: '',
    })
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Abastecimento</h1>
        <p className="text-muted-foreground">Registre o abastecimento do veículo</p>
      </div>

      {/* Vehicle Info */}
      {assignedVehicle && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                <Fuel className="h-5 w-5 text-muted-foreground" />
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

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Dados do Abastecimento</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  onValueChange={(value) => setFormData({ ...formData, fuelType: value as typeof formData.fuelType })}
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Litros</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
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
                  placeholder="0.00"
                  value={formData.unitPrice}
                  onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="odometer">Hodômetro (km)</Label>
                <Input
                  id="odometer"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.odometer}
                  onChange={(e) => setFormData({ ...formData, odometer: e.target.value })}
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

            {/* Total */}
            {totalCost > 0 && (
              <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    <span className="text-sm text-muted-foreground">Total</span>
                  </div>
                  <p className="text-2xl font-bold text-primary">
                    R$ {totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                'Registrando...'
              ) : (
                <>
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  Registrar Abastecimento
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

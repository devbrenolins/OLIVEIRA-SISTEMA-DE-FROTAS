'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  FileText,
  Download,
  Calendar,
  Car,
  Users,
  Fuel,
  Wrench,
  MapPin,
  TrendingUp,
  DollarSign,
  BarChart3,
  PieChart,
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { monthlyKmData, fuelCostData, maintenanceCostData } from '@/lib/mock-data'
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
  Legend,
} from 'recharts'

const reports = [
  {
    id: 'vehicles',
    title: 'Relatório de Veículos',
    description: 'Lista completa de veículos com status, quilometragem e documentação',
    icon: Car,
    color: 'bg-primary/10 text-primary',
  },
  {
    id: 'drivers',
    title: 'Relatório de Motoristas',
    description: 'Lista de motoristas com CNH, viagens realizadas e desempenho',
    icon: Users,
    color: 'bg-chart-2/10 text-chart-2',
  },
  {
    id: 'fuel',
    title: 'Relatório de Combustível',
    description: 'Consumo de combustível, custos e média de km/L por veículo',
    icon: Fuel,
    color: 'bg-warning/10 text-warning',
  },
  {
    id: 'maintenance',
    title: 'Relatório de Manutenção',
    description: 'Histórico de manutenções, custos e próximas revisões programadas',
    icon: Wrench,
    color: 'bg-chart-5/10 text-chart-5',
  },
  {
    id: 'trips',
    title: 'Relatório de Viagens',
    description: 'Viagens realizadas, quilometragem percorrida e tempo de uso',
    icon: MapPin,
    color: 'bg-info/10 text-info',
  },
  {
    id: 'costs',
    title: 'Relatório Financeiro',
    description: 'Visão geral de todos os custos da frota por categoria',
    icon: DollarSign,
    color: 'bg-destructive/10 text-destructive',
  },
]

export default function ReportsPage() {
  const [period, setPeriod] = useState('month')
  const [selectedReport, setSelectedReport] = useState<string | null>(null)

  const handleDownload = (reportId: string) => {
    setSelectedReport(reportId)
    // Simulate download
    setTimeout(() => {
      toast.success(`Relatório de ${reports.find(r => r.id === reportId)?.title.toLowerCase()} baixado!`)
      setSelectedReport(null)
    }, 1500)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Relatórios</h1>
          <p className="text-muted-foreground">
            Visualize e exporte relatórios da sua frota
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Última Semana</SelectItem>
              <SelectItem value="month">Último Mês</SelectItem>
              <SelectItem value="quarter">Último Trimestre</SelectItem>
              <SelectItem value="year">Último Ano</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">287.600</p>
                <p className="text-sm text-muted-foreground">km Total</p>
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
                <p className="text-2xl font-bold">R$ 84.9k</p>
                <p className="text-sm text-muted-foreground">Combustível</p>
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
                <p className="text-2xl font-bold">R$ 27.7k</p>
                <p className="text-sm text-muted-foreground">Manutenção</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-chart-5/10">
                <MapPin className="h-5 w-5 text-chart-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">62</p>
                <p className="text-sm text-muted-foreground">Viagens</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Quilometragem por Mês
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyKmData}>
                  <defs>
                    <linearGradient id="colorKmReport" x1="0" y1="0" x2="0" y2="1">
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
                    fill="url(#colorKmReport)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-chart-2" />
              Custos de Manutenção
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={maintenanceCostData}>
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
                  <Legend />
                  <Bar dataKey="preventive" name="Preventiva" fill="oklch(0.65 0.15 160)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="corrective" name="Corretiva" fill="oklch(0.7 0.2 30)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Available Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Relatórios Disponíveis
          </CardTitle>
          <CardDescription>
            Selecione um relatório para visualizar ou exportar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className="p-4 rounded-lg border border-border bg-secondary/30 hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${report.color}`}>
                    <report.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm">{report.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {report.description}
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownload(report.id)}
                        disabled={selectedReport === report.id}
                        className="h-8 text-xs"
                      >
                        {selectedReport === report.id ? (
                          'Gerando...'
                        ) : (
                          <>
                            <Download className="h-3.5 w-3.5 mr-1" />
                            Exportar
                          </>
                        )}
                      </Button>
                      <Badge variant="secondary" className="text-xs">PDF</Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type { User, Vehicle, Driver, ServiceOrder, Trip, Alert, Settings } from './types'
import { mockVehicles, mockDrivers, mockServiceOrders, mockTrips, mockAlerts } from './mock-data'
import { supabase } from './supabase'

interface StoreContextType {
  // Auth
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void

  // Data
  vehicles: Vehicle[]
  drivers: Driver[]
  serviceOrders: ServiceOrder[]
  trips: Trip[]
  alerts: Alert[]

  // Settings
  settings: Settings
  updateSettings: (newSettings: Partial<Settings>) => void
  isConfigured: boolean

  // CRUD Operations
  addVehicle: (vehicle: Omit<Vehicle, 'id' | 'createdAt' | 'documents'>) => void
  updateVehicle: (id: string, vehicle: Partial<Vehicle>) => void
  deleteVehicle: (id: string) => void

  addDriver: (driver: Omit<Driver, 'id' | 'createdAt'>) => void
  updateDriver: (id: string, driver: Partial<Driver>) => void
  deleteDriver: (id: string) => void

  addServiceOrder: (order: Omit<ServiceOrder, 'id' | 'createdAt'>) => void
  updateServiceOrder: (id: string, order: Partial<ServiceOrder>) => void

  addTrip: (trip: Omit<Trip, 'id' | 'createdAt'>) => void
  updateTrip: (id: string, trip: Partial<Trip>) => void

  markAlertAsRead: (id: string) => void
}

const StoreContext = createContext<StoreContextType | undefined>(undefined)

const SETTINGS_KEY = 'oliveira_frotas_settings'
const AUTH_KEY = 'oliveira_frotas_auth'

const defaultSettings: Settings = {
  supabaseUrl: '',
  supabaseKey: '',
  companyName: 'OLIVEIRA FROTAS',
  currency: 'BRL',
  timezone: 'America/Sao_Paulo',
  distanceUnit: 'km',
  fuelUnit: 'L',
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>([])
  const [trips, setTrips] = useState<Trip[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load settings and auth from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return

    const savedSettings = localStorage.getItem(SETTINGS_KEY)
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings))
      } catch {
        // Invalid JSON, use defaults
      }
    }

    const savedAuth = localStorage.getItem(AUTH_KEY)
    if (savedAuth) {
      try {
        setUser(JSON.parse(savedAuth))
      } catch {
        // Invalid JSON
      }
    }

    // Load data from localStorage or use mock data
    const savedVehicles = localStorage.getItem('oliveira_frotas_vehicles')
    const savedDrivers = localStorage.getItem('oliveira_frotas_drivers')
    const savedOrders = localStorage.getItem('oliveira_frotas_orders')
    const savedTrips = localStorage.getItem('oliveira_frotas_trips')
    const savedAlerts = localStorage.getItem('oliveira_frotas_alerts')

    setVehicles(savedVehicles ? JSON.parse(savedVehicles) : mockVehicles)
    setDrivers(savedDrivers ? JSON.parse(savedDrivers) : mockDrivers)
    setServiceOrders(savedOrders ? JSON.parse(savedOrders) : mockServiceOrders)
    setTrips(savedTrips ? JSON.parse(savedTrips) : mockTrips)
    setAlerts(savedAlerts ? JSON.parse(savedAlerts) : mockAlerts)

    setIsLoaded(true)
  }, [])

  // Persist settings
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
    }
  }, [settings, isLoaded])

  // Persist data changes
  useEffect(() => {
    if (!isLoaded || typeof window === 'undefined') return
    localStorage.setItem('oliveira_frotas_vehicles', JSON.stringify(vehicles))
  }, [vehicles, isLoaded])

  useEffect(() => {
    if (!isLoaded || typeof window === 'undefined') return
    localStorage.setItem('oliveira_frotas_drivers', JSON.stringify(drivers))
  }, [drivers, isLoaded])

  useEffect(() => {
    if (!isLoaded || typeof window === 'undefined') return
    localStorage.setItem('oliveira_frotas_orders', JSON.stringify(serviceOrders))
  }, [serviceOrders, isLoaded])

  useEffect(() => {
    if (!isLoaded || typeof window === 'undefined') return
    localStorage.setItem('oliveira_frotas_trips', JSON.stringify(trips))
  }, [trips, isLoaded])

  useEffect(() => {
    if (!isLoaded || typeof window === 'undefined') return
    localStorage.setItem('oliveira_frotas_alerts', JSON.stringify(alerts))
  }, [alerts, isLoaded])

  const isAuthenticated = user !== null
  const isConfigured = settings.supabaseUrl !== '' && settings.supabaseKey !== ''

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    // Try Supabase Auth if configured
    if (isConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (!error && data.user) {
        const authUser: User = {
          id: data.user.id,
          email: data.user.email || email,
          name: data.user.user_metadata?.name || email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
          role: data.user.user_metadata?.role || 'manager',
          createdAt: new Date(data.user.created_at),
        }
        setUser(authUser)
        localStorage.setItem(AUTH_KEY, JSON.stringify(authUser))
        return true
      }
    }

    // Fallback to mock login
    if (email && password) {
      const mockUser: User = {
        id: generateId(),
        email,
        name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        role: email.includes('admin') ? 'admin' : email.includes('driver') ? 'driver' : 'manager',
        createdAt: new Date(),
      }
      setUser(mockUser)
      localStorage.setItem(AUTH_KEY, JSON.stringify(mockUser))
      return true
    }
    return false
  }, [isConfigured])

  const logout = useCallback(async () => {
    if (isConfigured) {
      await supabase.auth.signOut()
    }
    setUser(null)
    localStorage.removeItem(AUTH_KEY)
  }, [isConfigured])

  const updateSettings = useCallback((newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }))
  }, [])

  const addVehicle = useCallback((vehicle: Omit<Vehicle, 'id' | 'createdAt' | 'documents'>) => {
    const newVehicle: Vehicle = {
      ...vehicle,
      id: generateId(),
      documents: [],
      createdAt: new Date(),
    }
    setVehicles(prev => [...prev, newVehicle])
  }, [])

  const updateVehicle = useCallback((id: string, vehicle: Partial<Vehicle>) => {
    setVehicles(prev => prev.map(v => v.id === id ? { ...v, ...vehicle } : v))
  }, [])

  const deleteVehicle = useCallback((id: string) => {
    setVehicles(prev => prev.filter(v => v.id !== id))
  }, [])

  const addDriver = useCallback((driver: Omit<Driver, 'id' | 'createdAt'>) => {
    const newDriver: Driver = {
      ...driver,
      id: generateId(),
      createdAt: new Date(),
    }
    setDrivers(prev => [...prev, newDriver])
  }, [])

  const updateDriver = useCallback((id: string, driver: Partial<Driver>) => {
    setDrivers(prev => prev.map(d => d.id === id ? { ...d, ...driver } : d))
  }, [])

  const deleteDriver = useCallback((id: string) => {
    setDrivers(prev => prev.filter(d => d.id !== id))
  }, [])

  const addServiceOrder = useCallback((order: Omit<ServiceOrder, 'id' | 'createdAt'>) => {
    const newOrder: ServiceOrder = {
      ...order,
      id: generateId(),
      createdAt: new Date(),
    }
    setServiceOrders(prev => [...prev, newOrder])
  }, [])

  const updateServiceOrder = useCallback((id: string, order: Partial<ServiceOrder>) => {
    setServiceOrders(prev => prev.map(o => o.id === id ? { ...o, ...order } : o))
  }, [])

  const addTrip = useCallback((trip: Omit<Trip, 'id' | 'createdAt'>) => {
    const newTrip: Trip = {
      ...trip,
      id: generateId(),
      createdAt: new Date(),
    }
    setTrips(prev => [...prev, newTrip])
  }, [])

  const updateTrip = useCallback((id: string, trip: Partial<Trip>) => {
    setTrips(prev => prev.map(t => t.id === id ? { ...t, ...trip } : t))
  }, [])

  const markAlertAsRead = useCallback((id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a))
  }, [])

  return (
    <StoreContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        vehicles,
        drivers,
        serviceOrders,
        trips,
        alerts,
        settings,
        updateSettings,
        isConfigured,
        addVehicle,
        updateVehicle,
        deleteVehicle,
        addDriver,
        updateDriver,
        deleteDriver,
        addServiceOrder,
        updateServiceOrder,
        addTrip,
        updateTrip,
        markAlertAsRead,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider')
  }
  return context
}

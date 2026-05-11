'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { User, Vehicle, Driver, ServiceOrder, Trip, Alert, Settings } from './types'
import { mockVehicles, mockDrivers, mockServiceOrders, mockTrips, mockAlerts } from './mock-data'

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

const SETTINGS_KEY = 'fleetpro_settings'
const AUTH_KEY = 'fleetpro_auth'

const defaultSettings: Settings = {
  supabaseUrl: '',
  supabaseKey: '',
  companyName: 'FleetPro',
  currency: 'BRL',
  timezone: 'America/Sao_Paulo',
  distanceUnit: 'km',
  fuelUnit: 'L',
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles)
  const [drivers, setDrivers] = useState<Driver[]>(mockDrivers)
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>(mockServiceOrders)
  const [trips, setTrips] = useState<Trip[]>(mockTrips)
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts)
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load settings and auth from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
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
      setIsLoaded(true)
    }
  }, [])

  // Save settings to localStorage
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
    }
  }, [settings, isLoaded])

  const isAuthenticated = user !== null
  const isConfigured = settings.supabaseUrl !== '' && settings.supabaseKey !== ''

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock login - in production, this would call Supabase Auth
    if (email && password) {
      const mockUser: User = {
        id: '1',
        email,
        name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        role: email.includes('admin') ? 'admin' : email.includes('driver') ? 'driver' : 'manager',
        createdAt: new Date(),
      }
      setUser(mockUser)
      if (typeof window !== 'undefined') {
        localStorage.setItem(AUTH_KEY, JSON.stringify(mockUser))
      }
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_KEY)
    }
  }

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }))
  }

  // Vehicle CRUD
  const addVehicle = (vehicle: Omit<Vehicle, 'id' | 'createdAt' | 'documents'>) => {
    const newVehicle: Vehicle = {
      ...vehicle,
      id: Date.now().toString(),
      documents: [],
      createdAt: new Date(),
    }
    setVehicles(prev => [...prev, newVehicle])
  }

  const updateVehicle = (id: string, vehicle: Partial<Vehicle>) => {
    setVehicles(prev => prev.map(v => v.id === id ? { ...v, ...vehicle } : v))
  }

  const deleteVehicle = (id: string) => {
    setVehicles(prev => prev.filter(v => v.id !== id))
  }

  // Driver CRUD
  const addDriver = (driver: Omit<Driver, 'id' | 'createdAt'>) => {
    const newDriver: Driver = {
      ...driver,
      id: Date.now().toString(),
      createdAt: new Date(),
    }
    setDrivers(prev => [...prev, newDriver])
  }

  const updateDriver = (id: string, driver: Partial<Driver>) => {
    setDrivers(prev => prev.map(d => d.id === id ? { ...d, ...driver } : d))
  }

  const deleteDriver = (id: string) => {
    setDrivers(prev => prev.filter(d => d.id !== id))
  }

  // Service Order CRUD
  const addServiceOrder = (order: Omit<ServiceOrder, 'id' | 'createdAt'>) => {
    const newOrder: ServiceOrder = {
      ...order,
      id: Date.now().toString(),
      createdAt: new Date(),
    }
    setServiceOrders(prev => [...prev, newOrder])
  }

  const updateServiceOrder = (id: string, order: Partial<ServiceOrder>) => {
    setServiceOrders(prev => prev.map(o => o.id === id ? { ...o, ...order } : o))
  }

  // Trip CRUD
  const addTrip = (trip: Omit<Trip, 'id' | 'createdAt'>) => {
    const newTrip: Trip = {
      ...trip,
      id: Date.now().toString(),
      createdAt: new Date(),
    }
    setTrips(prev => [...prev, newTrip])
  }

  const updateTrip = (id: string, trip: Partial<Trip>) => {
    setTrips(prev => prev.map(t => t.id === id ? { ...t, ...trip } : t))
  }

  // Alert
  const markAlertAsRead = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a))
  }

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

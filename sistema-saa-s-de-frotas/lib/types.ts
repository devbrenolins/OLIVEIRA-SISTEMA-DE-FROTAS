// FleetPro - Type Definitions

export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'manager' | 'driver'
  avatar?: string
  phone?: string
  createdAt: Date
}

export interface Vehicle {
  id: string
  plate: string
  brand: string
  model: string
  year: number
  type: 'car' | 'truck' | 'van' | 'motorcycle' | 'bus'
  status: 'available' | 'in_use' | 'maintenance' | 'inactive'
  fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid' | 'ethanol'
  currentOdometer: number
  lastMaintenanceDate?: Date
  nextMaintenanceDate?: Date
  insuranceExpiry?: Date
  licensingExpiry?: Date
  assignedDriverId?: string
  photo?: string
  documents: VehicleDocument[]
  createdAt: Date
}

export interface VehicleDocument {
  id: string
  vehicleId: string
  type: 'crlv' | 'insurance' | 'license' | 'inspection' | 'other'
  name: string
  url: string
  expiryDate?: Date
  createdAt: Date
}

export interface Driver {
  id: string
  name: string
  email: string
  phone: string
  cpf: string
  cnh: string
  cnhCategory: 'A' | 'B' | 'C' | 'D' | 'E' | 'AB' | 'AC' | 'AD' | 'AE'
  cnhExpiry: Date
  status: 'active' | 'inactive' | 'on_trip' | 'on_leave'
  avatar?: string
  address?: Address
  emergencyContact?: EmergencyContact
  assignedVehicleId?: string
  hireDate: Date
  createdAt: Date
}

export interface Address {
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
}

export interface EmergencyContact {
  name: string
  phone: string
  relationship: string
}

export interface ServiceOrder {
  id: string
  vehicleId: string
  type: 'preventive' | 'corrective' | 'inspection'
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  title: string
  description: string
  scheduledDate: Date
  completedDate?: Date
  cost?: number
  odometerAtService?: number
  mechanicNotes?: string
  parts?: ServicePart[]
  createdById: string
  assignedToId?: string
  createdAt: Date
}

export interface ServicePart {
  id: string
  name: string
  quantity: number
  unitCost: number
  totalCost: number
}

export interface Trip {
  id: string
  vehicleId: string
  driverId: string
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  origin: Location
  destination: Location
  waypoints?: Location[]
  scheduledStart: Date
  scheduledEnd: Date
  actualStart?: Date
  actualEnd?: Date
  startOdometer?: number
  endOdometer?: number
  fuelUsed?: number
  notes?: string
  createdAt: Date
}

export interface Location {
  address: string
  lat: number
  lng: number
}

export interface Inspection {
  id: string
  vehicleId: string
  driverId: string
  type: 'pre_trip' | 'post_trip' | 'daily'
  status: 'passed' | 'failed' | 'pending_review'
  date: Date
  odometerReading: number
  fuelLevel: number
  items: InspectionItem[]
  photos: InspectionPhoto[]
  signature?: string
  notes?: string
  createdAt: Date
}

export interface InspectionItem {
  id: string
  category: string
  item: string
  status: 'ok' | 'attention' | 'critical' | 'na'
  notes?: string
  photo?: string
}

export interface InspectionPhoto {
  id: string
  url: string
  caption?: string
  position: 'front' | 'back' | 'left' | 'right' | 'interior' | 'damage' | 'other'
}

export interface FuelRecord {
  id: string
  vehicleId: string
  driverId: string
  date: Date
  quantity: number
  unitPrice: number
  totalCost: number
  odometer: number
  fuelType: string
  station?: string
  receipt?: string
  createdAt: Date
}

export interface Expense {
  id: string
  vehicleId?: string
  driverId?: string
  category: 'fuel' | 'maintenance' | 'insurance' | 'licensing' | 'toll' | 'parking' | 'fine' | 'other'
  description: string
  amount: number
  date: Date
  receipt?: string
  approved: boolean
  approvedById?: string
  createdAt: Date
}

export interface Alert {
  id: string
  type: 'maintenance' | 'document' | 'license' | 'insurance' | 'inspection' | 'fuel' | 'trip'
  severity: 'info' | 'warning' | 'critical'
  title: string
  message: string
  vehicleId?: string
  driverId?: string
  read: boolean
  actionUrl?: string
  createdAt: Date
}

export interface DashboardStats {
  totalVehicles: number
  activeVehicles: number
  inMaintenance: number
  totalDrivers: number
  activeDrivers: number
  onTrip: number
  pendingServices: number
  completedTripsToday: number
  totalKmToday: number
  fuelCostToday: number
  alerts: number
  upcomingMaintenance: number
}

export interface ChartData {
  name: string
  value: number
  [key: string]: string | number
}

export interface Settings {
  supabaseUrl: string
  supabaseKey: string
  companyName: string
  companyLogo?: string
  currency: string
  timezone: string
  distanceUnit: 'km' | 'mi'
  fuelUnit: 'L' | 'gal'
}

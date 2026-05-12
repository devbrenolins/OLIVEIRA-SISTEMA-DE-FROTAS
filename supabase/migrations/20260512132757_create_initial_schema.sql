/*
  # OLIVEIRA FROTAS - Initial Database Schema

  1. New Tables
    - `profiles` - User profiles linked to auth.users
    - `drivers` - Driver information
    - `vehicles` - Fleet vehicles
    - `service_orders` - Maintenance and repair orders
    - `trips` - Trip records
    - `inspections` - Vehicle inspection checklists
    - `inspection_items` - Individual inspection checklist items
    - `fuel_records` - Fuel/refueling records
    - `alerts` - System alerts and notifications

  2. Security
    - RLS enabled on ALL tables
    - Restrictive policies: authenticated users can read, admins can write
    - Drivers can insert/update their own inspections, fuel records, trips

  3. Important Notes
    1. All tables use UUID primary keys with gen_random_uuid()
    2. Foreign key constraints ensure referential integrity
    3. RLS policies are restrictive by default
    4. Admin role determined by profiles.role = 'admin'
    5. Drivers table created BEFORE vehicles to satisfy FK reference
*/

-- Profiles table (no FK dependencies)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'driver' CHECK (role IN ('admin', 'manager', 'driver')),
  phone text DEFAULT '',
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Drivers table (depends on profiles only)
CREATE TABLE IF NOT EXISTS drivers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  cpf text UNIQUE NOT NULL,
  cnh text UNIQUE NOT NULL,
  cnh_category text NOT NULL,
  cnh_expiry date NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_trip', 'on_leave')),
  hire_date date NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read drivers"
  ON drivers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert drivers"
  ON drivers FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
  );

CREATE POLICY "Admins can update drivers"
  ON drivers FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
  );

CREATE POLICY "Admins can delete drivers"
  ON drivers FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
  );

CREATE POLICY "Drivers can read own data"
  ON drivers FOR SELECT
  TO authenticated
  USING (profile_id = auth.uid());

-- Vehicles table (depends on drivers for assigned_driver_id)
CREATE TABLE IF NOT EXISTS vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plate text UNIQUE NOT NULL,
  brand text NOT NULL,
  model text NOT NULL,
  year integer NOT NULL,
  type text NOT NULL CHECK (type IN ('car', 'truck', 'van', 'motorcycle', 'bus')),
  status text NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'in_use', 'maintenance', 'inactive')),
  fuel_type text NOT NULL CHECK (fuel_type IN ('gasoline', 'diesel', 'electric', 'hybrid', 'ethanol')),
  current_odometer integer NOT NULL DEFAULT 0,
  last_maintenance_date date,
  next_maintenance_date date,
  insurance_expiry date,
  licensing_expiry date,
  assigned_driver_id uuid REFERENCES drivers(id),
  photo_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read vehicles"
  ON vehicles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert vehicles"
  ON vehicles FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
  );

CREATE POLICY "Admins can update vehicles"
  ON vehicles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
  );

CREATE POLICY "Admins can delete vehicles"
  ON vehicles FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
  );

-- Add assigned_vehicle_id to drivers now that vehicles exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'drivers' AND column_name = 'assigned_vehicle_id'
  ) THEN
    ALTER TABLE drivers ADD COLUMN assigned_vehicle_id uuid REFERENCES vehicles(id);
  END IF;
END $$;

-- Service Orders table
CREATE TABLE IF NOT EXISTS service_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid NOT NULL REFERENCES vehicles(id),
  type text NOT NULL CHECK (type IN ('preventive', 'corrective', 'inspection')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  title text NOT NULL,
  description text DEFAULT '',
  scheduled_date date NOT NULL,
  completed_date date,
  cost numeric(10,2),
  odometer_at_service integer,
  mechanic_notes text,
  created_by_id uuid REFERENCES profiles(id),
  assigned_to_id uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE service_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read service orders"
  ON service_orders FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert service orders"
  ON service_orders FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
  );

CREATE POLICY "Admins can update service orders"
  ON service_orders FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
  );

-- Trips table
CREATE TABLE IF NOT EXISTS trips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid NOT NULL REFERENCES vehicles(id),
  driver_id uuid NOT NULL REFERENCES drivers(id),
  status text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  origin_address text NOT NULL,
  origin_lat numeric(10,7),
  origin_lng numeric(10,7),
  destination_address text NOT NULL,
  destination_lat numeric(10,7),
  destination_lng numeric(10,7),
  scheduled_start timestamptz NOT NULL,
  scheduled_end timestamptz NOT NULL,
  actual_start timestamptz,
  actual_end timestamptz,
  start_odometer integer,
  end_odometer integer,
  fuel_used numeric(8,2),
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE trips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read trips"
  ON trips FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert trips"
  ON trips FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
  );

CREATE POLICY "Admins can update trips"
  ON trips FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
  );

CREATE POLICY "Drivers can update own trips"
  ON trips FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM drivers WHERE id = trips.driver_id AND profile_id = auth.uid())
  );

-- Inspections table
CREATE TABLE IF NOT EXISTS inspections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid NOT NULL REFERENCES vehicles(id),
  driver_id uuid NOT NULL REFERENCES drivers(id),
  type text NOT NULL CHECK (type IN ('pre_trip', 'post_trip', 'daily')),
  status text NOT NULL DEFAULT 'pending_review' CHECK (status IN ('passed', 'failed', 'pending_review')),
  date timestamptz NOT NULL,
  odometer_reading integer NOT NULL,
  fuel_level integer DEFAULT 0,
  notes text,
  signature_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE inspections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read inspections"
  ON inspections FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Drivers can insert own inspections"
  ON inspections FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM drivers WHERE id = inspections.driver_id AND profile_id = auth.uid())
  );

CREATE POLICY "Admins can insert inspections"
  ON inspections FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
  );

CREATE POLICY "Admins can update inspections"
  ON inspections FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
  );

-- Inspection Items table
CREATE TABLE IF NOT EXISTS inspection_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inspection_id uuid NOT NULL REFERENCES inspections(id) ON DELETE CASCADE,
  category text NOT NULL,
  item text NOT NULL,
  status text NOT NULL DEFAULT 'ok' CHECK (status IN ('ok', 'attention', 'critical', 'na')),
  notes text,
  photo_url text
);

ALTER TABLE inspection_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read inspection items"
  ON inspection_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Drivers can insert own inspection items"
  ON inspection_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM inspections
      JOIN drivers ON inspections.driver_id = drivers.id
      WHERE inspections.id = inspection_items.inspection_id
      AND drivers.profile_id = auth.uid()
    )
  );

CREATE POLICY "Admins can insert inspection items"
  ON inspection_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
  );

-- Fuel Records table
CREATE TABLE IF NOT EXISTS fuel_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid NOT NULL REFERENCES vehicles(id),
  driver_id uuid NOT NULL REFERENCES drivers(id),
  date timestamptz NOT NULL,
  quantity numeric(8,2) NOT NULL,
  unit_price numeric(8,2) NOT NULL,
  total_cost numeric(10,2) NOT NULL,
  odometer integer NOT NULL,
  fuel_type text NOT NULL,
  station text,
  receipt_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE fuel_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read fuel records"
  ON fuel_records FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Drivers can insert own fuel records"
  ON fuel_records FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM drivers WHERE id = fuel_records.driver_id AND profile_id = auth.uid())
  );

CREATE POLICY "Admins can insert fuel records"
  ON fuel_records FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
  );

CREATE POLICY "Admins can update fuel records"
  ON fuel_records FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
  );

-- Alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  severity text NOT NULL CHECK (severity IN ('info', 'warning', 'critical')),
  title text NOT NULL,
  message text NOT NULL,
  vehicle_id uuid REFERENCES vehicles(id),
  driver_id uuid REFERENCES drivers(id),
  read boolean NOT NULL DEFAULT false,
  action_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read alerts"
  ON alerts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert alerts"
  ON alerts FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
  );

CREATE POLICY "Users can update alerts to mark as read"
  ON alerts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(status);
CREATE INDEX IF NOT EXISTS idx_vehicles_plate ON vehicles(plate);
CREATE INDEX IF NOT EXISTS idx_drivers_status ON drivers(status);
CREATE INDEX IF NOT EXISTS idx_drivers_cpf ON drivers(cpf);
CREATE INDEX IF NOT EXISTS idx_service_orders_vehicle ON service_orders(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_service_orders_status ON service_orders(status);
CREATE INDEX IF NOT EXISTS idx_trips_driver ON trips(driver_id);
CREATE INDEX IF NOT EXISTS idx_trips_status ON trips(status);
CREATE INDEX IF NOT EXISTS idx_inspections_vehicle ON inspections(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_fuel_records_vehicle ON fuel_records(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_alerts_read ON alerts(read);

-- Supabase Database Schema for Ivy Resort
-- Run this in the Supabase SQL Editor

-- Note: JWT secret is automatically managed by Supabase

-- Create reservations table
CREATE TABLE IF NOT EXISTS reservations (
  id BIGSERIAL PRIMARY KEY,
  confirmation_id VARCHAR(50) UNIQUE NOT NULL,
  guest_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  room_number VARCHAR(20),
  room_type VARCHAR(50),
  room_name VARCHAR(255) NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'USD',
  total_amount_in_currency DECIMAL(10,2),
  total_amount_display VARCHAR(100),
  special_requests TEXT,
  arrival_time VARCHAR(50),
  guest_count INTEGER DEFAULT 1,
  country VARCHAR(50),
  status VARCHAR(20) DEFAULT 'pending',
  email_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table for admin authentication
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_reservations_updated_at ON reservations(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_reservations_confirmation_id ON reservations(confirmation_id);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);
CREATE INDEX IF NOT EXISTS idx_reservations_email ON reservations(email);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_reservations_updated_at 
  BEFORE UPDATE ON reservations 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allow all for now - customize based on your auth needs)
CREATE POLICY "Allow all operations on reservations" ON reservations
  FOR ALL USING (true);

CREATE POLICY "Allow all operations on users" ON users
  FOR ALL USING (true);

-- Insert default admin user (password: admin123)
INSERT INTO users (email, password_hash, role) 
VALUES ('admin@ivyresort.com', '$2a$10$rQZ8K9L2vN3M4P5Q6R7S8uVwXyZ1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1U2V3W4X5Y6Z', 'admin')
ON CONFLICT (email) DO NOTHING;

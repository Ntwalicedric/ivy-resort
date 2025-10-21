-- Migration script to add visible_in_dashboard column to reservations table
-- Run this in your Supabase SQL editor

-- Add the visible_in_dashboard column with default value true
ALTER TABLE reservations 
ADD COLUMN visible_in_dashboard BOOLEAN DEFAULT true;

-- Update existing reservations to set visibility based on status
UPDATE reservations 
SET visible_in_dashboard = CASE 
  WHEN status IN ('cancelled', 'deleted', 'checked-out') THEN false
  ELSE true
END;

-- Add an index for better query performance
CREATE INDEX idx_reservations_visible_dashboard ON reservations(visible_in_dashboard);

-- Verify the migration
SELECT 
  status,
  visible_in_dashboard,
  COUNT(*) as count
FROM reservations 
GROUP BY status, visible_in_dashboard
ORDER BY status, visible_in_dashboard;

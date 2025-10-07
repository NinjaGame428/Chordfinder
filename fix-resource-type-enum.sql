-- Drop the enum type constraint if it exists and change type column to TEXT
ALTER TABLE public.resources 
  ALTER COLUMN type TYPE TEXT;

-- Drop the enum type if it exists
DROP TYPE IF EXISTS resource_type CASCADE;

-- Verify the change
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'resources' AND column_name = 'type';


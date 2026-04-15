-- SLAF Bus Pass System (e-PAS) - Database Schema
-- Last Updated: 2026-04-15

-- 1. PROFILES TABLE
-- Stores user metadata including roles and service numbers
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE,
  full_name TEXT,
  role TEXT DEFAULT 'Applicant' CHECK (role IN (
    'Applicant', 
    'Off I/C', 
    'O/Room', 
    'P3 Clerk', 
    'P3 Officer', 
    'Base CMDr', 
    'P&R Branch', 
    'Imprest Branch'
  )),
  service_no TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. APPLICATIONS TABLE
-- Stores main bus pass application data
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  applicant_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Applicant Details
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  nic TEXT NOT NULL,
  mobile TEXT NOT NULL,
  rank TEXT NOT NULL,
  posted_camp TEXT NOT NULL,
  svc_no TEXT NOT NULL,
  
  -- Bus Pass Info
  has_previous_pass BOOLEAN DEFAULT FALSE,
  previous_pass_no TEXT,
  journey_from TEXT NOT NULL,
  journey_to TEXT NOT NULL,
  nearest_town TEXT NOT NULL,
  bus_route_no TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  distance NUMERIC(10, 2) NOT NULL,
  
  -- Status & Tracking
  status TEXT DEFAULT 'Pending Off I/C' NOT NULL,
  application_received_date TIMESTAMPTZ DEFAULT NOW(),
  
  -- Phase 3 Tracking (CTB & Camp)
  ho_to_ctb_date DATE,
  received_from_ctb_date DATE,
  bus_pass_no TEXT,
  date_ho_to_camp DATE,
  
  -- Returns Tracking
  return_date_from_camp DATE,
  ho_date_to_ctb_return DATE,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on applications
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- 3. APPLICATION HISTORY TABLE
-- Stores the audit trail for each application
CREATE TABLE IF NOT EXISTS public.application_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE,
  step TEXT NOT NULL,
  role TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on application_history
ALTER TABLE public.application_history ENABLE ROW LEVEL SECURITY;

-- 4. RLS POLICIES

-- Profiles: Users can read their own profile, Admins/Officers can read all
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Officers can view all profiles" 
ON public.profiles FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role IN ('Off I/C', 'O/Room', 'P3 Clerk', 'P3 Officer', 'Base CMDr', 'P&R Branch', 'Imprest Branch')
  )
);

-- Applications: 
-- Applicants can see and create their own
-- Others can see and update based on role
CREATE POLICY "Applicants can view own applications"
ON public.applications FOR SELECT
USING (applicant_id = auth.uid());

CREATE POLICY "Officers can view all applications"
ON public.applications FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role != 'Applicant'
  )
);

CREATE POLICY "Applicants can insert own applications"
ON public.applications FOR INSERT
WITH CHECK (auth.uid() = applicant_id);

CREATE POLICY "Officers can update applications"
ON public.applications FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role != 'Applicant'
  )
);

-- History:
CREATE POLICY "Users can view relevant history"
ON public.application_history FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.applications 
    WHERE id = application_id 
    AND (applicant_id = auth.uid() OR EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role != 'Applicant'
    ))
  )
);

CREATE POLICY "Authenticated users can insert history"
ON public.application_history FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- 5. TRIGGER FOR AUTOMATIC PROFILE CREATION
-- This trigger creates a profile entry when a new user signs up via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, service_no)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    COALESCE(NEW.raw_user_meta_data->>'role', 'Applicant'),
    NEW.raw_user_meta_data->>'service_no'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

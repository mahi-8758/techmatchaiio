-- Fix privacy issue: Restrict employer access to candidate profiles
-- Employers should only see candidate profiles when candidates apply to their jobs or give explicit consent

-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Employers can view candidate profiles" ON public.profiles;

-- Create more restrictive policies
-- Users can still view their own profiles
-- Candidate profiles are private by default - employers need explicit permission to view them
CREATE POLICY "Candidate profiles are private by default" 
ON public.profiles 
FOR SELECT 
USING (
  auth.uid() = user_id OR 
  (user_type != 'candidate'::user_type)
);
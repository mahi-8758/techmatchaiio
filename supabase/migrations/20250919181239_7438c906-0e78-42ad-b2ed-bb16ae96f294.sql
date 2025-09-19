-- Remove all existing policies and create a comprehensive, secure policy structure
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Candidate profiles are private by default" ON public.profiles;

-- Create a single, comprehensive SELECT policy that ensures privacy
-- Only users can see their own profiles, regardless of user type
CREATE POLICY "Users can only view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Note: This ensures complete privacy - candidates and employers can only see their own profiles
-- If you need employers to see candidate profiles in the future, implement it through:
-- 1. A job application system where candidates explicitly apply
-- 2. A consent mechanism where candidates can choose to make profiles visible
-- 3. A matching system where both parties agree to share information
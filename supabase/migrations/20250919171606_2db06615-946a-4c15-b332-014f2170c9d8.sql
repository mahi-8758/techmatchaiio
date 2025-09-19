-- Create user_type enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE user_type AS ENUM ('candidate', 'employer');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create experience_level enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE experience_level AS ENUM ('entry', 'junior', 'mid', 'senior', 'lead', 'executive');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Ensure profiles table exists with correct structure
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE,
    user_type user_type NOT NULL,
    full_name TEXT,
    bio TEXT,
    location TEXT,
    company_name TEXT,
    company_size TEXT,
    industry TEXT,
    experience_level experience_level,
    skills TEXT[],
    website_url TEXT,
    linkedin_url TEXT,
    github_url TEXT,
    portfolio_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
DO $$ BEGIN
    -- Users can view their own profile
    CREATE POLICY "Users can view their own profile" 
    ON public.profiles FOR SELECT 
    USING (auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    -- Users can insert their own profile
    CREATE POLICY "Users can insert their own profile" 
    ON public.profiles FOR INSERT 
    WITH CHECK (auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    -- Users can update their own profile
    CREATE POLICY "Users can update their own profile" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    -- Employers can view candidate profiles
    CREATE POLICY "Employers can view candidate profiles" 
    ON public.profiles FOR SELECT 
    USING (user_type = 'candidate' OR auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create trigger for updating timestamps
DO $$ BEGIN
    CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, user_type, full_name)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data ->> 'user_type', 'candidate')::public.user_type,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', '')
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user registration
DO $$ BEGIN
    CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
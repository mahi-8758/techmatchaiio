-- First, let's create a function that creates default assessments for new users
CREATE OR REPLACE FUNCTION public.create_default_assessments_for_user(user_id_param UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.skill_assessments (
    title,
    description,
    assessment_type,
    difficulty_level,
    duration_minutes,
    status,
    user_id
  ) VALUES 
    ('JavaScript Fundamentals', 'Test your knowledge of modern JavaScript concepts', 'javascript', 'Intermediate', 45, 'available', user_id_param),
    ('React & TypeScript', 'Build a real-world component with TypeScript', 'react', 'Advanced', 60, 'available', user_id_param),
    ('Database Design', 'Design and optimize database schemas', 'database', 'Intermediate', 50, 'available', user_id_param),
    ('UI/UX Design Principles', 'Create user-centered design solutions', 'design', 'Beginner', 40, 'available', user_id_param),
    ('Python Programming', 'Master Python programming fundamentals', 'python', 'Intermediate', 55, 'available', user_id_param),
    ('System Design', 'Learn to design scalable systems', 'system-design', 'Advanced', 90, 'available', user_id_param);
END;
$$;

-- Update the handle_new_user function to also create default assessments
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (user_id, user_type, full_name)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data ->> 'user_type', 'candidate')::public.user_type,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', '')
  );
  
  -- Create default assessments for candidates
  IF COALESCE(NEW.raw_user_meta_data ->> 'user_type', 'candidate')::public.user_type = 'candidate' THEN
    PERFORM create_default_assessments_for_user(NEW.id);
  END IF;
  
  RETURN NEW;
END;
$$;
-- Insert sample skill assessments for testing
INSERT INTO public.skill_assessments (
  title,
  description,
  assessment_type,
  difficulty_level,
  duration_minutes,
  status,
  user_id
) VALUES 
  ('JavaScript Fundamentals', 'Test your knowledge of modern JavaScript concepts', 'javascript', 'Intermediate', 45, 'available', '00000000-0000-0000-0000-000000000000'),
  ('React & TypeScript', 'Build a real-world component with TypeScript', 'react', 'Advanced', 60, 'available', '00000000-0000-0000-0000-000000000000'),
  ('Database Design', 'Design and optimize database schemas', 'database', 'Intermediate', 50, 'available', '00000000-0000-0000-0000-000000000000'),
  ('UI/UX Design Principles', 'Create user-centered design solutions', 'design', 'Beginner', 40, 'available', '00000000-0000-0000-0000-000000000000'),
  ('Python Programming', 'Master Python programming fundamentals', 'python', 'Intermediate', 55, 'available', '00000000-0000-0000-0000-000000000000'),
  ('System Design', 'Learn to design scalable systems', 'system-design', 'Advanced', 90, 'available', '00000000-0000-0000-0000-000000000000');
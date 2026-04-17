-- Seed data for Supabase
INSERT INTO users (name, email, phone, college, year, password, role)
VALUES
  (
    'Tech Fest Admin',
    'admin@techfest.local',
    '9999999999',
    'TINT',
    4,
    '$2b$10$kGfI4K6eIJS6sQe4Sg0g5e4nM3Iu6CD6Tf3SXj0gA5Q7fOkX2n5G2',
    'admin'
  )
ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  college = EXCLUDED.college,
  year = EXCLUDED.year,
  role = EXCLUDED.role;

-- First add unique constraint for event names, since Postgres requires unique key for ON CONFLICT to work
ALTER TABLE events ADD CONSTRAINT events_name_key UNIQUE (name);

INSERT INTO events (name, category, description, rules, schedule, venue, prize)
VALUES
  (
    'AI HackSprint',
    'AI',
    'Build an AI-enabled prototype in a fast-paced sprint format.',
    'Team size 2-4. Original work only.',
    NOW() + INTERVAL '15 days',
    'Main Auditorium',
    'INR 50,000'
  ),
  (
    'Robo Race',
    'Robotics',
    'Design and race your autonomous robot on an obstacle track.',
    'Safety checks mandatory before entry.',
    NOW() + INTERVAL '20 days',
    'Robotics Lab',
    'INR 30,000'
  )
ON CONFLICT (name) DO UPDATE SET
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  rules = EXCLUDED.rules,
  schedule = EXCLUDED.schedule,
  venue = EXCLUDED.venue,
  prize = EXCLUDED.prize;

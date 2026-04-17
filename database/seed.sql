USE tech_fest;

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
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  phone = VALUES(phone),
  college = VALUES(college),
  year = VALUES(year),
  role = VALUES(role);

INSERT INTO events (name, category, description, rules, schedule, venue, prize)
VALUES
  (
    'AI HackSprint',
    'AI',
    'Build an AI-enabled prototype in a fast-paced sprint format.',
    'Team size 2-4. Original work only.',
    DATE_ADD(NOW(), INTERVAL 15 DAY),
    'Main Auditorium',
    'INR 50,000'
  ),
  (
    'Robo Race',
    'Robotics',
    'Design and race your autonomous robot on an obstacle track.',
    'Safety checks mandatory before entry.',
    DATE_ADD(NOW(), INTERVAL 20 DAY),
    'Robotics Lab',
    'INR 30,000'
  )
ON DUPLICATE KEY UPDATE
  category = VALUES(category),
  description = VALUES(description),
  rules = VALUES(rules),
  schedule = VALUES(schedule),
  venue = VALUES(venue),
  prize = VALUES(prize);

CREATE DATABASE IF NOT EXISTS tech_fest
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE tech_fest;

CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20) NOT NULL,
  college VARCHAR(255) NOT NULL,
  year INT NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('participant', 'admin', 'volunteer', 'faculty', 'organizer') NOT NULL DEFAULT 'participant',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP WITH TIME ZONE,
  CONSTRAINT chk_users_year CHECK (year BETWEEN 1 AND 8)
);

CREATE TABLE IF NOT EXISTS events (
  event_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  rules TEXT NOT NULL,
  schedule TIMESTAMP WITH TIME ZONE WITH TIME ZONE NOT NULL,
  venue VARCHAR(255) NOT NULL,
  prize VARCHAR(255) NULL,
  version INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS registrations (
  registration_id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  event_id INT NOT NULL,
  student_id_path VARCHAR(500) NULL,
  registered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP WITH TIME ZONE,
  CONSTRAINT uk_registrations_user_event UNIQUE (user_id, event_id),
  CONSTRAINT fk_registrations_user FOREIGN KEY (user_id)
    REFERENCES users(user_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT fk_registrations_event FOREIGN KEY (event_id)
    REFERENCES events(event_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS queries (
  query_id SERIAL PRIMARY KEY,
  user_id INT NULL,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(255) NOT NULL,
  question TEXT NOT NULL,
  response TEXT NULL,
  status ENUM('pending', 'resolved') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP WITH TIME ZONE,
  resolved_at TIMESTAMP WITH TIME ZONE NULL,
  CONSTRAINT fk_queries_user FOREIGN KEY (user_id)
    REFERENCES users(user_id)
    ON UPDATE CASCADE
    ON DELETE SET NULL
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_events_category ON events(category);
CREATE INDEX idx_events_schedule ON events(schedule);
CREATE INDEX idx_registrations_user_id ON registrations(user_id);
CREATE INDEX idx_registrations_event_id ON registrations(event_id);
CREATE INDEX idx_queries_email ON queries(email);
CREATE INDEX idx_queries_status ON queries(status);
CREATE INDEX idx_queries_created_at ON queries(created_at);

CREATE VIEW v_upcoming_events AS
SELECT event_id, name, category, schedule, venue, prize
FROM events
WHERE schedule >= NOW()
ORDER BY schedule ASC;

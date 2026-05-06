CREATE TABLE IF NOT EXISTS votes (
  id SERIAL PRIMARY KEY,
  participant_id INTEGER NOT NULL CHECK (participant_id IN (1, 2, 3)),
  created_at TIMESTAMP DEFAULT NOW()
);
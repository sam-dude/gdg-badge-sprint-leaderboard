-- GDG OAU Leaderboard Database Schema

-- Create participants table
CREATE TABLE participants (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  google_dev_profile_url TEXT,
  google_skills_profile_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create scores table
CREATE TABLE scores (
  id SERIAL PRIMARY KEY,
  participant_id INTEGER UNIQUE REFERENCES participants(id) ON DELETE CASCADE,
  google_dev_badges INTEGER DEFAULT 0 CHECK (google_dev_badges >= 0),
  google_skills_badges INTEGER DEFAULT 0 CHECK (google_skills_badges >= 0),
  social_media_posts INTEGER DEFAULT 0 CHECK (social_media_posts >= 0),
  total_points INTEGER DEFAULT 0,
  last_scraped TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_participants_email ON participants(email);
CREATE INDEX idx_scores_total_points ON scores(total_points DESC);
CREATE INDEX idx_scores_participant_id ON scores(participant_id);

-- Comments
COMMENT ON TABLE participants IS 'Stores participant information for the 30-day challenge';
COMMENT ON TABLE scores IS 'Stores badge counts and calculated scores for each participant';
COMMENT ON COLUMN scores.total_points IS 'Calculated as: (google_dev_badges + google_skills_badges) * 5 + social_media_posts * 2';

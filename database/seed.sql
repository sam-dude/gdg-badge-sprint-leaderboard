-- Sample data for testing
-- Insert sample participants
INSERT INTO participants (name, email, google_dev_profile_url, google_skills_profile_url) VALUES
('Alice Johnson', 'alice@example.com', 'https://developers.google.com/profile/u/alice', 'https://www.skills.google/public_profiles/alice123'),
('Bob Smith', 'bob@example.com', 'https://developers.google.com/profile/u/bob', 'https://www.skills.google/public_profiles/bob456'),
('Charlie Davis', 'charlie@example.com', 'https://developers.google.com/profile/u/charlie', 'https://www.skills.google/public_profiles/charlie789'),
('Diana Prince', 'diana@example.com', 'https://developers.google.com/profile/u/diana', 'https://www.skills.google/public_profiles/diana101'),
('Ethan Hunt', 'ethan@example.com', 'https://developers.google.com/profile/u/ethan', 'https://www.skills.google/public_profiles/ethan202');

-- Insert sample scores
INSERT INTO scores (participant_id, google_dev_badges, google_skills_badges, social_media_posts, total_points) VALUES
(1, 8, 5, 10, 85),  -- (8+5)*5 + 10*2 = 85
(2, 6, 4, 8, 66),   -- (6+4)*5 + 8*2 = 66
(3, 5, 3, 5, 50),   -- (5+3)*5 + 5*2 = 50
(4, 10, 7, 12, 109),-- (10+7)*5 + 12*2 = 109
(5, 3, 2, 3, 31);   -- (3+2)*5 + 3*2 = 31

-- Update timestamps
UPDATE scores SET last_scraped = NOW() - INTERVAL '2 hours', updated_at = NOW();

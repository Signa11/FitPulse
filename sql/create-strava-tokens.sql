-- Create strava_tokens table for Strava OAuth integration
CREATE TABLE IF NOT EXISTS strava_tokens (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  athlete_id BIGINT,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  expires_at BIGINT NOT NULL,
  athlete_name TEXT DEFAULT 'Athlete',
  connected_at TIMESTAMPTZ DEFAULT NOW()
);

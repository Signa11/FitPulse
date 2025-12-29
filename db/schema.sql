-- =====================================================
-- ActiveLife PWA - Database Schema
-- Neon PostgreSQL
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- USERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    level INTEGER DEFAULT 1,
    points INTEGER DEFAULT 0,
    streak INTEGER DEFAULT 0,
    workouts_completed INTEGER DEFAULT 0,
    recipes_cooked INTEGER DEFAULT 0,
    member_since TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- WORKOUT CATEGORIES
-- =====================================================
CREATE TABLE IF NOT EXISTS workout_categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(10),
    sort_order INTEGER DEFAULT 0
);

-- Insert default categories
INSERT INTO workout_categories (id, name, icon, sort_order) VALUES
    ('hiit', 'High Intensity (HIIT)', '🔥', 1),
    ('yoga', 'Yoga & Stretch', '🧘', 2),
    ('beginner', 'Beginner Friendly', '⭐', 3),
    ('strength', 'Strength Training', '💪', 4)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- WORKOUTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS workouts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    instructor VARCHAR(255) NOT NULL,
    category_id VARCHAR(50) REFERENCES workout_categories(id),
    duration INTEGER NOT NULL, -- in minutes
    intensity VARCHAR(20) NOT NULL, -- Low, Medium, High
    intensity_emoji VARCHAR(20),
    thumbnail_url TEXT,
    description TEXT,
    calories INTEGER,
    difficulty VARCHAR(50),
    equipment TEXT[], -- Array of equipment needed
    video_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- NUTRITION FILTERS
-- =====================================================
CREATE TABLE IF NOT EXISTS nutrition_filters (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    sort_order INTEGER DEFAULT 0
);

-- Insert default filters
INSERT INTO nutrition_filters (id, name, sort_order) VALUES
    ('all', 'All', 0),
    ('shakes', 'Shakes', 1),
    ('high-protein', 'High Protein', 2),
    ('vegan', 'Vegan', 3),
    ('snacks', 'Snacks', 4),
    ('meals', 'Meals', 5)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- RECIPES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS recipes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    image_url TEXT,
    protein INTEGER,
    calories INTEGER,
    carbs INTEGER,
    fat INTEGER,
    prep_time INTEGER, -- in minutes
    tags TEXT[], -- Array of tags
    ingredients TEXT[], -- Array of ingredients
    instructions TEXT[], -- Array of instruction steps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- CHALLENGES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS challenges (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration INTEGER NOT NULL, -- in days
    participants INTEGER DEFAULT 0,
    image_url TEXT,
    reward VARCHAR(100),
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- USER CHALLENGES (Join table)
-- =====================================================
CREATE TABLE IF NOT EXISTS user_challenges (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    challenge_id INTEGER REFERENCES challenges(id) ON DELETE CASCADE,
    current_day INTEGER DEFAULT 0,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    UNIQUE(user_id, challenge_id)
);

-- =====================================================
-- USER ACTIVITIES (For the feed)
-- =====================================================
CREATE TABLE IF NOT EXISTS user_activities (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL, -- completed, joined, achieved, made, reached
    target VARCHAR(255) NOT NULL, -- workout name, challenge name, etc.
    target_type VARCHAR(50) NOT NULL, -- workout, challenge, achievement, recipe
    target_id INTEGER, -- Optional reference to the target
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- ACTIVITY INTERACTIONS (Likes & Comments)
-- =====================================================
CREATE TABLE IF NOT EXISTS activity_likes (
    id SERIAL PRIMARY KEY,
    activity_id INTEGER REFERENCES user_activities(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(activity_id, user_id)
);

CREATE TABLE IF NOT EXISTS activity_comments (
    id SERIAL PRIMARY KEY,
    activity_id INTEGER REFERENCES user_activities(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- USER BADGES
-- =====================================================
CREATE TABLE IF NOT EXISTS badges (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(10),
    description TEXT,
    requirement TEXT -- What needs to be done to earn this badge
);

-- Insert default badges
INSERT INTO badges (name, icon, description, requirement) VALUES
    ('Early Bird', '🌅', 'Complete 5 morning workouts', 'morning_workouts >= 5'),
    ('Streak Master', '🔥', 'Maintain a 7-day streak', 'streak >= 7'),
    ('Shake Artist', '🥤', 'Try 10 different recipes', 'recipes_cooked >= 10'),
    ('HIIT Hero', '💪', 'Complete 20 HIIT workouts', 'hiit_workouts >= 20'),
    ('Zen Master', '🧘', 'Complete 15 yoga sessions', 'yoga_workouts >= 15'),
    ('Social Butterfly', '🦋', 'Give 50 high-fives', 'high_fives >= 50'),
    ('Challenge Champion', '🏆', 'Complete 3 challenges', 'challenges_completed >= 3')
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS user_badges (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    badge_id INTEGER REFERENCES badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, badge_id)
);

-- =====================================================
-- USER WORKOUT HISTORY
-- =====================================================
CREATE TABLE IF NOT EXISTS user_workouts (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    workout_id INTEGER REFERENCES workouts(id) ON DELETE CASCADE,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    duration_actual INTEGER, -- Actual time spent in minutes
    calories_burned INTEGER
);

-- =====================================================
-- USER RECIPE HISTORY
-- =====================================================
CREATE TABLE IF NOT EXISTS user_recipes (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
    made_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- PLANNED ITEMS (My Plan feature)
-- =====================================================
CREATE TABLE IF NOT EXISTS planned_items (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    item_type VARCHAR(20) NOT NULL, -- workout, meal
    item_id INTEGER, -- Reference to workout or recipe
    title VARCHAR(255) NOT NULL,
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,
    duration INTEGER, -- in minutes
    completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_user_activities_user_id ON user_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_created_at ON user_activities(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_workouts_category ON workouts(category_id);
CREATE INDEX IF NOT EXISTS idx_planned_items_user_date ON planned_items(user_id, scheduled_date);
CREATE INDEX IF NOT EXISTS idx_user_challenges_user ON user_challenges(user_id);

-- =====================================================
-- UPDATED_AT TRIGGER FUNCTION
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workouts_updated_at BEFORE UPDATE ON workouts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recipes_updated_at BEFORE UPDATE ON recipes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_challenges_updated_at BEFORE UPDATE ON challenges
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ActiveLife PWA - Seed Data
-- Initial data to populate the database
-- =====================================================

-- =====================================================
-- SEED WORKOUTS
-- =====================================================
INSERT INTO workouts (title, instructor, category_id, duration, intensity, intensity_emoji, thumbnail_url, description, calories, difficulty, equipment) VALUES
    ('Morning Energy Blast', 'Sarah Johnson', 'hiit', 20, 'High', '🔥🔥', 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop', 'Start your day with this high-energy HIIT workout designed to boost your metabolism and energize your body for the day ahead.', 250, 'Advanced', ARRAY['Dumbbells', 'Mat']),
    ('Sunset Yoga Flow', 'Emma Chen', 'yoga', 30, 'Low', '🧘', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop', 'Wind down with this calming yoga flow that focuses on deep stretches and mindful breathing.', 120, 'All Levels', ARRAY['Mat']),
    ('Core Crusher Express', 'Mike Torres', 'hiit', 15, 'Medium', '🔥', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop', 'A quick but intense core workout to strengthen your abs and improve stability.', 180, 'Intermediate', ARRAY['Mat']),
    ('First Steps Fitness', 'Lisa Park', 'beginner', 25, 'Low', '⭐', 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop', 'Perfect for beginners! This workout introduces basic movements to build a strong foundation.', 150, 'Beginner', ARRAY['None']),
    ('Power Strength Session', 'James Wilson', 'strength', 45, 'High', '💪💪', 'https://images.unsplash.com/photo-1581009146145-b5ef050c149a?w=400&h=300&fit=crop', 'Build lean muscle and increase strength with this comprehensive full-body workout.', 320, 'Advanced', ARRAY['Dumbbells', 'Resistance Bands', 'Mat']),
    ('Mobility Reset', 'Emma Chen', 'yoga', 20, 'Low', '🧘', 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=400&h=300&fit=crop', 'Improve flexibility and release tension with targeted mobility exercises.', 80, 'All Levels', ARRAY['Mat', 'Foam Roller']),
    ('Tabata Thunder', 'Sarah Johnson', 'hiit', 25, 'High', '🔥🔥🔥', 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=400&h=300&fit=crop', 'Classic Tabata intervals to push your limits and maximize calorie burn.', 280, 'Advanced', ARRAY['None']),
    ('Easy Morning Stretch', 'Lisa Park', 'beginner', 15, 'Low', '⭐', 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=400&h=300&fit=crop', 'Gentle stretches to wake up your body and prepare for the day.', 60, 'Beginner', ARRAY['Mat'])
ON CONFLICT DO NOTHING;

-- =====================================================
-- SEED RECIPES
-- =====================================================
INSERT INTO recipes (title, category, image_url, protein, calories, carbs, fat, prep_time, tags, ingredients, instructions) VALUES
    ('Green Power Shake', 'shakes', 'https://images.unsplash.com/photo-1638176066666-ffb2f013c7dd?w=400&h=400&fit=crop', 24, 180, 20, 5, 5, 
     ARRAY['shakes', 'high-protein', 'vegan'],
     ARRAY['1 scoop Herbalife Formula 1 (Vanilla)', '1 handful spinach', '1/2 banana', '1 tbsp almond butter', '250ml almond milk', 'Ice cubes'],
     ARRAY['Add almond milk to the blender first.', 'Add spinach and blend until smooth.', 'Add Formula 1, banana, and almond butter.', 'Add ice cubes and blend until creamy.', 'Pour into a glass and enjoy immediately!']),
    
    ('Berry Protein Bowl', 'meals', 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&h=400&fit=crop', 28, 320, 35, 8, 10,
     ARRAY['high-protein', 'vegan'],
     ARRAY['1 scoop Herbalife Formula 1 (Berry)', '100g frozen mixed berries', '1/2 cup Greek yogurt', '30g granola', 'Fresh berries for topping', 'Chia seeds'],
     ARRAY['Blend Formula 1 with frozen berries and a splash of water.', 'Pour the thick mixture into a bowl.', 'Top with Greek yogurt, granola, and fresh berries.', 'Sprinkle chia seeds on top.', 'Serve immediately and enjoy!']),
    
    ('Protein Energy Bites', 'snacks', 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400&h=400&fit=crop', 8, 95, 10, 4, 15,
     ARRAY['snacks', 'high-protein'],
     ARRAY['1 cup rolled oats', '1/2 cup peanut butter', '2 scoops Herbalife PDM (Chocolate)', '2 tbsp honey', 'Dark chocolate chips'],
     ARRAY['Mix oats, peanut butter, and PDM in a bowl.', 'Add honey and mix until combined.', 'Fold in chocolate chips.', 'Roll into small balls and refrigerate for 30 minutes.', 'Store in the fridge for up to 1 week.']),
    
    ('Tropical Mango Smoothie', 'shakes', 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400&h=400&fit=crop', 20, 210, 28, 3, 5,
     ARRAY['shakes', 'vegan'],
     ARRAY['1 scoop Herbalife Formula 1 (Tropical Fruit)', '1/2 cup frozen mango', '1/4 cup pineapple chunks', '250ml coconut water', 'Fresh mint leaves'],
     ARRAY['Add coconut water to the blender.', 'Add frozen mango and pineapple.', 'Add Formula 1 and blend until smooth.', 'Garnish with fresh mint.', 'Serve chilled!']),
    
    ('High Protein Pancakes', 'meals', 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=400&fit=crop', 32, 380, 40, 10, 20,
     ARRAY['high-protein', 'meals'],
     ARRAY['2 scoops Herbalife Formula 1 (Vanilla)', '1/2 cup oat flour', '1 egg', '1/2 cup milk', 'Coconut oil for cooking', 'Fresh berries and maple syrup'],
     ARRAY['Mix Formula 1 and oat flour in a bowl.', 'Whisk in egg and milk until smooth.', 'Heat coconut oil in a pan over medium heat.', 'Pour batter and cook until bubbles form, then flip.', 'Serve with fresh berries and a drizzle of maple syrup.']),
    
    ('Vegan Buddha Bowl', 'meals', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop', 18, 420, 52, 14, 25,
     ARRAY['vegan', 'meals'],
     ARRAY['1 cup quinoa (cooked)', '1/2 cup chickpeas', '1 cup roasted vegetables', '1/4 avocado', 'Tahini dressing', 'Fresh herbs'],
     ARRAY['Cook quinoa according to package instructions.', 'Roast chickpeas with spices until crispy.', 'Arrange quinoa, veggies, and chickpeas in a bowl.', 'Add sliced avocado on top.', 'Drizzle with tahini dressing and garnish with herbs.'])
ON CONFLICT DO NOTHING;

-- =====================================================
-- SEED CHALLENGES
-- =====================================================
INSERT INTO challenges (title, description, duration, participants, image_url, reward, start_date, end_date, is_active) VALUES
    ('Summer Shred Challenge', 'Transform your body in 21 days with daily workouts and nutrition tips.', 21, 1247, 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&h=300&fit=crop', '+500 Points', CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE + INTERVAL '16 days', true),
    ('Hydration Hero', 'Drink 8 glasses of water daily for 14 days straight.', 14, 892, 'https://images.unsplash.com/photo-1559839914-17aae19cec71?w=600&h=300&fit=crop', '+200 Points', CURRENT_DATE + INTERVAL '7 days', CURRENT_DATE + INTERVAL '21 days', true),
    ('Morning Warrior', 'Complete a workout before 8 AM for 7 consecutive days.', 7, 654, 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=600&h=300&fit=crop', '+150 Points', CURRENT_DATE + INTERVAL '14 days', CURRENT_DATE + INTERVAL '21 days', true)
ON CONFLICT DO NOTHING;

-- =====================================================
-- SEED DEMO USER
-- =====================================================
INSERT INTO users (id, email, name, avatar_url, level, points, streak, workouts_completed, recipes_cooked, member_since) VALUES
    ('550e8400-e29b-41d4-a716-446655440000', 'alex.j@email.com', 'Alex Johnson', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop', 12, 1560, 5, 47, 23, '2024-03-01')
ON CONFLICT (id) DO NOTHING;

-- Give demo user some badges
INSERT INTO user_badges (user_id, badge_id) 
SELECT '550e8400-e29b-41d4-a716-446655440000', id FROM badges WHERE name IN ('Early Bird', 'Streak Master', 'Shake Artist')
ON CONFLICT DO NOTHING;

-- Join demo user to the Summer Shred Challenge
INSERT INTO user_challenges (user_id, challenge_id, current_day)
SELECT '550e8400-e29b-41d4-a716-446655440000', id, 5 FROM challenges WHERE title = 'Summer Shred Challenge'
ON CONFLICT DO NOTHING;

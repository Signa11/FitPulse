// =====================================================
// FitPulse PWA - Mock Data
// =====================================================

// Workout Categories
export const workoutCategories = [
    {
        id: 'hiit',
        name: 'High Intensity (HIIT)',
        icon: '🔥'
    },
    {
        id: 'yoga',
        name: 'Yoga & Stretch',
        icon: '🧘'
    },
    {
        id: 'beginner',
        name: 'Beginner Friendly',
        icon: '⭐'
    },
    {
        id: 'strength',
        name: 'Strength Training',
        icon: '💪'
    }
];

// Workouts Data
export const workouts = [
    {
        id: 1,
        title: 'Morning Energy Blast',
        instructor: 'Sarah Johnson',
        category: 'hiit',
        duration: 20,
        intensity: 'High',
        intensityEmoji: '🔥🔥',
        thumbnail: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop',
        equipment: ['Dumbbells', 'Mat'],
        description: 'Start your day with this high-energy HIIT workout designed to boost your metabolism and energize your body for the day ahead.',
        calories: 250,
        difficulty: 'Advanced'
    },
    {
        id: 2,
        title: 'Sunset Yoga Flow',
        instructor: 'Emma Chen',
        category: 'yoga',
        duration: 30,
        intensity: 'Low',
        intensityEmoji: '🧘',
        thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop',
        equipment: ['Mat'],
        description: 'Wind down with this calming yoga flow that focuses on deep stretches and mindful breathing.',
        calories: 120,
        difficulty: 'All Levels'
    },
    {
        id: 3,
        title: 'Core Crusher Express',
        instructor: 'Mike Torres',
        category: 'hiit',
        duration: 15,
        intensity: 'Medium',
        intensityEmoji: '🔥',
        thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
        equipment: ['Mat'],
        description: 'A quick but intense core workout to strengthen your abs and improve stability.',
        calories: 180,
        difficulty: 'Intermediate'
    },
    {
        id: 4,
        title: 'First Steps Fitness',
        instructor: 'Lisa Park',
        category: 'beginner',
        duration: 25,
        intensity: 'Low',
        intensityEmoji: '⭐',
        thumbnail: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop',
        equipment: ['None'],
        description: 'Perfect for beginners! This workout introduces basic movements to build a strong foundation.',
        calories: 150,
        difficulty: 'Beginner'
    },
    {
        id: 5,
        title: 'Power Strength Session',
        instructor: 'James Wilson',
        category: 'strength',
        duration: 45,
        intensity: 'High',
        intensityEmoji: '💪💪',
        thumbnail: 'https://images.unsplash.com/photo-1581009146145-b5ef050c149a?w=400&h=300&fit=crop',
        equipment: ['Dumbbells', 'Resistance Bands', 'Mat'],
        description: 'Build lean muscle and increase strength with this comprehensive full-body workout.',
        calories: 320,
        difficulty: 'Advanced'
    },
    {
        id: 6,
        title: 'Mobility Reset',
        instructor: 'Emma Chen',
        category: 'yoga',
        duration: 20,
        intensity: 'Low',
        intensityEmoji: '🧘',
        thumbnail: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=400&h=300&fit=crop',
        equipment: ['Mat', 'Foam Roller'],
        description: 'Improve flexibility and release tension with targeted mobility exercises.',
        calories: 80,
        difficulty: 'All Levels'
    },
    {
        id: 7,
        title: 'Tabata Thunder',
        instructor: 'Sarah Johnson',
        category: 'hiit',
        duration: 25,
        intensity: 'High',
        intensityEmoji: '🔥🔥🔥',
        thumbnail: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=400&h=300&fit=crop',
        equipment: ['None'],
        description: 'Classic Tabata intervals to push your limits and maximize calorie burn.',
        calories: 280,
        difficulty: 'Advanced'
    },
    {
        id: 8,
        title: 'Easy Morning Stretch',
        instructor: 'Lisa Park',
        category: 'beginner',
        duration: 15,
        intensity: 'Low',
        intensityEmoji: '⭐',
        thumbnail: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=400&h=300&fit=crop',
        equipment: ['Mat'],
        description: 'Gentle stretches to wake up your body and prepare for the day.',
        calories: 60,
        difficulty: 'Beginner'
    }
];

// Nutrition Filter Categories
export const nutritionFilters = [
    { id: 'all', name: 'All' },
    { id: 'shakes', name: 'Shakes' },
    { id: 'high-protein', name: 'High Protein' },
    { id: 'vegan', name: 'Vegan' },
    { id: 'snacks', name: 'Snacks' },
    { id: 'meals', name: 'Meals' }
];

// Recipes Data
export const recipes = [
    {
        id: 1,
        title: 'Green Power Shake',
        category: 'shakes',
        image: 'https://images.unsplash.com/photo-1638176066666-ffb2f013c7dd?w=400&h=400&fit=crop',
        protein: 24,
        calories: 180,
        carbs: 20,
        fat: 5,
        prepTime: 5,
        tags: ['shakes', 'high-protein', 'vegan'],
        ingredients: [
            '1 scoop Herbalife Formula 1 (Vanilla)',
            '1 handful spinach',
            '1/2 banana',
            '1 tbsp almond butter',
            '250ml almond milk',
            'Ice cubes'
        ],
        instructions: [
            'Add almond milk to the blender first.',
            'Add spinach and blend until smooth.',
            'Add Formula 1, banana, and almond butter.',
            'Add ice cubes and blend until creamy.',
            'Pour into a glass and enjoy immediately!'
        ]
    },
    {
        id: 2,
        title: 'Berry Protein Bowl',
        category: 'meals',
        image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&h=400&fit=crop',
        protein: 28,
        calories: 320,
        carbs: 35,
        fat: 8,
        prepTime: 10,
        tags: ['high-protein', 'vegan'],
        ingredients: [
            '1 scoop Herbalife Formula 1 (Berry)',
            '100g frozen mixed berries',
            '1/2 cup Greek yogurt',
            '30g granola',
            'Fresh berries for topping',
            'Chia seeds'
        ],
        instructions: [
            'Blend Formula 1 with frozen berries and a splash of water.',
            'Pour the thick mixture into a bowl.',
            'Top with Greek yogurt, granola, and fresh berries.',
            'Sprinkle chia seeds on top.',
            'Serve immediately and enjoy!'
        ]
    },
    {
        id: 3,
        title: 'Protein Energy Bites',
        category: 'snacks',
        image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400&h=400&fit=crop',
        protein: 8,
        calories: 95,
        carbs: 10,
        fat: 4,
        prepTime: 15,
        tags: ['snacks', 'high-protein'],
        ingredients: [
            '1 cup rolled oats',
            '1/2 cup peanut butter',
            '2 scoops Herbalife PDM (Chocolate)',
            '2 tbsp honey',
            'Dark chocolate chips'
        ],
        instructions: [
            'Mix oats, peanut butter, and PDM in a bowl.',
            'Add honey and mix until combined.',
            'Fold in chocolate chips.',
            'Roll into small balls and refrigerate for 30 minutes.',
            'Store in the fridge for up to 1 week.'
        ]
    },
    {
        id: 4,
        title: 'Tropical Mango Smoothie',
        category: 'shakes',
        image: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400&h=400&fit=crop',
        protein: 20,
        calories: 210,
        carbs: 28,
        fat: 3,
        prepTime: 5,
        tags: ['shakes', 'vegan'],
        ingredients: [
            '1 scoop Herbalife Formula 1 (Tropical Fruit)',
            '1/2 cup frozen mango',
            '1/4 cup pineapple chunks',
            '250ml coconut water',
            'Fresh mint leaves'
        ],
        instructions: [
            'Add coconut water to the blender.',
            'Add frozen mango and pineapple.',
            'Add Formula 1 and blend until smooth.',
            'Garnish with fresh mint.',
            'Serve chilled!'
        ]
    },
    {
        id: 5,
        title: 'High Protein Pancakes',
        category: 'meals',
        image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=400&fit=crop',
        protein: 32,
        calories: 380,
        carbs: 40,
        fat: 10,
        prepTime: 20,
        tags: ['high-protein', 'meals'],
        ingredients: [
            '2 scoops Herbalife Formula 1 (Vanilla)',
            '1/2 cup oat flour',
            '1 egg',
            '1/2 cup milk',
            'Coconut oil for cooking',
            'Fresh berries and maple syrup'
        ],
        instructions: [
            'Mix Formula 1 and oat flour in a bowl.',
            'Whisk in egg and milk until smooth.',
            'Heat coconut oil in a pan over medium heat.',
            'Pour batter and cook until bubbles form, then flip.',
            'Serve with fresh berries and a drizzle of maple syrup.'
        ]
    },
    {
        id: 6,
        title: 'Vegan Buddha Bowl',
        category: 'meals',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop',
        protein: 18,
        calories: 420,
        carbs: 52,
        fat: 14,
        prepTime: 25,
        tags: ['vegan', 'meals'],
        ingredients: [
            '1 cup quinoa (cooked)',
            '1/2 cup chickpeas',
            '1 cup roasted vegetables',
            '1/4 avocado',
            'Tahini dressing',
            'Fresh herbs'
        ],
        instructions: [
            'Cook quinoa according to package instructions.',
            'Roast chickpeas with spices until crispy.',
            'Arrange quinoa, veggies, and chickpeas in a bowl.',
            'Add sliced avocado on top.',
            'Drizzle with tahini dressing and garnish with herbs.'
        ]
    }
];

// Community Feed Data
export const communityFeed = [
    {
        id: 1,
        user: 'Sarah J.',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
        action: 'completed',
        target: 'Morning Energy Blast',
        targetType: 'workout',
        timestamp: '2 min ago',
        likes: 12,
        comments: 3,
        liked: false
    },
    {
        id: 2,
        user: 'Tom K.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
        action: 'joined',
        target: 'Summer Shred Challenge',
        targetType: 'challenge',
        timestamp: '15 min ago',
        likes: 24,
        comments: 5,
        liked: true
    },
    {
        id: 3,
        user: 'Emma L.',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
        action: 'achieved',
        target: '7-Day Streak! 🎉',
        targetType: 'achievement',
        timestamp: '32 min ago',
        likes: 56,
        comments: 12,
        liked: false
    },
    {
        id: 4,
        user: 'Mike R.',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
        action: 'completed',
        target: 'Sunset Yoga Flow',
        targetType: 'workout',
        timestamp: '1 hour ago',
        likes: 8,
        comments: 2,
        liked: false
    },
    {
        id: 5,
        user: 'Lisa P.',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
        action: 'made',
        target: 'Green Power Shake',
        targetType: 'recipe',
        timestamp: '2 hours ago',
        likes: 18,
        comments: 4,
        liked: true
    },
    {
        id: 6,
        user: 'Alex M.',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
        action: 'reached',
        target: 'Level 10 🏆',
        targetType: 'achievement',
        timestamp: '3 hours ago',
        likes: 89,
        comments: 21,
        liked: false
    }
];

// Active Challenges
export const challenges = [
    {
        id: 1,
        title: 'Summer Shred Challenge',
        description: 'Transform your body in 21 days with daily workouts and nutrition tips.',
        duration: 21,
        currentDay: 5,
        participants: 1247,
        image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&h=300&fit=crop',
        reward: '+500 Points',
        active: true
    },
    {
        id: 2,
        title: 'Hydration Hero',
        description: 'Drink 8 glasses of water daily for 14 days straight.',
        duration: 14,
        currentDay: 0,
        participants: 892,
        image: 'https://images.unsplash.com/photo-1559839914-17aae19cec71?w=600&h=300&fit=crop',
        reward: '+200 Points',
        active: false
    },
    {
        id: 3,
        title: 'Morning Warrior',
        description: 'Complete a workout before 8 AM for 7 consecutive days.',
        duration: 7,
        currentDay: 0,
        participants: 654,
        image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=600&h=300&fit=crop',
        reward: '+150 Points',
        active: false
    }
];

// Leaderboard Data
export const leaderboard = [
    { rank: 1, name: 'Sarah J.', points: 2450, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' },
    { rank: 2, name: 'Mike R.', points: 2280, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop' },
    { rank: 3, name: 'Emma L.', points: 2150, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop' },
    { rank: 4, name: 'Tom K.', points: 1980, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
    { rank: 5, name: 'Lisa P.', points: 1820, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop' }
];

// User Profile Data
export const currentUser = {
    id: 1,
    name: 'Alex Johnson',
    email: 'alex.j@email.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
    level: 12,
    points: 1560,
    streak: 5,
    workoutsCompleted: 47,
    recipesCooked: 23,
    memberSince: 'March 2024',
    badges: [
        { id: 1, name: 'Early Bird', icon: '🌅', description: 'Complete 5 morning workouts' },
        { id: 2, name: 'Streak Master', icon: '🔥', description: 'Maintain a 7-day streak' },
        { id: 3, name: 'Shake Artist', icon: '🥤', description: 'Try 10 different recipes' }
    ]
};

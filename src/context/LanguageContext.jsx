import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext(null);

const STORAGE_KEY = 'movelab_language';

const translations = {
    en: {
        // Home Page
        'home.greeting.morning': 'Good morning',
        'home.greeting.afternoon': 'Good afternoon',
        'home.greeting.evening': 'Good evening',
        'home.letsCrushGoals': "Let's crush your goals today",
        'home.streak': 'Streak',
        'home.today': 'Today',
        'home.week': 'Week',
        'home.weeklyGoal': 'Weekly Goal',
        'home.startFirstWorkout': "Start your first workout to begin your weekly goal!",
        'home.congratulations': "🎉 Congratulations! You've reached your weekly goal!",
        'home.moreMinutes': 'more minutes to reach your goal',
        'home.workouts': 'Workouts',
        'home.calories': 'Calories',
        'home.minutes': 'Minutes',
        'home.readyForWorkout': 'Ready for a workout?',
        'home.recentActivity': 'Recent Activity',
        'home.viewAll': 'View All',
        'home.featuredWorkouts': 'Featured Workouts',
        'home.seeAll': 'See All',
        'home.browseByCategory': 'Browse by Category',
        'home.dailyTip': 'Daily Tip',
        'home.stayConsistent': 'Stay consistent!',
        'home.tipText': "Consistency beats intensity. Even a 15-minute workout is better than skipping altogether. Your body and mind will thank you! 💪",
        
        // Profile Page
        'profile.memberSince': 'Member since',
        'profile.level': 'Level',
        'profile.workouts': 'Workouts',
        'profile.dayStreak': 'Day Streak',
        'profile.points': 'Points',
        'profile.thisWeek': 'This Week',
        'profile.allTime': 'All Time',
        'profile.workoutHistory': 'Workout History',
        'profile.clear': 'Clear',
        'profile.noWorkoutsYet': 'No workouts yet',
        'profile.completeFirstWorkout': 'Complete your first workout to see it here!',
        'profile.browseWorkouts': 'Browse Workouts',
        'profile.achievements': 'Achievements',
        'profile.firstStep': 'First Step',
        'profile.gettingStrong': 'Getting Strong',
        'profile.onFire': 'On Fire',
        'profile.weekWarrior': 'Week Warrior',
        'profile.hourClub': 'Hour Club',
        'profile.notifications': 'Notifications',
        'profile.settings': 'Settings',
        'profile.helpSupport': 'Help & Support',
        'profile.signOut': 'Sign Out',
        'profile.language': 'Language',
        'profile.clearHistory': 'Clear History?',
        'profile.clearHistoryConfirm': 'This will permanently delete all your workout history. This action cannot be undone.',
        'profile.cancel': 'Cancel',
        'profile.clearAll': 'Clear All',
        'profile.noNotifications': 'No new notifications',
        
        // Workout Detail
        'workout.about': 'About This Workout',
        'workout.equipmentNeeded': 'Equipment Needed',
        'workout.exercises': 'Exercises',
        'workout.total': 'total',
        'workout.difficultyLevel': 'Difficulty Level',
        'workout.startWorkout': 'Start Workout',
        'workout.exercise': 'Exercise',
        'workout.rest': 'Rest',
        'workout.coolDown': 'Cool Down',
        'workout.takeABreath': 'Take a breath...',
        'workout.getReadyFor': 'Get ready for:',
        'workout.watchVideo': 'Watch Video',
        'workout.seconds': 'seconds',
        'workout.endWorkoutEarly': 'End Workout Early',
        'workout.complete': 'Workout Complete! 🎉',
        'workout.greatJob': 'Great job! You completed',
        'workout.duration': 'Duration',
        'workout.done': 'Done',
        'workout.doAgain': 'Do Again',
        
        // Common
        'common.today': 'Today',
        'common.yesterday': 'Yesterday',
        'common.at': 'at',
    },
    nl: {
        // Home Page
        'home.greeting.morning': 'Goedemorgen',
        'home.greeting.afternoon': 'Goedemiddag',
        'home.greeting.evening': 'Goedenavond',
        'home.letsCrushGoals': "Laten we vandaag je doelen verpletteren",
        'home.streak': 'Reeks',
        'home.today': 'Vandaag',
        'home.week': 'Week',
        'home.weeklyGoal': 'Wekelijkse Doel',
        'home.startFirstWorkout': "Begin je eerste workout om je wekelijkse doel te starten!",
        'home.congratulations': "🎉 Gefeliciteerd! Je hebt je wekelijkse doel bereikt!",
        'home.moreMinutes': 'meer minuten om je doel te bereiken',
        'home.workouts': 'Workouts',
        'home.calories': 'Calorieën',
        'home.minutes': 'Minuten',
        'home.readyForWorkout': 'Klaar voor een workout?',
        'home.recentActivity': 'Recente Activiteit',
        'home.viewAll': 'Bekijk Alles',
        'home.featuredWorkouts': 'Uitgelichte Workouts',
        'home.seeAll': 'Bekijk Alles',
        'home.browseByCategory': 'Bladeren op Categorie',
        'home.dailyTip': 'Dagelijkse Tip',
        'home.stayConsistent': 'Blijf consistent!',
        'home.tipText': "Consistentie verslaat intensiteit. Zelfs een 15-minuten workout is beter dan helemaal overslaan. Je lichaam en geest zullen je bedanken! 💪",
        
        // Profile Page
        'profile.memberSince': 'Lid sinds',
        'profile.level': 'Niveau',
        'profile.workouts': 'Workouts',
        'profile.dayStreak': 'Dagen Reeks',
        'profile.points': 'Punten',
        'profile.thisWeek': 'Deze Week',
        'profile.allTime': 'Aller Tijden',
        'profile.workoutHistory': 'Workout Geschiedenis',
        'profile.clear': 'Wissen',
        'profile.noWorkoutsYet': 'Nog geen workouts',
        'profile.completeFirstWorkout': 'Voltooi je eerste workout om het hier te zien!',
        'profile.browseWorkouts': 'Bladeren Workouts',
        'profile.achievements': 'Prestaties',
        'profile.firstStep': 'Eerste Stap',
        'profile.gettingStrong': 'Sterker Worden',
        'profile.onFire': 'In Vuur en Vlam',
        'profile.weekWarrior': 'Week Krijger',
        'profile.hourClub': 'Uur Club',
        'profile.notifications': 'Meldingen',
        'profile.settings': 'Instellingen',
        'profile.helpSupport': 'Hulp & Ondersteuning',
        'profile.signOut': 'Uitloggen',
        'profile.language': 'Taal',
        'profile.clearHistory': 'Geschiedenis Wissen?',
        'profile.clearHistoryConfirm': 'Dit zal permanent al je workout geschiedenis verwijderen. Deze actie kan niet ongedaan worden gemaakt.',
        'profile.cancel': 'Annuleren',
        'profile.clearAll': 'Alles Wissen',
        'profile.noNotifications': 'Geen nieuwe meldingen',
        
        // Workout Detail
        'workout.about': 'Over Deze Workout',
        'workout.equipmentNeeded': 'Benodigde Uitrusting',
        'workout.exercises': 'Oefeningen',
        'workout.total': 'totaal',
        'workout.difficultyLevel': 'Moeilijkheidsgraad',
        'workout.startWorkout': 'Start Workout',
        'workout.exercise': 'Oefening',
        'workout.rest': 'Rust',
        'workout.coolDown': 'Cool Down',
        'workout.takeABreath': 'Haal even adem...',
        'workout.getReadyFor': 'Maak je klaar voor:',
        'workout.watchVideo': 'Bekijk Video',
        'workout.seconds': 'seconden',
        'workout.endWorkoutEarly': 'Beëindig Workout Vroegtijdig',
        'workout.complete': 'Workout Voltooid! 🎉',
        'workout.greatJob': 'Goed gedaan! Je hebt voltooid',
        'workout.duration': 'Duur',
        'workout.done': 'Klaar',
        'workout.doAgain': 'Opnieuw Doen',
        
        // Common
        'common.today': 'Vandaag',
        'common.yesterday': 'Gisteren',
        'common.at': 'om',
    }
};

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('en');

    // Load language from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored && (stored === 'en' || stored === 'nl')) {
            setLanguage(stored);
        }
    }, []);

    // Save to localStorage whenever language changes
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, language);
    }, [language]);

    const t = (key) => {
        return translations[language]?.[key] || translations.en[key] || key;
    };

    const changeLanguage = (lang) => {
        if (lang === 'en' || lang === 'nl') {
            setLanguage(lang);
        }
    };

    const value = {
        language,
        setLanguage: changeLanguage,
        t,
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

export default LanguageContext;


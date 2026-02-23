import { createContext, useContext, useState, useEffect } from 'react';

const WorkoutContext = createContext(null);

const STORAGE_KEY = 'movelab_fitpulse_workouts';

export const WorkoutProvider = ({ children }) => {
    const [workoutHistory, setWorkoutHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load workout history from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setWorkoutHistory(parsed);
            } catch (e) {
                console.error('Failed to parse workout history:', e);
            }
        }
        setLoading(false);
    }, []);

    // Save to localStorage whenever history changes
    useEffect(() => {
        if (!loading) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(workoutHistory));
        }
    }, [workoutHistory, loading]);

    // Add a completed workout
    const addCompletedWorkout = (workout) => {
        const workoutRecord = {
            id: Date.now(),
            workoutId: workout.id,
            title: workout.title,
            instructor: workout.instructor,
            duration: workout.actualDuration, // in seconds
            calories: workout.caloriesBurned,
            points: workout.pointsEarned,
            exercisesCompleted: workout.exercisesCompleted,
            totalExercises: workout.totalExercises,
            completedAt: new Date().toISOString(),
            category: workout.category,
            difficulty: workout.difficulty,
        };
        
        setWorkoutHistory(prev => [workoutRecord, ...prev]);
        return workoutRecord;
    };

    // Get workouts for current week
    const getWeeklyWorkouts = () => {
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setHours(0, 0, 0, 0);
        startOfWeek.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)

        return workoutHistory.filter(w => {
            const completedDate = new Date(w.completedAt);
            return completedDate >= startOfWeek;
        });
    };

    // Get total minutes this week
    const getWeeklyMinutes = () => {
        const weeklyWorkouts = getWeeklyWorkouts();
        const totalSeconds = weeklyWorkouts.reduce((acc, w) => acc + (w.duration || 0), 0);
        return Math.round(totalSeconds / 60);
    };

    // Get total workouts this week
    const getWeeklyWorkoutCount = () => {
        return getWeeklyWorkouts().length;
    };

    // Get total calories this week
    const getWeeklyCalories = () => {
        const weeklyWorkouts = getWeeklyWorkouts();
        return weeklyWorkouts.reduce((acc, w) => acc + (w.calories || 0), 0);
    };

    // Get total points this week
    const getWeeklyPoints = () => {
        const weeklyWorkouts = getWeeklyWorkouts();
        return weeklyWorkouts.reduce((acc, w) => acc + (w.points || 0), 0);
    };

    // Get workouts for today
    const getTodayWorkouts = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return workoutHistory.filter(w => {
            const completedDate = new Date(w.completedAt);
            completedDate.setHours(0, 0, 0, 0);
            return completedDate.getTime() === today.getTime();
        });
    };

    // Get recent workouts (last N)
    const getRecentWorkouts = (count = 5) => {
        return workoutHistory.slice(0, count);
    };

    // Get streak (consecutive days with workouts)
    const getStreak = () => {
        if (workoutHistory.length === 0) return 0;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Get unique dates with workouts
        const datesWithWorkouts = new Set(
            workoutHistory.map(w => {
                const d = new Date(w.completedAt);
                d.setHours(0, 0, 0, 0);
                return d.getTime();
            })
        );

        let streak = 0;
        let currentDate = new Date(today);

        // Check if today has a workout, if not start from yesterday
        if (!datesWithWorkouts.has(currentDate.getTime())) {
            currentDate.setDate(currentDate.getDate() - 1);
        }

        // Count consecutive days
        while (datesWithWorkouts.has(currentDate.getTime())) {
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
        }

        return streak;
    };

    // Clear all history (for testing)
    const clearHistory = () => {
        setWorkoutHistory([]);
        localStorage.removeItem(STORAGE_KEY);
    };

    const value = {
        workoutHistory,
        loading,
        addCompletedWorkout,
        getWeeklyWorkouts,
        getWeeklyMinutes,
        getWeeklyWorkoutCount,
        getWeeklyCalories,
        getWeeklyPoints,
        getTodayWorkouts,
        getRecentWorkouts,
        getStreak,
        clearHistory,
    };

    return (
        <WorkoutContext.Provider value={value}>
            {children}
        </WorkoutContext.Provider>
    );
};

export const useWorkouts = () => {
    const context = useContext(WorkoutContext);
    if (!context) {
        throw new Error('useWorkouts must be used within a WorkoutProvider');
    }
    return context;
};

export default WorkoutContext;


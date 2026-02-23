import { useState, useEffect } from 'react';
import { Flame, TrendingUp, Zap, ChevronRight, Clock, Play, Target, Calendar, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWorkouts } from '../context/WorkoutContext';
import { useLanguage } from '../context/LanguageContext';
import { workoutPrograms } from '../data/workoutPrograms';

const HomePage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { t } = useLanguage();
    const { 
        getWeeklyMinutes, 
        getWeeklyWorkoutCount, 
        getWeeklyCalories, 
        getStreak,
        getRecentWorkouts,
        getTodayWorkouts,
    } = useWorkouts();

    // Get first name from user
    const firstName = user?.name?.split(' ')[0] || 'there';

    // Get featured workouts (mix of different types)
    const featuredWorkouts = workoutPrograms.slice(0, 3);

    // Use state for quick workout to avoid random on every render
    const [quickWorkout] = useState(() => 
        workoutPrograms[Math.floor(Math.random() * workoutPrograms.length)]
    );

    // Weekly goal in minutes (15 min x 5 workouts = 75 min)
    const WEEKLY_GOAL_MINUTES = 75;
    const weeklyMinutes = getWeeklyMinutes();
    const weeklyWorkouts = getWeeklyWorkoutCount();
    const weeklyCalories = getWeeklyCalories();
    const streak = getStreak();
    const weeklyProgress = Math.min((weeklyMinutes / WEEKLY_GOAL_MINUTES) * 100, 100);

    // Today's workouts
    const todayWorkouts = getTodayWorkouts();
    const todayMinutes = Math.round(todayWorkouts.reduce((acc, w) => acc + (w.duration || 0), 0) / 60);

    // Recent workouts for quick access
    const recentWorkouts = getRecentWorkouts(3);

    // Get time-appropriate greeting
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return t('home.greeting.morning');
        if (hour < 17) return t('home.greeting.afternoon');
        return t('home.greeting.evening');
    };

    return (
        <div className="px-4 space-y-6 fade-in">
            {/* Welcome Header */}
            <div className="relative bg-gradient-to-br from-[#1C1C1E] to-[#141416] rounded-2xl p-5 border border-white/5 overflow-hidden">
                {/* Accent glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6B4A]/20 rounded-full blur-3xl" />
                
                <div className="relative flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B4A] to-[#FF8A6F] rounded-xl flex items-center justify-center">
                        <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white">{getGreeting()}, {firstName}!</h1>
                        <p className="text-white/50 text-sm">{t('home.letsCrushGoals')}</p>
                    </div>
                </div>

                <div className="relative grid grid-cols-3 gap-3">
                    <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                        <div className="flex items-center justify-center gap-1 text-sm font-medium mb-1 text-white/60">
                            <Flame className="w-4 h-4 text-[#FF6B4A]" />
                            <span>{t('home.streak')}</span>
                        </div>
                        <p className="text-2xl font-bold text-white">{streak}</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                        <div className="flex items-center justify-center gap-1 text-sm font-medium mb-1 text-white/60">
                            <Clock className="w-4 h-4 text-[#4FACFE]" />
                            <span>{t('home.today')}</span>
                        </div>
                        <p className="text-2xl font-bold text-[#4FACFE]">{todayMinutes}m</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                        <div className="flex items-center justify-center gap-1 text-sm font-medium mb-1 text-white/60">
                            <TrendingUp className="w-4 h-4 text-green-400" />
                            <span>{t('home.week')}</span>
                        </div>
                        <p className="text-2xl font-bold text-white">{weeklyWorkouts}</p>
                    </div>
                </div>
            </div>

            {/* Weekly Goal - Minutes Based */}
            <div className="bg-[#141416] rounded-2xl p-5 border border-white/5">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-[#4FACFE]" />
                        <h2 className="font-bold text-white">{t('home.weeklyGoal')}</h2>
                    </div>
                    <span className="text-sm text-white/40">
                        {weeklyMinutes}/{WEEKLY_GOAL_MINUTES} {t('home.minutes').toLowerCase()}
                    </span>
                </div>
                
                <div className="h-3 bg-white/10 rounded-full overflow-hidden mb-3">
                    <div 
                        className="h-full bg-gradient-to-r from-[#4FACFE] to-[#00F2FE] rounded-full transition-all duration-500"
                        style={{ width: `${weeklyProgress}%` }}
                    />
                </div>
                
                <div className="flex items-center justify-between">
                    <p className="text-white/50 text-sm">
                        {weeklyMinutes === 0 
                            ? t('home.startFirstWorkout')
                            : weeklyMinutes >= WEEKLY_GOAL_MINUTES 
                                ? t('home.congratulations')
                                : `${WEEKLY_GOAL_MINUTES - weeklyMinutes} ${t('home.moreMinutes')}`
                        }
                    </p>
                    {weeklyMinutes >= WEEKLY_GOAL_MINUTES && (
                        <Trophy className="w-5 h-5 text-yellow-400" />
                    )}
                </div>

                {/* Weekly Stats */}
                {weeklyWorkouts > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/5">
                        <div className="text-center">
                            <p className="text-lg font-bold text-white">{weeklyWorkouts}</p>
                            <p className="text-xs text-white/40">{t('home.workouts')}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-bold text-[#FF6B4A]">{weeklyCalories}</p>
                            <p className="text-xs text-white/40">{t('home.calories')}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-bold text-[#4FACFE]">{weeklyMinutes}</p>
                            <p className="text-xs text-white/40">{t('home.minutes')}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Quick Start CTA */}
            <div 
                className="relative bg-gradient-to-r from-[#FF6B4A] to-[#FF8A6F] rounded-2xl p-5 overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform"
                onClick={() => navigate(`/fitpulse/workout/${quickWorkout.id}`)}
            >
                <div className="absolute right-0 top-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute right-8 bottom-0 w-16 h-16 bg-white/10 rounded-full translate-y-1/2" />
                
                <div className="relative flex items-center justify-between">
                    <div>
                        <p className="text-white/80 text-sm mb-1">{t('home.readyForWorkout')}</p>
                        <h2 className="text-xl font-bold text-white mb-2">{quickWorkout.title}</h2>
                        <div className="flex items-center gap-3 text-white/80 text-sm">
                            <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {quickWorkout.duration} min
                            </span>
                            <span>{quickWorkout.difficulty}</span>
                        </div>
                    </div>
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg">
                        <Play className="w-6 h-6 text-[#FF6B4A] ml-1" fill="currentColor" />
                    </div>
                </div>
            </div>

            {/* Recent Workouts - Only show if there are any */}
            {recentWorkouts.length > 0 && (
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-white">{t('home.recentActivity')}</h2>
                        <button 
                            onClick={() => navigate('/fitpulse/profile')}
                            className="text-sm text-[#FF6B4A] font-medium flex items-center gap-1"
                        >
                            {t('home.viewAll')}
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="space-y-2">
                        {recentWorkouts.map((workout) => (
                            <div
                                key={workout.id}
                                className="bg-[#141416] rounded-xl border border-white/5 p-4 flex items-center gap-4"
                            >
                                <div className="w-10 h-10 bg-[#FF6B4A]/20 rounded-full flex items-center justify-center">
                                    <Zap className="w-5 h-5 text-[#FF6B4A]" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-white text-sm truncate">{workout.title}</p>
                                    <p className="text-white/40 text-xs">
                                        {new Date(workout.completedAt).toLocaleDateString('en-US', { 
                                            weekday: 'short', 
                                            month: 'short', 
                                            day: 'numeric',
                                            hour: 'numeric',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium text-white">{Math.round(workout.duration / 60)}m</p>
                                    <p className="text-xs text-[#FF6B4A]">+{workout.points}pts</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Featured Workouts */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-white">{t('home.featuredWorkouts')}</h2>
                    <button 
                        onClick={() => navigate('/fitpulse/workouts')}
                        className="text-sm text-[#FF6B4A] font-medium flex items-center gap-1"
                    >
                        {t('home.seeAll')}
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>

                <div className="space-y-3">
                    {featuredWorkouts.map((workout) => (
                        <div
                            key={workout.id}
                            onClick={() => navigate(`/fitpulse/workout/${workout.id}`)}
                            className="bg-[#141416] rounded-xl border border-white/5 overflow-hidden cursor-pointer hover:border-white/10 hover:bg-[#1C1C1E] transition-all flex"
                        >
                            <div className="w-24 h-24 flex-shrink-0 relative">
                                <img
                                    src={workout.thumbnail}
                                    alt={workout.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#141416]/80" />
                            </div>
                            <div className="flex-1 p-3 flex flex-col justify-center">
                                <h3 className="font-semibold text-white text-sm mb-1 line-clamp-1">{workout.title}</h3>
                                <p className="text-white/40 text-xs mb-2">{workout.instructor}</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs bg-white/5 text-white/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {workout.duration}m
                                    </span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                                        workout.difficulty === 'Beginner' ? 'bg-green-500/10 text-green-400' :
                                        workout.difficulty === 'Intermediate' ? 'bg-yellow-500/10 text-yellow-400' :
                                        workout.difficulty === 'Advanced' ? 'bg-red-500/10 text-red-400' :
                                        'bg-white/5 text-white/50'
                                    }`}>
                                        {workout.difficulty}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center pr-3">
                                <ChevronRight className="w-5 h-5 text-white/20" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Workout Categories Quick Access */}
            <section>
                <h2 className="text-lg font-bold text-white mb-4">{t('home.browseByCategory')}</h2>
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { name: 'HIIT', emoji: '🔥', count: workoutPrograms.filter(w => w.category === 'hiit').length, color: 'from-orange-500/20 to-red-500/20' },
                        { name: 'Strength', emoji: '💪', count: workoutPrograms.filter(w => w.category === 'strength').length, color: 'from-blue-500/20 to-purple-500/20' },
                        { name: 'Yoga', emoji: '🧘', count: workoutPrograms.filter(w => w.category === 'yoga').length, color: 'from-green-500/20 to-teal-500/20' },
                        { name: 'Beginner', emoji: '⭐', count: workoutPrograms.filter(w => w.difficulty === 'Beginner').length, color: 'from-yellow-500/20 to-amber-500/20' },
                    ].map((category) => (
                        <button
                            key={category.name}
                            onClick={() => navigate('/fitpulse/workouts')}
                            className={`bg-gradient-to-br ${category.color} rounded-xl p-4 border border-white/5 text-left hover:border-white/10 transition-all`}
                        >
                            <span className="text-2xl mb-2 block">{category.emoji}</span>
                            <p className="font-semibold text-white">{category.name}</p>
                            <p className="text-white/40 text-sm">{category.count} workout{category.count !== 1 ? 's' : ''}</p>
                        </button>
                    ))}
                </div>
            </section>

            {/* Quick Tips */}
            <section className="pb-4">
                <div className="bg-[#141416] rounded-2xl p-5 border border-white/5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-[#4FACFE]/10 rounded-xl flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-[#4FACFE]" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white">{t('home.dailyTip')}</h3>
                            <p className="text-white/40 text-sm">{t('home.stayConsistent')}</p>
                        </div>
                    </div>
                    <p className="text-white/60 text-sm leading-relaxed">
                        {t('home.tipText')}
                    </p>
                </div>
            </section>
        </div>
    );
};

export default HomePage;

import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, Clock, Flame, Users, Dumbbell, Heart, Share2, CheckCircle, SkipForward, RotateCcw, X, Coffee, Zap, Youtube } from 'lucide-react';
import Button from '../components/ui/Button';
import { workoutPrograms } from '../data/workoutPrograms';
import { useWorkouts } from '../context/WorkoutContext';

const equipmentIcons = {
    'Dumbbells': '🏋️',
    'Mat': '🧘',
    'Resistance Bands': '🎗️',
    'Foam Roller': '🛢️',
    'None': '✋'
};

// Extract YouTube video ID from URL
const getYouTubeId = (url) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    return match ? match[1] : null;
};

// Video Modal Component
const VideoModal = ({ videoUrl, exerciseName, onClose }) => {
    const videoId = getYouTubeId(videoUrl);
    
    if (!videoId) return null;
    
    return (
        <div 
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100] p-4"
            onClick={onClose}
        >
            <div 
                className="w-full max-w-4xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                            <Youtube className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-white font-semibold">{exerciseName}</h3>
                            <p className="text-white/60 text-sm">Video Tutorial</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                    >
                        <X className="w-5 h-5 text-white" />
                    </button>
                </div>
                
                {/* Video Container */}
                <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
                    <iframe
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                        title={exerciseName}
                        className="absolute inset-0 w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>
                
                {/* Close hint */}
                <p className="text-center text-white/40 text-sm mt-4">
                    Click outside or press the X to close
                </p>
            </div>
        </div>
    );
};

const WorkoutDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addCompletedWorkout } = useWorkouts();
    const workout = workoutPrograms.find(w => w.id === parseInt(id));
    
    const [isLiked, setIsLiked] = useState(false);
    const [workoutSaved, setWorkoutSaved] = useState(false);
    const [isWorkoutStarted, setIsWorkoutStarted] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showCompletionModal, setShowCompletionModal] = useState(false);
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [exerciseTimeRemaining, setExerciseTimeRemaining] = useState(0);
    const [totalElapsedTime, setTotalElapsedTime] = useState(0);
    const [completedExercises, setCompletedExercises] = useState([]);
    const [videoModal, setVideoModal] = useState({ isOpen: false, videoUrl: '', exerciseName: '' });
    const intervalRef = useRef(null);
    
    // Open video modal (and pause workout if playing)
    const openVideoModal = (videoUrl, exerciseName) => {
        if (isPlaying) {
            clearInterval(intervalRef.current);
            setIsPlaying(false);
        }
        setVideoModal({ isOpen: true, videoUrl, exerciseName });
    };
    
    // Close video modal
    const closeVideoModal = () => {
        setVideoModal({ isOpen: false, videoUrl: '', exerciseName: '' });
    };

    // Get current exercise (clamp to valid index)
    const safeExerciseIndex = Math.min(currentExerciseIndex, (workout?.exercises.length || 1) - 1);
    const currentExercise = workout?.exercises[safeExerciseIndex];
    const totalExercises = workout?.exercises.filter(e => e.type === 'exercise').length || 0;
    
    // Count completed exercises (only actual exercises, not rests) - use Set to prevent duplicates
    const uniqueCompleted = [...new Set(completedExercises)];
    const completedCount = uniqueCompleted.filter(i => workout?.exercises[i]?.type === 'exercise').length;
    
    // Current exercise number for display (clamped to total)
    const currentExerciseNumber = Math.min(completedCount + 1, totalExercises);

    // Cleanup interval on unmount
    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);
    
    // Handle share
    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: workout.title,
                    text: `Check out this workout: ${workout.title} by ${workout.instructor}`,
                    url: window.location.href,
                });
            } catch (err) {
                console.log('Share cancelled');
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };
    
    // Handle start workout
    const handleStartWorkout = () => {
        setIsWorkoutStarted(true);
        setIsPlaying(true);
        setCurrentExerciseIndex(0);
        setExerciseTimeRemaining(workout.exercises[0].duration);
        setCompletedExercises([]);
        setTotalElapsedTime(0);
        startTimer();
    };

    // Start timer
    const startTimer = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        
        intervalRef.current = setInterval(() => {
            setExerciseTimeRemaining(prev => {
                if (prev <= 1) {
                    // Move to next exercise
                    moveToNextExercise();
                    return 0;
                }
                return prev - 1;
            });
            setTotalElapsedTime(prev => prev + 1);
        }, 1000);
    };

    // Move to next exercise
    const moveToNextExercise = () => {
        setCurrentExerciseIndex(prevIndex => {
            // Don't go past the end
            if (prevIndex >= workout.exercises.length - 1) {
                // Workout complete
                clearInterval(intervalRef.current);
                setIsPlaying(false);
                setShowCompletionModal(true);
                // Add last exercise to completed (without duplicates)
                setCompletedExercises(prev => 
                    prev.includes(prevIndex) ? prev : [...prev, prevIndex]
                );
                return prevIndex;
            }
            
            const newIndex = prevIndex + 1;
            // Add to completed (without duplicates)
            setCompletedExercises(prev => 
                prev.includes(prevIndex) ? prev : [...prev, prevIndex]
            );
            
            setExerciseTimeRemaining(workout.exercises[newIndex].duration);
            return newIndex;
        });
    };

    // Handle pause/resume
    const handlePlayPause = () => {
        if (isPlaying) {
            clearInterval(intervalRef.current);
            setIsPlaying(false);
        } else {
            startTimer();
            setIsPlaying(true);
        }
    };

    // Skip current exercise
    const handleSkip = () => {
        // Use safeExerciseIndex to prevent going past the end
        if (safeExerciseIndex < workout.exercises.length - 1) {
            clearInterval(intervalRef.current);
            moveToNextExercise();
            if (isPlaying) startTimer();
        } else {
            // Already at the last exercise, end the workout
            handleEndWorkout();
        }
    };

    // Calculate stats for saving
    const calculateCalories = () => Math.round(workout.calories * (totalElapsedTime / (workout.duration * 60)));
    const calculatePoints = () => completedCount * 5;

    // Handle end workout early
    const handleEndWorkout = () => {
        clearInterval(intervalRef.current);
        setShowCompletionModal(true);
        setIsPlaying(false);
        
        // Save the workout if not already saved
        if (!workoutSaved && totalElapsedTime > 0) {
            addCompletedWorkout({
                id: workout.id,
                title: workout.title,
                instructor: workout.instructor,
                actualDuration: totalElapsedTime,
                caloriesBurned: calculateCalories(),
                pointsEarned: calculatePoints(),
                exercisesCompleted: completedCount,
                totalExercises: totalExercises,
                category: workout.category,
                difficulty: workout.difficulty,
            });
            setWorkoutSaved(true);
        }
    };

    // Reset workout
    const handleReset = () => {
        clearInterval(intervalRef.current);
        setIsWorkoutStarted(false);
        setIsPlaying(false);
        setCurrentExerciseIndex(0);
        setExerciseTimeRemaining(0);
        setTotalElapsedTime(0);
        setCompletedExercises([]);
        setShowCompletionModal(false);
        setWorkoutSaved(false);
    };
    
    // Format time
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (!workout) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0A0A0B]">
                <p className="text-white/40">Workout not found</p>
            </div>
        );
    }

    // Calculate progress
    const progressPercent = ((completedExercises.length) / workout.exercises.length) * 100;
    const exerciseProgress = currentExercise ? ((currentExercise.duration - exerciseTimeRemaining) / currentExercise.duration) * 100 : 0;

    return (
        <div className="min-h-screen bg-[#0A0A0B]">
            {/* Progress Bar */}
            {isWorkoutStarted && (
                <div className="fixed top-0 left-0 right-0 h-1 bg-white/10 z-50">
                    <div 
                        className="h-full bg-gradient-to-r from-[#FF6B4A] to-[#FF8A6F] transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
            )}

            {/* Active Workout Player */}
            {isWorkoutStarted && !showCompletionModal ? (
                <div className="min-h-screen bg-[#0A0A0B] text-white">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4">
                        <button 
                            onClick={handleReset}
                            className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <div className="text-center">
                            <p className="text-xs text-white/60 uppercase tracking-wider">Exercise {currentExerciseNumber} of {totalExercises}</p>
                            <p className="text-sm font-medium">{workout.title}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-white/60">Total Time</p>
                            <p className="text-sm font-mono">{formatTime(totalElapsedTime)}</p>
                        </div>
                    </div>

                    {/* Current Exercise Display */}
                    <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
                        {/* Exercise Type Badge */}
                        <div className={`mb-4 px-4 py-1 rounded-full text-sm font-medium ${
                            currentExercise.type === 'rest' ? 'bg-[#4FACFE]/20 text-[#4FACFE]' :
                            currentExercise.type === 'cooldown' ? 'bg-purple-500/20 text-purple-300' :
                            'bg-[#FF6B4A]/20 text-[#FF6B4A]'
                        }`}>
                            {currentExercise.type === 'rest' ? (
                                <span className="flex items-center gap-2"><Coffee className="w-4 h-4" /> Rest</span>
                            ) : currentExercise.type === 'cooldown' ? (
                                <span className="flex items-center gap-2">🧘 Cool Down</span>
                            ) : (
                                <span className="flex items-center gap-2"><Zap className="w-4 h-4" /> Exercise</span>
                            )}
                        </div>

                        {/* Exercise Name */}
                        <h1 className="text-3xl font-bold text-center mb-4">{currentExercise.name}</h1>

                        {/* Timer Circle */}
                        <div className="relative w-56 h-56 mb-6">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle
                                    cx="112"
                                    cy="112"
                                    r="100"
                                    fill="none"
                                    stroke="rgba(255,255,255,0.05)"
                                    strokeWidth="8"
                                />
                                <circle
                                    cx="112"
                                    cy="112"
                                    r="100"
                                    fill="none"
                                    stroke={currentExercise.type === 'rest' ? '#4FACFE' : '#FF6B4A'}
                                    strokeWidth="8"
                                    strokeLinecap="round"
                                    strokeDasharray={2 * Math.PI * 100}
                                    strokeDashoffset={2 * Math.PI * 100 * (1 - exerciseProgress / 100)}
                                    className="transition-all duration-1000"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-6xl font-bold font-mono">{exerciseTimeRemaining}</span>
                                <span className="text-white/40 text-sm">seconds</span>
                            </div>
                        </div>

                        {/* Description */}
                        {currentExercise.description && currentExercise.type !== 'rest' && (
                            <p className="text-white/70 text-center max-w-md mb-4">{currentExercise.description}</p>
                        )}

                        {/* Tips */}
                        {currentExercise.tips && currentExercise.type !== 'rest' && (
                            <div className="flex flex-wrap justify-center gap-2 mb-4">
                                {currentExercise.tips.map((tip, i) => (
                                    <span key={i} className="text-xs bg-white/10 px-3 py-1 rounded-full">
                                        💡 {tip}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Video Link */}
                        {currentExercise.videoUrl && currentExercise.type !== 'rest' && (
                            <button
                                onClick={() => openVideoModal(currentExercise.videoUrl, currentExercise.name)}
                                className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-full transition-colors"
                            >
                                <Youtube className="w-4 h-4" />
                                <span className="text-sm font-medium">Watch Video</span>
                            </button>
                        )}

                        {/* Rest Message */}
                        {currentExercise.type === 'rest' && (
                            <div className="text-center">
                                <p className="text-white/40 text-lg mb-2">Take a breath...</p>
                                <p className="text-[#4FACFE]">Get ready for: <strong className="text-white">{workout.exercises[currentExerciseIndex + 1]?.name || 'Finish!'}</strong></p>
                            </div>
                        )}
                    </div>

                    {/* Controls */}
                    <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#0A0A0B] via-[#0A0A0B]/90 to-transparent">
                        <div className="flex items-center justify-center gap-6">
                            <button
                                onClick={handleReset}
                                className="w-14 h-14 bg-white/5 border border-white/10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
                            >
                                <RotateCcw className="w-6 h-6" />
                            </button>
                            
                            <button
                                onClick={handlePlayPause}
                                className="w-20 h-20 bg-gradient-to-r from-[#FF6B4A] to-[#FF8A6F] rounded-full flex items-center justify-center shadow-lg shadow-[#FF6B4A]/30 hover:scale-105 transition-transform"
                            >
                                {isPlaying ? (
                                    <Pause className="w-8 h-8" fill="currentColor" />
                                ) : (
                                    <Play className="w-8 h-8 ml-1" fill="currentColor" />
                                )}
                            </button>
                            
                            <button
                                onClick={handleSkip}
                                className="w-14 h-14 bg-white/5 border border-white/10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
                            >
                                <SkipForward className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <button
                            onClick={handleEndWorkout}
                            className="mt-4 w-full text-center text-white/40 hover:text-white/60 transition-colors text-sm"
                        >
                            End Workout Early
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    {/* Hero Section */}
                    <div className="relative h-72">
                        <img
                            src={workout.thumbnail}
                            alt={workout.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-black/40 to-black/30" />

                        {/* Back Button */}
                        <button
                            onClick={() => navigate(-1)}
                            className="absolute top-4 left-4 w-10 h-10 bg-white/10 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>

                        {/* Action Buttons */}
                        <div className="absolute top-4 right-4 flex gap-2">
                            <button 
                                onClick={() => setIsLiked(!isLiked)}
                                className={`w-10 h-10 backdrop-blur-md rounded-full flex items-center justify-center transition-colors border ${
                                    isLiked ? 'bg-red-500 border-red-500 text-white' : 'bg-white/10 border-white/10 text-white hover:bg-white/20'
                                }`}
                            >
                                <Heart className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} />
                            </button>
                            <button 
                                onClick={handleShare}
                                className="w-10 h-10 bg-white/10 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                            >
                                <Share2 className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Play Button - centered without blocking other buttons */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <button 
                                onClick={handleStartWorkout}
                                className="w-20 h-20 bg-gradient-to-r from-[#FF6B4A] to-[#FF8A6F] rounded-full flex items-center justify-center shadow-2xl shadow-[#FF6B4A]/30 hover:scale-105 transition-transform pointer-events-auto"
                            >
                                <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
                            </button>
                        </div>

                        {/* Title Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                            <h1 className="text-2xl font-bold text-white mb-2">{workout.title}</h1>
                            <p className="text-white/60">with {workout.instructor}</p>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="px-4 py-6 space-y-6 pb-28">
                        {/* Quick Stats */}
                        <div className="grid grid-cols-4 gap-3">
                            <div className="bg-[#141416] rounded-xl p-3 text-center border border-white/5">
                                <Clock className="w-5 h-5 mx-auto mb-1 text-[#FF6B4A]" />
                                <p className="text-lg font-bold text-white">{workout.duration}</p>
                                <p className="text-xs text-white/40">Minutes</p>
                            </div>
                            <div className="bg-[#141416] rounded-xl p-3 text-center border border-white/5">
                                <Flame className="w-5 h-5 mx-auto mb-1 text-orange-400" />
                                <p className="text-lg font-bold text-white">{workout.calories}</p>
                                <p className="text-xs text-white/40">Calories</p>
                            </div>
                            <div className="bg-[#141416] rounded-xl p-3 text-center border border-white/5">
                                <span className="text-xl block mb-1">{workout.intensityEmoji}</span>
                                <p className="text-sm font-bold text-white">{workout.intensity}</p>
                                <p className="text-xs text-white/40">Intensity</p>
                            </div>
                            <div className="bg-[#141416] rounded-xl p-3 text-center border border-white/5">
                                <Users className="w-5 h-5 mx-auto mb-1 text-[#4FACFE]" />
                                <p className="text-lg font-bold text-white">{totalExercises}</p>
                                <p className="text-xs text-white/40">Exercises</p>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-[#141416] rounded-xl p-4 border border-white/5">
                            <h2 className="font-bold text-white mb-2">About This Workout</h2>
                            <p className="text-sm text-white/50 leading-relaxed">{workout.description}</p>
                        </div>

                        {/* Equipment */}
                        <div className="bg-[#141416] rounded-xl p-4 border border-white/5">
                            <h2 className="font-bold text-white mb-3 flex items-center gap-2">
                                <Dumbbell className="w-5 h-5 text-[#FF6B4A]" />
                                Equipment Needed
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {workout.equipment.map(item => (
                                    <div
                                        key={item}
                                        className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/5"
                                    >
                                        <span className="text-lg">{equipmentIcons[item] || '🏋️'}</span>
                                        <span className="text-sm font-medium text-white/70">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Exercises List */}
                        <div className="bg-[#141416] rounded-xl p-4 border border-white/5">
                            <h2 className="font-bold text-white mb-4 flex items-center gap-2">
                                <Zap className="w-5 h-5 text-[#FF6B4A]" />
                                Exercises ({totalExercises} total)
                            </h2>
                            <div className="space-y-3">
                                {workout.exercises.map((exercise, index) => (
                                    <div
                                        key={index}
                                        className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                                            exercise.type === 'rest' ? 'bg-[#4FACFE]/10 border border-[#4FACFE]/20' :
                                            exercise.type === 'cooldown' ? 'bg-purple-500/10 border border-purple-500/20' :
                                            'bg-white/5 border border-white/5 hover:bg-white/10'
                                        }`}
                                    >
                                        {/* Number/Icon */}
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold ${
                                            exercise.type === 'rest' ? 'bg-[#4FACFE]/20 text-[#4FACFE]' :
                                            exercise.type === 'cooldown' ? 'bg-purple-500/20 text-purple-400' :
                                            'bg-[#FF6B4A]/20 text-[#FF6B4A]'
                                        }`}>
                                            {exercise.type === 'rest' ? <Coffee className="w-4 h-4" /> :
                                             exercise.type === 'cooldown' ? '🧘' :
                                             workout.exercises.slice(0, index).filter(e => e.type === 'exercise').length + 1}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-white truncate">{exercise.name}</p>
                                            <div className="flex items-center gap-2 text-xs text-white/40">
                                                <span>{exercise.duration}s</span>
                                                {exercise.targetMuscles && (
                                                    <>
                                                        <span>•</span>
                                                        <span className="truncate">{exercise.targetMuscles.slice(0, 2).join(', ')}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* Video Link */}
                                        {exercise.videoUrl && exercise.type !== 'rest' && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openVideoModal(exercise.videoUrl, exercise.name);
                                                }}
                                                className="flex-shrink-0 w-8 h-8 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center hover:bg-red-500/30 transition-colors"
                                                title="Watch video tutorial"
                                            >
                                                <Youtube className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Difficulty */}
                        <div className="bg-[#141416] rounded-xl p-4 border border-white/5">
                            <h2 className="font-bold text-white mb-3">Difficulty Level</h2>
                            <div className="flex items-center gap-3">
                                <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
                                    workout.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                                    workout.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                                    workout.difficulty === 'Advanced' ? 'bg-red-500/20 text-red-400' :
                                    'bg-white/10 text-white/60'
                                }`}>
                                    {workout.difficulty}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sticky Bottom CTA */}
                    <div className="fixed bottom-0 left-0 right-0 bg-[#0A0A0B] border-t border-white/5 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
                        <Button variant="action" fullWidth size="lg" icon={Play} onClick={handleStartWorkout}>
                            Start Workout
                        </Button>
                    </div>
                </>
            )}

            {/* Completion Modal */}
            {showCompletionModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#141416] rounded-2xl p-6 max-w-sm w-full text-center border border-white/10">
                        <div className="w-20 h-20 bg-[#FF6B4A]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-10 h-10 text-[#FF6B4A]" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">
                            Workout Complete! 🎉
                        </h2>
                        <p className="text-white/50 mb-4">
                            Great job! You completed <strong className="text-white">{workout.title}</strong>
                        </p>
                        
                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-3 mb-6">
                            <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                                <p className="text-lg font-bold text-white">{formatTime(totalElapsedTime)}</p>
                                <p className="text-xs text-white/40">Duration</p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                                <p className="text-lg font-bold text-[#FF6B4A]">{Math.round(workout.calories * (totalElapsedTime / (workout.duration * 60)))}</p>
                                <p className="text-xs text-white/40">Calories</p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                                <p className="text-lg font-bold text-[#4FACFE]">+{completedCount * 5}</p>
                                <p className="text-xs text-white/40">Points</p>
                            </div>
                        </div>
                        
                        <div className="flex gap-3">
                            <Button 
                                variant="secondary" 
                                fullWidth 
                                onClick={handleReset}
                            >
                                Do Again
                            </Button>
                            <Button 
                                variant="primary" 
                                fullWidth 
                                onClick={() => navigate('/')}
                            >
                                Done
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Video Modal */}
            {videoModal.isOpen && (
                <VideoModal
                    videoUrl={videoModal.videoUrl}
                    exerciseName={videoModal.exerciseName}
                    onClose={closeVideoModal}
                />
            )}
        </div>
    );
};

export default WorkoutDetailPage;

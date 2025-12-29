import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Clock, Flame, ChevronRight } from 'lucide-react';
import { workoutPrograms, workoutCategories } from '../data/workoutPrograms';

const WorkoutsPage = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Filter workouts
    const filteredWorkouts = workoutPrograms.filter(workout => {
        const matchesSearch = workout.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            workout.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
            workout.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || workout.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-[#0A0A0B] pb-28">
            {/* Header */}
            <div className="relative pt-6 pb-20 px-4 overflow-hidden">
                {/* Background glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-[#FF6B4A]/20 rounded-full blur-3xl" />
                
                <div className="relative">
                    <h1 className="text-2xl font-bold text-white mb-2">Workouts</h1>
                    <p className="text-white/50 text-sm">15-minute guided workouts with video tutorials</p>
                    
                    {/* Search Bar */}
                    <div className="mt-4 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                        <input
                            type="text"
                            placeholder="Search workouts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/50 focus:border-[#FF6B4A]/50"
                        />
                    </div>
                </div>
            </div>

            {/* Categories */}
            <div className="-mt-12 px-4 mb-6">
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    <button
                        onClick={() => setSelectedCategory('all')}
                        className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            selectedCategory === 'all'
                                ? 'bg-gradient-to-r from-[#FF6B4A] to-[#FF8A6F] text-white shadow-lg shadow-[#FF6B4A]/25'
                                : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
                        }`}
                    >
                        All Workouts
                    </button>
                    {workoutCategories.map(category => (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                                selectedCategory === category.id
                                    ? 'bg-gradient-to-r from-[#FF6B4A] to-[#FF8A6F] text-white shadow-lg shadow-[#FF6B4A]/25'
                                    : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
                            }`}
                        >
                            <span>{category.icon}</span>
                            {category.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Workout List */}
            <div className="px-4 space-y-4">
                {filteredWorkouts.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-white/40">No workouts found</p>
                    </div>
                ) : (
                    filteredWorkouts.map(workout => (
                        <div
                            key={workout.id}
                            onClick={() => navigate(`/workout/${workout.id}`)}
                            className="bg-[#141416] rounded-2xl border border-white/5 overflow-hidden cursor-pointer hover:border-white/10 hover:bg-[#1C1C1E] transition-all"
                        >
                            <div className="flex">
                                {/* Thumbnail */}
                                <div className="w-32 h-32 flex-shrink-0 relative">
                                    <img
                                        src={workout.thumbnail}
                                        alt={workout.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
                                    <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 backdrop-blur-sm">
                                        <Clock className="w-3 h-3" />
                                        {workout.duration} min
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 p-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-white mb-1">{workout.title}</h3>
                                            <p className="text-sm text-white/40 mb-2">with {workout.instructor}</p>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-white/20" />
                                    </div>

                                    {/* Tags */}
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-xs bg-white/5 text-white/50 px-2 py-1 rounded-full border border-white/5">
                                            {workout.exercises.filter(e => e.type === 'exercise').length} exercises
                                        </span>
                                        <span className="text-xs bg-[#FF6B4A]/10 text-[#FF6B4A] px-2 py-1 rounded-full flex items-center gap-1">
                                            <Flame className="w-3 h-3" />
                                            {workout.calories} cal
                                        </span>
                                        <span className={`text-xs px-2 py-1 rounded-full ${
                                            workout.difficulty === 'Beginner' ? 'bg-green-500/10 text-green-400' :
                                            workout.difficulty === 'Intermediate' ? 'bg-yellow-500/10 text-yellow-400' :
                                            workout.difficulty === 'Advanced' ? 'bg-red-500/10 text-red-400' :
                                            'bg-white/5 text-white/50'
                                        }`}>
                                            {workout.difficulty}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Stats */}
            <div className="mt-8 px-4">
                <div className="bg-[#141416] rounded-2xl p-6 border border-white/5">
                    <h3 className="font-semibold text-white mb-4">Quick Stats</h3>
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-2xl font-bold text-[#FF6B4A]">{workoutPrograms.length}</p>
                            <p className="text-xs text-white/40">Total Workouts</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-[#4FACFE]">15</p>
                            <p className="text-xs text-white/40">Minutes Each</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{workoutCategories.length}</p>
                            <p className="text-xs text-white/40">Categories</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkoutsPage;

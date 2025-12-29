import { Calendar, Plus, Clock, Dumbbell, ChefHat } from 'lucide-react';
import Button from '../components/ui/Button';

const PlanPage = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const dates = [27, 28, 29, 30, 31, 1, 2];
    const today = 29; // Example: Wednesday

    const scheduledItems = [
        {
            id: 1,
            time: '7:00 AM',
            title: 'Morning Energy Blast',
            type: 'workout',
            duration: '20 min',
            completed: true
        },
        {
            id: 2,
            time: '8:00 AM',
            title: 'Green Power Shake',
            type: 'meal',
            duration: '5 min',
            completed: true
        },
        {
            id: 3,
            time: '12:30 PM',
            title: 'Berry Protein Bowl',
            type: 'meal',
            duration: '10 min',
            completed: false
        },
        {
            id: 4,
            time: '5:30 PM',
            title: 'Power Strength Session',
            type: 'workout',
            duration: '45 min',
            completed: false
        }
    ];

    return (
        <div className="px-4 space-y-6 fade-in">
            {/* Week Calendar Strip */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-slate-800">December 2024</h2>
                    <Button variant="ghost" size="sm" icon={Calendar}>
                        View All
                    </Button>
                </div>

                <div className="flex justify-between">
                    {days.map((day, index) => (
                        <div
                            key={day}
                            className={`flex flex-col items-center gap-1 px-2 py-2 rounded-xl transition-all ${dates[index] === today
                                    ? 'bg-gradient-to-b from-[#7BC143] to-[#5FA030]'
                                    : 'hover:bg-slate-50'
                                }`}
                        >
                            <span className={`text-xs font-medium ${dates[index] === today ? 'text-white/80' : 'text-slate-400'
                                }`}>
                                {day}
                            </span>
                            <span className={`text-lg font-bold ${dates[index] === today ? 'text-white' : 'text-slate-700'
                                }`}>
                                {dates[index]}
                            </span>
                            {dates[index] === today && (
                                <div className="w-1.5 h-1.5 bg-white rounded-full" />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Today's Schedule */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-slate-800">Today's Plan</h2>
                    <Button variant="outline" size="sm" icon={Plus}>
                        Add
                    </Button>
                </div>

                <div className="space-y-3">
                    {scheduledItems.map((item, index) => (
                        <div
                            key={item.id}
                            className={`bg-white rounded-xl p-4 shadow-sm flex items-center gap-4 transition-all slide-up ${item.completed ? 'opacity-60' : ''
                                }`}
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            {/* Time */}
                            <div className="text-center min-w-[60px]">
                                <p className={`text-sm font-semibold ${item.completed ? 'text-slate-400' : 'text-slate-700'}`}>
                                    {item.time}
                                </p>
                            </div>

                            {/* Divider */}
                            <div className={`w-1 h-12 rounded-full ${item.type === 'workout'
                                    ? 'bg-gradient-to-b from-[#7BC143] to-[#5FA030]'
                                    : 'bg-gradient-to-b from-purple-400 to-purple-600'
                                }`} />

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    {item.type === 'workout'
                                        ? <Dumbbell className="w-4 h-4 text-[#7BC143]" />
                                        : <ChefHat className="w-4 h-4 text-purple-500" />
                                    }
                                    <h3 className={`font-semibold text-sm truncate ${item.completed ? 'text-slate-400 line-through' : 'text-slate-800'
                                        }`}>
                                        {item.title}
                                    </h3>
                                </div>
                                <div className="flex items-center gap-1 mt-1 text-slate-400 text-xs">
                                    <Clock className="w-3 h-3" />
                                    {item.duration}
                                </div>
                            </div>

                            {/* Checkbox */}
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${item.completed
                                    ? 'bg-[#7BC143] border-[#7BC143]'
                                    : 'border-slate-300'
                                }`}>
                                {item.completed && (
                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Quick Add */}
            <section className="bg-gradient-to-br from-slate-100 to-slate-50 rounded-2xl p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-2xl shadow-sm flex items-center justify-center">
                    <Plus className="w-8 h-8 text-[#7BC143]" />
                </div>
                <h3 className="font-bold text-slate-800 mb-2">Plan Your Week</h3>
                <p className="text-sm text-slate-500 mb-4">
                    Add workouts and meals to build your perfect routine
                </p>
                <Button variant="primary">
                    Start Planning
                </Button>
            </section>
        </div>
    );
};

export default PlanPage;

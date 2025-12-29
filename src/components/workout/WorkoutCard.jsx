import { useNavigate } from 'react-router-dom';
import { Clock, Flame } from 'lucide-react';

const WorkoutCard = ({ workout }) => {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/workout/${workout.id}`)}
            className="w-44 flex-shrink-0 bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md active:scale-[0.98]"
        >
            {/* Thumbnail with Badges */}
            <div className="relative h-28">
                <img
                    src={workout.thumbnail}
                    alt={workout.title}
                    className="w-full h-full object-cover"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Duration Badge */}
                <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-md">
                    <Clock className="w-3 h-3 text-white" />
                    <span className="text-xs font-medium text-white">{workout.duration} min</span>
                </div>

                {/* Intensity Badge */}
                <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-md">
                    <span className="text-xs">{workout.intensityEmoji}</span>
                </div>
            </div>

            {/* Content */}
            <div className="p-3">
                <h3 className="font-semibold text-sm text-slate-800 line-clamp-1">{workout.title}</h3>
                <p className="text-xs text-slate-500 mt-1">{workout.instructor}</p>

                <div className="flex items-center gap-2 mt-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-100 text-orange-600 rounded-full text-xs font-medium">
                        <Flame className="w-3 h-3" />
                        {workout.calories} cal
                    </span>
                </div>
            </div>
        </div>
    );
};

export default WorkoutCard;

import { useState } from 'react';
import { Users, Trophy } from 'lucide-react';
import Button from '../ui/Button';

const ChallengeCard = ({ challenge }) => {
    const [isJoined, setIsJoined] = useState(challenge.active);
    const progress = challenge.active ? (challenge.currentDay / challenge.duration) * 100 : 0;

    return (
        <div className="relative bg-[#141416] rounded-2xl border border-white/5 overflow-hidden">
            {/* Hero Image */}
            <div className="relative h-36">
                <img
                    src={challenge.image}
                    alt={challenge.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141416] via-black/40 to-transparent" />

                {/* Challenge Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-bold text-lg text-white">{challenge.title}</h3>
                    <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-white/60 text-sm">
                            <Users className="w-4 h-4" />
                            {challenge.participants.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1 text-[#FF6B4A] text-sm font-medium">
                            <Trophy className="w-4 h-4" />
                            {challenge.reward}
                        </span>
                    </div>
                </div>
            </div>

            {/* Progress Section */}
            <div className="p-4">
                <p className="text-sm text-white/50 line-clamp-2">{challenge.description}</p>

                {isJoined ? (
                    <div className="mt-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                            <span className="font-medium text-white/60">Your Progress</span>
                            <span className="text-[#FF6B4A] font-semibold">
                                Day {challenge.currentDay} of {challenge.duration}
                            </span>
                        </div>
                        <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-[#FF6B4A] to-[#FF8A6F] rounded-full transition-all duration-500"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="mt-4">
                        <Button
                            variant="primary"
                            fullWidth
                            onClick={() => setIsJoined(true)}
                        >
                            Join Challenge
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChallengeCard;

import { useState } from 'react';
import { Heart, MessageCircle, Dumbbell, Trophy, ChefHat, Flame } from 'lucide-react';

const getActionIcon = (targetType) => {
    switch (targetType) {
        case 'workout':
            return <Dumbbell className="w-4 h-4 text-[#FF6B4A]" />;
        case 'challenge':
            return <Flame className="w-4 h-4 text-orange-400" />;
        case 'achievement':
            return <Trophy className="w-4 h-4 text-yellow-500" />;
        case 'recipe':
            return <ChefHat className="w-4 h-4 text-purple-400" />;
        default:
            return null;
    }
};

const getActionText = (action, target, targetType) => {
    const icon = getActionIcon(targetType);

    switch (action) {
        case 'completed':
            return (
                <span className="flex items-center gap-1.5 flex-wrap">
                    completed {icon} <strong className="text-white">{target}</strong>
                </span>
            );
        case 'joined':
            return (
                <span className="flex items-center gap-1.5 flex-wrap">
                    joined {icon} <strong className="text-white">{target}</strong>
                </span>
            );
        case 'achieved':
            return (
                <span className="flex items-center gap-1.5 flex-wrap">
                    {icon} <strong className="text-white">{target}</strong>
                </span>
            );
        case 'made':
            return (
                <span className="flex items-center gap-1.5 flex-wrap">
                    made {icon} <strong className="text-white">{target}</strong>
                </span>
            );
        case 'reached':
            return (
                <span className="flex items-center gap-1.5 flex-wrap">
                    {icon} <strong className="text-white">{target}</strong>
                </span>
            );
        default:
            return <strong className="text-white">{target}</strong>;
    }
};

const FeedItem = ({ item }) => {
    const [liked, setLiked] = useState(item.liked);
    const [likes, setLikes] = useState(item.likes);

    const handleLike = () => {
        setLiked(!liked);
        setLikes(liked ? likes - 1 : likes + 1);
    };

    return (
        <div className="bg-[#141416] rounded-xl p-4 border border-white/5">
            <div className="flex items-start gap-3">
                {/* Avatar */}
                <img
                    src={item.avatar}
                    alt={item.user}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-white/10"
                />

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="text-sm text-white/60">
                        <span className="font-semibold text-white">{item.user}</span>{' '}
                        {getActionText(item.action, item.target, item.targetType)}
                    </div>
                    <span className="text-xs text-white/30 mt-1 block">{item.timestamp}</span>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/5">
                <button
                    onClick={handleLike}
                    className={`flex items-center gap-1.5 text-sm transition-all duration-200 ${liked ? 'text-red-500' : 'text-white/40 hover:text-red-500'
                        }`}
                >
                    <Heart
                        className={`w-5 h-5 transition-all duration-200 ${liked ? 'fill-current scale-110' : ''
                            }`}
                    />
                    <span className="font-medium">{likes}</span>
                </button>

                <button className="flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    <span className="font-medium">{item.comments}</span>
                </button>

                <button className="ml-auto text-sm font-medium text-[#FF6B4A] hover:underline">
                    High Five 🙌
                </button>
            </div>
        </div>
    );
};

const SocialFeed = ({ feed }) => {
    return (
        <div className="space-y-3">
            {feed.map((item, index) => (
                <div
                    key={item.id}
                    className="fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                >
                    <FeedItem item={item} />
                </div>
            ))}
        </div>
    );
};

export default SocialFeed;

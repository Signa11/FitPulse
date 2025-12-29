import { Trophy, Medal } from 'lucide-react';

const getRankStyle = (rank) => {
    switch (rank) {
        case 1:
            return 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white';
        case 2:
            return 'bg-gradient-to-r from-slate-400 to-slate-500 text-white';
        case 3:
            return 'bg-gradient-to-r from-amber-600 to-amber-700 text-white';
        default:
            return 'bg-white/10 text-white/60';
    }
};

const getRankIcon = (rank) => {
    if (rank === 1) return <Trophy className="w-4 h-4" />;
    if (rank <= 3) return <Medal className="w-4 h-4" />;
    return <span>#{rank}</span>;
};

const Leaderboard = ({ users }) => {
    const topThree = users.slice(0, 3);

    return (
        <div className="bg-[#141416] rounded-xl p-4 border border-white/5">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    Top Performers
                </h3>
                <button className="text-sm text-[#FF6B4A] font-medium hover:underline">
                    See All
                </button>
            </div>

            <div className="space-y-2">
                {topThree.map((user, index) => (
                    <div
                        key={user.rank}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        {/* Rank Badge */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getRankStyle(user.rank)}`}>
                            {getRankIcon(user.rank)}
                        </div>

                        {/* Avatar */}
                        <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-white/10"
                        />

                        {/* Name & Points */}
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-white truncate">{user.name}</p>
                            <p className="text-xs text-white/40">{user.points.toLocaleString()} points</p>
                        </div>

                        {/* Trophy for #1 */}
                        {user.rank === 1 && (
                            <span className="text-2xl">🏆</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Leaderboard;

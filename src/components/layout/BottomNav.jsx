import { NavLink } from 'react-router-dom';
import { Home, Dumbbell, User } from 'lucide-react';

const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/workouts', icon: Dumbbell, label: 'Workouts' },
    { path: '/profile', icon: User, label: 'Profile' },
];

const BottomNav = () => {
    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0A0A0B] border-t border-white/5 pb-[env(safe-area-inset-bottom)]">
            <div className="flex items-center justify-around h-20 max-w-lg mx-auto px-4">
                {navItems.map(({ path, icon: Icon, label }) => (
                    <NavLink
                        key={path}
                        to={path}
                        className={({ isActive }) =>
                            `flex flex-col items-center gap-1 px-6 py-2 rounded-2xl transition-all duration-200 ${isActive
                                ? 'text-[#FF6B4A]'
                                : 'text-white/40 hover:text-white/60'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <div className={`p-2 rounded-xl transition-all duration-200 ${isActive ? 'bg-[#FF6B4A]/15' : ''
                                    }`}>
                                    <Icon
                                        className={`w-6 h-6 transition-all duration-200 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.5]'
                                            }`}
                                    />
                                </div>
                                <span className={`text-xs font-medium ${isActive ? 'opacity-100' : 'opacity-70'
                                    }`}>
                                    {label}
                                </span>
                            </>
                        )}
                    </NavLink>
                ))}
            </div>
        </nav>
    );
};

export default BottomNav;

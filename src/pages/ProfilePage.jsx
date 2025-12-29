import { useState } from 'react';
import {
    Settings,
    ChevronRight,
    Bell,
    HelpCircle,
    LogOut,
    Languages,
    X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWorkouts } from '../context/WorkoutContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
    const { user, logout } = useAuth();
    const { language, setLanguage, t } = useLanguage();
    const { workoutHistory } = useWorkouts();
    const navigate = useNavigate();
    const [showLanguageSelector, setShowLanguageSelector] = useState(false);

    const totalPoints = workoutHistory.reduce((acc, w) => acc + (w.points || 0), 0);

    const menuItems = [
        { icon: Languages, label: t('profile.language'), action: () => setShowLanguageSelector(true) },
        { icon: Bell, label: t('profile.notifications'), badge: '3' },
        { icon: Settings, label: t('profile.settings') },
        { icon: HelpCircle, label: t('profile.helpSupport') },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Generate initials from name
    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    // Format member since date
    const formatMemberSince = () => {
        if (user?.memberSince) return user.memberSince;
        return new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    return (
        <div className="px-4 space-y-6 fade-in pb-8">
            {/* Profile Header */}
            <div className="text-center py-4">
                <div className="relative inline-block">
                    {user?.avatar ? (
                        <img
                            src={user.avatar}
                            alt={user.name || 'User'}
                            className="w-24 h-24 rounded-full object-cover ring-4 ring-[#FF6B4A]/20"
                        />
                    ) : (
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#FF6B4A] to-[#FF8A6F] flex items-center justify-center ring-4 ring-[#FF6B4A]/20">
                            <span className="text-white font-bold text-2xl">{getInitials(user?.name)}</span>
                        </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-r from-[#FF6B4A] to-[#FF8A6F] rounded-full flex items-center justify-center text-white text-sm font-bold ring-4 ring-[#0A0A0B]">
                        {Math.floor(totalPoints / 100) + 1}
                    </div>
                </div>

                <h1 className="text-xl font-bold text-white mt-4">{user?.name || 'User'}</h1>
                <p className="text-sm text-white/40">{t('profile.memberSince')} {formatMemberSince()}</p>

                {/* Points Bar */}
                <div className="mt-4 mx-auto max-w-xs">
                    <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-white/60">{t('profile.level')} {Math.floor(totalPoints / 100) + 1}</span>
                        <span className="text-[#FF6B4A] font-semibold">{totalPoints % 100} / 100 {t('profile.points').toLowerCase()}</span>
                    </div>
                    <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-[#FF6B4A] to-[#FF8A6F] rounded-full transition-all duration-500"
                            style={{ width: `${(totalPoints % 100)}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Menu Items */}
            <div className="bg-[#141416] rounded-xl border border-white/5 overflow-hidden">
                {menuItems.map((item, index) => (
                    <button
                        key={item.label}
                        onClick={item.action}
                        className={`w-full flex items-center gap-4 px-4 py-4 hover:bg-white/5 transition-colors ${index !== menuItems.length - 1 ? 'border-b border-white/5' : ''
                            }`}
                    >
                        <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                            <item.icon className="w-5 h-5 text-white/60" />
                        </div>
                        <span className="flex-1 text-left font-medium text-white/70">{item.label}</span>
                        {item.badge && (
                            <span className="px-2 py-0.5 bg-[#FF6B4A] text-white text-xs font-bold rounded-full">
                                {item.badge}
                            </span>
                        )}
                        {item.label === t('profile.language') && (
                            <span className="text-sm text-white/40">{language === 'en' ? 'English' : 'Nederlands'}</span>
                        )}
                        <ChevronRight className="w-5 h-5 text-white/20" />
                    </button>
                ))}
            </div>

            {/* Logout */}
            <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-4 text-red-400 font-medium hover:bg-red-500/10 rounded-xl transition-colors border border-red-500/20"
            >
                <LogOut className="w-5 h-5" />
                {t('profile.signOut')}
            </button>

            {/* Language Selector Modal */}
            {showLanguageSelector && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#141416] rounded-2xl p-6 max-w-sm w-full border border-white/10">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white">{t('profile.language')}</h2>
                            <button
                                onClick={() => setShowLanguageSelector(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
                            >
                                <X className="w-5 h-5 text-white/60" />
                            </button>
                        </div>
                        <div className="space-y-2">
                            <button
                                onClick={() => {
                                    setLanguage('en');
                                    setShowLanguageSelector(false);
                                }}
                                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-colors ${
                                    language === 'en' 
                                        ? 'bg-[#FF6B4A]/20 border-[#FF6B4A]' 
                                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">🇬🇧</span>
                                    <span className="font-medium text-white">English</span>
                                </div>
                                {language === 'en' && (
                                    <div className="w-5 h-5 bg-[#FF6B4A] rounded-full flex items-center justify-center">
                                        <div className="w-2 h-2 bg-white rounded-full" />
                                    </div>
                                )}
                            </button>
                            <button
                                onClick={() => {
                                    setLanguage('nl');
                                    setShowLanguageSelector(false);
                                }}
                                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-colors ${
                                    language === 'nl' 
                                        ? 'bg-[#FF6B4A]/20 border-[#FF6B4A]' 
                                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">🇳🇱</span>
                                    <span className="font-medium text-white">Nederlands</span>
                                </div>
                                {language === 'nl' && (
                                    <div className="w-5 h-5 bg-[#FF6B4A] rounded-full flex items-center justify-center">
                                        <div className="w-2 h-2 bg-white rounded-full" />
                                    </div>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;

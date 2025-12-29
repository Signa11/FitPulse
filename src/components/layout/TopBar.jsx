import { useState } from 'react';
import { Bell, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import Logo from '../ui/Logo';

const TopBar = () => {
    const { user } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [showNotifications, setShowNotifications] = useState(false);

    // Generate initials from name
    const getInitials = (name) => {
        if (!name) return 'FP';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0B]/90 backdrop-blur-xl border-b border-white/5">
            <div className="flex items-center justify-between px-4 h-16 max-w-lg mx-auto">
                {/* Notification Bell */}
                <div className="relative">
                    <button 
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative p-2 rounded-full hover:bg-white/10 transition-colors"
                    >
                        <Bell className="w-6 h-6 text-white/70" />
                        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#FF6B4A] rounded-full border-2 border-[#0A0A0B]"></span>
                    </button>
                    
                    {/* Notifications Dropdown */}
                    {showNotifications && (
                        <>
                            <div 
                                className="fixed inset-0 z-40"
                                onClick={() => setShowNotifications(false)}
                            />
                            <div className="absolute top-full left-0 mt-2 w-80 bg-[#141416] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
                                <div className="flex items-center justify-between p-4 border-b border-white/5">
                                    <h3 className="font-bold text-white">{t('profile.notifications')}</h3>
                                    <button
                                        onClick={() => setShowNotifications(false)}
                                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
                                    >
                                        <X className="w-4 h-4 text-white/60" />
                                    </button>
                                </div>
                                <div className="max-h-96 overflow-y-auto">
                                    <div className="p-4 text-center text-white/40 text-sm">
                                        {t('profile.noNotifications') || 'No new notifications'}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Logo / Title */}
                <div className="flex items-center gap-2">
                    <Logo size={32} />
                    <span className="font-bold text-lg text-white">FitPulse</span>
                </div>

                {/* User Avatar */}
                <button 
                    onClick={() => navigate('/profile')}
                    className="relative hover:opacity-80 transition-opacity"
                >
                    {user?.avatar ? (
                        <img
                            src={user.avatar}
                            alt={user.name || 'User'}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-[#FF6B4A] ring-offset-2 ring-offset-[#0A0A0B]"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6B4A] to-[#FF8A6F] flex items-center justify-center ring-2 ring-[#FF6B4A]/50 ring-offset-2 ring-offset-[#0A0A0B]">
                            <span className="text-white font-bold text-sm">{getInitials(user?.name)}</span>
                        </div>
                    )}
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#FF6B4A] rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {user?.level || 1}
                    </span>
                </button>
            </div>
        </header>
    );
};

export default TopBar;

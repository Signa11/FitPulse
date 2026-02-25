import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';

const ResetPasswordPage = () => {
    const [step, setStep] = useState('email'); // 'email' | 'reset' | 'done'
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        if (!email.trim()) {
            setError('Please enter your email');
            return;
        }
        setError('');
        setStep('reset');
    };

    const handleResetSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!newPassword || !confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            setLoading(true);
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, newPassword }),
            });

            const text = await response.text();
            let data;

            if (!text) {
                throw new Error('Server returned an empty response. Please try again.');
            }

            try {
                data = JSON.parse(text);
            } catch (e) {
                throw new Error('Unable to reach the server. Please try again later.');
            }

            if (!response.ok) {
                throw new Error(data.message || 'Reset failed');
            }

            setStep('done');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0A0B] flex flex-col relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

            {/* Header */}
            <div className="relative p-6 text-center pt-16">
                <div className="inline-flex items-center justify-center mb-6">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#FF6B4A] via-[#7C3AED] to-[#4FACFE] flex items-center justify-center">
                        <span className="text-4xl font-black text-white">M</span>
                    </div>
                </div>
                <h1 className="text-3xl font-bold text-white">Reset Password</h1>
                <p className="text-white/40 mt-2">
                    {step === 'email' && 'Enter your email address'}
                    {step === 'reset' && 'Choose a new password'}
                    {step === 'done' && 'You\'re all set!'}
                </p>
            </div>

            {/* Form */}
            <div className="relative flex-1 px-6 pb-8 pt-8">
                {/* Step 1: Email */}
                {step === 'email' && (
                    <form onSubmit={handleEmailSubmit} className="space-y-5">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-white/70">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => { setEmail(e.target.value); setError(''); }}
                                    placeholder="you@example.com"
                                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        <div className="pt-2">
                            <Button type="submit" variant="primary" fullWidth size="lg">
                                Continue
                                <ArrowRight className="w-5 h-5" />
                            </Button>
                        </div>
                    </form>
                )}

                {/* Step 2: New password */}
                {step === 'reset' && (
                    <form onSubmit={handleResetSubmit} className="space-y-5">
                        <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                            <span className="text-white/40 text-sm">Resetting password for </span>
                            <span className="text-white text-sm font-medium">{email}</span>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-white/70">New Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={newPassword}
                                    onChange={e => { setNewPassword(e.target.value); setError(''); }}
                                    placeholder="At least 6 characters"
                                    className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-white/70">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={e => { setConfirmPassword(e.target.value); setError(''); }}
                                    placeholder="Re-enter your password"
                                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        <div className="pt-2">
                            <Button type="submit" variant="primary" fullWidth size="lg" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Resetting...
                                    </>
                                ) : (
                                    <>
                                        Reset Password
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                )}

                {/* Step 3: Done */}
                {step === 'done' && (
                    <div className="text-center space-y-6">
                        <div className="w-16 h-16 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
                            <span className="text-green-400 text-3xl">✓</span>
                        </div>
                        <p className="text-white/60">
                            Your password has been reset. You can now sign in with your new password.
                        </p>
                        <Link
                            to="/login"
                            className="inline-flex items-center gap-2 text-white font-semibold hover:underline"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Sign In
                        </Link>
                    </div>
                )}

                {/* Back to login (steps 1-2) */}
                {step !== 'done' && (
                    <p className="text-center mt-10 text-white/50">
                        Remember your password?{' '}
                        <Link to="/login" className="font-semibold text-white hover:underline">
                            Sign In
                        </Link>
                    </p>
                )}
            </div>
        </div>
    );
};

export default ResetPasswordPage;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Camera, Check, Loader2, Pencil } from 'lucide-react';

const ACCENT = '#4FACFE';

// DiceBear avatar options — mix of styles
const AVATAR_OPTIONS = [
  // Avataaars
  ...['felix', 'aneka', 'jade', 'jude', 'nala', 'riley', 'buster', 'zoey', 'milo', 'luna', 'oliver', 'sophie'].map(
    seed => `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`
  ),
  // Fun emoji
  ...['happy', 'grin', 'cool', 'love', 'star', 'fire'].map(
    seed => `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${seed}`
  ),
  // Bottts (robots)
  ...['bot1', 'bot2', 'bot3', 'bot4'].map(
    seed => `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`
  ),
  // Lorelei
  ...['grace', 'max', 'sam', 'alex'].map(
    seed => `https://api.dicebear.com/7.x/lorelei/svg?seed=${seed}`
  ),
];

export default function MyProfilePage() {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || '');
  const [editingName, setEditingName] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const hasChanges = name !== (user?.name || '') || selectedAvatar !== (user?.avatar || '');

  async function handleSave() {
    if (!hasChanges) return;
    setSaving(true);
    setError('');
    try {
      const updates = {};
      if (name !== user?.name) updates.name = name;
      if (selectedAvatar !== user?.avatar) updates.avatar_url = selectedAvatar;
      await updateProfile(updates);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B] pb-8">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-[max(env(safe-area-inset-top),16px)] pb-4">
        <button
          onClick={() => navigate('/')}
          className="p-2 -ml-2 rounded-xl hover:bg-white/5 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white/50" />
        </button>
        <h1 className="text-xl font-bold text-white">My Profile</h1>
      </div>

      <div className="px-5 space-y-6">
        {/* Current avatar + name */}
        <div className="text-center">
          <div className="relative inline-block">
            {selectedAvatar ? (
              <img src={selectedAvatar} alt="" className="w-24 h-24 rounded-full border-3 border-white/10 mx-auto" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#FF6B4A] to-[#4FACFE] flex items-center justify-center border-3 border-white/10 mx-auto">
                <span className="text-white font-bold text-3xl">
                  {name?.charAt(0)?.toUpperCase() || '?'}
                </span>
              </div>
            )}
            <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center border-2 border-[#0A0A0B]" style={{ background: ACCENT }}>
              <Camera className="w-4 h-4 text-black" />
            </div>
          </div>

          {/* Editable name */}
          <div className="mt-4 flex items-center justify-center gap-2">
            {editingName ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  autoFocus
                  onBlur={() => setEditingName(false)}
                  onKeyDown={e => { if (e.key === 'Enter') setEditingName(false); }}
                  className="bg-white/5 border border-white/10 text-white text-lg font-bold rounded-xl px-4 py-2 text-center focus:outline-none focus:border-[#4FACFE]/50 w-56"
                />
              </div>
            ) : (
              <button
                onClick={() => setEditingName(true)}
                className="flex items-center gap-2 group"
              >
                <h2 className="text-white font-bold text-xl">{name || 'Your Name'}</h2>
                <Pencil className="w-3.5 h-3.5 text-white/20 group-hover:text-white/50 transition-colors" />
              </button>
            )}
          </div>
          <p className="text-white/30 text-sm mt-1">{user?.email}</p>
        </div>

        {/* Avatar picker */}
        <section>
          <label className="block text-xs text-white/40 mb-3 uppercase tracking-wider">Choose Avatar</label>
          <div className="grid grid-cols-5 gap-3">
            {AVATAR_OPTIONS.map(url => (
              <button
                key={url}
                onClick={() => setSelectedAvatar(url)}
                className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                  selectedAvatar === url
                    ? 'border-[#4FACFE] ring-2 ring-[#4FACFE]/20 scale-105'
                    : 'border-white/5 hover:border-white/20'
                }`}
              >
                <img src={url} alt="" className="w-full h-full" />
                {selectedAvatar === url && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: ACCENT }}>
                      <Check className="w-3 h-3 text-black" />
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Error */}
        {error && (
          <p className="text-red-400 text-sm text-center">{error}</p>
        )}

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={!hasChanges || saving}
          className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 font-semibold text-sm transition-all active:scale-[0.97] disabled:opacity-30"
          style={{ background: saved ? '#22c55e' : ACCENT, color: saved ? '#fff' : '#000' }}
        >
          {saving ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
          ) : saved ? (
            <><Check className="w-4 h-4" /> Saved!</>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>
    </div>
  );
}

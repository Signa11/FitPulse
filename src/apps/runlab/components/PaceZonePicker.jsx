import { loadPaceZones } from '../data/paceZones';

const ACCENT = '#4FACFE';

export default function PaceZonePicker({ slowPace, fastPace, onPaceChange }) {
  const zones = loadPaceZones();
  const activeZoneId = zones.find(z => z.slowPace === slowPace && z.fastPace === fastPace)?.id || null;

  return (
    <div className="space-y-2">
      {/* Zone quick-pick pills */}
      <div className="flex gap-1.5 flex-wrap">
        {zones.map(zone => (
          <button
            key={zone.id}
            type="button"
            onClick={() => onPaceChange(zone.slowPace, zone.fastPace)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              activeZoneId === zone.id
                ? 'text-black'
                : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70'
            }`}
            style={activeZoneId === zone.id ? { background: ACCENT } : {}}
          >
            {zone.label}
          </button>
        ))}
      </div>

      {/* Min/Max pace inputs */}
      <div className="flex items-center gap-1.5">
        <input
          type="text"
          placeholder="Slow"
          value={slowPace}
          onChange={e => onPaceChange(e.target.value, fastPace)}
          className="w-[5.5rem] bg-[#0A0A0B]/50 border border-white/10 text-white text-sm rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#4FACFE]/50 placeholder:text-white/25 text-center"
        />
        <span className="text-white/30 text-xs">to</span>
        <input
          type="text"
          placeholder="Fast"
          value={fastPace}
          onChange={e => onPaceChange(slowPace, e.target.value)}
          className="w-[5.5rem] bg-[#0A0A0B]/50 border border-white/10 text-white text-sm rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#4FACFE]/50 placeholder:text-white/25 text-center"
        />
        <span className="text-white/40 text-xs">/km</span>
      </div>
    </div>
  );
}

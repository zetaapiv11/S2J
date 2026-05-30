import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { TrendingUp, Users, Sparkles, Calendar } from 'lucide-react';

interface Member {
  id: string;
  username: string;
  role: string;
  avatarSeed?: string;
  status: 'online' | 'idle' | 'offline';
  statusText?: string;
  origin: string; // e.g. 'Sunda' | 'Jawa' | 'Nusantara'
  joinedDate: string; // e.g. 'Agustus 2024' or current month format 'Mei 2026'
  customIcon?: string;
  colorTheme?: string;
}

interface MemberGrowthChartProps {
  members: Member[];
}

const MONTH_MAP: { [key: string]: number } = {
  januari: 1,
  februari: 2,
  maret: 3,
  april: 4,
  mei: 5,
  juni: 6,
  juli: 7,
  agustus: 8,
  september: 9,
  oktober: 10,
  november: 11,
  desember: 12
};

const INDONESIAN_MONTHS = [
  "", "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

export const MemberGrowthChart: React.FC<MemberGrowthChartProps> = ({ members }) => {
  const [chartMode, setChartMode] = useState<'cumulative' | 'monthly'>('cumulative');

  // Parse list of members into structured month-year sequence
  const chartData = useMemo(() => {
    if (!members || members.length === 0) return [];

    // Parse members into numeric month-years
    const parsedMembers = members.map(m => {
      let originClean = 'Nusantara';
      if (m.origin) {
        if (m.origin.toLowerCase().includes('sunda')) originClean = 'Sunda';
        else if (m.origin.toLowerCase().includes('jawa')) originClean = 'Jawa';
      }

      const dateStr = m.joinedDate || 'Agustus 2024';
      const parts = dateStr.trim().split(/\s+/);
      
      let month = 8; // Default Agustus
      let year = 2024; // Default 2024

      if (parts.length >= 2) {
        // format is "Agustus 2024" or "May 2025" or "29 Agustus 2024"
        const yearPart = parts[parts.length - 1];
        const monthPart = parts[parts.length - 2].toLowerCase();
        
        const yearInt = parseInt(yearPart, 10);
        if (!isNaN(yearInt)) {
          year = yearInt;
        }

        // Handle possible day number like "29 Agustus 2024"
        const mappedMonth = MONTH_MAP[monthPart];
        if (mappedMonth) {
          month = mappedMonth;
        } else {
          // Check if some other spelling or if it's the first word
          const firstWord = parts[0].toLowerCase();
          const mappedFirst = MONTH_MAP[firstWord];
          if (mappedFirst) {
            month = mappedFirst;
          }
        }
      } else if (parts.length === 1 && MONTH_MAP[parts[0].toLowerCase()]) {
        month = MONTH_MAP[parts[0].toLowerCase()];
      }

      return {
        id: m.id,
        origin: originClean,
        year,
        month,
        sequenceNum: year * 12 + month
      };
    });

    // Determine bounds
    let minSeq = Math.min(...parsedMembers.map(m => m.sequenceNum));
    let maxSeq = Math.max(...parsedMembers.map(m => m.sequenceNum));

    // Guard bounds just in case
    if (isNaN(minSeq) || !isFinite(minSeq)) minSeq = 2024 * 12 + 8; // Agustus 2024
    if (isNaN(maxSeq) || !isFinite(maxSeq)) maxSeq = 2025 * 12 + 5; // Mei 2025

    // Always start at least from Agustus 2024 for visual consistency
    minSeq = Math.min(minSeq, 2024 * 12 + 8);

    // Generate timeline periods
    const timeline: { year: number; month: number; key: string; label: string; sequence: number }[] = [];
    for (let seq = minSeq; seq <= maxSeq; seq++) {
      const year = Math.floor((seq - 1) / 12);
      const month = ((seq - 1) % 12) + 1;
      const monthLabel = INDONESIAN_MONTHS[month];
      timeline.push({
        year,
        month,
        key: `${year}-${String(month).padStart(2, '0')}`,
        label: `${monthLabel} ${year}`,
        sequence: seq
      });
    }

    // Accumulate metrics
    let cumulativeSunda = 0;
    let cumulativeJawa = 0;
    let cumulativeNusantara = 0;

    return timeline.map(period => {
      // Find members who joined EXACTLY in this month
      const matches = parsedMembers.filter(pm => pm.year === period.year && pm.month === period.month);
      
      const sundaCount = matches.filter(m => m.origin === 'Sunda').length;
      const jawaCount = matches.filter(m => m.origin === 'Jawa').length;
      const nusantaraCount = matches.filter(m => m.origin === 'Nusantara').length;
      const monthlyTotal = sundaCount + jawaCount + nusantaraCount;

      // Add to cumulative
      cumulativeSunda += sundaCount;
      cumulativeJawa += jawaCount;
      cumulativeNusantara += nusantaraCount;
      const cumulativeTotal = cumulativeSunda + cumulativeJawa + cumulativeNusantara;

      return {
        periodKey: period.key,
        name: period.label,
        // Monthly added stats
        'Sunda (Baru)': sundaCount,
        'Jawa (Baru)': jawaCount,
        'Nusantara (Baru)': nusantaraCount,
        'Total Baru': monthlyTotal,
        // Cumulative stats
        'Sunda': cumulativeSunda,
        'Jawa': cumulativeJawa,
        'Nusantara': cumulativeNusantara,
        'Total Akumulasi': cumulativeTotal
      };
    });
  }, [members]);

  // Dynamic statistics counts for headers
  const totalSunda = useMemo(() => members.filter(m => m.origin?.toLowerCase().includes('sunda')).length, [members]);
  const totalJawa = useMemo(() => members.filter(m => m.origin?.toLowerCase().includes('jawa')).length, [members]);
  const totalNusantara = useMemo(() => {
    return members.filter(m => {
      const orig = m.origin?.toLowerCase() || '';
      return !orig.includes('sunda') && !orig.includes('jawa');
    }).length;
  }, [members]);

  // Native custom tooltip for professional dark theme look
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-zinc-950/95 border border-zinc-800 p-3.5 rounded-xl shadow-2xl font-sans text-[11px] leading-relaxed backdrop-blur-md">
          <p className="font-bold text-zinc-100 mb-2 border-b border-zinc-8050/80 pb-1 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            <span>{label}</span>
          </p>
          <div className="space-y-1.5 font-mono">
            {payload.map((entry: any, index: number) => {
              // Extract colors based on series name
              let circleColor = entry.color || entry.fill;
              if (entry.name.includes('Sunda')) circleColor = '#f97316'; // Orange 500
              if (entry.name.includes('Jawa')) circleColor = '#a855f7'; // Purple 500
              if (entry.name.includes('Nusantara')) circleColor = '#10b981'; // Emerald 500

              return (
                <p key={index} className="flex items-center gap-3 justify-between">
                  <span className="flex items-center gap-1.5 text-zinc-400">
                    <span 
                      className="inline-block w-2.5 h-2.5 rounded-full" 
                      style={{ backgroundColor: circleColor }} 
                    />
                    <span>{entry.name}:</span>
                  </span>
                  <span className="font-bold text-zinc-100">{entry.value} Dulur</span>
                </p>
              );
            })}

            {/* Total display overlay */}
            {payload.length > 0 && (
              <p className="flex items-center gap-3 justify-between border-t border-zinc-850 pt-1.5 mt-1.5 font-bold text-zinc-150">
                <span className="text-zinc-400">Total Kabeh:</span>
                <span className="text-indigo-400">
                  {payload.reduce((acc: number, item: any) => acc + item.value, 0)} Dulur
                </span>
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div id="member-analytics" className="bg-zinc-900/30 border border-zinc-850 rounded-2xl p-6 relative overflow-hidden backdrop-blur-sm shadow-xl">
      {/* Visual top glow decorative */}
      <div className="absolute top-0 right-0 w-80 h-32 bg-indigo-500/5 rounded-full filter blur-[50px] pointer-events-none" />

      {/* Analytics Card Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 relative z-10">
        <div>
          <h3 className="text-base font-serif font-black tracking-wide text-zinc-100 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
            Historis & Tren Pertumbuhan Fams S2J
          </h3>
          <p className="text-xs text-zinc-400">
            Analisis sebaran pertumbuhan wilayah Sunda, Jawa, dan Nusantara dari bulan ke bulan.
          </p>
        </div>

        {/* Toggle chart view mode */}
        <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-850 self-stretch sm:self-auto font-sans">
          <button
            onClick={() => setChartMode('cumulative')}
            className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all uppercase cursor-pointer ${
              chartMode === 'cumulative'
                ? 'bg-gradient-to-r from-indigo-500/20 to-indigo-600/20 border border-indigo-550/30 text-indigo-450'
                : 'border border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Kumulatif Total
          </button>
          <button
            onClick={() => setChartMode('monthly')}
            className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all uppercase cursor-pointer ${
              chartMode === 'monthly'
                ? 'bg-gradient-to-r from-indigo-500/20 to-indigo-600/20 border border-indigo-550/30 text-indigo-450'
                : 'border border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Sensus Bulanan (Baru)
          </button>
        </div>
      </div>

      {/* Info Stats Row */}
      <div className="grid grid-cols-3 gap-3 mb-6 font-mono text-center">
        <div className="bg-zinc-950 border border-zinc-850 p-2.5 rounded-xl">
          <span className="text-[9px] text-zinc-500 block uppercase font-bold tracking-wider">Sebaran Sunda</span>
          <span className="text-xs font-black text-orange-400 mt-0.5 block">{totalSunda} Orang ({Math.round((totalSunda / Math.max(1, members.length)) * 100)}%)</span>
        </div>
        <div className="bg-zinc-950 border border-zinc-850 p-2.5 rounded-xl">
          <span className="text-[9px] text-zinc-500 block uppercase font-bold tracking-wider">Sebaran Jawa</span>
          <span className="text-xs font-black text-purple-400 mt-0.5 block">{totalJawa} Orang ({Math.round((totalJawa / Math.max(1, members.length)) * 100)}%)</span>
        </div>
        <div className="bg-zinc-950 border border-zinc-850 p-2.5 rounded-xl">
          <span className="text-[9px] text-zinc-500 block uppercase font-bold tracking-wider">Luar Daerah / Nusantara</span>
          <span className="text-xs font-black text-emerald-400 mt-0.5 block">{totalNusantara} Orang ({Math.round((totalNusantara / Math.max(1, members.length)) * 100)}%)</span>
        </div>
      </div>

      {/* Chart container elements */}
      <div className="w-full h-[320px] bg-zinc-950/50 border border-zinc-850 rounded-xl p-4 relative">
        {chartData.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500 text-xs">
            <Users className="w-8 h-8 opacity-20 mb-2 animate-bounce" />
            <span>Memindai data pendaftaran anggota...</span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {chartMode === 'cumulative' ? (
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  {/* Sunda (Orange color) */}
                  <linearGradient id="colorSunda" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                  {/* Jawa (Purple color) */}
                  <linearGradient id="colorJawa" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                  {/* Nusantara (Emerald color) */}
                  <linearGradient id="colorNusantara" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" opacity={0.4} />
                <XAxis 
                  dataKey="name" 
                  stroke="#71717a" 
                  fontSize={9} 
                  tickLine={false} 
                  axisLine={false}
                />
                <YAxis 
                  stroke="#71717a" 
                  fontSize={9} 
                  tickLine={false} 
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="top" 
                  height={36} 
                  iconType="circle"
                  iconSize={7}
                  wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="Sunda" 
                  stroke="#f97316" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorSunda)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="Jawa" 
                  stroke="#a855f7" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorJawa)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="Nusantara" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorNusantara)" 
                />
              </AreaChart>
            ) : (
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" opacity={0.4} />
                <XAxis 
                  dataKey="name" 
                  stroke="#71717a" 
                  fontSize={9} 
                  tickLine={false} 
                  axisLine={false}
                />
                <YAxis 
                  stroke="#71717a" 
                  fontSize={9} 
                  tickLine={false} 
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="top" 
                  height={36} 
                  iconType="circle"
                  iconSize={7}
                  wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                />
                <Bar 
                  dataKey="Sunda (Baru)" 
                  name="Sunda"
                  fill="#f97316" 
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="Jawa (Baru)" 
                  name="Jawa"
                  fill="#a855f7" 
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="Nusantara (Baru)" 
                  name="Nusantara"
                  fill="#10b981" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        )}
      </div>

      {/* Decorative summary footer insights on active database status */}
      <div className="mt-4 flex items-center gap-1.5 justify-center text-[10px] text-zinc-550 font-mono">
        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
        <span>Bagan disinkronisasi otomatis dari database server setiap kali terpicu webhook Discord 🤖</span>
      </div>
    </div>
  );
};

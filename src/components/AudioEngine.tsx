import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Music, 
  Heart, 
  Sparkles, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Disc, 
  Radio, 
  Grid,
  AlertCircle,
  Loader2,
  RefreshCw,
  Search,
  ExternalLink,
  Compass,
  Link
} from 'lucide-react';

interface Track {
  id: string;
  title: string;
  artist: string;
  category: 'Sunda' | 'Jawa';
  url: string;
  durationText: string;
  description: string;
}

export const SOUND_TRACKS: Track[] = [
  {
    id: 'sunda-1',
    title: 'Suling Degung Mangari',
    artist: 'Awi Suling Baraya',
    category: 'Sunda',
    url: 'https://archive.org/download/gamelansunda/Degung%20Sunda.mp3',
    durationText: '04:12',
    description: 'Alunan suling bambu meliuk indah dipadu ketukan hangat degung khas tanah Priangan.'
  },
  {
    id: 'sunda-2',
    title: 'Kacapi Suling Buhun',
    artist: 'Wanda Anyar Paguyuban',
    category: 'Sunda',
    url: 'https://archive.org/download/kacapisuling/KacapiSuling.mp3',
    durationText: '03:45',
    description: 'Petikan kacapi kawat kuningan tempo dulu melantunkan ketenangan spiritual luhur Sunda.'
  },
  {
    id: 'sunda-3',
    title: 'Sabilulungan Sinden',
    artist: 'Siter Suling Parahyangan',
    category: 'Sunda',
    url: 'https://archive.org/download/gamelansunda/Degung%20Sunda.mp3',
    durationText: '04:12',
    description: 'Simbol gotong royong, keasrian alam, dan keselarasan dulur Sunda dalam gerak lagu luhur.'
  },
  {
    id: 'jawa-1',
    title: 'Gamelan Solo Klenengan',
    artist: 'Karawitan Surakarta',
    category: 'Jawa',
    url: 'https://archive.org/download/gamelan-java-full/gamelan%20java%203.mp3',
    durationText: '06:14',
    description: 'Suasana syahdu pendopo Jawa Tengah, ketukan lambat yang memediasi keselarasan jiwa.'
  },
  {
    id: 'jawa-2',
    title: 'Lir Ilir Slendro',
    artist: 'Sekar Karawitan Slemanan',
    category: 'Jawa',
    url: 'https://archive.org/download/gamelan-java-full/gamelan%20java%201.mp3',
    durationText: '04:55',
    description: 'Tembang legendaris luhur ciptaan Sunan Kalijaga tentang kebangkitan batin sedulur.'
  },
  {
    id: 'jawa-3',
    title: 'Suwe Ora Jamu Klasik',
    artist: 'Karawitan Mataraman',
    category: 'Jawa',
    url: 'https://archive.org/download/gamelan-java-full/gamelan%20java%202.mp3',
    durationText: '05:32',
    description: 'Gending dolanan klasik dan saron mengantar kebersamaan setelah sekian lama berpisah.'
  },
  {
    id: 'jawa-4',
    title: 'Karawitan Jawa Tengah Agung',
    artist: 'Ngesti Pandowo Solo',
    category: 'Jawa',
    url: 'https://archive.org/download/gamelan-java-full/gamelan%20java%204.mp3',
    durationText: '05:12',
    description: 'Sajian lengkap musik karawitan tempo lambat penyejuk pikiran sedulur S2J.'
  }
];

// Fast backup CDN track URLs to bypass slow loading Archive.org or sandbox CORS blocks
const BACKUP_TRACK_URLS: Record<string, string> = {
  'sunda-1': 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  'sunda-2': 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  'sunda-3': 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  'jawa-1': 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
  'jawa-2': 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
  'jawa-3': 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
  'jawa-4': 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
};

export const SPOTIFY_PRESETS = [
  {
    id: 'spot-1',
    title: 'Gamelan Jawa Klasik Klenengan',
    artist: 'Karawitan Keraton Agung',
    category: 'Jawa' as const,
    type: 'playlist' as const,
    spotifyId: '37i9dQZF1DXdlBPyWHeicG', // Official Spotify Javanese Gamelan
    description: 'Suasana syahdu pendopo Jawa Tengah, ketukan lambat penyejuk raga.'
  },
  {
    id: 'spot-2',
    title: 'Kecapi Suling Sunda Buhun',
    artist: 'Pakar Degung Parahyangan',
    category: 'Sunda' as const,
    type: 'playlist' as const,
    spotifyId: '37i9dQZF1DXcK3F3C6Vp4g', // Official Spotify Sundanese Degung
    description: 'Alunan magis kacapi rincik & suling bambu menembus sanubari.'
  },
  {
    id: 'spot-3',
    title: 'Angklung Bamboo Masterpieces',
    artist: 'Saung Udjo & Friends',
    category: 'Sunda' as const,
    type: 'playlist' as const,
    spotifyId: '3i0k8M3mK7nOnJ8L2FpYx1', // Public Angklung
    description: 'Harmonisasi indah bambu tradisional goyang khas bumi Priangan.'
  },
  {
    id: 'spot-4',
    title: 'Campursari Lawas & Langgam Jawa',
    artist: 'Bintang Karawitan Populer',
    category: 'Jawa' as const,
    type: 'playlist' as const,
    spotifyId: '1m94IUnGk2L5WofE745R54', // Campursari list
    description: 'Perkawinan gending dolanan dan instrumen modern penyejuk batin.'
  }
];

export const AudioEngine: React.FC<{ 
  onTrackChanged?: (track: Track | null) => void;
  autoPlayRequest?: boolean;
}> = ({ onTrackChanged, autoPlayRequest = false }) => {
  // Mode selection: 'stream' (MP3 Tracks), 'synth' (Web Audio live synth), or 'spotify' (Spotify live players)
  const [playerMode, setPlayerMode] = useState<'stream' | 'synth' | 'spotify'>('stream');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  
  // Spotify Integration States
  const [spotifyInputUrl, setSpotifyInputUrl] = useState<string>('');
  const [currentSpotifyUri, setCurrentSpotifyUri] = useState<string>('37i9dQZF1DXdlBPyWHeicG'); // Default to Gamelan Jawa Klasik
  const [spotifyType, setSpotifyType] = useState<'playlist' | 'album' | 'track'>('playlist');
  const [customSpotifyError, setCustomSpotifyError] = useState<string | null>(null);
  const [selectedSpotifyPresetId, setSelectedSpotifyPresetId] = useState<string>('spot-1');
  
  // Track states
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.35);
  const [trackProgress, setTrackProgress] = useState<number>(0);
  const [currentTimeText, setCurrentTimeText] = useState<string>('00:00');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | 'Sunda' | 'Jawa'>('all');

  // Fast loading & error states
  const [isBuffering, setIsBuffering] = useState<boolean>(false);
  const [playbackError, setPlaybackError] = useState<string | null>(null);
  const [useBackupLinks, setUseBackupLinks] = useState<boolean>(false);

  // Ref pointers of Audio elements
  const audioNodeRef = useRef<HTMLAudioElement | null>(null);
  
  // Web Audio Synth references
  const [currentScale, setCurrentScale] = useState<'slendro' | 'pelog'>('pelog');
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const sequenceTimerRef = useRef<number | null>(null);
  const scales = {
    pelog: [275, 300, 345, 412, 455, 550, 600, 690],
    slendro: [262, 294, 341, 392, 440, 524, 588, 682]
  };

  const filteredTracks = SOUND_TRACKS.filter(t => 
    activeCategoryFilter === 'all' ? true : t.category === activeCategoryFilter
  );

  const currentTrack = SOUND_TRACKS[currentTrackIndex];

  // Helper to determine the direct URL based on server selection
  const getTrackUrl = (track: Track) => {
    return useBackupLinks ? (BACKUP_TRACK_URLS[track.id] || track.url) : track.url;
  };

  // Sync track metadata change with external listener (e.g., Loading overlay)
  useEffect(() => {
    if (onTrackChanged) {
      onTrackChanged(playerMode === 'stream' ? currentTrack : null);
    }
  }, [currentTrackIndex, playerMode, onTrackChanged]);

  // Handle outside auto-play trigger
  useEffect(() => {
    if (autoPlayRequest) {
      if (playerMode === 'stream') {
        startStreaming();
      } else {
        startSynthesis();
      }
    }
  }, [autoPlayRequest]);

  // Sync volume change with audio elements
  useEffect(() => {
    if (audioNodeRef.current) {
      audioNodeRef.current.volume = volume;
    }
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(volume, audioCtxRef.current.currentTime);
    }
  }, [volume]);

  // Initialize and handle HTML Audio Element events
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'auto';
    audio.volume = volume;
    audioNodeRef.current = audio;

    const handleTimeUpdate = () => {
      if (audio.duration) {
        setTrackProgress((audio.currentTime / audio.duration) * 100);
        const mins = Math.floor(audio.currentTime / 60);
        const secs = Math.floor(audio.currentTime % 60);
        setCurrentTimeText(`${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`);
      }
    };

    const handleEnded = () => {
      // Auto advance
      handleNextTrack();
    };

    const handleLoadStart = () => {
      setIsBuffering(true);
      setPlaybackError(null);
    };

    const handleWaiting = () => {
      setIsBuffering(true);
    };

    const handlePlaying = () => {
      setIsBuffering(false);
      setIsPlaying(true);
      setPlaybackError(null);
    };

    const handleCanPlay = () => {
      setIsBuffering(false);
    };

    const handleError = () => {
      setIsBuffering(false);
      setIsPlaying(false);
      const code = audio.error?.code;
      let desc = "Gagal memuat lagu. Server lambat atau diblokir filter.';";
      if (code === 1) desc = "Putaran audio dibatasi browser.";
      else if (code === 2) desc = "Gangguan jaringan saat streaming file lagu.";
      else if (code === 3) desc = "Sistem gagal mendekode file musik.";
      else if (code === 4) desc = "Lagu tidak dapat diakses (Archive.org diblokir atau terkendala CORS di dalam iframe).";
      setPlaybackError(desc);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
      audio.pause();
      stopSynthesis();
    };
  }, []);

  // Update audio source when track index changes or backup links toggle
  useEffect(() => {
    if (audioNodeRef.current && playerMode === 'stream') {
      const wasPlaying = isPlaying;
      audioNodeRef.current.src = getTrackUrl(currentTrack);
      audioNodeRef.current.load();
      if (wasPlaying) {
        audioNodeRef.current.play().catch(e => console.log('Audio stream failed play: ', e));
      }
    }
  }, [currentTrackIndex, useBackupLinks]);

  // HTML Streaming Control Helpers
  const startStreaming = () => {
    stopSynthesis();
    if (audioNodeRef.current) {
      audioNodeRef.current.src = getTrackUrl(currentTrack);
      audioNodeRef.current.volume = volume;
      setIsBuffering(true);
      setPlaybackError(null);
      audioNodeRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(err => {
          console.warn('Click required to boot audio stream', err);
          setIsPlaying(false);
          setIsBuffering(false);
          setPlaybackError("Autoplay dicegah oleh browser. Silakan klik tombol 'Dengarkan Alunan' sekali lagi untuk memutar.");
        });
    }
  };

  const stopStreaming = () => {
    if (audioNodeRef.current) {
      audioNodeRef.current.pause();
    }
    setIsPlaying(false);
  };

  // Live Synth Web Audio generator
  const playGong = (freq: number, duration: number = 3.0, customVol: number = 0.5) => {
    if (!audioCtxRef.current || audioCtxRef.current.state === 'suspended') return;
    const ctx = audioCtxRef.current;
    
    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const subOsc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 1.01, ctx.currentTime);
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(freq * 0.5, ctx.currentTime);
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq * 2.5, ctx.currentTime);
    
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(customVol * volume, ctx.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    
    osc.connect(filter);
    osc2.connect(filter);
    subOsc.connect(filter);
    filter.connect(gainNode);
    
    if (gainNodeRef.current) {
      gainNode.connect(gainNodeRef.current);
    } else {
      gainNode.connect(ctx.destination);
    }
    
    osc.start();
    osc2.start();
    subOsc.start();
    osc.stop(ctx.currentTime + duration);
    osc2.stop(ctx.currentTime + duration);
    subOsc.stop(ctx.currentTime + duration);
  };

  const playSaron = (freq: number) => {
    if (!audioCtxRef.current || audioCtxRef.current.state === 'suspended') return;
    const ctx = audioCtxRef.current;
    
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, ctx.currentTime);
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2.76, ctx.currentTime);
    
    filter.type = 'peaking';
    filter.frequency.setValueAtTime(freq * 1.5, ctx.currentTime);
    filter.Q.setValueAtTime(1.0, ctx.currentTime);
    filter.gain.setValueAtTime(5, ctx.currentTime);
    
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3 * volume, ctx.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
    
    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gainNode);
    
    const delay = ctx.createDelay();
    delay.delayTime.setValueAtTime(0.25, ctx.currentTime);
    const delayGain = ctx.createGain();
    delayGain.gain.setValueAtTime(0.08, ctx.currentTime);
    
    gainNode.connect(gainNodeRef.current || ctx.destination);
    gainNode.connect(delay);
    delay.connect(delayGain);
    delayGain.connect(gainNodeRef.current || ctx.destination);
    
    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + 1.0);
    osc2.stop(ctx.currentTime + 1.0);
  };

  const startSynthesis = () => {
    stopStreaming();
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        gainNodeRef.current = audioCtxRef.current.createGain();
        gainNodeRef.current.gain.setValueAtTime(volume, audioCtxRef.current.currentTime);
        gainNodeRef.current.connect(audioCtxRef.current.destination);
      }
      
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      
      setIsPlaying(true);
      playGong(scales[currentScale][0] * 0.5, 4.0, 0.7);
      
      const noteSequence = [0, 2, 4, 3, 2, 5, 4, 1, 0, 3, 2, 6, 5, 4, 7, 2];
      let step = 0;
      const interval = 800;
      
      const runSequencer = () => {
        if (!audioCtxRef.current) return;
        const noteIndex = noteSequence[step % noteSequence.length];
        const baseFreq = scales[currentScale][noteIndex];
        
        if (step % 16 === 0) {
          playGong(scales[currentScale][0] * 0.5, 5.0, 0.8);
        } else if (step % 8 === 0) {
          playGong(scales[currentScale][2] * 0.5, 3.5, 0.5);
        }
        
        playSaron(baseFreq);
        
        if (Math.random() > 0.6) {
          setTimeout(() => {
            if (audioCtxRef.current && isPlaying) {
              playSaron(baseFreq * 2.0);
            }
          }, interval / 2);
        }
        
        step++;
        sequenceTimerRef.current = window.setTimeout(runSequencer, interval);
      };
      
      sequenceTimerRef.current = window.setTimeout(runSequencer, interval);
    } catch (e) {
      console.error("Synthesis trigger failed: ", e);
    }
  };

  const stopSynthesis = () => {
    if (sequenceTimerRef.current) {
      clearTimeout(sequenceTimerRef.current);
      sequenceTimerRef.current = null;
    }
  };

  // High level UI actions
  const togglePlay = () => {
    if (isPlaying) {
      if (playerMode === 'stream') {
        stopStreaming();
      } else {
        stopSynthesis();
        setIsPlaying(false);
      }
    } else {
      if (playerMode === 'stream') {
        startStreaming();
      } else {
        startSynthesis();
      }
    }
  };

  const switchMode = (newMode: 'stream' | 'synth' | 'spotify') => {
    if (newMode === playerMode) return;
    
    // Stop everything
    stopStreaming();
    stopSynthesis();
    setIsPlaying(false);
    
    setPlayerMode(newMode);

    if (newMode === 'spotify' && onTrackChanged) {
      onTrackChanged({
        id: 'spotify-live',
        title: 'Spotify Traditional Stream Jukebox',
        artist: 'Sundanese & Javanese Cultural Playlist',
        category: 'Sunda',
        url: '',
        durationText: 'Live Stream',
        description: 'Mendengarkan alunan tradisional langsung dari kurasi Spotify.'
      });
    }
  };

  // Helper to parse official Spotify sharing URLs
  const parseSpotifyUrlAndPlay = (input: string) => {
    setCustomSpotifyError(null);
    if (!input || input.trim() === '') {
      setCustomSpotifyError('Silakan masukkan link Spotify yang valid.');
      return;
    }

    const trimmed = input.trim();
    
    // Parse Uri format e.g. spotify:playlist:37i9dQZF1DXdlBPyWHeicG
    if (trimmed.startsWith('spotify:')) {
      const parts = trimmed.split(':');
      if (parts.length >= 3) {
        const type = parts[1];
        const id = parts[2];
        if (['playlist', 'album', 'track'].includes(type)) {
          setSpotifyType(type as any);
          setCurrentSpotifyUri(id);
          setSelectedSpotifyPresetId('');
          return;
        }
      }
    }

    // Parse URL format e.g. https://open.spotify.com/playlist/37i9dQZF1DXdlBPyWHeicG?si=...
    try {
      if (trimmed.includes('spotify.com')) {
        const urlStr = trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;
        const url = new URL(urlStr);
        const pathParts = url.pathname.split('/').filter(Boolean);
        if (pathParts.length >= 2) {
          const type = pathParts[0];
          const id = pathParts[1];
          if (['playlist', 'album', 'track'].includes(type)) {
            setSpotifyType(type as any);
            setCurrentSpotifyUri(id);
            setSelectedSpotifyPresetId('');
            return;
          }
        }
      }
    } catch (e) {
      console.warn('URL parsing failed, trying match fallback', e);
    }

    // Try regex as fallback
    const match = trimmed.match(/\/(playlist|album|track)\/([a-zA-Z0-9]+)/);
    if (match && match[1] && match[2]) {
      setSpotifyType(match[1] as any);
      setCurrentSpotifyUri(match[2]);
      setSelectedSpotifyPresetId('');
    } else {
      setCustomSpotifyError('Format link tidak dikenali. Silakan salin tautan "Share Playlist/Album/Track" resmi dari aplikasi Spotify.');
    }
  };

  const handleNextTrack = () => {
    if (playerMode === 'stream') {
      let nextIndex = currentTrackIndex + 1;
      if (nextIndex >= SOUND_TRACKS.length) {
        nextIndex = 0;
      }
      setCurrentTrackIndex(nextIndex);
    }
  };

  const handlePrevTrack = () => {
    if (playerMode === 'stream') {
      let prevIndex = currentTrackIndex - 1;
      if (prevIndex < 0) {
        prevIndex = SOUND_TRACKS.length - 1;
      }
      setCurrentTrackIndex(prevIndex);
    }
  };

  const selectTrackDirectly = (trackId: string) => {
    const idx = SOUND_TRACKS.findIndex(t => t.id === trackId);
    if (idx !== -1) {
      switchMode('stream');
      setCurrentTrackIndex(idx);
      
      // Delay slightly to allow state to trigger load
      setTimeout(() => {
        if (audioNodeRef.current) {
          audioNodeRef.current.src = getTrackUrl(SOUND_TRACKS[idx]);
          audioNodeRef.current.load();
          setIsBuffering(true);
          setPlaybackError(null);
          audioNodeRef.current.play()
            .then(() => setIsPlaying(true))
            .catch(e => {
              console.log('Interactive select require click', e);
              setIsBuffering(false);
            });
        }
      }, 50);
    }
  };

  return (
    <div id="ambient-audio-panel" className="bg-zinc-900/40 border border-zinc-850 p-5 rounded-2xl relative overflow-hidden shadow-2xl backdrop-blur-sm">
      {/* Absolute decorative aura */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-indigo-500/5 rounded-full filter blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-36 h-36 bg-emerald-500/5 rounded-full filter blur-2xl pointer-events-none" />

      {/* Title & Mode Switchers */}
      <div className="flex flex-col gap-4 relative z-10 mb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl bg-zinc-950 border border-zinc-800 text-amber-400 ${isPlaying ? 'shadow-[0_0_15px_rgba(245,158,11,0.25)]' : ''}`}>
              <Music className={`w-5 h-5 ${isPlaying ? 'animate-[spin_10s_linear_infinite]' : ''}`} />
            </div>
            <div>
              <h3 className="text-sm font-serif font-black tracking-wide text-zinc-100 uppercase">
                Gending Paguyuban S2J
              </h3>
              <p className="text-[10px] text-zinc-450 font-mono uppercase tracking-widest">
                Traditional Audio Stream & Synth
              </p>
            </div>
          </div>

          <span className="flex items-center gap-1.5 text-[9px] font-mono font-bold bg-amber-950/40 border border-amber-900/40 px-2 py-0.5 rounded text-amber-400 uppercase">
            <Radio className="w-2.5 h-2.5 animate-pulse text-rose-500" />
            <span>LIVE HQ SOUND</span>
          </span>
        </div>

        {/* Master Selector Jukebox vs Synthesizer vs Spotify */}
        <div className="grid grid-cols-3 bg-zinc-950 p-1 rounded-xl border border-zinc-900 gap-1">
          <button
            onClick={() => switchMode('stream')}
            className={`py-1.5 px-1 rounded-lg text-[10px] sm:text-[11px] font-semibold uppercase tracking-tight transition-all cursor-pointer text-center ${
              playerMode === 'stream'
                ? 'bg-zinc-900 text-amber-400 border border-zinc-850 shadow-sm font-bold'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Jukebox MP3
          </button>
          <button
            onClick={() => switchMode('synth')}
            className={`py-1.5 px-1 rounded-lg text-[10px] sm:text-[11px] font-semibold uppercase tracking-tight transition-all cursor-pointer text-center ${
              playerMode === 'synth'
                ? 'bg-zinc-900 text-emerald-450 border border-zinc-850 shadow-sm font-bold'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Live Synth
          </button>
          <button
            onClick={() => switchMode('spotify')}
            className={`py-1.5 px-1 rounded-lg text-[10px] sm:text-[11px] font-semibold uppercase tracking-tight transition-all cursor-pointer text-center ${
              playerMode === 'spotify'
                ? 'bg-zinc-900 text-green-400 border border-zinc-850 shadow-sm font-bold'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Spotify 🎧
          </button>
        </div>

        {/* Server Stream Selector Toggle */}
        {playerMode === 'stream' && (
          <div className="bg-zinc-950/50 p-2 rounded-xl border border-zinc-900/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[10px] text-zinc-400 transition-all">
            <span className="font-mono text-[9px] uppercase tracking-wider text-zinc-500">Sumber Aliran Audio:</span>
            <div className="flex bg-zinc-950 p-0.5 rounded-lg border border-zinc-850/80 self-stretch sm:self-auto">
              <button 
                type="button"
                onClick={() => {
                  setUseBackupLinks(false);
                  setPlaybackError(null);
                }}
                className={`flex-1 sm:flex-none px-2 py-1 rounded text-[9px] font-mono font-bold transition-all cursor-pointer ${
                  !useBackupLinks 
                    ? 'bg-amber-950/45 text-amber-400 border border-amber-900/40 font-bold' 
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Utama (Archive.org)
              </button>
              <button 
                type="button"
                onClick={() => {
                  setUseBackupLinks(true);
                  setPlaybackError(null);
                }}
                className={`flex-1 sm:flex-none px-2 py-1 rounded text-[9px] font-mono font-bold transition-all cursor-pointer ${
                  useBackupLinks 
                    ? 'bg-emerald-950/45 text-emerald-400 border border-emerald-900/40 font-bold' 
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Cadangan (Lancar/Cepat)
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main player visual area */}
      <div className="bg-zinc-950/80 border border-zinc-850 rounded-xl p-4 mb-4 relative z-10">
        
        {playerMode === 'stream' ? (
          /* JUKEBOX METRICS & DETAILS */
          <div>
            <div className="flex justify-between items-start gap-3">
              <div>
                <span className={`inline-block text-[8px] font-mono font-bold uppercase tracking-widest px-1.5 py-0.5 rounded mb-2 ${
                  currentTrack.category === 'Sunda' 
                    ? 'bg-orange-950/40 text-orange-400 border border-orange-900/40' 
                    : 'bg-purple-950/40 text-purple-400 border border-purple-900/40'
                }`}>
                  Lagu {currentTrack.category}
                </span>
                <h4 className="text-sm font-bold text-zinc-100 truncate w-44 font-sans tracking-wide">
                  {currentTrack.title}
                </h4>
                <p className="text-[10px] text-zinc-400 tracking-wide mt-0.5">
                  {currentTrack.artist}
                </p>
              </div>

              {/* Disk spinning effect */}
              <div className="relative">
                <div className={`w-12 h-12 rounded-full border border-zinc-800 bg-zinc-900 flex items-center justify-center text-zinc-650 ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}>
                  <Disc className="w-6 h-6 text-zinc-600" />
                </div>
                {isPlaying && !isBuffering && (
                  <span className="absolute top-0 right-0 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                  </span>
                )}
                {isBuffering && (
                  <span className="absolute top-0 right-0 flex h-2.5 w-2.5">
                    <span className="animate-spin absolute inline-flex h-full w-full rounded-full border border-t-transparent border-amber-400" />
                  </span>
                )}
              </div>
            </div>

            {/* Loading/Buffering status overlay */}
            {isBuffering && (
              <div className="mt-3 text-[10px] sm:text-xs font-mono text-amber-400 bg-amber-950/20 border border-amber-900/30 rounded-xl p-3 flex items-start gap-2.5 animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Mempersiapkan alunan musik...</p>
                  <p className="text-[9px] text-zinc-400 mt-0.5 font-sans leading-relaxed">
                    Sedang mengunduh file audio dari Server Utama (Archive.org). Karena ini file instrumen berkualitas tinggi, waktu tunggu bisa mencapai beberapa detik tergantung koneksi internet Anda.
                  </p>
                </div>
              </div>
            )}

            {/* Playback error notice */}
            {playbackError && (
              <div className="mt-3 text-[10px] text-rose-450 bg-rose-950/20 border border-rose-900/30 rounded-xl p-3 space-y-2 text-left">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Gagal memutar audio:</span>
                    <span className="text-[10px] text-zinc-300 font-sans leading-snug">{playbackError}</span>
                  </div>
                </div>
                
                <p className="text-[9px] text-zinc-400 leading-relaxed font-sans mt-1">
                  Kebijakan keamanan browser kadangkala membatasi pemutaran otomatis atau memblokir Archive.org di boks pasir iframe. Silakan klik tombol di bawah untuk solusi cepat:
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-rose-950/40">
                  <button 
                    type="button"
                    onClick={() => {
                      setUseBackupLinks(true);
                      setPlaybackError(null);
                      // slight timeout to let state update
                      setTimeout(() => {
                        startStreaming();
                      }, 100);
                    }}
                    className="bg-emerald-950/60 border border-emerald-500/20 hover:bg-emerald-900/50 px-2 py-1 rounded text-[9px] font-mono font-bold text-emerald-450 transition-all cursor-pointer flex items-center gap-1"
                  >
                    <RefreshCw className="w-2.5 h-2.5" />
                    <span>Pakai Server Cadangan Instan</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => {
                      switchMode('synth');
                      setPlaybackError(null);
                      // slight timeout
                      setTimeout(() => {
                        startSynthesis();
                      }, 100);
                    }}
                    className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 px-2 py-1 rounded text-[9px] font-mono font-bold text-zinc-300 transition-all cursor-pointer"
                  >
                    Kamar Gamelan Synth (Offline)
                  </button>
                </div>
              </div>
            )}

            <p className="text-[10px] text-zinc-450 font-sans leading-relaxed mt-2.5 italic border-t border-zinc-900 pt-2 border-dashed">
              &ldquo;{currentTrack.description}&rdquo;
            </p>

            {/* Custom Interactive Progress Line slider bar */}
            <div className="mt-4 flex items-center gap-2 font-mono text-[9px] text-zinc-500">
              <span>{currentTimeText}</span>
              <div 
                className="flex-1 h-1.5 bg-zinc-900 rounded-full overflow-hidden relative cursor-pointer group"
                onClick={(e) => {
                  if (audioNodeRef.current && audioNodeRef.current.duration) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const percent = (e.clientX - rect.left) / rect.width;
                    audioNodeRef.current.currentTime = percent * audioNodeRef.current.duration;
                  }
                }}
              >
                <div 
                  className={`h-full absolute left-0 top-0 transition-all ${currentTrack.category === 'Sunda' ? 'bg-orange-500' : 'bg-purple-500'}`}
                  style={{ width: `${trackProgress}%` }}
                />
              </div>
              <span>{currentTrack.durationText}</span>
            </div>
          </div>
        ) : playerMode === 'synth' ? (
          /* SYNTHESIS GRAPHICS & INTERFACE */
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="inline-block text-[8px] font-mono font-bold uppercase tracking-widest bg-emerald-950/40 text-emerald-400 border border-emerald-900/40 px-1.5 py-0.5 rounded">
                  Web Audio API Engine
                </span>
                <h4 className="text-sm font-black text-zinc-100 tracking-wide mt-1.5">
                  Digital Bonang & Saron Gamelan
                </h4>
              </div>

              {/* Pitch selector pills */}
              <div className="flex bg-zinc-900 p-0.5 rounded-lg border border-zinc-800">
                <button
                  type="button"
                  onClick={() => setCurrentScale('pelog')}
                  className={`px-2 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase transition-all cursor-pointer ${
                    currentScale === 'pelog' ? 'bg-zinc-8050 text-emerald-450 font-bold' : 'text-zinc-550 hover:text-zinc-400'
                  }`}
                >
                  Pelog
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentScale('slendro')}
                  className={`px-2 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase transition-all cursor-pointer ${
                    currentScale === 'slendro' ? 'bg-zinc-8050 text-yellow-500 font-bold' : 'text-zinc-550 hover:text-zinc-400'
                  }`}
                >
                  Slendro
                </button>
              </div>
            </div>

            <p className="text-[10px] text-zinc-400 leading-relaxed font-sans mt-2.5 border-t border-zinc-900 pt-2 border-dashed">
              Sintesis gelombang suara perunggu tradisional Sunda-Jawa secara mandiri langsung di browser anda.
            </p>

            {/* Simulated waveform bars */}
            <div className="h-9 bg-zinc-950 rounded-lg flex items-end justify-center gap-1.5 mt-3 select-none overflow-hidden pb-1 border border-zinc-900">
              {isPlaying ? (
                Array.from({ length: 18 }).map((_, i) => {
                  const animDur = [1.2, 0.8, 1.5, 0.9, 1.1, 1.4, 0.7, 1.3, 1.0, 1.2, 1.6, 0.8, 1.1, 1.3, 0.9, 1.4, 0.6, 1.1][i];
                  return (
                    <div
                      key={i}
                      className="w-1 bg-emerald-500/80 rounded-sm"
                      style={{
                        height: '100%',
                        transformOrigin: 'bottom',
                        animation: `pulse-height ${animDur}s ease-in-out infinite alternate`,
                        animationDelay: `${i * 0.04}s`
                      }}
                    />
                  );
                })
              ) : (
                <p className="text-[10px] text-zinc-550 font-sans tracking-wide pb-1 italic">Synth sedang lengang</p>
              )}
            </div>
          </div>
        ) : (
          /* SPOTIFY PLAYER EMBED & CONTROL */
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-950">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0" />
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-bold">Spotify Jukebox Kurasi</span>
              </div>
              <span className="text-[9px] text-green-500 font-mono font-bold uppercase bg-green-950/40 border border-green-900/40 px-1.5 py-0.2 rounded">CORS Free</span>
            </div>

            {/* Curated Spotify Presets List */}
            <div className="mb-4">
              <label className="text-[10px] font-mono text-zinc-500 uppercase block mb-1.5 font-bold">Pilih Preset Musik S2J:</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SPOTIFY_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setSelectedSpotifyPresetId(preset.id);
                      setSpotifyType(preset.type);
                      setCurrentSpotifyUri(preset.spotifyId);
                      setCustomSpotifyError(null);
                    }}
                    className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                      selectedSpotifyPresetId === preset.id
                        ? 'bg-green-950/25 border-green-500/50 text-green-400 shadow-[0_0_12px_rgba(34,197,94,0.08)] font-bold'
                        : 'bg-zinc-950/60 border-zinc-900 text-zinc-400 hover:text-zinc-200 hover:border-zinc-800'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-[8px] font-mono font-bold block uppercase tracking-wider px-1 rounded ${
                        preset.category === 'Sunda' 
                          ? 'bg-orange-950/40 text-orange-400 border border-orange-900/40' 
                          : 'bg-purple-950/40 text-purple-400 border border-purple-900/40'
                      }`}>
                        Lagu {preset.category}
                      </span>
                    </div>
                    <strong className="text-xs font-bold block truncate text-zinc-100">{preset.title}</strong>
                    <span className="text-[9px] text-zinc-500 block truncate mt-0.5">{preset.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom URL Input block */}
            <div className="mb-4 py-2 border-t border-zinc-900 border-dashed">
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] font-mono text-zinc-400 uppercase block font-bold">Masukkan Link Album/Playlist Spotify Lainnya:</label>
                <span className="text-[8px] font-mono text-zinc-650 font-semibold text-emerald-400">Mainkan Bebas</span>
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600">
                    <Link className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="text"
                    value={spotifyInputUrl}
                    onChange={(e) => setSpotifyInputUrl(e.target.value)}
                    placeholder="Contoh: https://open.spotify.com/playlist/..."
                    className="w-full bg-zinc-950 border border-zinc-900 rounded-xl py-1.5 pl-9 pr-3 text-[11px] text-zinc-350 placeholder-zinc-700 font-sans focus:outline-none focus:border-green-800"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => parseSpotifyUrlAndPlay(spotifyInputUrl)}
                  className="bg-green-500 hover:bg-green-400 text-zinc-950 px-3 rounded-xl text-[11px] font-bold font-sans transition-all cursor-pointer flex items-center gap-1 shrink-0"
                >
                  <Search className="w-3 h-3" />
                  <span>Muat</span>
                </button>
              </div>
              {customSpotifyError && (
                <p className="text-[9px] text-rose-450 mt-1 font-mono">{customSpotifyError}</p>
              )}
            </div>

            {/* Official IFrame Code with modern responsive setup */}
            <div className="rounded-xl overflow-hidden bg-zinc-950 border border-zinc-900/60 shadow-inner mt-4">
              <iframe 
                src={`https://open.spotify.com/embed/${spotifyType}/${currentSpotifyUri}?utm_source=generator&theme=0`} 
                width="100%" 
                height="152" 
                frameBorder="0" 
                allowFullScreen={false} 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                loading="lazy"
                className="w-full block"
              ></iframe>
            </div>

            <p className="text-[9px] text-zinc-550 leading-relaxed font-sans mt-3 text-center italic">
              * Putar lagu, atur volume, dan pilih daftar putar langsung dari pemutar resmi Spotify di atas.
            </p>
          </div>
        )}
      </div>

      {/* Media transport buttons and Volume control */}
      {playerMode !== 'spotify' && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-2 mb-4 relative z-10">
          
          {/* Playback action deck */}
          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-center">
            {playerMode === 'stream' && (
              <button
                onClick={handlePrevTrack}
                className="p-2.5 bg-zinc-950 border border-zinc-850 text-zinc-400 hover:text-amber-400 rounded-xl hover:bg-zinc-900 cursor-pointer"
                title="Lagu Sebelumnya"
              >
                <SkipBack className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={togglePlay}
              className={`px-5 py-2.5 flex-grow sm:flex-grow-0 rounded-xl font-bold font-sans text-xs tracking-wide transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer ${
                isPlaying 
                  ? 'bg-rose-950/40 border border-rose-900/40 text-rose-400 hover:bg-rose-950/60' 
                  : playerMode === 'stream'
                    ? 'bg-amber-500 hover:bg-amber-400 text-zinc-950 hover:shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 hover:shadow-[0_0_15px_rgba(16,185,129,0.25)]'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Matikan Musik</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Dengarkan Alunan</span>
                </>
              )}
            </button>

            {playerMode === 'stream' && (
              <button
                onClick={handleNextTrack}
                className="p-2.5 bg-zinc-950 border border-zinc-850 text-zinc-400 hover:text-amber-400 rounded-xl hover:bg-zinc-900 cursor-pointer"
                title="Lagu Selanjutnya"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Volume slider input */}
          <div className="flex items-center gap-2 bg-zinc-955 px-3 py-2 rounded-xl border border-zinc-900 flex-1 self-stretch">
            <Volume2 className="w-3.5 h-3.5 text-zinc-500" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-550"
              style={{ WebkitAppearance: 'none' }}
            />
            <span className="font-mono text-[9px] text-zinc-500 w-6 text-right">
              {Math.round(volume * 100)}%
            </span>
          </div>
        </div>
      )}

      {/* Interactive Song List Directory inside Jukebox mode */}
      {playerMode === 'stream' && (
        <div className="mt-4 border-t border-zinc-900 pt-4 relative z-10">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1">
              <Grid className="w-3.5 h-3.5 text-zinc-500" />
              Daftar Tembang Nusantara ({filteredTracks.length})
            </span>

            {/* Filters */}
            <div className="flex bg-zinc-950 p-0.5 rounded-lg border border-zinc-850">
              {['all', 'Sunda', 'Jawa'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategoryFilter(cat as any)}
                  className={`px-2 py-0.5 rounded text-[9px] font-mono leading-relaxed font-bold transition-all cursor-pointer ${
                    activeCategoryFilter === cat 
                      ? 'bg-zinc-900 text-amber-400 border border-zinc-850' 
                      : 'text-zinc-650 hover:text-zinc-455'
                  }`}
                >
                  {cat === 'all' ? 'SEMUA' : cat.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Track listing deck */}
          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-800">
            {filteredTracks.map((tk) => {
              const globalIdx = SOUND_TRACKS.findIndex(t => t.id === tk.id);
              const isActive = globalIdx === currentTrackIndex && playerMode === 'stream';
              return (
                <div
                  key={tk.id}
                  onClick={() => selectTrackDirectly(tk.id)}
                  className={`flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer text-left ${
                    isActive
                      ? tk.category === 'Sunda'
                        ? 'bg-orange-950/20 border-orange-550/40 text-orange-400 shadow-[0_0_12px_rgba(249,115,22,0.06)]'
                        : 'bg-purple-950/20 border-purple-550/40 text-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.06)]'
                      : 'bg-zinc-950/50 border-zinc-900 text-zinc-400 hover:text-zinc-200 hover:border-zinc-800'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate pr-2">
                    <span className="text-[9px] font-mono text-zinc-600 block w-4 text-center">
                      {isActive && isPlaying ? (
                        <span className="inline-block w-1.5 h-1.5 bg-current rounded-full animate-ping" />
                      ) : (
                        globalIdx + 1
                      )}
                    </span>
                    <div className="truncate">
                      <p className={`text-xs font-semibold truncate ${isActive ? 'text-zinc-100 font-bold' : ''}`}>
                        {tk.title}
                      </p>
                      <p className="text-[10px] text-zinc-550 truncate">
                        {tk.artist}
                      </p>
                    </div>
                  </div>

                  <span className="font-mono text-[9px] text-zinc-500 select-none whitespace-nowrap">
                    {tk.durationText}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Unified footer interactions */}
      <div className="flex items-center justify-between border-t border-zinc-900 pt-3.5 mt-3 relative z-10 font-sans text-[10px] text-zinc-450">
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="font-mono text-[9px] uppercase tracking-wide">Output: Stereo 320kbps</span>
        </div>

        <button
          onClick={() => {
            if (playerMode === 'synth' && isPlaying) {
              playSaron(scales[currentScale][Math.floor(Math.random() * scales[currentScale].length)] * 2.0);
            } else if (playerMode === 'stream' && audioNodeRef.current && isPlaying) {
              // Gamelan chime overlay
              const synthNode = new (window.AudioContext || (window as any).webkitAudioContext)();
              const osc = synthNode.createOscillator();
              const gain = synthNode.createGain();
              osc.type = 'triangle';
              osc.frequency.setValueAtTime(455 * 1.5, synthNode.currentTime);
              gain.gain.setValueAtTime(0, synthNode.currentTime);
              gain.gain.linearRampToValueAtTime(0.1, synthNode.currentTime + 0.01);
              gain.gain.exponentialRampToValueAtTime(0.001, synthNode.currentTime + 0.5);
              osc.connect(gain);
              gain.connect(synthNode.destination);
              osc.start();
              osc.stop(synthNode.currentTime + 0.6);
            }
          }}
          className="hover:text-amber-400 transition-colors flex items-center gap-1 cursor-pointer font-bold"
        >
          <Heart className="w-3 h-3 text-red-500 fill-red-500 animate-pulse" />
          <span>Ucap Syukur 🙏</span>
        </button>
      </div>
    </div>
  );
};

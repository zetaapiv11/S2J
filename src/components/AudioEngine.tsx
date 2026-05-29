import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music, Heart, Sparkles } from 'lucide-react';

export const AudioEngine: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentScale, setCurrentScale] = useState<'slendro' | 'pelog'>('pelog');
  const [volume, setVolume] = useState<number>(0.3);
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const sequenceTimerRef = useRef<number | null>(null);
  const currentNoteIndexRef = useRef<number>(0);

  // Traditional Gamelan Pelog and Slendro scale frequencies (Hz) approximate
  const scales = {
    pelog: [275, 300, 345, 412, 455, 550, 600, 690], // Deep, mystical
    slendro: [262, 294, 341, 392, 440, 524, 588, 682], // Bright, heroic
  };

  const playGong = (freq: number, duration: number = 3.0, customVol: number = 0.5) => {
    if (!audioCtxRef.current || audioCtxRef.current.state === 'suspended') return;
    
    const ctx = audioCtxRef.current;
    
    // Deep resonant carrier
    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const subOsc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 1.01, ctx.currentTime); // subtle chorus detune
    
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(freq * 0.5, ctx.currentTime); // sub-harmonics for depth
    
    // Low pass filter to make it warmer
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq * 2.5, ctx.currentTime);
    
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    // Instant attack, very long decay representing gong resonance
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
    
    // Bright metallic bell-like bar
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator(); // overtone
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, ctx.currentTime);
    
    osc2.type = 'sine';
    // metallic overtones are usually non-harmonic (e.g. 2.76x of fundamental)
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
    
    // Add custom delay for traditional spacious echo
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
    if (isPlaying) return;
    
    try {
      if (!audioCtxRef.current) {
        // Create audio context
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        gainNodeRef.current = audioCtxRef.current.createGain();
        gainNodeRef.current.gain.setValueAtTime(1.0, audioCtxRef.current.currentTime);
        gainNodeRef.current.connect(audioCtxRef.current.destination);
      }
      
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      
      setIsPlaying(true);
      
      // Play starter deep Gong representing blessing and start
      playGong(scales[currentScale][0] * 0.5, 4.0, 0.7);
      
      // Start sequencer loop representing traditional pacing
      const noteSequence = [0, 2, 4, 3, 2, 5, 4, 1, 0, 3, 2, 6, 5, 4, 7, 2];
      
      let step = 0;
      const interval = 800; // ms per step (stately, calm pace)
      
      const runSequencer = () => {
        if (!audioCtxRef.current) return;
        
        const noteIndex = noteSequence[step % noteSequence.length];
        const baseFreq = scales[currentScale][noteIndex];
        
        // Randomly play a high melodic note or a strong deep gong
        if (step % 16 === 0) {
          // Absolute deep ancestral gong at the start of rhythm cycles
          playGong(scales[currentScale][0] * 0.5, 5.0, 0.8);
        } else if (step % 8 === 0) {
          // Mid gong
          playGong(scales[currentScale][2] * 0.5, 3.5, 0.5);
        }
        
        // Play the main saron note
        playSaron(baseFreq);
        
        // Occasional light accompaniment note
        if (Math.random() > 0.6) {
          setTimeout(() => {
            if (audioCtxRef.current && isPlaying) {
              playSaron(baseFreq * 2.0); // An octave higher for sparkle
            }
          }, interval / 2);
        }
        
        step++;
        sequenceTimerRef.current = window.setTimeout(runSequencer, interval);
      };
      
      sequenceTimerRef.current = window.setTimeout(runSequencer, interval);
      
    } catch (e) {
      console.error("Failed to start traditional synthesis", e);
    }
  };

  const stopSynthesis = () => {
    if (sequenceTimerRef.current) {
      clearTimeout(sequenceTimerRef.current);
      sequenceTimerRef.current = null;
    }
    setIsPlaying(false);
  };

  const toggleSound = () => {
    if (isPlaying) {
      stopSynthesis();
    } else {
      startSynthesis();
    }
  };

  useEffect(() => {
    // If scale changes during playback, update gracefully
    if (isPlaying && audioCtxRef.current) {
      // Play a transition gong
      playGong(scales[currentScale][1] * 0.5, 3.5, 0.6);
    }
  }, [currentScale]);

  useEffect(() => {
    return () => {
      if (sequenceTimerRef.current) {
        clearTimeout(sequenceTimerRef.current);
      }
    };
  }, []);

  return (
    <div id="ambient-audio-panel" className="bg-zinc-900/80 border border-emerald-950/40 backdrop-blur-md rounded-2xl p-5 shadow-2xl relative overflow-hidden max-w-sm w-full mx-auto">
      {/* Visual background glow */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full filter blur-xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-500/5 rounded-full filter blur-xl" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${isPlaying ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-800 text-zinc-500'}`}>
              <Music className={`w-5 h-5 ${isPlaying ? 'animate-[spin_6s_linear_infinite]' : ''}`} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-zinc-100 font-sans tracking-wide">Alunan Nusantara</h4>
              <p className="text-[10px] text-zinc-400 font-mono">Synthesized Live Soundscape</p>
            </div>
          </div>
          
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/50 border border-emerald-500/20 text-emerald-400 font-mono flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5" />
            Live Synthesizer
          </span>
        </div>

        {/* Audio Visualizer Waves (pure CSS simulations) */}
        <div className="h-10 bg-zinc-950/60 rounded-lg flex items-end justify-center gap-1 p-2 border border-zinc-800/80 mb-4 overflow-hidden">
          {isPlaying ? (
            Array.from({ length: 15 }).map((_, i) => {
              const animDur = [1.2, 0.8, 1.5, 0.9, 1.1, 1.4, 0.7, 1.3, 1.0, 1.2, 1.6, 0.8, 1.1, 1.3, 0.9][i];
              return (
                <div
                  key={i}
                  className="w-1.5 bg-emerald-500 rounded-sm"
                  style={{
                    height: '100%',
                    transformOrigin: 'bottom',
                    animation: `pulse-height ${animDur}s ease-in-out infinite alternate`,
                    animationDelay: `${i * 0.05}s`
                  }}
                />
              );
            })
          ) : (
            <p className="text-xs text-zinc-500 font-sans text-center w-full pb-1">Instrumental sedang hening</p>
          )}
        </div>

        {/* Action Controls */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            id="play-sound-btn"
            onClick={toggleSound}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-sans text-xs font-semibold transition-all duration-300 ${
              isPlaying
                ? 'bg-yellow-500 text-zinc-950 hover:bg-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.3)]'
                : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
            }`}
          >
            {isPlaying ? (
              <>
                <VolumeX className="w-4 h-4" />
                Matikan Musik
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4" />
                Dengarkan Alunan
              </>
            )}
          </button>

          {/* Scale selector */}
          <div className="flex bg-zinc-800/90 p-0.5 rounded-xl border border-zinc-700/50">
            <button
              id="scale-pelog-btn"
              onClick={() => setCurrentScale('pelog')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-medium font-sans transition-all duration-200 ${
                currentScale === 'pelog'
                  ? 'bg-zinc-950 text-emerald-400 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Degung Pelog
            </button>
            <button
              id="scale-slendro-btn"
              onClick={() => setCurrentScale('slendro')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-medium font-sans transition-all duration-200 ${
                currentScale === 'slendro'
                  ? 'bg-zinc-950 text-yellow-400 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Slendro Jawa
            </button>
          </div>
        </div>

        {/* Volume & Details */}
        <div className="flex items-center justify-between text-[11px] text-zinc-400 font-sans border-t border-zinc-800/80 pt-3">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-mono">Pace: 75 BPM</span>
          </div>
          
          <button
            onClick={() => {
              if (isPlaying) {
                // Play a pleasant waterdrop note
                playSaron(scales[currentScale][Math.floor(Math.random() * scales[currentScale].length)] * 2.0);
              }
            }}
            disabled={!isPlaying}
            className="text-zinc-400 hover:text-yellow-400 font-medium transition-colors flex items-center gap-1 disabled:opacity-30"
          >
            <Heart className="w-3 h-3 text-red-500 fill-red-500" />
            Ucap Syukur (Tepuk Gamelan)
          </button>
        </div>
      </div>
    </div>
  );
};

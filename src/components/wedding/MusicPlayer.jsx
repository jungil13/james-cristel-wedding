import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function MusicPlayer({ autoPlayTrigger }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef(null);
  const timerRef = useRef(null);
  const isPlayingRef = useRef(false);

  // Soft romantic wedding arpeggio chords (Harp/Acoustic Piano simulation via Web Audio API)
  // Notes in Hz: D4, F#4, A4, C#5, E5, D5, B4, A4, G4, F#4
  const chords = [
    [293.66, 369.99, 440.0, 554.37], // Dmaj7
    [246.94, 329.63, 392.0, 493.88], // Em7
    [220.00, 277.18, 329.63, 440.00], // A7sus
    [293.66, 369.99, 440.0, 587.33], // Dadd9
  ];

  const playTone = (freq, time, duration = 2.5) => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    
    // Main oscillator for soft bell/piano tone
    const osc = ctx.createOscillator();
    const oscHarmonic = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    oscHarmonic.type = 'triangle';
    oscHarmonic.frequency.setValueAtTime(freq * 2, time);

    // Warm soft low-pass filter
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, time);
    filter.Q.setValueAtTime(1.5, time);

    // Envelope
    gainNode.gain.setValueAtTime(0, time);
    gainNode.gain.linearRampToValueAtTime(0.08, time + 0.08);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(filter);
    oscHarmonic.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(time);
    oscHarmonic.start(time);
    osc.stop(time + duration);
    oscHarmonic.stop(time + duration);
  };

  const scheduleMelody = () => {
    if (!audioCtxRef.current || !isPlayingRef.current) return;
    const ctx = audioCtxRef.current;
    const now = ctx.currentTime;
    let noteTime = now + 0.1;

    for (let c = 0; c < chords.length; c++) {
      const chord = chords[c];
      for (let n = 0; n < chord.length; n++) {
        playTone(chord[n], noteTime, 3.0);
        noteTime += 0.55;
      }
      noteTime += 0.4;
    }

    const loopDuration = (noteTime - now) * 1000;
    timerRef.current = setTimeout(() => {
      if (isPlayingRef.current) {
        scheduleMelody();
      }
    }, loopDuration - 200);
  };

  const startMusic = async () => {
    try {
      if (!audioCtxRef.current) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtxRef.current = new AudioContext();
      }

      if (audioCtxRef.current.state === 'suspended') {
        await audioCtxRef.current.resume();
      }

      isPlayingRef.current = true;
      setIsPlaying(true);
      scheduleMelody();
    } catch (err) {
      console.warn('Audio playback restricted:', err);
    }
  };

  const stopMusic = () => {
    isPlayingRef.current = false;
    setIsPlaying(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'running') {
      audioCtxRef.current.suspend();
    }
  };

  const toggleMusic = () => {
    if (isPlaying) {
      stopMusic();
    } else {
      startMusic();
    }
  };

  // Trigger audio on user-initiated door opening
  useEffect(() => {
    if (autoPlayTrigger && !isPlaying) {
      startMusic();
    }
  }, [autoPlayTrigger]);

  useEffect(() => {
    return () => {
      isPlayingRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <button
        onClick={toggleMusic}
        aria-label={isPlaying ? "Mute background wedding music" : "Play background wedding music"}
        className={`group flex items-center gap-2.5 px-4 py-2.5 rounded-full backdrop-blur-md transition-all duration-300 shadow-wedding-lg border ${
          isPlaying 
            ? 'bg-weddingBrown/90 text-champagne border-gold/40 hover:bg-weddingBrown' 
            : 'bg-white/90 text-weddingBrown border-taupe/30 hover:bg-white'
        }`}
      >
        <span className="relative flex h-3 w-3">
          {isPlaying && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
          )}
          <span className={`relative inline-flex rounded-full h-3 w-3 ${isPlaying ? 'bg-gold' : 'bg-taupe/40'}`}></span>
        </span>
        
        {isPlaying ? (
          <Volume2 className="w-4 h-4 text-champagne group-hover:scale-110 transition-transform" />
        ) : (
          <VolumeX className="w-4 h-4 text-taupe group-hover:scale-110 transition-transform" />
        )}
        
        <span className="text-xs font-medium tracking-wider uppercase font-poppins hidden sm:inline">
          {isPlaying ? 'Wedding Melody' : 'Play Music'}
        </span>
      </button>
    </div>
  );
}

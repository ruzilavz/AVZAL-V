import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { Track } from '../types';

interface AudioContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  playTrack: (track: Track) => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  seek: (time: number) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    const audio = audioRef.current;

    const updateProgress = () => {
      setProgress(audio.currentTime);
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadedmetadata', updateProgress);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadedmetadata', updateProgress);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const playTrack = (track: Track) => {
    if (!audioRef.current) return;
    
    if (currentTrack?.id === track.id) {
      togglePlay();
      return;
    }

    if (!track.isReleased) return;

    audioRef.current.src = track.audioUrl;
    setCurrentTrack(track);
    setIsPlaying(true);
    // Reset progress
    setProgress(0);
  };

  const togglePlay = () => {
    setIsPlaying(prev => !prev);
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setProgress(time);
    }
  };

  const nextTrack = () => {
    // Implement next logic based on playlist if needed
    console.log("Next track logic placeholder");
  };

  const prevTrack = () => {
    console.log("Prev track logic placeholder");
  };

  return (
    <AudioContext.Provider value={{
      currentTrack,
      isPlaying,
      progress,
      duration,
      playTrack,
      togglePlay,
      nextTrack,
      prevTrack,
      seek
    }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

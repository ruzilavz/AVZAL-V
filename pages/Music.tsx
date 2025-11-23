import React from 'react';
import { TRACKS } from '../constants';
import { useAudio } from '../context/AudioContext';
import { Play, Pause, Clock, Lock } from 'lucide-react';

const Music: React.FC = () => {
  const { currentTrack, isPlaying, playTrack, togglePlay } = useAudio();

  return (
    <div className="pt-24 pb-32 min-h-screen container mx-auto px-4">
      <div className="mb-12 border-b border-white/10 pb-8">
        <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-4">Discography</h1>
        <p className="text-gray-400 font-body text-lg max-w-2xl">
          Sonic experiments and released frequencies. Listen to the latest tracks produced in the lab.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {TRACKS.map((track) => {
          const isCurrent = currentTrack?.id === track.id;
          
          return (
            <div 
              key={track.id} 
              className={`group flex items-center p-4 rounded-lg transition-all duration-300 ${isCurrent ? 'bg-primary/10 border border-primary/30' : 'bg-surface hover:bg-white/5 border border-transparent'}`}
            >
              {/* Cover Art */}
              <div className="relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0">
                <img 
                  src={track.coverUrl} 
                  alt={track.title} 
                  className={`w-full h-full object-cover rounded shadow-lg ${!track.isReleased ? 'grayscale opacity-50' : ''}`} 
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  {track.isReleased ? (
                    <button 
                      onClick={() => playTrack(track)}
                      className={`w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ${isCurrent ? 'opacity-100' : ''}`}
                    >
                      {isCurrent && isPlaying ? <Pause size={18} className="text-white" /> : <Play size={18} className="text-white ml-1" />}
                    </button>
                  ) : (
                    <Lock size={20} className="text-gray-400" />
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="ml-4 md:ml-6 flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className={`font-display text-lg md:text-xl font-bold truncate ${isCurrent ? 'text-primary' : 'text-white'}`}>
                    {track.title}
                  </h3>
                  {!track.isReleased && (
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-gray-800 text-gray-400 rounded">Soon</span>
                  )}
                </div>
                <p className="text-sm text-gray-400 font-body uppercase tracking-wider">{track.artist} • {track.album || 'Single'}</p>
              </div>

              {/* Meta */}
              <div className="hidden md:flex items-center gap-8 text-gray-500 text-sm font-mono mr-4">
                <div className="flex items-center gap-2">
                   {track.isReleased ? (
                     <>
                        <Clock size={14} />
                        <span>{Math.floor(track.duration / 60)}:{track.duration % 60 < 10 ? '0' : ''}{track.duration % 60}</span>
                     </>
                   ) : (
                     <span>{track.releaseDate}</span>
                   )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Music;
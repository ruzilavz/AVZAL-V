import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

const App = () => {
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    // Данные из файла tracks-data.js, прикрепленные к window
    if (window.RELEASED_TRACKS_DATA) {
      setTracks(window.RELEASED_TRACKS_DATA);
    }
  }, []);

  const getCoverArt = (track) => {
    const ext = track.coverExt || '.jpg';
    return `/covers/${track.slug}${ext}`;
  };

  const getAudioSrc = (track) => {
    if (track.audio === false) return null;
    const ext = track.audioExt || '.mp3';
    return `/audio/${track.slug}${ext}`;
  };

  return (
    <div className="bg-background min-h-screen font-body text-text">
      <div className="container mx-auto p-4 md:p-8">
        <header className="text-center my-8 md:my-12">
          <h1 className="text-4xl md:text-6xl font-display font-bold neon-text animate-pulse-slow">
            AVZALØV
          </h1>
          <p className="text-lg md:text-xl mt-2 text-gray-400">
            Musician, Producer, Developer.
          </p>
        </header>

        <main>
          <h2 className="text-3xl md:text-4xl font-display neon-text mb-8 text-center">
            Треки
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {tracks.map((track) => (
              <div
                key={track.slug}
                className="bg-surface rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-primary/50 hover:scale-105 border border-transparent hover:border-primary/50"
              >
                <img
                  src={getCoverArt(track)}
                  alt={`Обложка трека ${track.title}`}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-bold font-display truncate">
                    {track.title}
                  </h3>
                  <p className="text-gray-400">{track.artist}</p>
                  <div className="mt-2 text-sm text-gray-500">
                    <p>
                      Релиз:{' '}
                      <span className="font-semibold text-primary">
                        {track.releaseDate} {track.releaseTime || ''}
                      </span>
                    </p>
                    {track.price === 0 && (
                      <span className="text-green-400 font-bold">Free</span>
                    )}
                     {track.access === 'early-access' && (
                      <span className="text-yellow-400 font-bold">Early Access</span>
                    )}
                  </div>

                  {getAudioSrc(track) && (
                     <audio controls className="w-full mt-4">
                        <source src={getAudioSrc(track)} type={track.audioExt === '.wav' ? 'audio/wav' : 'audio/mpeg'} />
                        Your browser does not support the audio element.
                    </audio>
                  )}

                  {track.hasClip && (
                     <a 
                        href={track.clipUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="mt-4 inline-block w-full text-center bg-red-600/50 hover:bg-red-500/50 text-white font-bold py-2 px-4 rounded"
                     >
                       Клип
                     </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
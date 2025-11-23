import React from 'react';
import { Camera, Video } from 'lucide-react';

const Gallery: React.FC = () => {
  const images = Array.from({ length: 9 }).map((_, i) => ({
    id: i,
    url: `https://picsum.photos/seed/${i + 50}/600/400`,
    type: i % 3 === 0 ? 'video' : 'photo'
  }));

  return (
    <div className="pt-24 pb-32 min-h-screen container mx-auto px-4">
      <div className="mb-12">
        <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-4">Visual Archives</h1>
        <p className="text-gray-400 font-body text-lg">Glimpses into the process.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((item) => (
          <div key={item.id} className="group relative aspect-video bg-surface overflow-hidden rounded-lg cursor-pointer border border-transparent hover:border-primary/50 transition-all">
            <img 
              src={item.url} 
              alt="Gallery Item" 
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 opacity-70 group-hover:opacity-100" 
              loading="lazy"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
              {item.type === 'video' ? (
                <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center text-white">
                  <Video size={24} />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center text-white">
                  <Camera size={24} />
                </div>
              )}
            </div>
            <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-xs font-mono text-primary uppercase">Archive_00{item.id}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
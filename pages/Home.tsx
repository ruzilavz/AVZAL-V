import React from 'react';
import { Link } from 'react-router-dom';
import { Play, ArrowRight, Activity } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Abstract Background Element */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b0d12] via-[#0b0d12]/50 to-[#0b0d12] z-10"></div>
        <div className="absolute inset-0 opacity-20 bg-[url('https://picsum.photos/id/450/1920/1080')] bg-cover bg-center"></div>
        
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-block mb-4 px-3 py-1 border border-primary/30 rounded-full bg-primary/10 text-primary text-xs font-mono tracking-widest uppercase">
            Official Frequency
          </div>
          <h1 className="font-display font-black text-5xl md:text-7xl lg:text-9xl mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 neon-text">
            AVZALØV
          </h1>
          <p className="font-body text-xl md:text-2xl text-gray-400 mb-10 tracking-wide">
            MUSICIAN / PRODUCER / <span className="text-primary">DEVELOPER</span>
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/music" 
              className="px-8 py-3 bg-primary text-black font-bold font-display uppercase tracking-wider hover:bg-white hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              <Play size={18} fill="black" /> Listen Now
            </Link>
            <Link 
              to="/ai-lab" 
              className="px-8 py-3 border border-gray-600 bg-black/50 backdrop-blur text-white font-bold font-display uppercase tracking-wider hover:border-primary hover:text-primary transition-all duration-300 flex items-center gap-2"
            >
              <Activity size={18} /> Enter AI Lab
            </Link>
          </div>
        </div>
      </section>

      {/* Latest News / Updates Teaser */}
      <section className="py-20 bg-surface">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-3xl font-display font-bold text-white">Latest Transmissions</h2>
            <Link to="/blog" className="text-primary text-sm uppercase tracking-widest hover:underline flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <article key={item} className="group bg-[#0b0d12] border border-white/5 hover:border-primary/50 transition-colors p-6 rounded-sm">
                <div className="text-xs text-gray-500 font-mono mb-2">2024.05.{10 + item}</div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">System Update v{item}.0: New Release Incoming</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  Preparing the neural networks for the upcoming drop. Pre-save link available in the bio.
                </p>
                <Link to="/blog" className="text-xs font-bold uppercase text-gray-500 group-hover:text-white">Read More</Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
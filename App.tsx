import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AudioProvider } from './context/AudioContext';
import Navbar from './components/Navbar';
import PlayerBar from './components/PlayerBar';
import CustomCursor from './components/CustomCursor';
import Home from './pages/Home';
import Music from './pages/Music';
import AILab from './pages/AILab';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';

const App: React.FC = () => {
  return (
    <AudioProvider>
      <HashRouter>
        <div className="bg-background min-h-screen text-text font-body selection:bg-primary selection:text-black">
          <CustomCursor />
          <Navbar />
          
          <main className="relative z-10">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/music" element={<Music />} />
              <Route path="/ai-lab" element={<AILab />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/contact" element={<Contact />} />
              {/* Placeholders for other routes */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <PlayerBar />
        </div>
      </HashRouter>
    </AudioProvider>
  );
};

export default App;
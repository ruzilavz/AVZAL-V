import React, { useState } from 'react';
import { Mail, Send } from 'lucide-react';

const Contact: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to send email would go here
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="pt-24 pb-32 min-h-screen container mx-auto px-4 flex justify-center">
      <div className="w-full max-w-2xl">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-display font-bold text-white mb-2">Establish Contact</h1>
          <p className="text-gray-400">Bookings, collaborations, or encrypted messages.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-surface/50 p-8 rounded-xl border border-white/5 backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-mono text-primary uppercase">Identification</label>
              <input type="text" required className="w-full bg-[#0b0d12] border border-white/10 rounded p-3 text-white focus:border-primary focus:outline-none transition-colors" placeholder="Your Name" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono text-primary uppercase">Frequency (Email)</label>
              <input type="email" required className="w-full bg-[#0b0d12] border border-white/10 rounded p-3 text-white focus:border-primary focus:outline-none transition-colors" placeholder="email@domain.com" />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-mono text-primary uppercase">Transmission</label>
            <textarea required rows={5} className="w-full bg-[#0b0d12] border border-white/10 rounded p-3 text-white focus:border-primary focus:outline-none transition-colors" placeholder="Type your message..."></textarea>
          </div>

          <button 
            type="submit" 
            className="w-full py-4 bg-white text-black font-bold font-display uppercase tracking-widest hover:bg-primary transition-colors flex items-center justify-center gap-2"
          >
            {submitted ? 'Transmission Sent' : <><Send size={18} /> Send Message</>}
          </button>
        </form>

        <div className="mt-12 flex justify-center gap-8">
           <a href="mailto:contact@avzalov.com" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
             <Mail size={18} /> contact@avzalov.com
           </a>
        </div>
      </div>
    </div>
  );
};

export default Contact;
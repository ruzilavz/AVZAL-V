import React, { useState, useRef, useEffect } from 'react';
import { Send, Cpu, Bot, User as UserIcon } from 'lucide-react';
import { sendMessageToGemini } from '../services/geminiService';
import { ChatMessage } from '../types';

const AILab: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      role: 'model',
      text: "Greetings. I am the neural interface for AVZALØV. Ask me about the music, the lore, or the technology.",
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Mock history context construction
      const historyContext = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));
      
      const responseText = await sendMessageToGemini(input, historyContext);
      
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-32 min-h-screen container mx-auto px-4 flex flex-col items-center">
      <div className="w-full max-w-4xl flex-1 flex flex-col h-[80vh] bg-surface/50 border border-white/5 rounded-lg overflow-hidden backdrop-blur-sm relative">
        {/* Header */}
        <div className="p-4 border-b border-white/5 bg-[#0b0d12]/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Cpu size={24} className="text-primary animate-pulse" />
            </div>
            <div>
              <h2 className="font-display font-bold text-white">Neural Link</h2>
              <div className="flex items-center gap-2 text-xs font-mono text-green-500">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                ONLINE
              </div>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-gray-700">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-white text-black' : 'bg-secondary text-white'}`}>
                {msg.role === 'user' ? <UserIcon size={16} /> : <Bot size={16} />}
              </div>
              
              <div className={`max-w-[80%] rounded-2xl px-5 py-3 text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-white text-black rounded-tr-none' 
                  : 'bg-white/5 text-gray-200 border border-white/10 rounded-tl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center gap-2 text-primary font-mono text-xs ml-12">
              <span className="animate-bounce">●</span>
              <span className="animate-bounce delay-100">●</span>
              <span className="animate-bounce delay-200">●</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-[#0b0d12]/80 border-t border-white/5">
          <form onSubmit={handleSend} className="relative flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter command or query..."
              className="flex-1 bg-surface border border-white/10 rounded-full px-6 py-3 text-white focus:outline-none focus:border-primary/50 font-mono text-sm placeholder-gray-600"
              disabled={isLoading}
            />
            <button 
              type="submit" 
              disabled={isLoading}
              className="p-3 bg-primary text-black rounded-full hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AILab;
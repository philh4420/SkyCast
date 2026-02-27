
import React, { useState, useEffect } from 'react';
import { WeatherData } from '../types';
import { getGeminiWeatherInsight } from '../services/geminiService';
import { Sparkles, Loader2, Send, X } from 'lucide-react';

interface GeminiAssistantProps {
  weather: WeatherData;
  glassClass: string;
}

export const GeminiAssistant: React.FC<GeminiAssistantProps> = ({ weather, glassClass }) => {
  const [insight, setInsight] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [question, setQuestion] = useState('');

  useEffect(() => {
    let mounted = true;
    const fetchSummary = async () => {
      if (!weather) return;
      setLoading(true);
      const result = await getGeminiWeatherInsight(weather);
      if (mounted) {
        setInsight(result);
        setLoading(false);
      }
    };
    fetchSummary();
    return () => { mounted = false; };
  }, [weather]);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    setLoading(true);
    const result = await getGeminiWeatherInsight(weather, question);
    setInsight(result);
    setLoading(false);
    setQuestion('');
  };

  return (
    <div className={`${glassClass} backdrop-blur-xl rounded-3xl p-6 border shadow-sm transition-all duration-500`}>
        <div className="flex items-start justify-between">
             <div className="flex items-center space-x-3 mb-2">
                 <div className="p-2 bg-gradient-to-tr from-purple-500 to-indigo-500 rounded-xl shadow-lg shadow-purple-500/30">
                     <Sparkles className="w-4 h-4 text-white" />
                 </div>
                 <div>
                    <h3 className="font-bold text-sm">AI Assistant</h3>
                 </div>
             </div>
             
             {!isExpanded && (
               <button onClick={() => setIsExpanded(true)} className="text-xs font-bold uppercase tracking-wider opacity-60 hover:opacity-100 transition-opacity mt-2">
                  Ask
               </button>
             )}
             {isExpanded && (
               <button onClick={() => setIsExpanded(false)} className="opacity-50 hover:opacity-100 p-1">
                 <X className="w-4 h-4" />
               </button>
             )}
        </div>

        <div className="mt-3">
            {loading && !insight ? (
                <div className="flex items-center space-x-2 opacity-60">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Reading atmosphere...</span>
                </div>
            ) : (
                <p className="text-sm leading-relaxed opacity-90 font-medium">
                    {insight || "Hello! I'm analyzing the weather for you."}
                </p>
            )}
        </div>

        {isExpanded && (
          <form onSubmit={handleAsk} className="mt-4 relative animate-fade-in">
            <input 
              type="text" 
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="E.g., 'Will it rain at 4pm?'"
              className="w-full bg-slate-950/50 border border-white/10 rounded-xl pl-4 pr-10 py-3 text-sm focus:outline-none focus:bg-black/80 transition-all placeholder-white/40"
            />
            <button 
              type="submit"
              disabled={loading || !question.trim()}
              className="absolute right-2 top-2 p-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
            </button>
          </form>
        )}
    </div>
  );
};

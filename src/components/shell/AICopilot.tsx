import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useShell } from './ShellContext';
import { X, Sparkles, Send, Activity, FileText, Zap } from 'lucide-react';
import { AIService } from '@/src/services/ai';

export function AICopilot() {
  const { isCopilotOpen, setCopilotOpen } = useShell();
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'I am your Novalyte AI Copilot. I can analyze patient dossiers, draft outreach campaigns, or query system metrics. How can I assist you today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    try {
      const chatHistory = messages.map(m => ({ role: m.role, content: m.content }));
      const response = await AIService.chat(input, chatHistory);
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response.response 
      }]);
    } catch (error) {
      console.error('Copilot error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'I encountered an error connecting to the intelligence server.' 
      }]);
    }
  };

  return (
    <AnimatePresence>
      {isCopilotOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[90] bg-background/20 backdrop-blur-sm md:hidden"
            onClick={() => setCopilotOpen(false)}
          />
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full md:w-[400px] bg-surface-1 border-l border-surface-3 shadow-2xl z-[100] flex flex-col"
          >
            {/* Header */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-surface-3 bg-surface-2/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
                <span className="font-display font-bold">AI Copilot</span>
              </div>
              <button onClick={() => setCopilotOpen(false)} className="p-2 text-text-secondary hover:text-text-primary rounded-lg hover:bg-surface-3 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4 hide-scrollbar">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    msg.role === 'user' 
                      ? 'bg-primary text-background rounded-tr-sm' 
                      : 'bg-surface-2 border border-surface-3 text-text-primary rounded-tl-sm'
                  }`}>
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Suggestions */}
            <div className="p-4 border-t border-surface-3 bg-surface-2/30">
              <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
                <button className="flex-shrink-0 px-3 py-1.5 rounded-full bg-surface-3 border border-surface-3 text-xs text-text-secondary hover:text-text-primary hover:border-primary/50 transition-colors flex items-center gap-1">
                  <Activity className="w-3 h-3" /> Analyze Pipeline
                </button>
                <button className="flex-shrink-0 px-3 py-1.5 rounded-full bg-surface-3 border border-surface-3 text-xs text-text-secondary hover:text-text-primary hover:border-primary/50 transition-colors flex items-center gap-1">
                  <FileText className="w-3 h-3" /> Draft Outreach
                </button>
                <button className="flex-shrink-0 px-3 py-1.5 rounded-full bg-surface-3 border border-surface-3 text-xs text-text-secondary hover:text-text-primary hover:border-primary/50 transition-colors flex items-center gap-1">
                  <Zap className="w-3 h-3" /> System Health
                </button>
              </div>
              
              {/* Input */}
              <form onSubmit={handleSend} className="relative mt-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Copilot..."
                  className="w-full pl-4 pr-12 py-3 bg-surface-1 border border-surface-3 rounded-xl text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                />
                <button 
                  type="submit"
                  disabled={!input.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary hover:text-background transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

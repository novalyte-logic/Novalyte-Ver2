import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, User, Sparkles, Activity, ArrowRight, ShieldAlert, Stethoscope, Search, BookOpen, ChevronRight } from 'lucide-react';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Link, useNavigate } from 'react-router-dom';
import { AIService } from '@/src/services/ai';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/src/firebase';

interface Action {
  label: string;
  path: string;
  icon: React.ElementType;
  primary?: boolean;
}

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  disclaimer?: string;
  actions?: Action[];
}

const SUGGESTIONS = [
  {
    title: "Low Energy & Fatigue",
    desc: "What are the clinical signs of low testosterone?",
    icon: Activity,
    query: "What are the clinical signs of low testosterone and how is it treated?"
  },
  {
    title: "Peptide Therapy",
    desc: "How do healing peptides like BPC-157 work?",
    icon: Sparkles,
    query: "Explain how peptide therapy works, specifically BPC-157 for recovery."
  },
  {
    title: "Find a Provider",
    desc: "What should I look for in a longevity clinic?",
    icon: Stethoscope,
    query: "What criteria should I use when choosing a longevity or hormone optimization clinic?"
  },
  {
    title: "Metabolic Health",
    desc: "How can I improve my metabolic markers?",
    icon: Search,
    query: "What are the best ways to improve metabolic health and insulin sensitivity?"
  }
];

export function AskAI() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'ai',
      content: "Hello. I am the Novalyte Health Intelligence Assistant. I can help you understand symptoms, explore optimization protocols, or find the right clinical partner. How can I assist you today?",
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (overrideInput?: string) => {
    const textToSend = overrideInput || input;
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const chatHistory = messages.map(m => ({ role: m.role, content: m.content }));
      const response = await AIService.chat(textToSend, chatHistory);
      
      // Persist interaction to Firestore
      await addDoc(collection(db, 'ai_interactions'), {
        userQuery: textToSend,
        aiResponse: response.response,
        timestamp: serverTimestamp(),
        type: 'ask_ai'
      });

      let actions: Action[] = [];
      if (response.suggestedActions) {
        actions = response.suggestedActions.map((a: any) => {
          let icon = Search;
          if (a.path.includes('assessment')) icon = Activity;
          if (a.path.includes('directory')) icon = Stethoscope;
          if (a.path.includes('blog')) icon = BookOpen;
          return { ...a, icon };
        });
      }

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: response.response,
        disclaimer: response.rationale,
        actions: actions.length > 0 ? actions : undefined
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: "I'm sorry, I'm having trouble connecting to the intelligence server right now. Please try again later.",
        disclaimer: "Connection error",
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-[#05070A] flex flex-col pt-20 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-secondary/10 to-transparent blur-3xl rounded-full" />
      </div>

      <div className="flex-grow max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col h-[calc(100vh-5rem)] relative z-10">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-surface-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-white">Ask Novalyte AI</h1>
            <p className="text-sm text-text-secondary">Intelligent health guidance and clinical routing.</p>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-grow overflow-y-auto pr-2 sm:pr-4 space-y-8 hide-scrollbar pb-4">
          {messages.map((msg, index) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                msg.role === 'user' 
                  ? 'bg-surface-3 border border-surface-3' 
                  : 'bg-primary/10 border border-primary/30 shadow-[0_0_10px_rgba(6,182,212,0.1)]'
              }`}>
                {msg.role === 'user' ? <User className="w-5 h-5 text-text-secondary" /> : <Activity className="w-5 h-5 text-primary" />}
              </div>
              
              {/* Message Content */}
              <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} max-w-[85%] sm:max-w-[75%]`}>
                <div className={`p-5 rounded-2xl text-sm sm:text-base leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-surface-2 border border-surface-3 text-white rounded-tr-sm' 
                    : 'bg-[#0B0F14] border border-surface-3 text-text-primary rounded-tl-sm shadow-lg'
                }`}>
                  {/* Render paragraphs for AI responses */}
                  {msg.content.split('\n\n').map((paragraph, i) => (
                    <p key={i} className={i > 0 ? 'mt-4' : ''}>{paragraph}</p>
                  ))}
                </div>
                
                {/* AI Structured Add-ons */}
                {msg.role === 'ai' && (
                  <div className="mt-4 w-full space-y-4">
                    
                    {/* Disclaimer / Risk Framing */}
                    {msg.disclaimer && (
                      <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-400/5 border border-amber-400/10 text-amber-400/80 text-xs">
                        <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                        <p>{msg.disclaimer}</p>
                      </div>
                    )}

                    {/* Actionable Routing Cards */}
                    {msg.actions && msg.actions.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                        {msg.actions.map((action, i) => {
                          const Icon = action.icon;
                          return (
                            <button
                              key={i}
                              onClick={() => navigate(action.path)}
                              className={`flex items-center justify-between p-3 rounded-xl border transition-all group text-left ${
                                action.primary 
                                  ? 'bg-primary/10 border-primary/30 hover:border-primary hover:bg-primary/20' 
                                  : 'bg-surface-1 border-surface-3 hover:border-text-secondary/50 hover:bg-surface-2'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                  action.primary ? 'bg-primary/20 text-primary' : 'bg-surface-3 text-text-secondary'
                                }`}>
                                  <Icon className="w-4 h-4" />
                                </div>
                                <span className={`text-sm font-bold ${action.primary ? 'text-white' : 'text-text-secondary group-hover:text-white transition-colors'}`}>
                                  {action.label}
                                </span>
                              </div>
                              <ChevronRight className={`w-4 h-4 ${action.primary ? 'text-primary' : 'text-surface-3 group-hover:text-text-secondary transition-colors'}`} />
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          
          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0 mt-1 shadow-[0_0_10px_rgba(6,182,212,0.1)]">
                <Activity className="w-5 h-5 text-primary" />
              </div>
              <div className="p-5 rounded-2xl bg-[#0B0F14] border border-surface-3 rounded-tl-sm flex items-center gap-2 h-[60px]">
                <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} className="h-4" />
        </div>

        {/* Input Area */}
        <div className="mt-4 pt-4 border-t border-surface-3 bg-[#05070A]">
          
          {/* Welcome Suggestion Cards (Only show if no user messages yet) */}
          {messages.length === 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              {SUGGESTIONS.map((suggestion, i) => {
                const Icon = suggestion.icon;
                return (
                  <button
                    key={i}
                    onClick={() => handleSend(suggestion.query)}
                    className="flex flex-col items-start p-4 rounded-xl bg-surface-1 border border-surface-3 hover:border-primary/50 hover:bg-surface-2 transition-all text-left group"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="w-4 h-4 text-primary" />
                      <span className="text-sm font-bold text-white">{suggestion.title}</span>
                    </div>
                    <p className="text-xs text-text-secondary group-hover:text-text-primary transition-colors line-clamp-2">
                      {suggestion.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
          
          <div className="relative flex items-end gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about health optimization, clinics, or protocols..."
              className="w-full bg-surface-1 border border-surface-3 rounded-xl pl-4 pr-12 py-4 text-white placeholder:text-text-secondary focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all resize-none min-h-[60px] max-h-[120px]"
              rows={1}
              style={{ height: '60px' }}
            />
            <Button
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              className="absolute right-2 bottom-2 h-11 w-11 p-0 flex items-center justify-center rounded-lg"
            >
              <Send className="w-5 h-5 ml-1" />
            </Button>
          </div>
          <p className="text-center text-xs text-text-secondary mt-4">
            Novalyte AI is an educational tool. It does not provide medical diagnosis or treatment plans.
          </p>
        </div>

      </div>
    </div>
  );
}

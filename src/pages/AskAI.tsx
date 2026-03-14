import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Send, User, Sparkles, Activity, ArrowRight } from 'lucide-react';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Link } from 'react-router-dom';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  actions?: { label: string; path: string }[];
}

export function AskAI() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'ai',
      content: 'Hello. I am the Novalyte Health Intelligence Assistant. I can help you understand symptoms, explore optimization protocols, or find the right clinic. How can I assist you today?',
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false);
      
      let aiResponse = "I can help you explore that further. Based on what you're describing, a comprehensive clinical assessment would be the best next step to get personalized medical guidance.";
      let actions = [
        { label: 'Start Assessment', path: '/patient/assessment' },
        { label: 'Find a Clinic', path: '/directory' }
      ];

      if (userMsg.content.toLowerCase().includes('testosterone') || userMsg.content.toLowerCase().includes('trt')) {
        aiResponse = "Testosterone Replacement Therapy (TRT) is a common protocol for men experiencing symptoms of low T, such as fatigue, muscle loss, and brain fog. It requires comprehensive blood work and clinical supervision to ensure safety and efficacy.";
      } else if (userMsg.content.toLowerCase().includes('peptide')) {
        aiResponse = "Peptide therapy involves using specific amino acid sequences to signal the body to perform certain functions, such as tissue repair, fat loss, or cognitive enhancement. Popular peptides include BPC-157 and CJC-1295.";
      }

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: aiResponse,
        actions: actions
      }]);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestions = [
    "What are the signs of low testosterone?",
    "How does peptide therapy work?",
    "What should I look for in a longevity clinic?",
    "I'm feeling constantly fatigued."
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col pt-20">
      <div className="flex-grow max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col h-[calc(100vh-5rem)]">
        
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-surface-3">
          <div className="w-12 h-12 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-secondary" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-text-primary">Ask Novalyte AI</h1>
            <p className="text-sm text-text-secondary">Intelligent health guidance and routing.</p>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto pr-4 space-y-6 hide-scrollbar">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user' ? 'bg-surface-3' : 'bg-primary/10 border border-primary/20'
              }`}>
                {msg.role === 'user' ? <User className="w-5 h-5 text-text-secondary" /> : <Activity className="w-5 h-5 text-primary" />}
              </div>
              
              <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} max-w-[80%]`}>
                <div className={`p-4 rounded-2xl ${
                  msg.role === 'user' 
                    ? 'bg-surface-2 border border-surface-3 text-text-primary rounded-tr-sm' 
                    : 'bg-surface-1 border border-surface-3 text-text-primary rounded-tl-sm'
                }`}>
                  <p className="leading-relaxed">{msg.content}</p>
                </div>
                
                {msg.actions && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {msg.actions.map((action, i) => (
                      <Link key={i} to={action.path}>
                        <Button variant="outline" size="sm" className="text-xs py-1 h-8">
                          {action.label} <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                <Activity className="w-5 h-5 text-primary" />
              </div>
              <div className="p-4 rounded-2xl bg-surface-1 border border-surface-3 rounded-tl-sm flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-text-secondary animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-text-secondary animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-text-secondary animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="mt-6 pt-6 border-t border-surface-3">
          {messages.length === 1 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {suggestions.map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setInput(suggestion);
                    // Optional: auto-send
                    // setTimeout(() => handleSend(), 100);
                  }}
                  className="px-3 py-1.5 rounded-full bg-surface-2 border border-surface-3 text-xs text-text-secondary hover:text-text-primary hover:border-secondary/50 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
          
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about health optimization..."
              className="w-full bg-surface-2 border border-surface-3 rounded-xl pl-4 pr-12 py-4 text-text-primary focus:outline-none focus:border-secondary/50 focus:ring-1 focus:ring-secondary/50 transition-all resize-none h-14 overflow-hidden"
              rows={1}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="absolute right-2 top-2 p-2 rounded-lg bg-secondary text-background hover:bg-secondary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-center text-xs text-text-secondary mt-3">
            AI can make mistakes. Always consult a qualified healthcare provider for medical advice.
          </p>
        </div>

      </div>
    </div>
  );
}

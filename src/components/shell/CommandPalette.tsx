import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Activity, Users, Settings, FileText, ArrowRight, Command } from 'lucide-react';
import { useShell } from './ShellContext';
import { useNavigate } from 'react-router-dom';

export function CommandPalette() {
  const { isCommandOpen, setCommandOpen, openEntity } = useShell();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isCommandOpen && inputRef.current) {
      inputRef.current.focus();
    } else {
      setQuery('');
    }
  }, [isCommandOpen]);

  if (!isCommandOpen) return null;

  const handleAction = (action: () => void) => {
    action();
    setCommandOpen(false);
  };

  const results = [
    { type: 'Patient', title: 'Michael T.', subtitle: 'Hormone Optimization', icon: Users, action: () => openEntity('patient', '1') },
    { type: 'Patient', title: 'David R.', subtitle: 'Peptide Therapy', icon: Users, action: () => openEntity('patient', '2') },
    { type: 'Clinic', title: 'Apex Longevity', subtitle: 'Miami, FL', icon: Activity, action: () => openEntity('clinic', '1') },
    { type: 'Navigation', title: 'Go to CRM', subtitle: 'Admin Dashboard', icon: ArrowRight, action: () => navigate('/admin/crm') },
    { type: 'Navigation', title: 'Go to Pipeline', subtitle: 'Clinic Dashboard', icon: ArrowRight, action: () => navigate('/dashboard') },
    { type: 'Action', title: 'Create New Campaign', subtitle: 'Outreacher', icon: FileText, action: () => navigate('/admin/outreacher') },
  ].filter(r => r.title.toLowerCase().includes(query.toLowerCase()) || r.subtitle.toLowerCase().includes(query.toLowerCase()));

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          onClick={() => setCommandOpen(false)}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative w-full max-w-2xl bg-surface-1 border border-surface-3 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[60vh]"
        >
          <div className="flex items-center px-4 py-4 border-b border-surface-3 bg-surface-2/50">
            <Search className="w-5 h-5 text-text-secondary mr-3" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search patients, clinics, commands..."
              className="flex-grow bg-transparent border-none focus:outline-none text-lg text-text-primary placeholder:text-text-secondary/50"
            />
            <div className="flex items-center gap-1 text-xs text-text-secondary font-mono bg-surface-3 px-2 py-1 rounded">
              <Command className="w-3 h-3" /> K
            </div>
          </div>

          <div className="flex-grow overflow-y-auto p-2 hide-scrollbar">
            {results.length === 0 ? (
              <div className="p-8 text-center text-text-secondary">
                No results found for "{query}"
              </div>
            ) : (
              <div className="space-y-1">
                {results.map((result, i) => (
                  <button
                    key={i}
                    onClick={() => handleAction(result.action)}
                    className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-surface-3 transition-colors text-left group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-surface-2 border border-surface-3 flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/30 group-hover:text-primary transition-colors">
                      <result.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-text-primary font-medium">{result.title}</h4>
                      <p className="text-xs text-text-secondary">{result.subtitle}</p>
                    </div>
                    <span className="text-xs font-mono text-text-secondary bg-surface-2 px-2 py-1 rounded border border-surface-3">
                      {result.type}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="p-3 border-t border-surface-3 bg-surface-2/50 flex justify-between items-center text-xs text-text-secondary">
            <div className="flex gap-4">
              <span><kbd className="font-mono bg-surface-3 px-1 rounded">â†‘â†“</kbd> to navigate</span>
              <span><kbd className="font-mono bg-surface-3 px-1 rounded">â†µ</kbd> to select</span>
            </div>
            <span><kbd className="font-mono bg-surface-3 px-1 rounded">esc</kbd> to close</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

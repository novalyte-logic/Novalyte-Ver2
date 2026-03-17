import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useShell } from './ShellContext';
import { X, User, Activity, Calendar, FileText, Shield, Clock } from 'lucide-react';
import { Button } from '@/src/components/ui/Button';

export function EntityDrawer() {
  const { entityDrawer, closeEntity } = useShell();
  const { isOpen, type, id } = entityDrawer;

  // Mock data fetching based on type/id
  const data = type === 'patient' ? {
    name: 'Michael T.',
    status: 'Qualified',
    score: 92,
    intent: 'Hormone Optimization',
    email: 'michael.t@example.com',
    phone: '+1 (555) 123-4567',
    history: [
      { action: 'Assessment Completed', time: '2 hours ago' },
      { action: 'Routed to Apex Longevity', time: '1 hour ago' },
      { action: 'Consult Scheduled', time: '15 mins ago' }
    ]
  } : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[80] bg-background/40 backdrop-blur-sm"
            onClick={closeEntity}
          />
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full md:w-[600px] bg-surface-1 border-l border-surface-3 shadow-2xl z-[85] flex flex-col"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-surface-3 bg-surface-2/50 flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-surface-3 border border-surface-3 flex items-center justify-center">
                  {type === 'patient' ? <User className="w-6 h-6 text-primary" /> : <Activity className="w-6 h-6 text-secondary" />}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-2xl font-display font-bold">{data?.name || 'Entity Details'}</h2>
                    <span className="px-2 py-0.5 rounded text-xs font-mono bg-success/10 text-success border border-success/20">
                      {data?.status || 'Active'}
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary capitalize">{type} Record â€¢ ID: {id}</p>
                </div>
              </div>
              <button onClick={closeEntity} className="p-2 text-text-secondary hover:text-text-primary rounded-lg hover:bg-surface-3 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-grow overflow-y-auto p-6 space-y-8 hide-scrollbar">
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-surface-2 border border-surface-3">
                  <p className="text-xs text-text-secondary mb-1">Qualification Score</p>
                  <p className="text-2xl font-mono font-bold text-success">{data?.score || '--'}</p>
                </div>
                <div className="p-4 rounded-xl bg-surface-2 border border-surface-3 col-span-2">
                  <p className="text-xs text-text-secondary mb-1">Primary Intent</p>
                  <p className="text-lg font-medium text-text-primary">{data?.intent || '--'}</p>
                </div>
              </div>

              {/* Details */}
              <div>
                <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4 border-b border-surface-3 pb-2">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-surface-2 border border-surface-3">
                    <span className="text-text-secondary text-sm">Email</span>
                    <span className="text-text-primary font-medium">{data?.email || '--'}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-surface-2 border border-surface-3">
                    <span className="text-text-secondary text-sm">Phone</span>
                    <span className="text-text-primary font-medium">{data?.phone || '--'}</span>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4 border-b border-surface-3 pb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Activity Timeline
                </h3>
                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-surface-3 before:to-transparent">
                  {data?.history.map((event, i) => (
                    <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border border-surface-3 bg-surface-2 text-text-secondary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-surface-3 bg-surface-2 shadow">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-bold text-sm">{event.action}</h4>
                        </div>
                        <time className="text-xs font-mono text-text-secondary">{event.time}</time>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-surface-3 bg-surface-2/50 flex gap-3">
              <Button className="flex-grow">Take Action</Button>
              <Button variant="outline" className="flex-grow">Edit Record</Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

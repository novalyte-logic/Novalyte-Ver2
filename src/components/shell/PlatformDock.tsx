import React from 'react';
import { motion } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { UserCircle, Building2, Store, Network, ShieldAlert } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export function PlatformDock() {
  const location = useLocation();

  const navItems = [
    {
      name: 'Patient',
      path: '/patient',
      icon: UserCircle,
      color: 'text-primary',
      bg: 'bg-primary/10',
      activeBorder: 'border-primary',
      match: (p: string) => p.startsWith('/patient') || p === '/symptom-checker' || p === '/ask-ai'
    },
    {
      name: 'Clinic',
      path: '/clinics',
      icon: Building2,
      color: 'text-secondary',
      bg: 'bg-secondary/10',
      activeBorder: 'border-secondary',
      match: (p: string) => p.startsWith('/clinic') || p.startsWith('/dashboard')
    },
    {
      name: 'Marketplace',
      path: '/marketplace',
      icon: Store,
      color: 'text-[#2EE6A6]',
      bg: 'bg-[#2EE6A6]/10',
      activeBorder: 'border-[#2EE6A6]',
      match: (p: string) => p.startsWith('/marketplace')
    },
    {
      name: 'Network',
      path: '/network',
      icon: Network,
      color: 'text-[#FFB84D]',
      bg: 'bg-[#FFB84D]/10',
      activeBorder: 'border-[#FFB84D]',
      match: (p: string) => p.startsWith('/network') || p.startsWith('/vendors')
    },
    {
      name: 'Admin',
      path: '/admin',
      icon: ShieldAlert,
      color: 'text-[#FF6B6B]',
      bg: 'bg-[#FF6B6B]/10',
      activeBorder: 'border-[#FF6B6B]',
      match: (p: string) => p.startsWith('/admin')
    }
  ];

  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', damping: 20, stiffness: 100, delay: 0.5 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] pointer-events-auto"
    >
      <div className="bg-[#0B0F14]/90 backdrop-blur-xl border border-surface-3 rounded-full p-2 flex items-center gap-2 shadow-2xl shadow-black/50">
        {navItems.map((item) => {
          const isActive = item.match(location.pathname);
          const Icon = item.icon;
          
          return (
            <Link key={item.name} to={item.path}>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "relative flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-full transition-all duration-300 cursor-pointer overflow-hidden group",
                  isActive ? "bg-surface-2 border-surface-4" : "hover:bg-surface-2 border-transparent"
                )}
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeDockIndicator"
                    className={cn("absolute inset-0 border-2 rounded-full opacity-50", item.activeBorder)}
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors z-10",
                  isActive ? item.bg : "bg-surface-3 group-hover:bg-surface-4"
                )}>
                  <Icon className={cn("w-4 h-4", isActive ? item.color : "text-text-secondary group-hover:text-white")} />
                </div>
                
                <span className={cn(
                  "text-sm font-bold z-10 transition-colors hidden sm:block",
                  isActive ? "text-white" : "text-text-secondary group-hover:text-white"
                )}>
                  {item.name}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
}

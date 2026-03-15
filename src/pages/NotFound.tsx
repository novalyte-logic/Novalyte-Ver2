import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  Terminal, Building2, UserCircle, 
  Network, LifeBuoy, ArrowRight, Home 
} from 'lucide-react';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';

export function NotFound() {
  const suggestions = [
    {
      title: 'Patient Portal',
      description: 'Access health assessments, symptom checkers, and clinic matching.',
      icon: UserCircle,
      link: '/patient',
      color: 'text-primary',
      bg: 'bg-primary/10',
      border: 'border-primary/20'
    },
    {
      title: 'Clinic Operations',
      description: 'Access the clinic dashboard, pipeline, and lead acquisition tools.',
      icon: Building2,
      link: '/clinics',
      color: 'text-secondary',
      bg: 'bg-secondary/10',
      border: 'border-secondary/20'
    },
    {
      title: 'Partner Network',
      description: 'Explore the procurement ecosystem and vendor integration.',
      icon: Network,
      link: '/network',
      color: 'text-[#2EE6A6]', // success mint
      bg: 'bg-[#2EE6A6]/10',
      border: 'border-[#2EE6A6]/20'
    },
    {
      title: 'System Support',
      description: 'Get help with routing, integrations, or platform access.',
      icon: LifeBuoy,
      link: '/contact',
      color: 'text-[#FFB84D]', // warning amber
      bg: 'bg-[#FFB84D]/10',
      border: 'border-[#FFB84D]/20'
    }
  ];

  return (
    <div className="min-h-screen bg-[#05070A] pt-32 pb-20 px-4 font-sans relative overflow-hidden flex flex-col items-center justify-center">
      {/* Background Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl w-full mx-auto text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-2 border border-surface-3 text-text-secondary text-xs font-mono uppercase tracking-widest mb-8"
        >
          <Terminal className="w-4 h-4 text-[#FF6B6B]" /> ERR_ROUTE_NOT_FOUND
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="text-8xl md:text-9xl font-display font-black tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/20"
        >
          404
        </motion.h1>

        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl md:text-3xl font-bold text-white mb-4"
        >
          System Endpoint Unreachable
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-lg text-text-secondary max-w-2xl mx-auto mb-12"
        >
          The requested module or pathway could not be located within the Novalyte ecosystem. Please select an active operational route below.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mb-12"
        >
          {suggestions.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Link key={idx} to={item.link}>
                <Card className="bg-surface-1/50 backdrop-blur-sm border-surface-3 p-6 hover:border-surface-4 transition-all group cursor-pointer h-full flex flex-col">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl ${item.bg} ${item.border} border flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-6 h-6 ${item.color}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1 group-hover:text-primary transition-colors flex items-center gap-2">
                        {item.title} <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </h3>
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Link to="/">
            <Button className="bg-white text-black hover:bg-gray-200 font-bold h-12 px-8">
              <Home className="w-4 h-4 mr-2" /> Return to Main System
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

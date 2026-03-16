import React from 'react';
import { Link } from 'react-router-dom';
import { Activity } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#05070A] border-t border-surface-3/30 pt-12 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-12 mb-12">
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <Activity className="w-6 h-6 text-primary" />
              <span className="font-display font-bold text-2xl tracking-tight text-white">
                Novalyte <span className="text-primary">AI</span>
              </span>
            </Link>
            <p className="text-text-secondary text-sm max-w-xs font-light leading-relaxed">
              The unified AI operating system for Men's Health, Longevity, and Clinical Optimization infrastructure.
            </p>
          </div>
          
          <div>
            <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-text-secondary/60 mb-6">Platform</h4>
            <ul className="space-y-3">
              <li><Link to="/patient" className="text-sm text-text-secondary hover:text-primary transition-colors">Patients</Link></li>
              <li><Link to="/clinics" className="text-sm text-text-secondary hover:text-primary transition-colors">Clinics</Link></li>
              <li><Link to="/marketplace" className="text-sm text-text-secondary hover:text-primary transition-colors">Marketplace</Link></li>
              <li><Link to="/workforce" className="text-sm text-text-secondary hover:text-primary transition-colors">Workforce</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-text-secondary/60 mb-6">Resources</h4>
            <ul className="space-y-3">
              <li><Link to="/directory" className="text-sm text-text-secondary hover:text-primary transition-colors">Directory</Link></li>
              <li><Link to="/blog" className="text-sm text-text-secondary hover:text-primary transition-colors">Blog</Link></li>
              <li><Link to="/status" className="text-sm text-text-secondary hover:text-primary transition-colors">Status</Link></li>
              <li><Link to="/contact" className="text-sm text-text-secondary hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-text-secondary/60 mb-6">Support</h4>
            <ul className="space-y-3">
              <li><Link to="/support/patient" className="text-sm text-text-secondary hover:text-primary transition-colors">Patient</Link></li>
              <li><Link to="/support/clinic" className="text-sm text-text-secondary hover:text-primary transition-colors">Clinic</Link></li>
              <li><Link to="/support/vendor" className="text-sm text-text-secondary hover:text-primary transition-colors">Vendor</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-text-secondary/60 mb-6">Legal</h4>
            <ul className="space-y-3">
              <li><Link to="/privacy" className="text-sm text-text-secondary hover:text-primary transition-colors">Privacy</Link></li>
              <li><Link to="/terms" className="text-sm text-text-secondary hover:text-primary transition-colors">Terms</Link></li>
              <li><Link to="/security" className="text-sm text-text-secondary hover:text-primary transition-colors">Security</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-surface-3/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <p className="text-text-secondary text-xs font-mono">
              &copy; {new Date().getFullYear()} Novalyte AI.
            </p>
            <div className="hidden md:flex h-4 w-px bg-surface-3/50" />
            <div className="flex items-center gap-4">
              <span className="text-[10px] text-text-secondary/50 uppercase tracking-[0.2em] font-mono">HIPAA Aligned</span>
              <span className="text-[10px] text-text-secondary/50 uppercase tracking-[0.2em] font-mono">SOC 2 Ready</span>
            </div>
          </div>
          
          <div className="text-[10px] text-text-secondary/40 font-mono tracking-widest uppercase">
            Precision Medicine Infrastructure
          </div>
        </div>
      </div>
    </footer>
  );
}

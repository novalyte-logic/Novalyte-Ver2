import React from 'react';
import { Link } from 'react-router-dom';
import { Activity } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-surface-1 border-t border-surface-3 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Activity className="w-6 h-6 text-primary" />
              <span className="font-display font-bold text-xl tracking-tight text-text-primary">
                Novalyte <span className="text-primary">AI</span>
              </span>
            </Link>
            <p className="text-text-secondary text-sm">
              The unified AI operating system for healthcare infrastructure.
            </p>
          </div>
          
          <div>
            <h3 className="text-text-primary font-semibold mb-4">Platform</h3>
            <ul className="space-y-2">
              <li><Link to="/patient" className="text-text-secondary hover:text-primary text-sm transition-colors">Patients</Link></li>
              <li><Link to="/clinics" className="text-text-secondary hover:text-primary text-sm transition-colors">Clinics</Link></li>
              <li><Link to="/marketplace" className="text-text-secondary hover:text-primary text-sm transition-colors">Marketplace</Link></li>
              <li><Link to="/workforce" className="text-text-secondary hover:text-primary text-sm transition-colors">Workforce</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-text-primary font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/directory" className="text-text-secondary hover:text-primary text-sm transition-colors">Clinic Directory</Link></li>
              <li><Link to="/blog" className="text-text-secondary hover:text-primary text-sm transition-colors">Blog</Link></li>
              <li><Link to="/support/patient" className="text-text-secondary hover:text-primary text-sm transition-colors">Patient Support</Link></li>
              <li><Link to="/support/clinic" className="text-text-secondary hover:text-primary text-sm transition-colors">Clinic Support</Link></li>
              <li><Link to="/support/vendor" className="text-text-secondary hover:text-primary text-sm transition-colors">Vendor Support</Link></li>
              <li><Link to="/status" className="text-text-secondary hover:text-primary text-sm transition-colors">System Status</Link></li>
              <li><Link to="/contact" className="text-text-secondary hover:text-primary text-sm transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-text-primary font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-text-secondary hover:text-primary text-sm transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-text-secondary hover:text-primary text-sm transition-colors">Terms of Service</Link></li>
              <li><Link to="/security" className="text-text-secondary hover:text-primary text-sm transition-colors">Security Standards</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-surface-3 flex flex-col md:flex-row items-center justify-between">
          <p className="text-text-secondary text-sm">
            &copy; {new Date().getFullYear()} Novalyte AI. All rights reserved.
          </p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <span className="text-xs text-text-secondary uppercase tracking-wider font-mono">HIPAA Aligned</span>
            <span className="text-xs text-text-secondary uppercase tracking-wider font-mono">SOC 2 Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

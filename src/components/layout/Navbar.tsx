import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, Menu, X, Search, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '@/src/lib/utils';
import { useShell } from '../shell/ShellContext';

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();
  const { setCommandOpen, setCopilotOpen } = useShell();

  const navLinks = [
    { name: 'Patients', path: '/patient' },
    { name: 'Clinics', path: '/clinics' },
    { name: 'Directory', path: '/directory' },
    { name: 'Workforce', path: '/workforce' },
    { name: 'Blog', path: '/blog' },
    { name: 'Visuals', path: '/visual-intelligence' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-surface-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-surface-2 border border-surface-3 flex items-center justify-center group-hover:border-primary/50 transition-colors shadow-[0_0_15px_rgba(53,212,255,0.1)]">
                <Activity className="w-6 h-6 text-primary" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-text-primary">
                Novalyte <span className="text-primary">AI</span>
              </span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    location.pathname.startsWith(link.path)
                      ? "text-primary bg-primary/10"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface-2"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            <Link to="/marketplace">
              <Button size="sm">Marketplace</Button>
            </Link>
          </div>

          <div className="-mr-2 flex md:hidden items-center gap-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-2 focus:outline-none"
            >
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-surface-1 border-b border-surface-3">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium",
                  location.pathname.startsWith(link.path)
                    ? "text-primary bg-primary/10"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-2"
                )}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="mt-4 pt-4 border-t border-surface-3 flex flex-col gap-2 px-3">
              <Link to="/marketplace" onClick={() => setIsOpen(false)}>
                <Button className="w-full">Marketplace</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}


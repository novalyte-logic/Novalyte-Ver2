import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Activity, Users, Send, Database, Rocket, Server, Menu, X, Search, Bell, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useShell } from '../shell/ShellContext';

export function AdminLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { setCommandOpen, setCopilotOpen } = useShell();

  const navItems = [
    { path: '/admin', icon: Activity, label: 'Command Center' },
    { path: '/admin/crm', icon: Users, label: 'CRM' },
    { path: '/admin/outreacher', icon: Send, label: 'Outreacher' },
    { path: '/admin/directory', icon: Database, label: 'Directory' },
    { path: '/admin/launch', icon: Rocket, label: 'Launch' },
    { path: '/admin/mcp', icon: Server, label: 'MCP Control' },
  ];

  return (
    <div className="min-h-screen bg-background text-text-primary flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-surface-1 border-r border-surface-3">
        <div className="h-16 flex items-center px-6 border-b border-surface-3">
          <Activity className="w-6 h-6 text-primary mr-2" />
          <span className="font-display font-bold text-lg tracking-tight">Novalyte <span className="text-primary">Admin</span></span>
        </div>
        <nav className="flex-grow p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-2'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-surface-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center border border-surface-3">
              <span className="text-xs font-bold">AD</span>
            </div>
            <div className="text-sm">
              <p className="font-medium">Admin User</p>
              <p className="text-xs text-text-secondary">System Operator</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            className="fixed inset-0 z-50 md:hidden flex"
          >
            <div className="w-64 bg-surface-1 border-r border-surface-3 flex flex-col h-full shadow-2xl">
              <div className="h-16 flex items-center justify-between px-4 border-b border-surface-3">
                <div className="flex items-center">
                  <Activity className="w-6 h-6 text-primary mr-2" />
                  <span className="font-display font-bold text-lg tracking-tight">Admin</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-text-secondary">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex-grow p-4 space-y-1">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        isActive 
                          ? 'bg-primary/10 text-primary font-medium' 
                          : 'text-text-secondary hover:text-text-primary hover:bg-surface-2'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className="flex-grow bg-background/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-grow flex flex-col h-screen overflow-hidden">
        {/* Topbar */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 border-b border-surface-3 bg-surface-1/50 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2 -ml-2 text-text-secondary">
              <Menu className="w-6 h-6" />
            </button>
            
            <button 
              onClick={() => setCommandOpen(true)}
              className="hidden sm:flex items-center relative group"
            >
              <Search className="w-4 h-4 absolute left-3 text-text-secondary group-hover:text-primary transition-colors" />
              <div className="pl-9 pr-4 py-1.5 bg-surface-2 border border-surface-3 rounded-md text-sm text-text-secondary group-hover:border-primary/50 w-64 text-left transition-all flex justify-between items-center">
                <span>Command search...</span>
                <span className="text-xs font-mono bg-surface-3 px-1.5 rounded">âŒ˜K</span>
              </div>
            </button>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-surface-2 border border-surface-3 mr-2">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs font-mono text-text-secondary uppercase tracking-wider">System Nominal</span>
            </div>
            <button 
              onClick={() => setCopilotOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm font-medium border border-primary/20"
            >
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">AI Copilot</span>
            </button>
            <button className="relative p-2 text-text-secondary hover:text-text-primary transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-grow overflow-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

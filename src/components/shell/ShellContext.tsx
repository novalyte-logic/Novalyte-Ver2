import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface ShellContextType {
  isCommandOpen: boolean;
  setCommandOpen: (v: boolean) => void;
  isCopilotOpen: boolean;
  setCopilotOpen: (v: boolean) => void;
  entityDrawer: { isOpen: boolean; type: string; id: string | null };
  openEntity: (type: string, id: string) => void;
  closeEntity: () => void;
}

const ShellContext = createContext<ShellContextType | undefined>(undefined);

export function ShellProvider({ children }: { children: ReactNode }) {
  const [isCommandOpen, setCommandOpen] = useState(false);
  const [isCopilotOpen, setCopilotOpen] = useState(false);
  const [entityDrawer, setEntityDrawer] = useState<{ isOpen: boolean; type: string; id: string | null }>({ 
    isOpen: false, 
    type: '', 
    id: null 
  });

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K for Command Palette
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen((open) => !open);
      }
      // Esc to close top-most overlay
      if (e.key === 'Escape') {
        if (isCommandOpen) setCommandOpen(false);
        else if (entityDrawer.isOpen) setEntityDrawer({ isOpen: false, type: '', id: null });
        else if (isCopilotOpen) setCopilotOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isCommandOpen, entityDrawer.isOpen, isCopilotOpen]);

  return (
    <ShellContext.Provider value={{
      isCommandOpen, setCommandOpen,
      isCopilotOpen, setCopilotOpen,
      entityDrawer,
      openEntity: (type, id) => setEntityDrawer({ isOpen: true, type, id }),
      closeEntity: () => setEntityDrawer({ isOpen: false, type: '', id: null })
    }}>
      {children}
    </ShellContext.Provider>
  );
}

export const useShell = () => {
  const context = useContext(ShellContext);
  if (!context) throw new Error('useShell must be used within ShellProvider');
  return context;
};

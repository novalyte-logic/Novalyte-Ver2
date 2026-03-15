import React from 'react';
import { ShellProvider } from './ShellContext';
import { CommandPalette } from './CommandPalette';
import { AICopilot } from './AICopilot';
import { EntityDrawer } from './EntityDrawer';
import { PlatformDock } from './PlatformDock';

export function ShellRoot({ children }: { children: React.ReactNode }) {
  return (
    <ShellProvider>
      {children}
      <CommandPalette />
      <AICopilot />
      <EntityDrawer />
      <PlatformDock />
    </ShellProvider>
  );
}

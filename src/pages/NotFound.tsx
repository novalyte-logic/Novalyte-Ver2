import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/src/components/ui/Button';

export function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-8xl font-display font-bold text-primary mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-6">System Route Not Found</h2>
      <p className="text-text-secondary max-w-md mb-8">
        The requested pathway does not exist in the Novalyte architecture.
      </p>
      <Link to="/">
        <Button>Return to Command Center</Button>
      </Link>
    </div>
  );
}

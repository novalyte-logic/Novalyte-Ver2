import React from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, Search, Filter, ArrowRight, Package } from 'lucide-react';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';

export function ClinicMarketplace() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Marketplace</h1>
          <p className="text-text-secondary mt-1">Procure equipment, diagnostics, and protocols for your clinic.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">Order History</Button>
          <Button>Browse Catalog</Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 space-y-6">
          <Card className="p-4 bg-surface-1 border-surface-3">
            <h3 className="font-semibold mb-4">Categories</h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li className="hover:text-primary cursor-pointer transition-colors">Equipment</li>
              <li className="hover:text-primary cursor-pointer transition-colors">Diagnostics</li>
              <li className="hover:text-primary cursor-pointer transition-colors">Supplements</li>
              <li className="hover:text-primary cursor-pointer transition-colors">Digital Health</li>
            </ul>
          </Card>
        </div>

        <div className="flex-grow space-y-6">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full h-12 pl-12 pr-4 bg-surface-2 border border-surface-3 rounded-lg text-text-primary focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'InBody 770', category: 'Equipment', price: '$18,500', roi: '3 months' },
              { name: 'Comprehensive Male Panel', category: 'Diagnostics', price: '$150/kit', roi: 'Immediate' },
              { name: 'Shockwave Therapy Device', category: 'Equipment', price: '$12,000', roi: '2 months' },
              { name: 'Peptide Protocol Bundle', category: 'Supplements', price: '$450/mo', roi: 'Recurring' },
            ].map((product, i) => (
              <Card key={i} className="p-6 bg-surface-1 border-surface-3 flex flex-col h-full">
                <div className="h-32 bg-surface-2 rounded-lg border border-surface-3 mb-4 flex items-center justify-center">
                  <Package className="w-8 h-8 text-surface-3" />
                </div>
                <div className="flex-grow">
                  <span className="text-xs font-mono text-primary uppercase tracking-wider">{product.category}</span>
                  <h3 className="text-lg font-bold text-text-primary mt-1 mb-2">{product.name}</h3>
                  <div className="flex justify-between items-center text-sm text-text-secondary mb-4">
                    <span>{product.price}</span>
                    <span className="text-success font-medium">ROI: {product.roi}</span>
                  </div>
                </div>
                <Button className="w-full mt-auto">View Details</Button>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

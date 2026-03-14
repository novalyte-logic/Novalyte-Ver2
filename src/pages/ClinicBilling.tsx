import React from 'react';
import { motion } from 'motion/react';
import { CreditCard, Download, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';

export function ClinicBilling() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Billing & Subscription</h1>
          <p className="text-text-secondary mt-1">Manage your Novalyte OS plan and payment methods.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">Update Payment Method</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 bg-surface-1 border-surface-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-text-primary">Current Plan</h3>
            <span className="px-2 py-1 rounded text-xs font-medium bg-primary/10 text-primary">Pro Tier</span>
          </div>
          <p className="text-3xl font-display font-bold text-text-primary mb-2">$997<span className="text-sm text-text-secondary font-normal">/mo</span></p>
          <p className="text-text-secondary text-sm mb-6">Your next billing date is April 1, 2026.</p>
          <ul className="space-y-2 mb-6 text-sm text-text-secondary">
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success" /> Unlimited Leads</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success" /> Advanced AI Triage</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success" /> Priority Support</li>
          </ul>
          <Button className="w-full">Upgrade Plan</Button>
        </Card>

        <Card className="p-6 bg-surface-1 border-surface-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-text-primary">Payment Method</h3>
          </div>
          <div className="flex items-center gap-4 p-4 border border-surface-3 rounded-lg bg-surface-2 mb-6">
            <CreditCard className="w-6 h-6 text-text-secondary" />
            <div>
              <p className="font-medium text-text-primary">Visa ending in 4242</p>
              <p className="text-xs text-text-secondary">Expires 12/28</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-warning mb-6">
            <AlertCircle className="w-4 h-4" />
            <span>Your card expires soon. Please update your payment method.</span>
          </div>
          <Button variant="outline" className="w-full">Edit Payment Method</Button>
        </Card>
      </div>

      <Card className="p-6 bg-surface-1 border-surface-3">
        <h3 className="text-lg font-bold text-text-primary mb-6">Billing History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-surface-3 text-text-secondary text-sm">
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Description</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {[
                { date: 'Mar 1, 2026', desc: 'Novalyte OS - Pro Tier', amount: '$997.00', status: 'Paid' },
                { date: 'Feb 1, 2026', desc: 'Novalyte OS - Pro Tier', amount: '$997.00', status: 'Paid' },
                { date: 'Jan 1, 2026', desc: 'Novalyte OS - Pro Tier', amount: '$997.00', status: 'Paid' },
              ].map((invoice, i) => (
                <tr key={i} className="border-b border-surface-3 hover:bg-surface-2/50 transition-colors">
                  <td className="py-4 text-text-primary">{invoice.date}</td>
                  <td className="py-4 text-text-secondary">{invoice.desc}</td>
                  <td className="py-4 text-text-primary">{invoice.amount}</td>
                  <td className="py-4">
                    <span className="px-2 py-1 rounded text-xs font-medium bg-success/10 text-success">
                      {invoice.status}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <button className="p-1.5 rounded hover:bg-surface-3 text-text-secondary transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

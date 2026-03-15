import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  CreditCard, Download, CheckCircle2, AlertTriangle, 
  ShieldCheck, Zap, ArrowUpRight, Clock, Receipt, Building2
} from 'lucide-react';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';

export function ClinicBilling() {
  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col animate-in fade-in duration-500">
      
      {/* Header & Actions */}
      <div className="flex-none flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Financial & Subscription</h1>
          <p className="text-text-secondary mt-1">Manage your Novalyte OS plan, billing methods, and invoice history.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/contact">
            <Button variant="outline" className="border-surface-3 text-white hover:bg-surface-2">
              Contact Billing Support
            </Button>
          </Link>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-grow overflow-y-auto hide-scrollbar pb-8">
        <div className="space-y-6">
          
          {/* Account Health Banner (Conditional) */}
          <div className="bg-success/10 border border-success/20 rounded-xl p-4 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-success shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-success">Account in Good Standing</h3>
              <p className="text-sm text-success/80 mt-1">Your next automated payment is scheduled for April 1, 2026. No action required.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Current Plan Card */}
            <Card className="lg:col-span-2 p-8 bg-[#0B0F14] border-surface-3 relative overflow-hidden flex flex-col">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Zap className="w-48 h-48 text-primary" />
              </div>
              
              <div className="relative z-10 flex-grow">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider">
                      Pro Tier Active
                    </span>
                    <h2 className="text-2xl font-display font-bold text-white mt-4">Novalyte Clinic OS</h2>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-display font-bold text-white">$997<span className="text-lg text-text-secondary font-normal">/mo</span></p>
                    <p className="text-sm text-text-secondary mt-1">Billed monthly</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      <span className="text-white">Unlimited Patient Leads</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      <span className="text-white">Advanced AI Triage & Scoring</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      <span className="text-white">Full CRM & Pipeline Access</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      <span className="text-white">Marketplace Procurement</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      <span className="text-white">Workforce Exchange Access</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      <span className="text-white">Priority Technical Support</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative z-10 pt-6 border-t border-surface-3 flex items-center justify-between">
                <p className="text-sm text-text-secondary flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Renews automatically on April 1, 2026
                </p>
                <div className="flex gap-3">
                  <Link to="/contact">
                    <Button variant="outline" className="border-surface-3 text-white hover:bg-surface-2">
                      Cancel Plan
                    </Button>
                  </Link>
                  <Link to="/contact">
                    <Button className="bg-primary hover:bg-primary/90 text-black font-bold">
                      Upgrade to Enterprise <ArrowUpRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>

            {/* Payment Method & Details */}
            <div className="space-y-6">
              <Card className="p-6 bg-surface-1 border-surface-3">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-white">Payment Method</h3>
                  <Button variant="outline" size="sm" className="border-surface-3 text-white hover:bg-surface-2 h-8 text-xs">
                    Update
                  </Button>
                </div>
                
                <div className="p-4 rounded-lg bg-[#0B0F14] border border-surface-3 flex items-center gap-4">
                  <div className="w-12 h-8 bg-surface-2 rounded border border-surface-3 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-text-secondary" />
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm font-bold text-white">Visa ending in 4242</p>
                    <p className="text-xs text-text-secondary mt-0.5">Expires 12/2028</p>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-success" />
                </div>
              </Card>

              <Card className="p-6 bg-surface-1 border-surface-3">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-white">Billing Details</h3>
                  <Button variant="outline" size="sm" className="border-surface-3 text-white hover:bg-surface-2 h-8 text-xs">
                    Edit
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Building2 className="w-4 h-4 text-text-secondary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-white">Apex Men's Health</p>
                      <p className="text-xs text-text-secondary mt-1">
                        123 Medical Plaza, Suite 400<br/>
                        Austin, TX 78701<br/>
                        United States
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-surface-3">
                    <p className="text-xs text-text-secondary mb-1">Tax ID / EIN</p>
                    <p className="text-sm font-mono text-white">XX-XXX4921</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Invoice History */}
          <Card className="p-0 bg-surface-1 border-surface-3 overflow-hidden">
            <div className="p-6 border-b border-surface-3 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Receipt className="w-5 h-5 text-text-secondary" /> Invoice History
              </h3>
              <Button variant="outline" size="sm" className="border-surface-3 text-white hover:bg-surface-2">
                Download All
              </Button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-2/50 text-xs uppercase tracking-wider text-text-secondary">
                    <th className="px-6 py-4 font-medium">Invoice</th>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium">Amount</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-surface-3">
                  {[
                    { id: 'INV-2026-003', date: 'Mar 1, 2026', desc: 'Novalyte OS - Pro Tier', amount: '$997.00', status: 'Paid' },
                    { id: 'INV-2026-002', date: 'Feb 1, 2026', desc: 'Novalyte OS - Pro Tier', amount: '$997.00', status: 'Paid' },
                    { id: 'INV-2026-001', date: 'Jan 1, 2026', desc: 'Novalyte OS - Pro Tier', amount: '$997.00', status: 'Paid' },
                    { id: 'INV-2025-012', date: 'Dec 1, 2025', desc: 'Novalyte OS - Pro Tier', amount: '$997.00', status: 'Paid' },
                  ].map((invoice, i) => (
                    <tr key={i} className="hover:bg-surface-2/30 transition-colors group">
                      <td className="px-6 py-4">
                        <p className="font-mono text-white">{invoice.id}</p>
                        <p className="text-xs text-text-secondary mt-0.5">{invoice.desc}</p>
                      </td>
                      <td className="px-6 py-4 text-text-secondary">{invoice.date}</td>
                      <td className="px-6 py-4 font-medium text-white">{invoice.amount}</td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-success/10 text-success uppercase tracking-wider border border-success/20">
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 rounded-lg bg-surface-2 border border-surface-3 text-text-secondary hover:text-white hover:border-primary/50 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100">
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
      </div>
    </div>
  );
}

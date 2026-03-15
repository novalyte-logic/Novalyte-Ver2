import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  CreditCard, Download, CheckCircle2, AlertTriangle, 
  ShieldCheck, Zap, ArrowUpRight, Clock, Receipt, Building2
} from 'lucide-react';
import { collection, query, where, onSnapshot, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '@/src/firebase';
import { useAuth } from '@/src/lib/auth/AuthContext';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';

interface Invoice {
  id: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  dueDate: any;
  createdAt: any;
  description?: string;
}

export function ClinicBilling() {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clinicData, setClinicData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchClinic = async () => {
      const snap = await getDoc(doc(db, 'clinics', user.uid));
      if (snap.exists()) setClinicData(snap.data());
    };

    const q = query(
      collection(db, 'invoices'),
      where('clinicId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const invoiceData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Invoice[];
      setInvoices(invoiceData);
      setLoading(false);
    });

    fetchClinic();
    return () => unsubscribe();
  }, [user]);

  const currentPlan = {
    name: "Novalyte Clinic OS",
    price: "$997",
    period: "mo",
    nextBilling: "April 1, 2026",
    features: [
      "Unlimited Patient Leads",
      "Advanced AI Triage & Scoring",
      "Full CRM & Pipeline Access",
      "Marketplace Procurement",
      "Workforce Exchange Access",
      "Priority Technical Support"
    ]
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col animate-in fade-in duration-500">
      
      {/* Header & Actions */}
      <div className="flex-none flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Financial & Subscription</h1>
          <p className="text-text-secondary mt-1">Manage your Novalyte OS plan, billing methods, and invoice history.</p>
        </div>
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <Link to="/contact" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto border-surface-3 text-white hover:bg-surface-2">
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
              <p className="text-sm text-success/80 mt-1">Your next automated payment is scheduled for {currentPlan.nextBilling}. No action required.</p>
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
                    <h2 className="text-2xl font-display font-bold text-white mt-4">{currentPlan.name}</h2>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-display font-bold text-white">{currentPlan.price}<span className="text-lg text-text-secondary font-normal">/{currentPlan.period}</span></p>
                    <p className="text-sm text-text-secondary mt-1">Billed monthly</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div className="space-y-3">
                    {currentPlan.features.slice(0, 3).map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-text-secondary">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        <span className="text-white">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3">
                    {currentPlan.features.slice(3).map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-text-secondary">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        <span className="text-white">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="relative z-10 pt-6 border-t border-surface-3 flex items-center justify-between">
                <p className="text-sm text-text-secondary flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Renews automatically on {currentPlan.nextBilling}
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
                      <p className="text-sm font-medium text-white">{clinicData?.name || "Apex Men's Health"}</p>
                      <p className="text-xs text-text-secondary mt-1">
                        {clinicData?.address || "123 Medical Plaza, Suite 400"}<br/>
                        {clinicData?.city || "Austin"}, {clinicData?.state || "TX"} {clinicData?.zip || "78701"}<br/>
                        United States
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-surface-3">
                    <p className="text-xs text-text-secondary mb-1">NPI Number</p>
                    <p className="text-sm font-mono text-white">{clinicData?.npiNumber || "XX-XXX4921"}</p>
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
                  {invoices.length > 0 ? (
                    invoices.map((invoice, i) => (
                      <tr key={i} className="hover:bg-surface-2/30 transition-colors group">
                        <td className="px-6 py-4">
                          <p className="font-mono text-white">{invoice.id}</p>
                          <p className="text-xs text-text-secondary mt-0.5">{invoice.description || 'Novalyte OS - Pro Tier'}</p>
                        </td>
                        <td className="px-6 py-4 text-text-secondary">
                          {invoice.createdAt?.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="px-6 py-4 font-medium text-white">${invoice.amount.toFixed(2)}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            invoice.status === 'paid' 
                              ? 'bg-success/10 text-success border-success/20' 
                              : invoice.status === 'overdue'
                              ? 'bg-error/10 text-error border-error/20'
                              : 'bg-warning/10 text-warning border-warning/20'
                          }`}>
                            {invoice.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="p-2 rounded-lg bg-surface-2 border border-surface-3 text-text-secondary hover:text-white hover:border-primary/50 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100">
                            <Download className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-text-secondary italic">
                        No invoice history found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
}

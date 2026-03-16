import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  CreditCard, Download, CheckCircle2, AlertTriangle, 
  ShieldCheck, Zap, ArrowUpRight, Clock, Receipt, Building2
} from 'lucide-react';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { ClinicApiError, ClinicService, type ClinicBillingResponse } from '@/src/services/clinic';

type Invoice = ClinicBillingResponse['invoices'][number];

export function ClinicBilling() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [billing, setBilling] = useState<ClinicBillingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionFeedback, setActionFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    let isActive = true;

    const loadBilling = async (silent = false) => {
      if (!silent) {
        setLoading(true);
      }
      try {
        const response = await ClinicService.getBilling();
        if (isActive) {
          setBilling(response);
          setInvoices(response.invoices);
        }
      } catch (error) {
        console.error('Failed to load billing:', error);
        if (isActive) {
          setActionFeedback({
            type: 'error',
            message: error instanceof ClinicApiError ? error.message : 'Unable to load billing right now.',
          });
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    void loadBilling();
    const interval = window.setInterval(() => {
      void loadBilling(true);
    }, 30000);

    return () => {
      isActive = false;
      window.clearInterval(interval);
    };
  }, []);

  const currentPlan = {
    name: billing?.plan.name || '',
    price: billing?.plan.priceLabel || '',
    period: billing?.plan.interval || '',
    nextBilling: billing?.plan.nextBillingDate || '',
    features: billing?.plan.features || [],
  };
  const paymentMethod = billing?.paymentMethod;
  const hasPaymentMethod = Boolean(paymentMethod?.last4);
  const accountHealthy = (billing?.summary.outstandingBalance || 0) <= 0;

  const formatInvoiceDate = (value: unknown) => {
    if (!value) {
      return 'Pending';
    }

    const date = new Date(String(value));
    return Number.isNaN(date.getTime())
      ? 'Pending'
      : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const downloadFile = (filename: string, content: string, type = 'text/plain;charset=utf-8') => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    const receipt = [
      `Invoice ${invoice.id}`,
      `Clinic: ${billing?.clinic.name || 'Novalyte Clinic Account'}`,
      `Description: ${invoice.description || 'Novalyte subscription'}`,
      `Date: ${formatInvoiceDate(invoice.createdAt)}`,
      `Amount: $${invoice.amount.toFixed(2)}`,
      `Status: ${invoice.status}`,
    ].join('\n');

    downloadFile(`invoice-${invoice.id}.txt`, receipt);
    setActionFeedback({
      type: 'success',
      message: `Downloaded invoice ${invoice.id}.`,
    });
  };

  const handleDownloadAllInvoices = () => {
    if (!invoices.length) {
      setActionFeedback({
        type: 'error',
        message: 'No invoices are available to download.',
      });
      return;
    }

    const csvRows = [
      'invoice_id,date,amount,status,description',
      ...invoices.map((invoice) =>
        [
          invoice.id,
          formatInvoiceDate(invoice.createdAt),
          invoice.amount.toFixed(2),
          invoice.status,
          `"${(invoice.description || 'Novalyte subscription').replace(/"/g, '""')}"`,
        ].join(','),
      ),
    ];

    downloadFile('novalyte-invoices.csv', csvRows.join('\n'), 'text/csv;charset=utf-8');
    setActionFeedback({
      type: 'success',
      message: `Downloaded ${invoices.length} invoice${invoices.length === 1 ? '' : 's'}.`,
    });
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
          {actionFeedback ? (
            <div className={`mt-4 rounded-lg border px-4 py-3 text-sm ${
              actionFeedback.type === 'success'
                ? 'border-success/20 bg-success/10 text-success'
                : 'border-danger/20 bg-danger/10 text-danger'
            }`}>
              {actionFeedback.message}
            </div>
          ) : null}
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
          <div className={`rounded-xl p-4 flex items-start gap-3 border ${
            accountHealthy ? 'bg-success/10 border-success/20' : 'bg-warning/10 border-warning/20'
          }`}>
            {accountHealthy ? (
              <ShieldCheck className="w-5 h-5 text-success shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
            )}
            <div>
              <h3 className={`text-sm font-bold ${accountHealthy ? 'text-success' : 'text-warning'}`}>
                {accountHealthy ? 'Account in Good Standing' : 'Billing follow-up required'}
              </h3>
              <p className={`text-sm mt-1 ${accountHealthy ? 'text-success/80' : 'text-warning/80'}`}>
                {accountHealthy
                  ? currentPlan.nextBilling
                    ? `Your next automated payment is scheduled for ${currentPlan.nextBilling}.`
                    : 'Your clinic account is current.'
                  : `${billing?.summary.outstandingBalanceLabel || '$0'} remains outstanding across open invoices.`}
              </p>
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
                      {billing?.plan.status || 'Plan details pending'}
                    </span>
                    <h2 className="text-2xl font-display font-bold text-white mt-4">
                      {currentPlan.name || 'No active billing plan on file'}
                    </h2>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-display font-bold text-white">
                      {currentPlan.price || '--'}
                      {currentPlan.period ? <span className="text-lg text-text-secondary font-normal">/{currentPlan.period}</span> : null}
                    </p>
                    <p className="text-sm text-text-secondary mt-1">
                      {currentPlan.period ? 'Billing cadence configured' : 'Billing cadence not configured'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {currentPlan.features.length ? (
                    <>
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
                    </>
                  ) : (
                    <div className="md:col-span-2 rounded-xl border border-dashed border-surface-3 bg-surface-1/30 p-6 text-sm text-text-secondary">
                      Billing plan metadata has not been configured for this clinic yet.
                    </div>
                  )}
                </div>
              </div>

              <div className="relative z-10 pt-6 border-t border-surface-3 flex items-center justify-between">
                <p className="text-sm text-text-secondary flex items-center gap-2">
                  <Clock className="w-4 h-4" /> {currentPlan.nextBilling ? `Renews automatically on ${currentPlan.nextBilling}` : 'Next billing date unavailable'}
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
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-surface-3 text-white hover:bg-surface-2 h-8 text-xs"
                    onClick={() => navigate('/contact?role=clinic&topic=payment_method_update')}
                  >
                    Update
                  </Button>
                </div>
                
                <div className="p-4 rounded-lg bg-[#0B0F14] border border-surface-3 flex items-center gap-4">
                  <div className="w-12 h-8 bg-surface-2 rounded border border-surface-3 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-text-secondary" />
                  </div>
                  <div className="flex-grow">
                    {hasPaymentMethod ? (
                      <>
                        <p className="text-sm font-bold text-white">
                          {(paymentMethod?.brand || 'Card').trim() || 'Card'} ending in {paymentMethod?.last4}
                        </p>
                        <p className="text-xs text-text-secondary mt-0.5">
                          Expires {paymentMethod?.expMonth || '--'}/{paymentMethod?.expYear || '--'}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm font-bold text-white">No payment method on file</p>
                        <p className="text-xs text-text-secondary mt-0.5">Connect billing details to enable automated renewal.</p>
                      </>
                    )}
                  </div>
                  {hasPaymentMethod ? <CheckCircle2 className="w-5 h-5 text-success" /> : <AlertTriangle className="w-5 h-5 text-warning" />}
                </div>
              </Card>

              <Card className="p-6 bg-surface-1 border-surface-3">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-white">Billing Details</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-surface-3 text-white hover:bg-surface-2 h-8 text-xs"
                    onClick={() => navigate('/dashboard/settings')}
                  >
                    Edit
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Building2 className="w-4 h-4 text-text-secondary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-white">{billing?.clinic.name || 'Clinic billing profile missing'}</p>
                      <p className="text-xs text-text-secondary mt-1">
                        {billing?.clinic.address || 'Address not configured'}<br/>
                        {[billing?.clinic.city, billing?.clinic.state, billing?.clinic.zip].filter(Boolean).join(' ') || 'Location not configured'}<br/>
                        United States
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-surface-3">
                    <p className="text-xs text-text-secondary mb-1">NPI Number</p>
                    <p className="text-sm font-mono text-white">{billing?.clinic.npiNumber || 'Not configured'}</p>
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
              <Button
                variant="outline"
                size="sm"
                className="border-surface-3 text-white hover:bg-surface-2"
                onClick={handleDownloadAllInvoices}
                disabled={!invoices.length}
              >
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
                          {formatInvoiceDate(invoice.createdAt)}
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
                          <button
                            type="button"
                            onClick={() => handleDownloadInvoice(invoice)}
                            className="p-2 rounded-lg bg-surface-2 border border-surface-3 text-text-secondary hover:text-white hover:border-primary/50 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                          >
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

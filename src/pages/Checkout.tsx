import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, CheckCircle2, ShieldCheck, CreditCard, Building2 } from 'lucide-react';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';

export function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    // In a real app, we'd get the product details from the state or a cart context
    // For now, we'll just check if there's state passed from the product detail page
    if (location.state?.product) {
      setProduct(location.state.product);
    } else {
      // Fallback mock data if accessed directly
      setProduct({
        id: 'mock-1',
        name: 'Clinical Solution',
        price: '$1,999',
        vendor: 'Novalyte Partner'
      });
    }
  }, [location]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate processing
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <Card className="p-8 bg-surface-1/80 border-surface-3 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-display font-bold text-white mb-2">Order Confirmed</h2>
            <p className="text-slate-400 mb-8">
              Thank you for your request. Our team will contact you shortly to finalize the details and arrange delivery.
            </p>
            <Button 
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold"
              onClick={() => navigate('/marketplace')}
            >
              Return to Marketplace
            </Button>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col pb-24">
      {/* Header */}
      <section className="pt-24 pb-6 border-b border-surface-3/50 bg-surface-1/50 backdrop-blur-md sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button onClick={() => navigate(-1)} className="inline-flex items-center text-sm text-text-secondary hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </button>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-3xl font-display font-bold text-white mb-2">Checkout</h1>
              <p className="text-slate-400">Complete your request for {product?.name}</p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Card className="p-6 bg-surface-1/50 border-surface-3">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-cyan-400" /> Clinic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Clinic Name</label>
                    <input type="text" required className="w-full px-4 py-2 rounded-lg bg-surface-2 border border-surface-3 text-white focus:outline-none focus:border-cyan-500 transition-colors" placeholder="e.g. Apex Men's Health" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Contact Name</label>
                    <input type="text" required className="w-full px-4 py-2 rounded-lg bg-surface-2 border border-surface-3 text-white focus:outline-none focus:border-cyan-500 transition-colors" placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Email Address</label>
                    <input type="email" required className="w-full px-4 py-2 rounded-lg bg-surface-2 border border-surface-3 text-white focus:outline-none focus:border-cyan-500 transition-colors" placeholder="john@apexhealth.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Phone Number</label>
                    <input type="tel" required className="w-full px-4 py-2 rounded-lg bg-surface-2 border border-surface-3 text-white focus:outline-none focus:border-cyan-500 transition-colors" placeholder="(555) 123-4567" />
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-surface-1/50 border-surface-3">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-cyan-400" /> Payment Details
                </h3>
                <p className="text-sm text-slate-400 mb-4">
                  For high-value clinical equipment, we process a secure authorization. A representative will contact you to finalize the transaction and arrange financing if needed.
                </p>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Name on Card</label>
                    <input type="text" className="w-full px-4 py-2 rounded-lg bg-surface-2 border border-surface-3 text-white focus:outline-none focus:border-cyan-500 transition-colors" placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Card Number</label>
                    <input type="text" className="w-full px-4 py-2 rounded-lg bg-surface-2 border border-surface-3 text-white focus:outline-none focus:border-cyan-500 transition-colors" placeholder="•••• •••• •••• ••••" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Expiry Date</label>
                      <input type="text" className="w-full px-4 py-2 rounded-lg bg-surface-2 border border-surface-3 text-white focus:outline-none focus:border-cyan-500 transition-colors" placeholder="MM/YY" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">CVC</label>
                      <input type="text" className="w-full px-4 py-2 rounded-lg bg-surface-2 border border-surface-3 text-white focus:outline-none focus:border-cyan-500 transition-colors" placeholder="123" />
                    </div>
                  </div>
                </div>
              </Card>

              <Button 
                type="submit" 
                className="w-full py-4 text-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Complete Request'}
              </Button>
            </form>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-6">
              <Card className="p-6 bg-surface-1/80 backdrop-blur-xl border-surface-3">
                <h3 className="font-bold text-white mb-6">Order Summary</h3>
                
                {product && (
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-white">{product.name}</p>
                        <p className="text-sm text-slate-400">{product.vendor}</p>
                      </div>
                      <p className="font-medium text-white">{product.price}</p>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-surface-3 space-y-3">
                  <div className="flex justify-between text-sm text-slate-400">
                    <span>Subtotal</span>
                    <span>{product?.price || '--'}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-400">
                    <span>Shipping</span>
                    <span>Calculated later</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-400">
                    <span>Tax</span>
                    <span>Calculated later</span>
                  </div>
                  <div className="pt-3 border-t border-surface-3 flex justify-between items-center">
                    <span className="font-bold text-white">Total Due Today</span>
                    <span className="font-bold text-xl text-emerald-400">$0.00</span>
                  </div>
                  <p className="text-xs text-slate-500 text-center mt-4">
                    * No charges will be made until a representative confirms your order details.
                  </p>
                </div>
              </Card>

              <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Secure SSL Encrypted Checkout</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

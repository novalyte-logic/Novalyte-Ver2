import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  Search, Filter, Package, Zap, TrendingUp, CheckCircle2, 
  AlertTriangle, Sparkles, DollarSign, Users, Activity,
  ChevronRight, ShieldCheck, ArrowUpRight
} from 'lucide-react';
import { collection, query, where, onSnapshot, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/src/firebase';
import { useAuth } from '@/src/lib/auth/AuthContext';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';

interface MarketplaceService {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  provider: string;
  status: 'active' | 'inactive';
  roi?: {
    payback: string;
    estRevenue: string;
    margin: string;
  };
  compatibility?: {
    status: 'perfect' | 'high' | 'medium';
    message: string;
  };
  demand?: {
    level: string;
    signal: string;
  };
  image?: string;
}

export function ClinicMarketplace() {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState('all');
  const [services, setServices] = useState<MarketplaceService[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'all', label: 'All Infrastructure' },
    { id: 'equipment', label: 'Capital Equipment' },
    { id: 'diagnostics', label: 'Diagnostics & Labs' },
    { id: 'protocols', label: 'Clinical Protocols' },
    { id: 'software', label: 'Digital Health' },
  ];

  useEffect(() => {
    const q = query(
      collection(db, 'marketplaceServices'),
      where('status', '==', 'active')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as MarketplaceService[];
      setServices(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleOrderService = async (service: MarketplaceService) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'marketplaceOrders'), {
        serviceId: service.id,
        clinicId: user.uid,
        status: 'pending',
        amount: service.price,
        createdAt: serverTimestamp()
      });
      alert(`Order request for ${service.title} submitted successfully!`);
    } catch (error) {
      console.error("Error ordering service:", error);
    }
  };

  const filteredServices = activeCategory === 'all' 
    ? services 
    : services.filter(s => s.category.toLowerCase().includes(activeCategory.toLowerCase()));

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
          <h1 className="text-3xl font-display font-bold text-white">Infrastructure & Procurement</h1>
          <p className="text-text-secondary mt-1">Curated equipment, diagnostics, and protocols tailored to your clinic's growth.</p>
        </div>
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <Link to="/dashboard/billing" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto border-surface-3 text-white hover:bg-surface-2">
              Procurement History
            </Button>
          </Link>
          <Link to="/contact" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-black font-bold">
              Request Custom Sourcing
            </Button>
          </Link>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-grow overflow-y-auto hide-scrollbar pb-8">
        <div className="space-y-8">
          
          {/* AI Procurement Insight Hero */}
          <Card className="p-8 bg-[#0B0F14] border-primary/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Sparkles className="w-48 h-48 text-primary" />
            </div>
            <div className="relative z-10 max-w-4xl">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-primary" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">AI Procurement Recommendation</h2>
              </div>
              <p className="text-2xl font-display font-bold text-white leading-tight mb-6">
                Based on <span className="text-primary">45 recent patient leads</span> requesting ED treatments in your area, adding <span className="text-white">Acoustic Wave Therapy</span> could increase your monthly revenue by <span className="text-success">$12,500</span> with a payback period of 2.5 months.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/marketplace/equipment">
                  <Button className="bg-primary hover:bg-primary/90 text-black font-bold">
                    View ROI Calculator
                  </Button>
                </Link>
                <Link to="/marketplace/equipment">
                  <Button variant="outline" className="border-surface-3 text-white hover:bg-surface-2">
                    Explore Equipment
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          {/* Main Layout: Sidebar + Grid */}
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Sidebar Filters */}
            <div className="w-full lg:w-64 flex-shrink-0 space-y-6">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                <input 
                  type="text" 
                  placeholder="Search infrastructure..." 
                  className="w-full h-10 pl-10 pr-4 bg-surface-1 border border-surface-3 rounded-lg text-sm text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-text-secondary"
                />
              </div>

              <div>
                <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3">Categories</h3>
                <div className="space-y-1">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeCategory === cat.id 
                          ? 'bg-primary/10 text-primary' 
                          : 'text-text-secondary hover:bg-surface-2 hover:text-white'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3">Compatibility Filters</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer hover:text-white transition-colors">
                    <input type="checkbox" className="rounded border-surface-3 bg-surface-1 text-primary focus:ring-primary/50" defaultChecked />
                    EMR Integrated
                  </label>
                  <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer hover:text-white transition-colors">
                    <input type="checkbox" className="rounded border-surface-3 bg-surface-1 text-primary focus:ring-primary/50" defaultChecked />
                    Matches Current Staffing
                  </label>
                  <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer hover:text-white transition-colors">
                    <input type="checkbox" className="rounded border-surface-3 bg-surface-1 text-primary focus:ring-primary/50" />
                    No Additional Space Required
                  </label>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            <div className="flex-grow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">
                  {categories.find(c => c.id === activeCategory)?.label}
                </h3>
                <span className="text-sm text-text-secondary">Showing {filteredServices.length} recommendations</span>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {filteredServices.length > 0 ? filteredServices.map((product) => (
                  <Card key={product.id} className="bg-[#0B0F14] border-surface-3 hover:border-surface-4 transition-colors overflow-hidden flex flex-col group">
                    {/* Image / Header Area */}
                    <div className={`h-32 ${product.image || 'bg-gradient-to-br from-surface-2 to-surface-3'} relative p-4 flex flex-col justify-between border-b border-surface-3`}>
                      <div className="flex justify-between items-start">
                        <span className="px-2 py-1 rounded bg-black/50 backdrop-blur-md border border-white/10 text-[10px] font-mono font-bold text-white uppercase tracking-wider">
                          {product.category}
                        </span>
                        {product.compatibility?.status === 'perfect' && (
                          <span className="px-2 py-1 rounded bg-success/20 backdrop-blur-md border border-success/30 text-[10px] font-bold text-success flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> EMR Ready
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-white drop-shadow-md">{product.title}</h3>
                    </div>

                    <div className="p-5 flex-grow flex flex-col">
                      
                      {/* Compatibility & Demand Signals */}
                      <div className="space-y-3 mb-6">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${
                            product.compatibility?.status === 'perfect' ? 'text-success' : 
                            product.compatibility?.status === 'high' ? 'text-primary' : 'text-warning'
                          }`} />
                          <p className="text-sm text-text-secondary leading-tight">
                            <span className="text-white font-medium">Compatibility:</span> {product.compatibility?.message || 'Standard integration available.'}
                          </p>
                        </div>
                        <div className="flex items-start gap-2">
                          <Activity className="w-4 h-4 mt-0.5 shrink-0 text-secondary" />
                          <p className="text-sm text-text-secondary leading-tight">
                            <span className="text-white font-medium">{product.demand?.level || 'Steady'} Demand:</span> {product.demand?.signal || 'Consistent market interest.'}
                          </p>
                        </div>
                      </div>

                      {/* ROI Framing */}
                      {product.roi && (
                        <div className="grid grid-cols-3 gap-2 mb-6 p-3 rounded-lg bg-surface-1 border border-surface-3">
                          <div>
                            <p className="text-[10px] text-text-secondary uppercase tracking-wider mb-1">Est. Revenue</p>
                            <p className="text-sm font-bold text-success flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" /> {product.roi.estRevenue}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] text-text-secondary uppercase tracking-wider mb-1">Payback</p>
                            <p className="text-sm font-bold text-white">{product.roi.payback}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-text-secondary uppercase tracking-wider mb-1">Margin</p>
                            <p className="text-sm font-bold text-white">{product.roi.margin}</p>
                          </div>
                        </div>
                      )}

                      {/* Pricing & Action */}
                      <div className="mt-auto pt-4 border-t border-surface-3 flex items-center justify-between">
                        <div>
                          <p className="text-lg font-display font-bold text-white">${product.price.toLocaleString()}</p>
                          <p className="text-xs text-text-secondary">by {product.provider}</p>
                        </div>
                        <Button 
                          onClick={() => handleOrderService(product)}
                          className="bg-surface-2 hover:bg-surface-3 text-white border border-surface-3 group-hover:border-primary/50 transition-colors"
                        >
                          Procurement Details <ArrowUpRight className="w-4 h-4 ml-2 opacity-50 group-hover:opacity-100 group-hover:text-primary transition-all" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                )) : (
                  <div className="xl:col-span-2 p-12 text-center border-2 border-dashed border-surface-3 rounded-xl bg-surface-1/30">
                    <Package className="w-12 h-12 text-surface-3 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-white">No services found</h3>
                    <p className="text-text-secondary mt-2">Try adjusting your filters or search terms.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

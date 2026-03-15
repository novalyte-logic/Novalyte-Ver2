import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useParams } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/src/firebase';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Search, Filter, ArrowRight, Package, Server, Activity, ShoppingCart, Dumbbell, Smartphone, Zap, ShieldCheck, Clock, CheckCircle2, TrendingUp } from 'lucide-react';

// Mock data for products removed

const categoryConfig: Record<string, { title: string, description: string, icon: any, color: string, bgGlow: string }> = {
  'equipment': { title: 'Clinical Equipment', description: 'Procure capital equipment and treatment devices with verified ROI.', icon: Server, color: 'text-primary', bgGlow: 'bg-primary/10' },
  'diagnostics': { title: 'Diagnostics & Labs', description: 'Advanced testing kits and lab partnerships for comprehensive patient insights.', icon: Activity, color: 'text-secondary', bgGlow: 'bg-secondary/10' },
  'supplements': { title: 'Supplements & Protocols', description: 'Clinical-grade supplements, peptides, and specialized formulations.', icon: ShoppingCart, color: 'text-secondary', bgGlow: 'bg-secondary/10' },
  'health-tech': { title: 'Health Tech', description: 'Wearables, continuous monitors, and digital health software.', icon: Smartphone, color: 'text-primary', bgGlow: 'bg-primary/10' },
  'home-gym': { title: 'Home Gym', description: 'Premium fitness and recovery hardware for patients.', icon: Dumbbell, color: 'text-warning', bgGlow: 'bg-warning/10' },
  'clinics': { title: 'Clinic Supplies', description: 'Operational supplies and protocol kits.', icon: Package, color: 'text-primary', bgGlow: 'bg-primary/10' },
};

export function MarketplaceCategory() {
  const { category } = useParams<{ category: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = category ? query(collection(db, 'products'), where('category', '==', category)) : collection(db, 'products');
        const querySnapshot = await getDocs(q);
        const productsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category]);
  
  const config = category && categoryConfig[category] ? categoryConfig[category] : { title: 'Marketplace', description: 'Browse products.', icon: Package, color: 'text-primary', bgGlow: 'bg-primary/10' };
  const Icon = config.icon;

  const filteredProducts = products.filter(p => p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || p.description?.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Premium Header */}
      <section className="relative pt-32 pb-16 border-b border-surface-3/50 overflow-hidden">
        <div className="absolute inset-0 bg-[#05070A]" />
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] ${config.bgGlow} rounded-full blur-[100px] opacity-40 mix-blend-screen`} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className={`w-16 h-16 shrink-0 rounded-2xl bg-surface-2/80 backdrop-blur-xl border border-surface-3 flex items-center justify-center ${config.color} shadow-2xl`}>
                <Icon className="w-8 h-8" />
              </div>
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-2/50 border border-surface-3 mb-3">
                  <ShieldCheck className="w-3 h-3 text-success" />
                  <span className="text-xs font-mono text-text-secondary uppercase tracking-wider">Verified Category</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">{config.title}</h1>
                <p className="text-lg text-text-secondary max-w-2xl font-light">{config.description}</p>
              </div>
            </div>
            
            <div className="flex gap-3 w-full md:w-auto">
              <Link to="/auth/clinic-login" className="w-full md:w-auto">
                <Button variant="outline" className="w-full md:w-auto border-surface-3 hover:bg-surface-2 text-white">
                  <Clock className="w-4 h-4 mr-2" /> Procurement History
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 flex-grow bg-[#0B0F14] relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-8 relative z-10">
          {/* Sidebar Filters */}
          <div className="w-full lg:w-72 space-y-6 flex-shrink-0">
            <Card className="p-6 bg-surface-1/80 backdrop-blur-xl border-surface-3 shadow-xl">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-surface-3/50">
                <Filter className="w-5 h-5 text-text-secondary" />
                <h3 className="font-bold text-white text-lg">Filters</h3>
              </div>
              
              <div className="space-y-8">
                <div>
                  <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Price Range</h4>
                  <div className="space-y-3">
                    {['Under $500', '$500 - $5,000', '$5,000+'].map((label, i) => (
                      <label key={i} className="flex items-center gap-3 text-sm text-text-secondary hover:text-white cursor-pointer transition-colors">
                        <input type="checkbox" className="rounded border-surface-3 bg-surface-2 text-primary focus:ring-primary/50 w-4 h-4" />
                        {label}
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Vendor Status</h4>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 text-sm text-text-secondary hover:text-white cursor-pointer transition-colors">
                      <input type="checkbox" className="rounded border-surface-3 bg-surface-2 text-primary focus:ring-primary/50 w-4 h-4" defaultChecked />
                      Novalyte Verified
                    </label>
                    <label className="flex items-center gap-3 text-sm text-text-secondary hover:text-white cursor-pointer transition-colors">
                      <input type="checkbox" className="rounded border-surface-3 bg-surface-2 text-primary focus:ring-primary/50 w-4 h-4" />
                      Direct Ship
                    </label>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Clinical Efficacy</h4>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 text-sm text-text-secondary hover:text-white cursor-pointer transition-colors">
                      <input type="checkbox" className="rounded border-surface-3 bg-surface-2 text-primary focus:ring-primary/50 w-4 h-4" />
                      FDA Cleared
                    </label>
                    <label className="flex items-center gap-3 text-sm text-text-secondary hover:text-white cursor-pointer transition-colors">
                      <input type="checkbox" className="rounded border-surface-3 bg-surface-2 text-primary focus:ring-primary/50 w-4 h-4" />
                      Peer Reviewed
                    </label>
                  </div>
                </div>
              </div>
            </Card>

            {/* AI Advisor Hook */}
            <Card className="p-6 bg-gradient-to-br from-surface-1 to-surface-2 border-surface-3 shadow-xl relative overflow-hidden">
              <div className={`absolute top-0 right-0 w-24 h-24 ${config.bgGlow} rounded-full blur-[24px]`} />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-mono uppercase tracking-wider mb-4">
                  <Zap className="w-3 h-3" /> AI Advisor
                </div>
                <h4 className="text-white font-bold mb-2">Need a custom protocol?</h4>
                <p className="text-sm text-text-secondary mb-4 leading-relaxed">
                  Let our AI analyze your clinic's patient demographics to recommend the highest ROI {config.title.toLowerCase()}.
                </p>
                <Link to="/clinics/icp">
                  <Button className="w-full bg-surface-3 hover:bg-surface-3/80 text-white text-sm">
                    Run Analysis
                  </Button>
                </Link>
              </div>
            </Card>
          </div>

          {/* Product Grid & Search */}
          <div className="flex-grow space-y-6">
            <div className="relative w-full group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-500" />
              <div className="relative flex items-center bg-surface-1/80 backdrop-blur-xl border border-surface-3 rounded-xl p-1">
                <Search className="w-5 h-5 text-text-secondary ml-4" />
                <input 
                  type="text" 
                  placeholder={`Search ${config.title.toLowerCase()}...`} 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 bg-transparent border-none text-white placeholder-text-secondary focus:outline-none focus:ring-0 px-4"
                />
              </div>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <Link key={product.id} to={`/marketplace/product/${product.id}`}>
                    <Card className="p-0 bg-surface-1/80 backdrop-blur-sm border-surface-3 flex flex-col h-full overflow-hidden hover:border-primary/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.1)] transition-all duration-300 group">
                      <div className="h-48 bg-surface-2 relative overflow-hidden">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                        <div className="absolute top-3 left-3 bg-background/80 backdrop-blur-md border border-surface-3 px-2 py-1 rounded-md flex items-center gap-1 text-xs font-medium text-white">
                          <ShieldCheck className="w-3 h-3 text-primary" /> Verified
                        </div>
                      </div>
                      <div className="p-6 flex-grow flex flex-col">
                        <div className="text-xs font-mono text-text-secondary uppercase tracking-wider mb-2">{product.vendor}</div>
                        <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors mb-2 leading-tight">{product.name}</h3>
                        <p className="text-sm text-text-secondary mb-6 flex-grow leading-relaxed">{product.description}</p>
                        
                        <div className="flex flex-col gap-3 mt-auto pt-4 border-t border-surface-3/50">
                          <div className="flex justify-between items-center">
                            <span className="font-mono font-medium text-white text-lg">{product.price}</span>
                            <span className="flex items-center gap-1 text-sm font-medium text-success bg-success/10 px-2 py-1 rounded-md">
                              ★ {product.rating}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs font-medium text-primary bg-primary/5 px-3 py-2 rounded-lg border border-primary/10">
                            <TrendingUp className="w-3 h-3" /> Est. ROI: {product.roi}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-16 px-8 text-center border border-surface-3 rounded-2xl bg-surface-1/50 backdrop-blur-xl relative overflow-hidden"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/5 rounded-full blur-[64px]" />
                <div className="relative z-10 max-w-lg mx-auto">
                  <div className="w-20 h-20 rounded-2xl bg-surface-2 border border-surface-3 flex items-center justify-center mx-auto mb-6 shadow-xl">
                    <Icon className={`w-10 h-10 ${config.color}`} />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white mb-4">Catalog Update in Progress</h3>
                  <p className="text-text-secondary mb-8 leading-relaxed">
                    We are currently vetting clinical-grade {config.title.toLowerCase()} vendors to ensure they meet our efficacy, compliance, and ROI standards. 
                  </p>
                  
                  <div className="bg-surface-2/50 border border-surface-3 rounded-xl p-6 text-left mb-8">
                    <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success" /> Vendor Vetting Criteria
                    </h4>
                    <ul className="space-y-2 text-sm text-text-secondary">
                      <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-primary" /> Clinical Efficacy & Peer Review</li>
                      <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-primary" /> Margin & ROI Potential for Clinics</li>
                      <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-primary" /> Supply Chain Reliability</li>
                      <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-primary" /> API/EMR Integration Readiness</li>
                    </ul>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/contact">
                      <Button className="bg-primary hover:bg-primary-hover text-background font-semibold">
                        Request Custom Procurement
                      </Button>
                    </Link>
                    <Link to="/contact">
                      <Button variant="outline" className="border-surface-3 hover:bg-surface-2 text-white">
                        Get Notified When Live
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

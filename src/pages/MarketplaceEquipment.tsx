import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Search, Filter, ShieldCheck, Clock, CheckCircle2, Zap, TrendingUp, Server, Calculator, FileText, ArrowRight, Activity, DollarSign, X } from 'lucide-react';

// Mock data for equipment
const equipment = [
  { id: 'e1', name: 'InBody 770', category: 'Body Composition', price: '$18,500', roi: '3 months', payback: '90 days', description: 'Advanced body composition analyzer providing detailed muscle and fat analysis.', image: 'https://picsum.photos/seed/inbody/400/300', vendor: 'InBody', rating: '4.9', revenuePerPatient: '$50-$100', basePrice: 18500, avgRevPerSession: 75 },
  { id: 'e2', name: 'Storz Medical DUOLITH', category: 'Shockwave Therapy', price: '$45,000', roi: '4 months', payback: '120 days', description: 'Focused shockwave therapy for ED and musculoskeletal conditions.', image: 'https://picsum.photos/seed/shockwave/400/300', vendor: 'Storz', rating: '4.8', revenuePerPatient: '$300-$500', basePrice: 45000, avgRevPerSession: 400 },
  { id: 'e3', name: 'BTL Emsella', category: 'Pelvic Floor', price: '$95,000', roi: '6 months', payback: '180 days', description: 'Non-invasive HIFEM technology for pelvic floor strengthening.', image: 'https://picsum.photos/seed/emsella/400/300', vendor: 'BTL', rating: '4.9', revenuePerPatient: '$400/session', basePrice: 95000, avgRevPerSession: 400 },
  { id: 'e4', name: 'Hyperbaric Chamber', category: 'Recovery', price: '$25,000', roi: '5 months', payback: '150 days', description: 'Mild hyperbaric oxygen therapy for accelerated recovery and longevity.', image: 'https://picsum.photos/seed/hbot/400/300', vendor: 'OxyHealth', rating: '4.7', revenuePerPatient: '$150/session', basePrice: 25000, avgRevPerSession: 150 },
];

export function MarketplaceEquipment() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isROICalculatorOpen, setIsROICalculatorOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(equipment[0]);
  const [patientsPerWeek, setPatientsPerWeek] = useState(10);

  const filteredEquipment = equipment.filter(e => 
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const calculateROI = () => {
    const weeklyRevenue = patientsPerWeek * selectedEquipment.avgRevPerSession;
    const monthlyRevenue = weeklyRevenue * 4.33;
    const paybackMonths = selectedEquipment.basePrice / monthlyRevenue;
    const annualProfit = (monthlyRevenue * 12) - selectedEquipment.basePrice;
    
    return {
      monthlyRevenue: Math.round(monthlyRevenue).toLocaleString(),
      paybackMonths: paybackMonths.toFixed(1),
      annualProfit: Math.round(annualProfit).toLocaleString()
    };
  };

  const roiResults = calculateROI();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Premium Header */}
      <section className="relative pt-32 pb-16 border-b border-surface-3/50 overflow-hidden">
        <div className="absolute inset-0 bg-[#05070A]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/10 rounded-full blur-[100px] opacity-40 mix-blend-screen" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-surface-2/80 backdrop-blur-xl border border-surface-3 flex items-center justify-center text-primary shadow-2xl">
                <Server className="w-8 h-8" />
              </div>
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-2/50 border border-surface-3 mb-3">
                  <ShieldCheck className="w-3 h-3 text-success" />
                  <span className="text-xs font-mono text-text-secondary uppercase tracking-wider">Capital Equipment Procurement</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">Clinical Equipment</h1>
                <p className="text-lg text-text-secondary max-w-2xl font-light">Procure high-ROI capital equipment and treatment devices with verified clinical efficacy and financial modeling.</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" className="border-surface-3 hover:bg-surface-2 text-white" onClick={() => setIsROICalculatorOpen(true)}>
                <Calculator className="w-4 h-4 mr-2" /> ROI Calculator
              </Button>
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
                <h3 className="font-bold text-white text-lg">Procurement Filters</h3>
              </div>
              
              <div className="space-y-8">
                <div>
                  <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Capital Range</h4>
                  <div className="space-y-3">
                    {['Under $10,000', '$10,000 - $50,000', '$50,000+'].map((label, i) => (
                      <label key={i} className="flex items-center gap-3 text-sm text-text-secondary hover:text-white cursor-pointer transition-colors">
                        <input type="checkbox" className="rounded border-surface-3 bg-surface-2 text-primary focus:ring-primary/50 w-4 h-4" />
                        {label}
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Target Payback Period</h4>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 text-sm text-text-secondary hover:text-white cursor-pointer transition-colors">
                      <input type="checkbox" className="rounded border-surface-3 bg-surface-2 text-primary focus:ring-primary/50 w-4 h-4" defaultChecked />
                      &lt; 90 Days
                    </label>
                    <label className="flex items-center gap-3 text-sm text-text-secondary hover:text-white cursor-pointer transition-colors">
                      <input type="checkbox" className="rounded border-surface-3 bg-surface-2 text-primary focus:ring-primary/50 w-4 h-4" />
                      90 - 180 Days
                    </label>
                    <label className="flex items-center gap-3 text-sm text-text-secondary hover:text-white cursor-pointer transition-colors">
                      <input type="checkbox" className="rounded border-surface-3 bg-surface-2 text-primary focus:ring-primary/50 w-4 h-4" />
                      180+ Days
                    </label>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Financing Options</h4>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 text-sm text-text-secondary hover:text-white cursor-pointer transition-colors">
                      <input type="checkbox" className="rounded border-surface-3 bg-surface-2 text-primary focus:ring-primary/50 w-4 h-4" />
                      Lease-to-Own
                    </label>
                    <label className="flex items-center gap-3 text-sm text-text-secondary hover:text-white cursor-pointer transition-colors">
                      <input type="checkbox" className="rounded border-surface-3 bg-surface-2 text-primary focus:ring-primary/50 w-4 h-4" />
                      Revenue Share
                    </label>
                  </div>
                </div>
              </div>
            </Card>

            {/* AI Procurement Advisor Hook */}
            <Card className="p-6 bg-gradient-to-br from-surface-1 to-surface-2 border-surface-3 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-[24px]" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-mono uppercase tracking-wider mb-4">
                  <Zap className="w-3 h-3" /> Procurement AI
                </div>
                <h4 className="text-white font-bold mb-2">Optimize Your CapEx</h4>
                <p className="text-sm text-text-secondary mb-4 leading-relaxed">
                  Let our AI analyze your current patient volume and treatment mix to recommend the equipment with the fastest payback period for your specific clinic.
                </p>
                <Button className="w-full bg-surface-3 hover:bg-surface-3/80 text-white text-sm">
                  Run CapEx Analysis
                </Button>
              </div>
            </Card>
          </div>

          {/* Equipment Grid & Search */}
          <div className="flex-grow space-y-6">
            <div className="relative w-full group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-500" />
              <div className="relative flex items-center bg-surface-1/80 backdrop-blur-xl border border-surface-3 rounded-xl p-1">
                <Search className="w-5 h-5 text-text-secondary ml-4" />
                <input 
                  type="text" 
                  placeholder="Search equipment, modalities, or vendors..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 bg-transparent border-none text-white placeholder-text-secondary focus:outline-none focus:ring-0 px-4"
                />
              </div>
            </div>

            {filteredEquipment.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredEquipment.map((item) => (
                  <Card key={item.id} className="p-0 bg-surface-1/80 backdrop-blur-sm border-surface-3 flex flex-col h-full overflow-hidden hover:border-primary/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.1)] transition-all duration-300 group">
                    <Link to={`/marketplace/product/${item.id}`} className="flex-grow flex flex-col">
                      <div className="h-48 bg-surface-2 relative overflow-hidden">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                        <div className="absolute top-3 left-3 bg-background/80 backdrop-blur-md border border-surface-3 px-2 py-1 rounded-md flex items-center gap-1 text-xs font-medium text-white">
                          <ShieldCheck className="w-3 h-3 text-primary" /> FDA Cleared
                        </div>
                      </div>
                      <div className="p-6 flex-grow flex flex-col">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-xs font-mono text-text-secondary uppercase tracking-wider">{item.vendor}</div>
                          <span className="text-xs font-medium bg-surface-2 text-text-secondary px-2 py-1 rounded-md border border-surface-3">
                            {item.category}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors mb-2 leading-tight">{item.name}</h3>
                        <p className="text-sm text-text-secondary mb-6 flex-grow leading-relaxed">{item.description}</p>
                        
                        <div className="flex flex-col gap-3 mt-auto pt-4 border-t border-surface-3/50">
                          <div className="flex justify-between items-center">
                            <span className="font-mono font-medium text-white text-lg">{item.price}</span>
                            <span className="flex items-center gap-1 text-sm font-medium text-success bg-success/10 px-2 py-1 rounded-md">
                              ★ {item.rating}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            <div className="flex flex-col bg-surface-2/50 p-2 rounded-lg border border-surface-3">
                              <span className="text-[10px] text-text-secondary uppercase tracking-wider mb-1 flex items-center gap-1"><Clock className="w-3 h-3" /> Payback</span>
                              <span className="text-sm font-bold text-white">{item.payback}</span>
                            </div>
                            <div className="flex flex-col bg-surface-2/50 p-2 rounded-lg border border-surface-3">
                              <span className="text-[10px] text-text-secondary uppercase tracking-wider mb-1 flex items-center gap-1"><DollarSign className="w-3 h-3" /> Rev/Patient</span>
                              <span className="text-sm font-bold text-success">{item.revenuePerPatient}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                    <div className="px-6 pb-6 pt-0">
                      <Button 
                        variant="outline" 
                        className="w-full border-surface-3 hover:bg-surface-2 text-white"
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedEquipment(item);
                          setIsROICalculatorOpen(true);
                        }}
                      >
                        <Calculator className="w-4 h-4 mr-2" /> Calculate ROI
                      </Button>
                    </div>
                  </Card>
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
                    <Server className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white mb-4">Equipment Catalog Updating</h3>
                  <p className="text-text-secondary mb-8 leading-relaxed">
                    We are currently finalizing direct-procurement partnerships with top-tier medical device manufacturers to bring you exclusive pricing and financing options.
                  </p>
                  
                  <div className="bg-surface-2/50 border border-surface-3 rounded-xl p-6 text-left mb-8">
                    <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success" /> Procurement Standards
                    </h4>
                    <ul className="space-y-2 text-sm text-text-secondary">
                      <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-primary" /> FDA Clearance Verification</li>
                      <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-primary" /> Verified Clinic ROI & Payback Models</li>
                      <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-primary" /> White-Glove Installation & Training</li>
                      <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-primary" /> Preferred Financing Terms</li>
                    </ul>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button className="bg-primary hover:bg-primary-hover text-background font-semibold">
                      Request Equipment Quote
                    </Button>
                    <Button variant="outline" className="border-surface-3 hover:bg-surface-2 text-white">
                      View Financing Options
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* ROI Calculator Modal */}
      <AnimatePresence>
        {isROICalculatorOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setIsROICalculatorOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-surface-1 border border-surface-3 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-surface-3 flex justify-between items-center bg-surface-2/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">ROI Calculator</h3>
                    <p className="text-sm text-text-secondary">{selectedEquipment.name}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsROICalculatorOpen(false)}
                  className="p-2 text-text-secondary hover:text-white hover:bg-surface-3 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-8">
                {/* Equipment Selection */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Select Equipment</label>
                  <select 
                    className="w-full bg-surface-2 border border-surface-3 rounded-lg p-3 text-white focus:outline-none focus:border-primary/50"
                    value={selectedEquipment.id}
                    onChange={(e) => setSelectedEquipment(equipment.find(eq => eq.id === e.target.value) || equipment[0])}
                  >
                    {equipment.map(eq => (
                      <option key={eq.id} value={eq.id}>{eq.name} - {eq.price}</option>
                    ))}
                  </select>
                </div>

                {/* Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Expected Patients / Week</label>
                    <div className="flex items-center gap-4">
                      <input 
                        type="range" 
                        min="1" 
                        max="50" 
                        value={patientsPerWeek}
                        onChange={(e) => setPatientsPerWeek(parseInt(e.target.value))}
                        className="flex-grow accent-primary"
                      />
                      <span className="font-mono text-lg text-white w-12 text-right">{patientsPerWeek}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Avg Revenue / Session</label>
                    <div className="p-3 bg-surface-2 border border-surface-3 rounded-lg font-mono text-white">
                      ${selectedEquipment.avgRevPerSession}
                    </div>
                  </div>
                </div>

                {/* Results */}
                <div className="bg-surface-2/50 border border-surface-3 rounded-xl p-6">
                  <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Projected Returns</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-surface-1 border border-surface-3 p-4 rounded-lg">
                      <div className="text-xs text-text-secondary mb-1">Monthly Revenue</div>
                      <div className="text-2xl font-mono font-bold text-white">${roiResults.monthlyRevenue}</div>
                    </div>
                    <div className="bg-surface-1 border border-surface-3 p-4 rounded-lg">
                      <div className="text-xs text-text-secondary mb-1">Payback Period</div>
                      <div className="text-2xl font-mono font-bold text-primary">{roiResults.paybackMonths} mo</div>
                    </div>
                    <div className="bg-surface-1 border border-surface-3 p-4 rounded-lg">
                      <div className="text-xs text-text-secondary mb-1">Annual Profit</div>
                      <div className="text-2xl font-mono font-bold text-success">${roiResults.annualProfit}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-surface-3 bg-surface-2/50 flex justify-end gap-3">
                <Button variant="outline" className="border-surface-3 hover:bg-surface-3 text-white" onClick={() => setIsROICalculatorOpen(false)}>
                  Close
                </Button>
                <Button className="bg-primary hover:bg-primary-hover text-background font-semibold">
                  Request Financing Quote
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

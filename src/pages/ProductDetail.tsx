import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { collection, doc, getDoc } from 'firebase/firestore';
import { db } from '@/src/firebase';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { 
  ArrowLeft, CheckCircle2, Shield, Activity, FileText, Download, 
  BarChart2, Star, TrendingUp, ArrowRight, ShoppingCart, 
  Info, ShieldCheck, Zap, Layers, Server, MessageSquare
} from 'lucide-react';


// Rich default data for the universal template
const defaultProductData = {
  id: '1',
  name: 'InBody 970',
  category: 'Capital Equipment & Devices',
  price: '$22,500',
  roi: '3 Months Average Payback',
  description: 'Advanced body composition analyzer providing detailed clinical insights into muscle mass, visceral fat, and cellular health. Essential for men\'s health clinics tracking TRT and peptide protocol adherence.',
  image: 'https://picsum.photos/seed/inbody970/800/600',
  gallery: [
    'https://picsum.photos/seed/inbody970/800/600',
    'https://picsum.photos/seed/inbody1/800/600',
    'https://picsum.photos/seed/inbody2/800/600'
  ],
  vendor: 'InBody USA',
  vendorId: 'inbody-usa',
  rating: 4.9,
  reviews: 128,
  features: [
    'Segmental Lean Analysis',
    'Extracellular Water Ratio',
    'Visceral Fat Area',
    'Phase Angle Measurement',
    'Cloud-based Data Management',
    'HL7/EMR Integration Ready'
  ],
  benefits: [
    'Increases patient retention through objective progress tracking',
    'Enables premium pricing for optimization protocols',
    'Reduces consultation time with automated reporting',
    'Provides clinical-grade accuracy for hormone therapy monitoring'
  ],
  specs: [
    { label: 'Dimensions', value: '20.7 x 33.6 x 46.3 in' },
    { label: 'Weight', value: '83.8 lbs' },
    { label: 'Testing Time', value: '60 Seconds' },
    { label: 'Frequencies', value: '1, 5, 50, 250, 500, 1000 kHz' },
    { label: 'Database', value: '100,000 results' }
  ],
  requirements: [
    'Clinic Approval Required',
    'Dedicated Floor Space (3x3 ft)',
    'Standard 110V Outlet',
    'Active Wi-Fi Connection'
  ],
  useCases: [
    'Baseline Health Assessments',
    'Weight Loss Program Tracking',
    'Hormone Optimization Monitoring',
    'Athletic Performance Evaluation'
  ],
  compliance: 'FDA Class II Medical Device',
  emrCompatibility: 'Native HL7/FHIR support. Pre-built integrations for Epic, Cerner, and AthenaHealth. Custom API webhooks available.',
  userReviews: [
    { id: 1, name: 'Dr. Marcus Thorne', rating: 5, text: 'The InBody 970 has completely transformed how we track patient progress on TRT. The segmental lean analysis is incredibly accurate.' },
    { id: 2, name: 'Sarah Jenkins, Clinic Director', rating: 5, text: 'Worth every penny. The ROI was realized in just 2 months by offering premium body composition scans as an add-on service.' },
    { id: 3, name: 'Dr. Alan Grant', rating: 4, text: 'Excellent machine, though the initial setup with our custom EMR took a bit of coordination with their support team.' }
  ]
};

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [activeImage, setActiveImage] = useState(0);
  const [product, setProduct] = useState<any>(defaultProductData);
  const [loading, setLoading] = useState(true);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          
          // Map specifications if available
          let specs = defaultProductData.specs;
          if (data.specifications) {
            specs = Object.entries(data.specifications).map(([label, value]) => ({ label, value: String(value) }));
          }

          setProduct({
            ...defaultProductData,
            ...data,
            id: docSnap.id,
            gallery: data.gallery || [data.imageUrl || data.image, `https://picsum.photos/seed/${docSnap.id}a/800/600`, `https://picsum.photos/seed/${docSnap.id}b/800/600`],
            roi: data.priceDisplay?.includes('/mo') ? 'Immediate ROI' : (data.category?.toLowerCase().includes('equipment') ? '3-6 Months' : null),
            benefits: data.benefits || defaultProductData.benefits,
            compliance: data.validation || data.compliance || 'Vetted Partner',
            specs: specs,
            features: data.features || defaultProductData.features,
            useCases: data.useCases || defaultProductData.useCases,
            requirements: data.requirements || defaultProductData.requirements,
            emrCompatibility: data.emrCompatibility || defaultProductData.emrCompatibility,
            userReviews: data.userReviews || defaultProductData.userReviews
          });
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-white">Loading...</div>;
  }

  // Intelligent Routing Logic
  const getRoutingLogic = () => {
    if (product.conversionType === 'approval') {
      return {
        label: 'Apply for Clinic Access',
        path: '/clinics/apply',
        icon: Shield,
        color: 'bg-cyan-500 hover:bg-cyan-400 text-black',
        description: 'Requires verified clinic credentials or physician NPI.'
      };
    }
    if (product.conversionType === 'assessment') {
      return {
        label: 'Start Patient Assessment',
        path: '/patient/assessment',
        icon: Activity,
        color: 'bg-blue-500 hover:bg-blue-400 text-white',
        description: 'Clinical assessment required for protocol matching.'
      };
    }
    if (product.conversionType === 'direct' || (product.price && product.conversionType !== 'approval')) {
       return {
        label: 'Add to Cart',
        path: '/checkout', // Placeholder checkout route
        icon: ShoppingCart,
        color: 'bg-emerald-500 hover:bg-emerald-400 text-white',
        description: 'Direct purchase available.'
      };
    }
    if (product.conversionType === 'inquiry') {
      return {
        label: 'Request Quote',
        path: '/checkout',
        icon: ArrowRight,
        color: 'bg-surface-3 hover:bg-surface-3/80 text-white',
        description: 'Contact our procurement team for details.'
      };
    }

    // Fallback logic
    const reqs = (product.requirements || []).join(' ').toLowerCase();
    const cat = (product.category || '').toLowerCase();

    if (reqs.includes('clinic approval') || reqs.includes('physician prescription') || cat.includes('equipment') || cat.includes('software') || cat.includes('clinical workflow')) {
      return {
        label: 'Apply for Clinic Access',
        path: '/clinics/apply',
        icon: Shield,
        color: 'bg-cyan-500 hover:bg-cyan-400 text-black',
        description: 'Requires verified clinic credentials or physician NPI.'
      };
    }
    if (cat.includes('supplement') || cat.includes('diagnostic') || reqs.includes('assessment') || cat.includes('peptide') || cat.includes('protocol')) {
      return {
        label: 'Start Patient Assessment',
        path: '/patient/assessment',
        icon: Activity,
        color: 'bg-blue-500 hover:bg-blue-400 text-white',
        description: 'Clinical assessment required for protocol matching.'
      };
    }
    if (product.price) {
       return {
        label: 'Add to Cart',
        path: '/checkout', // Placeholder checkout route
        icon: ShoppingCart,
        color: 'bg-emerald-500 hover:bg-emerald-400 text-white',
        description: 'Direct purchase available.'
      };
    }
    return {
      label: 'Request Quote',
      path: '/checkout',
      icon: ArrowRight,
      color: 'bg-surface-3 hover:bg-surface-3/80 text-white',
      description: 'Contact our procurement team for details.'
    };
  };

  const route = getRoutingLogic();
  const RouteIcon = route.icon;

  return (
    <div className="min-h-screen bg-background flex flex-col pb-24">
      {/* Breadcrumb & Header */}
      <section className="pt-24 pb-6 border-b border-surface-3/50 bg-surface-1/50 backdrop-blur-md sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button onClick={() => navigate(-1)} className="inline-flex items-center text-sm text-text-secondary hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Marketplace
          </button>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Left Column - Main Content */}
          <div className="w-full lg:w-2/3 space-y-12">
            
            {/* Product Hero & Gallery */}
            <div className="space-y-6">
              <div className="aspect-video md:aspect-[21/9] rounded-2xl bg-surface-2 border border-surface-3 overflow-hidden relative group">
                <img src={product.gallery[activeImage]} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" referrerPolicy="no-referrer" />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-background/80 backdrop-blur-md text-white border border-surface-3 uppercase tracking-wider">
                    {product.category}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-surface-2/80 backdrop-blur-md text-slate-400 border border-surface-3 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" /> {product.compliance}
                  </span>
                </div>
              </div>
              
              {/* Thumbnails */}
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {product.gallery.map((img: string, idx: number) => (
                  <button 
                    key={idx} 
                    onClick={() => setActiveImage(idx)}
                    className={`relative w-24 h-20 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${activeImage === idx ? 'border-cyan-400' : 'border-surface-3 opacity-60 hover:opacity-100'}`}
                  >
                    <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            </div>

            {/* Title & Vendor Info */}
            <div>
              <div className="flex items-center gap-3 text-sm text-slate-400 mb-3">
                <span className="font-mono text-white uppercase tracking-wider">{product.vendorName || product.vendor}</span>
                <span>•</span>
                <div className="flex items-center text-amber-400">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="ml-1 font-medium text-white">{product.rating}</span>
                  <span className="ml-1 text-slate-400">({(product.reviewCount || product.reviews || 0).toLocaleString()} reviews)</span>
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 leading-tight">{product.name}</h1>
              <p className="text-xl text-slate-400 leading-relaxed font-light">{product.description}</p>
            </div>

            {/* Tabs */}
            <div className="border-b border-surface-3">
              <div className="flex gap-8">
                {['overview', 'specifications', 'reviews', 'resources'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 text-sm font-medium transition-colors border-b-2 capitalize ${
                      activeTab === tab ? 'border-white text-white' : 'border-transparent text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
              {activeTab === 'overview' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                  
                  {/* Features Grid */}
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                      <Layers className="w-6 h-6 text-cyan-400" /> Core Capabilities
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {product.features.map((feature: string, i: number) => (
                        <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-surface-1/50 border border-surface-3 hover:border-surface-3/80 transition-colors">
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-400">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Benefits List */}
                  {product.benefits && product.benefits.length > 0 && (
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <TrendingUp className="w-6 h-6 text-blue-400" /> Clinical & Operational Benefits
                      </h3>
                      <div className="space-y-3">
                        {product.benefits.map((benefit: string, i: number) => (
                          <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-surface-1 to-transparent border-l-2 border-blue-500">
                            <Zap className="w-5 h-5 text-blue-400 flex-shrink-0" />
                            <span className="text-white">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* EMR Compatibility */}
                  {product.emrCompatibility && (
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <Server className="w-6 h-6 text-purple-400" /> EMR & Systems Compatibility
                      </h3>
                      <div className="p-6 rounded-xl bg-surface-1/50 border border-surface-3">
                        <p className="text-slate-400 leading-relaxed">{product.emrCompatibility}</p>
                      </div>
                    </div>
                  )}

                  {/* Use Cases */}
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                      <BarChart2 className="w-6 h-6 text-emerald-400" /> Primary Use Cases
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {product.useCases.map((useCase: string, i: number) => (
                        <span key={i} className="px-4 py-2 rounded-full bg-surface-2 border border-surface-3 text-sm text-slate-400">
                          {useCase}
                        </span>
                      ))}
                    </div>
                  </div>

                </motion.div>
              )}

              {activeTab === 'specifications' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <h3 className="text-2xl font-bold text-white mb-6">Technical Specifications</h3>
                  <div className="rounded-xl border border-surface-3 overflow-hidden bg-surface-1/50">
                    <table className="w-full text-left border-collapse">
                      <tbody className="text-sm">
                        {product.specs.map((spec: any, i: number) => (
                          <tr key={i} className="border-b border-surface-3 last:border-0 hover:bg-surface-2/50 transition-colors">
                            <td className="py-4 px-6 font-mono text-slate-400 w-1/3 border-r border-surface-3/50">{spec.label}</td>
                            <td className="py-4 px-6 text-white">{spec.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {activeTab === 'reviews' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                      <MessageSquare className="w-6 h-6 text-cyan-400" /> User Reviews
                    </h3>
                    <div className="flex items-center gap-2">
                      <Star className="w-6 h-6 text-amber-400 fill-current" />
                      <span className="text-2xl font-bold text-white">{product.rating}</span>
                      <span className="text-slate-400">({product.reviews} reviews)</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {product.userReviews?.map((review: any) => (
                      <Card key={review.id} className="p-6 bg-surface-1/50 border-surface-3">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-bold text-white">{review.name}</h4>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-4 h-4 ${i < review.rating ? 'text-amber-400 fill-current' : 'text-surface-3'}`} 
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-slate-400 leading-relaxed">"{review.text}"</p>
                      </Card>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'resources' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <h3 className="text-2xl font-bold text-white mb-6">Documentation & Clinical Validation</h3>
                  <div className="space-y-4">
                    {[
                      { title: 'Clinical Validation & Efficacy Study', type: 'PDF', size: '2.4 MB' },
                      { title: 'Implementation & Operator Manual', type: 'PDF', size: '5.1 MB' },
                      { title: 'API & EMR Integration Guide', type: 'PDF', size: '1.2 MB' },
                    ].map((doc, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-surface-1/50 border border-surface-3 hover:border-cyan-500/50 transition-colors cursor-pointer group">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-surface-2 flex items-center justify-center text-slate-400 group-hover:text-cyan-400 transition-colors">
                            <FileText className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="font-medium text-white group-hover:text-cyan-400 transition-colors">{doc.title}</p>
                            <p className="text-xs text-slate-400 font-mono mt-1">{doc.type} • {doc.size}</p>
                          </div>
                        </div>
                        <Download className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Right Column - Sticky Sidebar */}
          <div className="w-full lg:w-1/3">
            <div className="sticky top-32 space-y-6">
              
              {/* Action Panel */}
              <Card className="p-6 bg-surface-1/80 backdrop-blur-xl border-surface-3 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-[32px]" />
                <div className="relative z-10">
                  <div className="mb-6">
                    <p className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Procurement Pricing</p>
                    <div className="flex items-end gap-2">
                      <span className="text-4xl font-display font-bold text-white">{product.priceDisplay || product.price}</span>
                    </div>
                  </div>

                  {product.roi && (
                    <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Estimated ROI</span>
                      </div>
                      <p className="text-lg font-medium text-white">{product.roi}</p>
                    </div>
                  )}

                  <div className="space-y-4 mb-6">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-surface-2/50 border border-surface-3">
                      <Info className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-white">Eligibility & Routing</p>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">{route.description}</p>
                      </div>
                    </div>
                  </div>

                  <Button 
                    size="lg" 
                    className={`w-full group ${route.color} border-none shadow-lg`} 
                    onClick={() => navigate(route.path, { state: { product } })}
                  >
                    <RouteIcon className="w-5 h-5 mr-2" />
                    {route.label}
                    <ArrowRight className="ml-auto w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </Card>

              {/* Requirements Card */}
              <Card className="p-6 bg-surface-1/50 border-surface-3">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-slate-400" /> Deployment Requirements
                </h3>
                <ul className="space-y-3">
                  {product.requirements.map((req: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-surface-3 flex-shrink-0 mt-1.5" />
                      {req}
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Vendor Card */}
              <Card className="p-6 bg-surface-1/50 border-surface-3">
                <h3 className="font-bold text-white mb-4">Vendor Intelligence</h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-surface-2 border border-surface-3 flex items-center justify-center">
                    <span className="font-display font-bold text-white text-lg">{(product.vendorName || product.vendor || 'V').charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-medium text-white">{product.vendorName || product.vendor}</p>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Verified Platform Partner
                    </p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full text-sm border-surface-3 hover:bg-surface-2 text-white"
                  onClick={() => navigate(`/vendor/${product.vendorId || 'inbody-usa'}`)}
                >
                  View Vendor Profile
                </Button>
              </Card>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}


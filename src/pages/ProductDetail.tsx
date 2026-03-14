import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { ArrowLeft, CheckCircle2, Shield, Activity, FileText, Download, BarChart2, Star, Clock, TrendingUp, ArrowRight } from 'lucide-react';

// Mock data for a single product
const productData = {
  id: '1',
  name: 'InBody 770',
  category: 'equipment',
  price: '$18,500',
  roi: '3 months',
  description: 'Advanced body composition analyzer providing detailed insights into muscle mass, body fat, and water retention.',
  image: 'https://picsum.photos/seed/inbody770/800/600',
  vendor: 'InBody USA',
  rating: 4.9,
  reviews: 128,
  features: [
    'Segmental Lean Analysis',
    'Extracellular Water Ratio',
    'Visceral Fat Area',
    'Phase Angle Measurement',
    'Cloud-based Data Management'
  ],
  specs: [
    { label: 'Dimensions', value: '20.7 x 33.6 x 46.3 in' },
    { label: 'Weight', value: '83.8 lbs' },
    { label: 'Testing Time', value: '60 Seconds' },
    { label: 'Frequencies', value: '1, 5, 50, 250, 500, 1000 kHz' }
  ],
  requirements: [
    'Clinic Approval Required',
    'Dedicated Floor Space',
    'Standard 110V Outlet'
  ],
  useCases: [
    'Baseline Health Assessments',
    'Weight Loss Program Tracking',
    'Hormone Optimization Monitoring',
    'Athletic Performance Evaluation'
  ]
};

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Simulate gating logic
  const requiresClinicApproval = productData.requirements.includes('Clinic Approval Required');
  const requiresAssessment = productData.category === 'supplements' || productData.category === 'diagnostics';

  const handleAction = () => {
    if (requiresClinicApproval) {
      navigate('/clinics/apply');
    } else if (requiresAssessment) {
      navigate('/patient/assessment');
    } else {
      navigate('/contact');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <section className="pt-24 pb-12 border-b border-surface-3 bg-surface-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to={`/marketplace/${productData.category}`} className="inline-flex items-center text-sm text-text-secondary hover:text-primary transition-colors mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to {productData.category}
          </Link>
          
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Product Image */}
            <div className="w-full lg:w-1/2">
              <div className="aspect-4/3 rounded-2xl bg-surface-2 border border-surface-3 overflow-hidden relative">
                <img src={productData.image} alt={productData.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-background/80 backdrop-blur-md text-text-primary border border-surface-3 uppercase tracking-wider">
                    {productData.category}
                  </span>
                  {requiresClinicApproval && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-warning/20 backdrop-blur-md text-warning border border-warning/30 flex items-center gap-1">
                      <Shield className="w-3 h-3" /> Clinic Only
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="w-full lg:w-1/2 flex flex-col">
              <div className="mb-6">
                <div className="flex items-center gap-2 text-sm text-text-secondary mb-2">
                  <span className="font-medium text-text-primary">{productData.vendor}</span>
                  <span>•</span>
                  <div className="flex items-center text-warning">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="ml-1 font-medium text-text-primary">{productData.rating}</span>
                    <span className="ml-1 text-text-secondary">({productData.reviews})</span>
                  </div>
                </div>
                <h1 className="text-4xl font-display font-bold text-text-primary mb-4">{productData.name}</h1>
                <p className="text-xl text-text-secondary leading-relaxed">{productData.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 rounded-xl bg-surface-2 border border-surface-3">
                  <p className="text-sm text-text-secondary mb-1">Estimated ROI</p>
                  <p className="text-2xl font-display font-bold text-success flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" /> {productData.roi}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-surface-2 border border-surface-3">
                  <p className="text-sm text-text-secondary mb-1">Pricing</p>
                  <p className="text-2xl font-display font-bold text-text-primary font-mono">{productData.price}</p>
                </div>
              </div>

              <div className="mt-auto space-y-4">
                <Button size="lg" className="w-full group" onClick={handleAction}>
                  {requiresClinicApproval ? 'Apply for Clinic Access' : requiresAssessment ? 'Start Patient Assessment' : 'Request Quote'}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <div className="flex items-center justify-center gap-4 text-sm text-text-secondary">
                  <span className="flex items-center gap-1"><Shield className="w-4 h-4" /> Vetted Vendor</span>
                  <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Quality Assured</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Details Section */}
      <section className="py-12 flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8 border-b border-surface-3 mb-8">
            {['overview', 'specifications', 'resources'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-sm font-medium transition-colors border-b-2 capitalize ${
                  activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              {activeTab === 'overview' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
                  <div>
                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                      <Activity className="w-6 h-6 text-primary" /> Key Features
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {productData.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-surface-1 border border-surface-3">
                          <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                          <span className="text-text-primary">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                      <BarChart2 className="w-6 h-6 text-secondary" /> Clinical Use Cases
                    </h3>
                    <ul className="space-y-3">
                      {productData.useCases.map((useCase, i) => (
                        <li key={i} className="flex items-center gap-3 text-text-secondary">
                          <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                          {useCase}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}

              {activeTab === 'specifications' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h3 className="text-2xl font-bold mb-6">Technical Specifications</h3>
                  <div className="rounded-xl border border-surface-3 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <tbody className="text-sm">
                        {productData.specs.map((spec, i) => (
                          <tr key={i} className="border-b border-surface-3 last:border-0">
                            <td className="py-4 px-6 bg-surface-1 font-medium text-text-secondary w-1/3">{spec.label}</td>
                            <td className="py-4 px-6 bg-surface-2 text-text-primary">{spec.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {activeTab === 'resources' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h3 className="text-2xl font-bold mb-6">Documentation & Resources</h3>
                  <div className="space-y-4">
                    {[
                      { title: 'Clinical Validation Study', type: 'PDF', size: '2.4 MB' },
                      { title: 'Operator Manual', type: 'PDF', size: '5.1 MB' },
                      { title: 'Integration Guide', type: 'PDF', size: '1.2 MB' },
                    ].map((doc, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-surface-1 border border-surface-3 hover:border-primary/50 transition-colors cursor-pointer group">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-surface-2 flex items-center justify-center text-text-secondary group-hover:text-primary transition-colors">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-medium text-text-primary group-hover:text-primary transition-colors">{doc.title}</p>
                            <p className="text-xs text-text-secondary font-mono">{doc.type} • {doc.size}</p>
                          </div>
                        </div>
                        <Download className="w-5 h-5 text-text-secondary group-hover:text-primary transition-colors" />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="p-6 bg-surface-1 border-surface-3">
                <h3 className="font-bold text-text-primary mb-4">Requirements</h3>
                <ul className="space-y-3">
                  {productData.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                      <div className="w-5 h-5 rounded bg-surface-2 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Shield className="w-3 h-3 text-warning" />
                      </div>
                      {req}
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="p-6 bg-surface-1 border-surface-3">
                <h3 className="font-bold text-text-primary mb-4">Vendor Information</h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-surface-2 border border-surface-3 flex items-center justify-center">
                    <span className="font-bold text-text-secondary">{productData.vendor.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-medium text-text-primary">{productData.vendor}</p>
                    <p className="text-xs text-text-secondary flex items-center gap-1 mt-1">
                      <CheckCircle2 className="w-3 h-3 text-success" /> Verified Partner
                    </p>
                  </div>
                </div>
                <Button variant="outline" className="w-full text-sm">View Vendor Profile</Button>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

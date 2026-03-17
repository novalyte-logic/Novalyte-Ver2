import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Building2, Globe, Mail, Star, MapPin, ShieldCheck, 
  ArrowLeft, ExternalLink, Package, Activity, Users
} from 'lucide-react';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';

// Mock data for vendors
const VENDOR_DATA: Record<string, any> = {
  'inbody-usa': {
    id: 'inbody-usa',
    name: 'InBody USA',
    description: 'InBody is the global leader in body composition analysis. By utilizing multiple frequencies and safe, low-level currents, InBody devices provide highly accurate, comprehensive insights into muscle mass, visceral fat, and cellular health without empirical estimations.',
    rating: 4.9,
    reviewCount: 342,
    email: 'partnerships@inbody.com',
    website: 'https://inbodyusa.com',
    location: 'Cerritos, CA',
    founded: '1996',
    verified: true,
    categories: ['Capital Equipment', 'Diagnostics'],
    products: [
      { id: '1', name: 'InBody 970', category: 'Body Composition', price: '$22,500' },
      { id: '2', name: 'InBody 770', category: 'Body Composition', price: '$17,500' },
      { id: '3', name: 'InBody 570', category: 'Body Composition', price: '$9,500' }
    ]
  }
};

export function VendorProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Simulate API fetch
    setTimeout(() => {
      const data = VENDOR_DATA[id || 'inbody-usa'] || {
        id: id,
        name: 'Partner Vendor',
        description: 'A verified partner in the Novalyte ecosystem providing clinical-grade solutions for men\'s health operators.',
        rating: 4.5,
        reviewCount: 12,
        email: 'contact@vendor.com',
        website: 'https://vendor.com',
        location: 'United States',
        verified: true,
        categories: ['Marketplace Partner'],
        products: []
      };
      setVendor(data);
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-white">Loading...</div>;
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
          
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-start gap-6 mb-6">
                <div className="w-24 h-24 rounded-2xl bg-surface-2 border border-surface-3 flex items-center justify-center shrink-0">
                  <span className="font-display font-bold text-white text-4xl">{vendor.name.charAt(0)}</span>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-4xl font-display font-bold text-white">{vendor.name}</h1>
                    {vendor.verified && (
                      <span className="px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                        <ShieldCheck className="w-3 h-3" /> Verified
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" /> {vendor.location}
                    </span>
                    <span className="flex items-center gap-1 text-amber-400">
                      <Star className="w-4 h-4 fill-current" /> {vendor.rating} ({vendor.reviewCount} reviews)
                    </span>
                  </div>
                </div>
              </div>

              <div className="prose prose-invert max-w-none">
                <h3 className="text-xl font-bold text-white mb-4">About {vendor.name}</h3>
                <p className="text-slate-400 leading-relaxed text-lg">{vendor.description}</p>
              </div>
            </motion.div>

            {/* Products Section */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Package className="w-6 h-6 text-cyan-400" /> Products & Solutions
              </h3>
              {vendor.products && vendor.products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {vendor.products.map((product: any) => (
                    <Card key={product.id} className="p-5 bg-surface-1/50 border-surface-3 hover:border-cyan-500/50 transition-colors cursor-pointer" onClick={() => navigate(`/marketplace/product/${product.id}`)}>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-white">{product.name}</h4>
                        <span className="text-sm font-medium text-emerald-400">{product.price}</span>
                      </div>
                      <p className="text-sm text-slate-400">{product.category}</p>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="p-8 rounded-xl border border-surface-3 border-dashed text-center text-slate-400">
                  No products listed currently.
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Column - Contact & Details */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-6">
              <Card className="p-6 bg-surface-1/80 backdrop-blur-xl border-surface-3">
                <h3 className="font-bold text-white mb-6">Vendor Details</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-surface-2 flex items-center justify-center text-slate-400">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-0.5">Website</p>
                      <a href={vendor.website} target="_blank" rel="noopener noreferrer" className="text-white hover:text-cyan-400 transition-colors flex items-center gap-1">
                        {vendor.website.replace(/^https?:\/\//, '')} <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-surface-2 flex items-center justify-center text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-0.5">Contact Email</p>
                      <a href={`mailto:${vendor.email}`} className="text-white hover:text-cyan-400 transition-colors">
                        {vendor.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-surface-2 flex items-center justify-center text-slate-400">
                      <Star className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-0.5">Vendor Rating</p>
                      <p className="text-white font-medium flex items-center gap-1">
                        {vendor.rating} / 5.0 <span className="text-slate-400 font-normal">({vendor.reviewCount} reviews)</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-surface-3">
                  <Button className="w-full bg-white text-black hover:bg-gray-200 font-bold" onClick={() => window.location.href = `mailto:${vendor.email}`}>
                    Contact Vendor
                  </Button>
                </div>
              </Card>

              <Card className="p-6 bg-surface-1/50 border-surface-3">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-slate-400" /> Categories
                </h3>
                <div className="flex flex-wrap gap-2">
                  {vendor.categories.map((cat: string, i: number) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-surface-2 border border-surface-3 text-xs text-slate-400">
                      {cat}
                    </span>
                  ))}
                </div>
              </Card>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

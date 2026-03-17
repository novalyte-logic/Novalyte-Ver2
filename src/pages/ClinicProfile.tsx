import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useParams } from 'react-router-dom';
import { 
  MapPin, Star, Activity, CheckCircle2, Shield, ArrowRight, 
  Clock, Phone, Globe, Sparkles, Microscope, TrendingUp, 
  Users, Award, Calendar, MessageSquare, ChevronRight, FileText
} from 'lucide-react';
import { collection, doc, getDoc } from 'firebase/firestore';
import { db } from '@/src/firebase';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';

// Mock data for the premium profile
const CLINIC_DATA = {
  id: "apex",
  name: "Apex Longevity Institute",
  location: "Miami, FL",
  rating: 4.9,
  reviews: 128,
  matchScore: 98,
  heroImage: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=2000",
  gallery: [
    "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1551076805-e18690c5e561?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&q=80&w=800"
  ],
  description: "Apex Longevity Institute represents the pinnacle of proactive men's healthcare. Moving beyond traditional reactive medicine, our board-certified endocrinologists and performance specialists utilize military-grade diagnostics and data-driven protocols to help men achieve peak physical, metabolic, and cognitive performance. Every protocol is highly individualized, continuously monitored, and rigorously optimized.",
  specialties: ["Hormone Optimization", "Peptide Therapy", "Longevity Protocols", "Weight Management", "Cognitive Enhancement"],
  providers: [
    { 
      name: "Dr. Marcus Thorne", 
      role: "Chief Medical Officer", 
      credentials: "MD, FAARM", 
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400", 
      bio: "Former Special Operations physician specializing in human performance and endocrine optimization. Dr. Thorne brings 15 years of experience in advanced metabolic therapies." 
    },
    { 
      name: "Dr. Sarah Jenkins", 
      role: "Head of Endocrinology", 
      credentials: "MD, PhD", 
      image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=400", 
      bio: "Leading researcher in peptide therapeutics and metabolic longevity. Dr. Jenkins oversees all complex hormone balancing and neuro-regenerative protocols." 
    }
  ],
  protocols: [
    { 
      name: "Comprehensive TRT", 
      description: "Bio-identical testosterone replacement with continuous metabolic monitoring, estrogen management, and fertility preservation options.", 
      duration: "Ongoing", 
      price: "From $199/mo" 
    },
    { 
      name: "Cognitive Peptides", 
      description: "Advanced neuro-regenerative peptide stacks (Dihexa, Semax, Cerebrolysin) designed for executive function, focus, and memory enhancement.", 
      duration: "12 Weeks", 
      price: "From $349/mo" 
    },
    { 
      name: "Metabolic Reset", 
      description: "GLP-1 and Tirzepatide protocols combined with continuous glucose monitoring (CGM) and lean mass preservation coaching.", 
      duration: "6 Months", 
      price: "From $299/mo" 
    }
  ],
  outcomes: [
    { metric: "+142%", label: "Average Free T Increase", timeframe: "90 Days" },
    { metric: "-14 lbs", label: "Average Fat Mass Loss", timeframe: "12 Weeks" },
    { metric: "94%", label: "Patient Retention Rate", timeframe: "Year 1" }
  ],
  features: ["Telehealth Available", "In-house Labs", "Concierge Service", "Novalyte Certified", "Direct Doctor Messaging", "Quarterly Blood Panels"],
  hours: "Mon-Fri: 8am - 6pm",
  address: "1200 Brickell Ave, Suite 400, Miami, FL 33131",
  phone: "(305) 555-0123",
  website: "apexlongevity.com",
  price: "$$$"
};

const SIMILAR_CLINICS = [
  { id: "vitality", name: "Vitality Men's Clinic", location: "Austin, TX", rating: 4.8, matchScore: 92, image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=400", tags: ["TRT", "Weight Loss"] },
  { id: "neurohealth", name: "NeuroHealth Partners", location: "New York, NY", rating: 5.0, matchScore: 85, image: "https://images.unsplash.com/photo-1551076805-e18690c5e561?auto=format&fit=crop&q=80&w=400", tags: ["Cognitive", "Longevity"] }
];

export function ClinicProfile() {
  const { id } = useParams();
  const [isBooking, setIsBooking] = useState(false);
  const [clinicData, setClinicData] = useState<any>(CLINIC_DATA);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchClinic = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'clinics', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setClinicData({
            ...CLINIC_DATA, // fallback to mock data for missing fields
            id: docSnap.id,
            name: data.name || CLINIC_DATA.name,
            location: data.city && data.state ? `${data.city}, ${data.state}` : CLINIC_DATA.location,
            rating: data.rating || CLINIC_DATA.rating,
            reviews: data.reviewCount || CLINIC_DATA.reviews,
            description: data.description || CLINIC_DATA.description,
            specialties: data.tags || CLINIC_DATA.specialties,
            heroImage: data.image || CLINIC_DATA.heroImage,
            address: data.address || CLINIC_DATA.address,
            phone: data.phone || CLINIC_DATA.phone,
            website: data.website || CLINIC_DATA.website,
            pricingTier: data.pricingTier || CLINIC_DATA.price,
          });
        }
      } catch (error) {
        console.error("Error fetching clinic:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchClinic();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen bg-[#05070A] flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#05070A] font-sans text-text-primary pb-24">
      
      {/* Editorial Hero Section */}
      <div className="relative h-[60vh] min-h-[500px] w-full">
        <img 
          src={clinicData.heroImage} 
          alt={clinicData.name} 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05070A] via-[#05070A]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#05070A]/80 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="px-3 py-1 rounded-full bg-success/20 border border-success/30 flex items-center gap-1.5 backdrop-blur-md">
                  <Shield className="w-3.5 h-3.5 text-success" />
                  <span className="text-xs font-bold text-success tracking-wide uppercase">Novalyte Verified</span>
                </div>
                <div className="px-3 py-1 rounded-full bg-primary/20 border border-primary/30 flex items-center gap-1.5 backdrop-blur-md">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xs font-bold text-white tracking-wide uppercase">{clinicData.matchScore}% AI Match</span>
                </div>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-4 tracking-tight leading-tight">
                {clinicData.name}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-text-secondary text-lg">
                <span className="flex items-center gap-2"><MapPin className="w-5 h-5 text-primary" /> {clinicData.location}</span>
                <span className="flex items-center gap-2 text-warning"><Star className="w-5 h-5 fill-current" /> {clinicData.rating} ({clinicData.reviews} Reviews)</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Column: Editorial Content */}
          <div className="lg:col-span-2 space-y-16">
            
            {/* About Section */}
            <section>
              <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-2">
                <Activity className="w-6 h-6 text-primary" /> Clinical Philosophy
              </h2>
              <p className="text-text-secondary text-lg leading-relaxed mb-8">
                {clinicData.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {clinicData.specialties.map((spec: string, i: number) => (
                  <span key={i} className="px-4 py-2 rounded-lg bg-[#0B0F14] border border-surface-3 text-sm font-medium text-white">
                    {spec}
                  </span>
                ))}
              </div>
            </section>

            {/* AI Insights & Proof Signals */}
            <section>
              <Card className="p-8 bg-gradient-to-br from-[#0B0F14] to-[#05070A] border-primary/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="text-2xl font-display font-bold text-white">Why You Matched</h2>
                  </div>
                  
                  <p className="text-text-secondary text-lg mb-8">
                    Based on your assessment, <strong className="text-white">Apex Longevity Institute</strong> is a 98% match for your specific biological goals. Their protocols directly address your reported symptoms of fatigue and brain fog.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {clinicData.outcomes.map((outcome: any, i: number) => (
                      <div key={i} className="p-4 rounded-xl bg-[#05070A] border border-surface-3 text-center">
                        <div className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-1">
                          {outcome.metric}
                        </div>
                        <div className="text-sm font-bold text-white mb-1">{outcome.label}</div>
                        <div className="text-xs text-text-secondary uppercase tracking-wider">{outcome.timeframe}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </section>

            {/* Protocols */}
            <section>
              <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-2">
                <Microscope className="w-6 h-6 text-primary" /> Core Protocols
              </h2>
              <div className="space-y-4">
                {clinicData.protocols.map((protocol: any, i: number) => (
                  <Card key={i} className="p-6 bg-[#0B0F14] border-surface-3 hover:border-primary/30 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <h3 className="text-xl font-bold text-white">{protocol.name}</h3>
                      <div className="flex items-center gap-3 text-sm font-medium">
                        <span className="px-3 py-1 rounded bg-surface-2 text-text-secondary">{protocol.duration}</span>
                        <span className="px-3 py-1 rounded bg-primary/10 text-primary border border-primary/20">{protocol.price}</span>
                      </div>
                    </div>
                    <p className="text-text-secondary leading-relaxed">
                      {protocol.description}
                    </p>
                  </Card>
                ))}
              </div>
            </section>

            {/* Medical Team */}
            <section>
              <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-2">
                <Users className="w-6 h-6 text-primary" /> Medical Team
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {clinicData.providers.map((provider: any, i: number) => (
                  <Card key={i} className="p-6 bg-[#0B0F14] border-surface-3">
                    <div className="flex items-center gap-4 mb-4">
                      <img src={provider.image} alt={provider.name} className="w-16 h-16 rounded-full object-cover border-2 border-surface-3" />
                      <div>
                        <h3 className="font-bold text-white text-lg">{provider.name}</h3>
                        <p className="text-primary text-sm font-medium">{provider.credentials}</p>
                        <p className="text-text-secondary text-sm">{provider.role}</p>
                      </div>
                    </div>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      {provider.bio}
                    </p>
                  </Card>
                ))}
              </div>
            </section>

            {/* Gallery */}
            <section>
              <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-2">
                <Award className="w-6 h-6 text-primary" /> Facility & Experience
              </h2>
              <div className="grid grid-cols-3 gap-4">
                {clinicData.gallery.map((img: string, i: number) => (
                  <div key={i} className={`rounded-xl overflow-hidden border border-surface-3 ${i === 0 ? 'col-span-3 h-64' : 'col-span-1 h-32 md:h-48'}`}>
                    <img src={img} alt="Clinic Facility" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* Right Column: Sticky Booking & Info */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              
              {/* Booking Handoff Card */}
              <Card className="p-6 bg-[#0B0F14] border-primary/30 shadow-[0_0_40px_rgba(6,182,212,0.1)]">
                <h3 className="text-2xl font-display font-bold text-white mb-2">Ready to Optimize?</h3>
                <p className="text-text-secondary text-sm mb-6">
                  Novalyte requires a standardized clinical assessment before matching you with a provider.
                </p>
                
                {!isBooking ? (
                  <div className="space-y-6">
                    <div className="space-y-4 relative before:absolute before:inset-0 before:ml-3.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary before:via-surface-3 before:to-transparent">
                      <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-7 h-7 rounded-full border-2 border-primary bg-[#05070A] text-primary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                          <FileText className="w-3 h-3" />
                        </div>
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-3 rounded-lg bg-surface-2 border border-surface-3">
                          <h4 className="font-bold text-white text-sm">1. Clinical Triage</h4>
                        </div>
                      </div>
                      <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                        <div className="flex items-center justify-center w-7 h-7 rounded-full border-2 border-surface-3 bg-[#05070A] text-text-secondary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                          <Microscope className="w-3 h-3" />
                        </div>
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-3 rounded-lg bg-surface-1 border border-surface-2 opacity-50">
                          <h4 className="font-bold text-white text-sm">2. Lab Review</h4>
                        </div>
                      </div>
                      <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                        <div className="flex items-center justify-center w-7 h-7 rounded-full border-2 border-surface-3 bg-[#05070A] text-text-secondary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                          <Calendar className="w-3 h-3" />
                        </div>
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-3 rounded-lg bg-surface-1 border border-surface-2 opacity-50">
                          <h4 className="font-bold text-white text-sm">3. Doctor Consult</h4>
                        </div>
                      </div>
                    </div>

                    <Button 
                      className="w-full h-14 text-lg font-bold bg-white text-black hover:bg-gray-200" 
                      onClick={() => setIsBooking(true)}
                    >
                      Start Assessment
                    </Button>
                    <Link to="/contact">
                      <Button variant="outline" className="w-full gap-2">
                        <MessageSquare className="w-4 h-4" /> Message Clinic
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-4"
                  >
                    <div className="p-6 rounded-xl bg-success/10 border border-success/20 text-center">
                      <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-3" />
                      <h4 className="font-bold text-white text-lg">Routing to Assessment</h4>
                      <p className="text-sm text-text-secondary mt-2">
                        You are being securely redirected to the Novalyte Patient Intake protocol.
                      </p>
                    </div>
                    <Link to="/patient/assessment" className="block">
                      <Button className="w-full bg-primary text-black hover:bg-primary-hover font-bold">
                        Continue to Intake <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </motion.div>
                )}
              </Card>

              {/* Clinic Info Card */}
              <Card className="p-6 bg-[#0B0F14] border-surface-3">
                <h3 className="font-bold text-white mb-4">Clinic Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 text-text-secondary text-sm">
                    <MapPin className="w-5 h-5 text-primary shrink-0" />
                    <div>
                      <p className="text-white font-medium mb-1">Location</p>
                      <p>{clinicData.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-text-secondary text-sm">
                    <Clock className="w-5 h-5 text-primary shrink-0" />
                    <div>
                      <p className="text-white font-medium mb-1">Hours</p>
                      <p>{clinicData.hours}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-text-secondary text-sm">
                    <Globe className="w-5 h-5 text-primary shrink-0" />
                    <div>
                      <p className="text-white font-medium mb-1">Website</p>
                      <p className="hover:text-primary cursor-pointer transition-colors">apexlongevity.com</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-surface-3">
                  <h4 className="font-bold text-white text-sm mb-3">Amenities & Features</h4>
                  <ul className="space-y-2">
                    {clinicData.features.map((feature: string, i: number) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-text-secondary">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>

            </div>
          </div>

        </div>
      </div>

      {/* Similar Clinics Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 pt-12 border-t border-surface-3">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-display font-bold text-white">Similar Elite Clinics</h2>
          <Link to="/directory" className="text-primary hover:text-primary-hover text-sm font-bold flex items-center gap-1">
            View Directory <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SIMILAR_CLINICS.map((clinic, i) => (
            <Link key={i} to={`/clinics/${clinic.id}`}>
              <Card className="overflow-hidden bg-[#0B0F14] border-surface-3 hover:border-primary/30 transition-all group cursor-pointer h-full flex flex-col">
                <div className="h-40 relative overflow-hidden">
                  <img src={clinic.image} alt={clinic.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F14] to-transparent" />
                  <div className="absolute top-3 left-3 px-2 py-1 rounded bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-primary" />
                    <span className="text-white font-bold text-xs">{clinic.matchScore}% Match</span>
                  </div>
                </div>
                <div className="p-5 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-white text-lg mb-1 group-hover:text-primary transition-colors">{clinic.name}</h3>
                    <div className="flex items-center gap-3 text-text-secondary text-sm mb-4">
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {clinic.location}</span>
                      <span className="flex items-center gap-1 text-warning"><Star className="w-3.5 h-3.5 fill-current" /> {clinic.rating}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {clinic.tags.map((tag, j) => (
                      <span key={j} className="px-2 py-1 rounded bg-surface-2 border border-surface-3 text-xs text-text-secondary">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}

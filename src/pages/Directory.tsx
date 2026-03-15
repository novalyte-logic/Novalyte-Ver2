import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { Button } from '@/src/components/ui/Button';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '@/src/firebase';
import { Card } from '@/src/components/ui/Card';
import { 
  MapPin, 
  Star, 
  Activity, 
  Search, 
  ArrowRight, 
  MessageSquare, 
  Calendar, 
  Map as MapIcon, 
  List, 
  Sparkles, 
  SlidersHorizontal,
  CheckCircle2,
  X,
  Scale
} from 'lucide-react';

const MOCK_CLINICS = [
  { 
    id: "apex", 
    name: "Apex Longevity Institute", 
    location: "Miami, FL", 
    rating: 4.9, 
    matchScore: 98,
    tags: ["Hormone Optimization", "Peptides", "Longevity"],
    symptoms: ["Fatigue", "Low Libido", "Brain Fog"],
    waitlist: "2 days",
    price: "$$$",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800"
  },
  { 
    id: "vitality", 
    name: "Vitality Men's Clinic", 
    location: "Austin, TX", 
    rating: 4.8, 
    matchScore: 92,
    tags: ["Weight Management", "TRT", "Hair Loss"],
    symptoms: ["Weight Gain", "Low Energy", "Hair Thinning"],
    waitlist: "1 week",
    price: "$$",
    image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=800"
  },
  { 
    id: "neurohealth", 
    name: "NeuroHealth Partners", 
    location: "New York, NY", 
    rating: 5.0, 
    matchScore: 85,
    tags: ["Cognitive Health", "Longevity", "Biohacking"],
    symptoms: ["Brain Fog", "Poor Sleep", "Stress"],
    waitlist: "No wait",
    price: "$$$$",
    image: "https://images.unsplash.com/photo-1551076805-e18690c5e561?auto=format&fit=crop&q=80&w=800"
  },
  { 
    id: "titan", 
    name: "Titan Performance", 
    location: "Los Angeles, CA", 
    rating: 4.7, 
    matchScore: 78,
    tags: ["TRT", "Sports Medicine", "Recovery"],
    symptoms: ["Muscle Loss", "Joint Pain", "Fatigue"],
    waitlist: "3 days",
    price: "$$",
    image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&q=80&w=800"
  },
];

const SYMPTOMS = ["Fatigue", "Brain Fog", "Low Libido", "Weight Gain", "Poor Sleep", "Muscle Loss", "Joint Pain"];
const TREATMENTS = ["TRT", "Peptides", "Longevity", "Weight Management", "Cognitive Health", "Hair Loss"];

export function Directory() {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [selectedTreatments, setSelectedTreatments] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [isAiMatching, setIsAiMatching] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [clinics, setClinics] = useState<any[]>([]);

  React.useEffect(() => {
    const q = query(collection(db, 'clinics'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const clinicsData = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || 'Unknown Clinic',
          location: data.city && data.state ? `${data.city}, ${data.state}` : 'Unknown Location',
          rating: data.rating || 4.5,
          matchScore: 85,
          tags: data.tags || ['General'],
          symptoms: data.symptoms || [],
          waitlist: data.waitlist || 'Contact for availability',
          price: data.pricingTier || '$$',
          image: data.image || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800'
        };
      });
      
      if (clinicsData.length > 0) {
        setClinics(clinicsData);
      } else {
        setClinics(MOCK_CLINICS);
      }
    });

    return () => unsubscribe();
  }, []);

  const toggleSelection = (item: string, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const toggleCompare = (id: string) => {
    if (compareList.includes(id)) {
      setCompareList(compareList.filter(i => i !== id));
    } else if (compareList.length < 3) {
      setCompareList([...compareList, id]);
    }
  };

  const handleAiMatch = () => {
    setIsAiMatching(true);
    setTimeout(() => {
      setIsAiMatching(false);
    }, 1500);
  };

  const filteredClinics = clinics.filter(clinic => {
    const matchesSearch = clinic.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          clinic.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSymptoms = selectedSymptoms.length === 0 || selectedSymptoms.some(s => clinic.symptoms.includes(s));
    const matchesTreatments = selectedTreatments.length === 0 || selectedTreatments.some(t => clinic.tags.includes(t));
    return matchesSearch && matchesSymptoms && matchesTreatments;
  }).sort((a, b) => b.matchScore - a.matchScore);

  return (
    <div className="min-h-screen bg-[#05070A] flex flex-col font-sans text-text-primary">
      {/* Premium Header */}
      <section className="pt-32 pb-16 border-b border-surface-3 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-[#05070A] to-[#05070A]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-3 mb-6 justify-center">
            <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-widest uppercase flex items-center gap-2">
              <Sparkles className="w-3 h-3" />
              AI Clinical Matchmaker
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 text-center text-white tracking-tight">
            Find Your Ideal <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Clinic</span>
          </h1>
          <p className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto text-center mb-12">
            Don't just search. Let our intelligence engine match your specific symptoms, goals, and biology to the perfect medical team.
          </p>
          
          {/* Search & Match Bar */}
          <div className="max-w-4xl mx-auto bg-[#0B0F14]/80 backdrop-blur-xl border border-surface-3 p-2 rounded-2xl flex flex-col md:flex-row gap-2 shadow-2xl">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by clinic name, location, or specialty..." 
                className="w-full h-14 pl-12 pr-4 bg-transparent text-white focus:outline-none placeholder:text-text-secondary/50"
              />
            </div>
            <div className="hidden md:block w-px h-8 bg-surface-3 self-center mx-2" />
            <Button 
              size="lg" 
              className="h-14 px-8 bg-white text-black hover:bg-gray-200 font-bold"
              onClick={handleAiMatch}
              disabled={isAiMatching}
            >
              {isAiMatching ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Analyzing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Run AI Match
                </span>
              )}
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 pb-4 border-b border-surface-3">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <Button 
                variant="outline" 
                className={`gap-2 ${showFilters ? 'bg-surface-2 border-primary/50 text-white' : ''}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters {(selectedSymptoms.length + selectedTreatments.length) > 0 && `(${selectedSymptoms.length + selectedTreatments.length})`}
              </Button>
              
              {compareList.length > 0 && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
                  <Scale className="w-4 h-4" />
                  Comparing {compareList.length}/3
                  <button onClick={() => setCompareList([])} className="ml-2 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center p-1 bg-[#0B0F14] border border-surface-3 rounded-lg">
              <button 
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'list' ? 'bg-surface-3 text-white' : 'text-text-secondary hover:text-white'}`}
              >
                <List className="w-4 h-4" /> List
              </button>
              <button 
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'map' ? 'bg-surface-3 text-white' : 'text-text-secondary hover:text-white'}`}
              >
                <MapIcon className="w-4 h-4" /> Map
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Filters Panel (Desktop or toggled on mobile) */}
            <div className={`lg:col-span-1 space-y-8 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <div>
                <h3 className="text-sm font-bold tracking-widest text-text-secondary uppercase mb-4">Symptoms</h3>
                <div className="flex flex-wrap gap-2">
                  {SYMPTOMS.map(symptom => (
                    <button
                      key={symptom}
                      onClick={() => toggleSelection(symptom, selectedSymptoms, setSelectedSymptoms)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                        selectedSymptoms.includes(symptom)
                          ? 'bg-primary/20 border-primary/50 text-white'
                          : 'bg-[#0B0F14] border-surface-3 text-text-secondary hover:border-surface-4 hover:text-white'
                      }`}
                    >
                      {symptom}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold tracking-widest text-text-secondary uppercase mb-4">Treatments</h3>
                <div className="flex flex-wrap gap-2">
                  {TREATMENTS.map(treatment => (
                    <button
                      key={treatment}
                      onClick={() => toggleSelection(treatment, selectedTreatments, setSelectedTreatments)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                        selectedTreatments.includes(treatment)
                          ? 'bg-secondary/20 border-secondary/50 text-white'
                          : 'bg-[#0B0F14] border-surface-3 text-text-secondary hover:border-surface-4 hover:text-white'
                      }`}
                    >
                      {treatment}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results Area */}
            <div className={`lg:col-span-3 ${viewMode === 'map' ? 'hidden lg:block' : ''}`}>
              <div className="mb-6 flex justify-between items-end">
                <div>
                  <h2 className="text-2xl font-display font-bold text-white">Recommended Clinics</h2>
                  <p className="text-text-secondary text-sm">Showing {filteredClinics.length} matches based on your profile.</p>
                </div>
              </div>

              <div className="space-y-4">
                <AnimatePresence>
                  {filteredClinics.map((clinic, i) => (
                    <motion.div
                      key={clinic.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                    >
                      <Card className={`overflow-hidden bg-[#0B0F14] border-surface-3 transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_30px_rgba(6,182,212,0.1)] ${compareList.includes(clinic.id) ? 'ring-2 ring-primary' : ''}`}>
                        <div className="flex flex-col sm:flex-row">
                          {/* Image & Match Score */}
                          <div className="sm:w-64 h-48 sm:h-auto relative flex-shrink-0">
                            <img src={clinic.image} alt={clinic.name} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-primary" />
                              <span className="text-white font-bold text-sm">{clinic.matchScore}% Match</span>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-6 flex-grow flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h3 className="text-xl font-display font-bold text-white hover:text-primary transition-colors cursor-pointer">
                                    <Link to={`/clinics/${clinic.id}`}>{clinic.name}</Link>
                                  </h3>
                                  <div className="flex items-center gap-3 text-text-secondary text-sm mt-1">
                                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {clinic.location}</span>
                                    <span className="flex items-center gap-1 text-warning"><Star className="w-3.5 h-3.5 fill-current" /> {clinic.rating}</span>
                                    <span className="text-surface-4">•</span>
                                    <span>{clinic.price}</span>
                                  </div>
                                </div>
                                
                                <label className="flex items-center gap-2 cursor-pointer group">
                                  <span className="text-xs font-medium text-text-secondary group-hover:text-white transition-colors">Compare</span>
                                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${compareList.includes(clinic.id) ? 'bg-primary border-primary text-black' : 'border-surface-3 bg-[#05070A]'}`}>
                                    {compareList.includes(clinic.id) && <CheckCircle2 className="w-3.5 h-3.5" />}
                                  </div>
                                  <input 
                                    type="checkbox" 
                                    className="sr-only"
                                    checked={compareList.includes(clinic.id)}
                                    onChange={() => toggleCompare(clinic.id)}
                                  />
                                </label>
                              </div>

                              <div className="flex flex-wrap gap-2 mt-4">
                                {clinic.tags.map((tag, j) => (
                                  <span key={j} className="px-2 py-1 rounded bg-surface-2 border border-surface-3 text-xs text-text-secondary">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-4 border-t border-surface-3">
                              <Link to={`/clinics/${clinic.id}`} className="flex-grow flex">
                                <Button className="w-full bg-white text-black hover:bg-gray-200 gap-2">
                                  <Calendar className="w-4 h-4" /> Quick Book
                                </Button>
                              </Link>
                              <Link to={`/clinics/${clinic.id}`} className="flex-grow flex">
                                <Button variant="outline" className="w-full gap-2 hover:bg-surface-2 hover:text-white">
                                  <MessageSquare className="w-4 h-4" /> Chat with Clinic
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {filteredClinics.length === 0 && (
                  <div className="text-center py-20 bg-[#0B0F14] border border-surface-3 rounded-2xl">
                    <Activity className="w-12 h-12 text-surface-4 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No exact matches found</h3>
                    <p className="text-text-secondary mb-6">Try adjusting your filters or expanding your search area.</p>
                    <Button variant="outline" onClick={() => { setSelectedSymptoms([]); setSelectedTreatments([]); setSearchQuery(''); }}>
                      Clear All Filters
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Map View Placeholder */}
            {viewMode === 'map' && (
              <div className="lg:col-span-3 h-[600px] bg-[#0B0F14] border border-surface-3 rounded-2xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-20 grayscale" />
                <div className="absolute inset-0 bg-[#05070A]/60 backdrop-blur-sm" />
                <div className="relative z-10 text-center">
                  <MapPin className="w-12 h-12 text-primary mx-auto mb-4 animate-bounce" />
                  <h3 className="text-2xl font-bold text-white mb-2">Interactive Map View</h3>
                  <p className="text-text-secondary">Explore {filteredClinics.length} clinics in your area.</p>
                  <Button className="mt-6" onClick={() => setViewMode('list')}>Return to List View</Button>
                </div>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* Compare Drawer (Floating at bottom) */}
      <AnimatePresence>
        {compareList.length > 0 && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 bg-[#0B0F14]/95 backdrop-blur-xl border-t border-surface-3 p-4 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
          >
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Scale className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Compare Clinics</h4>
                  <p className="text-sm text-text-secondary">{compareList.length} of 3 selected</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {compareList.map(id => {
                  const clinic = clinics.find(c => c.id === id);
                  return clinic ? (
                    <div key={id} className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#05070A] border border-surface-3 rounded-lg text-sm">
                      <span className="text-white truncate max-w-[120px]">{clinic.name}</span>
                      <button onClick={() => toggleCompare(id)} className="text-text-secondary hover:text-danger">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : null;
                })}
                <Button className="ml-4 bg-primary text-black hover:bg-primary-hover font-bold" disabled={compareList.length < 2}>
                  Compare Now
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

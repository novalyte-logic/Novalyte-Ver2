import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { MapPin, Star, Activity, Search, ArrowRight } from 'lucide-react';

export function Directory() {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="pt-24 pb-12 border-b border-surface-3 bg-surface-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-display font-bold mb-4">Clinic Directory</h1>
          <p className="text-text-secondary text-lg max-w-2xl mb-8">
            Find and connect with elite, verified clinics operating on the Novalyte network.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
              <input 
                type="text" 
                placeholder="Search by specialty, treatment, or clinic name..." 
                className="w-full h-12 pl-12 pr-4 bg-surface-2 border border-surface-3 rounded-lg text-text-primary focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
              />
            </div>
            <div className="relative w-full md:w-64">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
              <input 
                type="text" 
                placeholder="Location or Zip" 
                className="w-full h-12 pl-12 pr-4 bg-surface-2 border border-surface-3 rounded-lg text-text-primary focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
              />
            </div>
            <Button className="h-12 px-8">Search</Button>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Filters Sidebar */}
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Specialties</h3>
                <div className="space-y-2">
                  {['Hormone Optimization', 'Longevity', 'Peptide Therapy', 'Weight Management', 'Cognitive Health'].map((item, i) => (
                    <label key={i} className="flex items-center gap-2 text-text-secondary hover:text-text-primary cursor-pointer">
                      <input type="checkbox" className="rounded border-surface-3 bg-surface-2 text-primary focus:ring-primary/50" />
                      {item}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Clinic List */}
            <div className="md:col-span-2 space-y-6">
              {[
                { id: "apex", name: "Apex Longevity Institute", location: "Miami, FL", rating: 4.9, tags: ["Hormone Optimization", "Peptides"] },
                { id: "vitality", name: "Vitality Men's Clinic", location: "Austin, TX", rating: 4.8, tags: ["Weight Management", "TRT"] },
                { id: "neurohealth", name: "NeuroHealth Partners", location: "New York, NY", rating: 5.0, tags: ["Cognitive Health", "Longevity"] },
              ].map((clinic, i) => (
                <Card key={i} glow="cyan" className="flex flex-col sm:flex-row gap-6 p-6">
                  <div className="w-full sm:w-48 h-32 rounded-lg bg-surface-2 border border-surface-3 flex items-center justify-center flex-shrink-0">
                    <Activity className="w-8 h-8 text-surface-3" />
                  </div>
                  <div className="flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-display font-bold text-text-primary">{clinic.name}</h3>
                        <div className="flex items-center gap-1 text-warning">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-sm font-medium">{clinic.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-text-secondary text-sm mb-4">
                        <MapPin className="w-4 h-4" /> {clinic.location}
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {clinic.tags.map((tag, j) => (
                          <span key={j} className="px-2 py-1 rounded bg-surface-2 border border-surface-3 text-xs text-text-secondary">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Link to={`/clinics/${clinic.id}`} className="flex-grow sm:flex-grow-0">
                        <Button size="sm" className="w-full">Book Consult</Button>
                      </Link>
                      <Link to={`/clinics/${clinic.id}`} className="flex-grow sm:flex-grow-0">
                        <Button variant="outline" size="sm" className="w-full">View Profile</Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

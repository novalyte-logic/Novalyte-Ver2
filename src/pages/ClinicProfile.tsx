import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useParams } from 'react-router-dom';
import { MapPin, Star, Activity, CheckCircle2, Shield, ArrowRight, Clock, Phone, Mail, Globe, Sparkles } from 'lucide-react';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';

export function ClinicProfile() {
  const { id } = useParams();
  const [isBooking, setIsBooking] = useState(false);

  // Mock data based on ID
  const clinic = {
    name: "Apex Longevity Institute",
    location: "Miami, FL",
    rating: 4.9,
    reviews: 128,
    description: "Apex Longevity Institute specializes in advanced hormone optimization, peptide therapies, and comprehensive metabolic health. Our board-certified physicians utilize data-driven protocols to help men achieve peak physical and cognitive performance.",
    specialties: ["Hormone Optimization", "Peptide Therapy", "Longevity Protocols", "Weight Management"],
    providers: [
      { name: "Dr. Marcus Thorne", role: "Chief Medical Officer", credentials: "MD, FAARM" },
      { name: "Dr. Sarah Jenkins", role: "Endocrinology Specialist", credentials: "MD" }
    ],
    features: ["Telehealth Available", "In-house Labs", "Concierge Service", "Novalyte Certified"],
    hours: "Mon-Fri: 8am - 6pm"
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Hero Section */}
      <div className="relative h-64 md:h-80 bg-surface-2 border-b border-surface-3 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <Activity className="w-48 h-48 text-primary" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="p-8 bg-surface-1 border-surface-3">
              <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-display font-bold text-text-primary">{clinic.name}</h1>
                    <div className="px-2 py-1 rounded bg-success/10 border border-success/20 flex items-center gap-1">
                      <Shield className="w-3 h-3 text-success" />
                      <span className="text-xs font-medium text-success">Verified</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-text-secondary">
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {clinic.location}</span>
                    <span className="flex items-center gap-1 text-warning"><Star className="w-4 h-4 fill-current" /> {clinic.rating} ({clinic.reviews})</span>
                  </div>
                </div>
                <div className="w-16 h-16 rounded-xl bg-surface-2 border border-surface-3 flex items-center justify-center flex-shrink-0">
                  <Activity className="w-8 h-8 text-primary" />
                </div>
              </div>

              <div className="prose prose-invert max-w-none">
                <p className="text-text-secondary text-lg leading-relaxed">{clinic.description}</p>
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                {clinic.specialties.map((spec, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-full bg-surface-2 border border-surface-3 text-sm text-text-primary">
                    {spec}
                  </span>
                ))}
              </div>
            </Card>

            <Card className="p-8 bg-surface-1 border-surface-3">
              <h2 className="text-2xl font-display font-bold mb-6">Medical Team</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {clinic.providers.map((provider, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-surface-2 border border-surface-3">
                    <div className="w-12 h-12 rounded-full bg-surface-3 flex items-center justify-center text-lg font-bold">
                      {provider.name.charAt(4)}
                    </div>
                    <div>
                      <h3 className="font-medium text-text-primary">{provider.name}, {provider.credentials}</h3>
                      <p className="text-sm text-text-secondary">{provider.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-8 bg-surface-1 border-surface-3">
              <h2 className="text-2xl font-display font-bold mb-6">AI Insights</h2>
              <div className="p-6 rounded-xl bg-secondary/5 border border-secondary/20">
                <div className="flex items-start gap-4">
                  <Sparkles className="w-6 h-6 text-secondary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-text-primary mb-2">Why this clinic?</h3>
                    <p className="text-text-secondary mb-4">
                      Based on network data, Apex Longevity Institute has a 94% success rate in patient-reported outcomes for hormone optimization protocols within the first 90 days. Their response time to patient inquiries is in the top 5% of the Novalyte network.
                    </p>
                    <ul className="space-y-2 text-sm text-text-secondary">
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success" /> High patient retention rate</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success" /> Advanced diagnostic capabilities</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card glow="cyan" className="p-6 bg-surface-1 border-surface-3 sticky top-24">
              <h3 className="text-xl font-bold mb-6">Book Consultation</h3>
              
              {!isBooking ? (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-text-secondary">
                      <Clock className="w-5 h-5" />
                      <span>{clinic.hours}</span>
                    </div>
                    <div className="flex items-center gap-3 text-text-secondary">
                      <Phone className="w-5 h-5" />
                      <span>(555) 123-4567</span>
                    </div>
                    <div className="flex items-center gap-3 text-text-secondary">
                      <Globe className="w-5 h-5" />
                      <span>apexlongevity.com</span>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-surface-3">
                    <p className="text-sm text-text-secondary mb-4">
                      Start with a comprehensive clinical assessment to ensure this clinic is the right fit for your goals.
                    </p>
                    <Button 
                      className="w-full" 
                      onClick={() => setIsBooking(true)}
                    >
                      Request Appointment
                    </Button>
                  </div>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="p-4 rounded-lg bg-success/10 border border-success/20 text-center">
                    <CheckCircle2 className="w-8 h-8 text-success mx-auto mb-2" />
                    <h4 className="font-bold text-text-primary">Request Sent</h4>
                    <p className="text-sm text-text-secondary mt-1">
                      The clinic will contact you shortly to confirm your consultation time.
                    </p>
                  </div>
                  <Link to="/mens-trivia">
                    <Button variant="outline" className="w-full mt-4">
                      Take the Men's Health Quiz
                    </Button>
                  </Link>
                </motion.div>
              )}
            </Card>

            <Card className="p-6 bg-surface-1 border-surface-3">
              <h3 className="font-bold mb-4">Clinic Features</h3>
              <ul className="space-y-3">
                {clinic.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-text-secondary">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}

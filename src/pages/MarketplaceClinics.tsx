import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { PublicService, type PublicClinicCard } from '@/src/services/public';
import {
  Search,
  Filter,
  ShieldCheck,
  Zap,
  Users,
  Building2,
  MapPin,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';

export function MarketplaceClinics() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [clinics, setClinics] = React.useState<PublicClinicCard[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [acceptingOnly, setAcceptingOnly] = React.useState(true);
  const [insuranceOnly, setInsuranceOnly] = React.useState(false);
  const [selectedSpecialties, setSelectedSpecialties] = React.useState<string[]>([]);

  React.useEffect(() => {
    let isActive = true;

    const loadClinics = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await PublicService.getClinics();
        if (isActive) {
          setClinics(response.clinics);
        }
      } catch (loadError) {
        console.error('Failed to load clinic marketplace:', loadError);
        if (isActive) {
          setClinics([]);
          setError('Unable to load the live clinic partner network right now.');
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    void loadClinics();

    return () => {
      isActive = false;
    };
  }, []);

  const specialties = React.useMemo(
    () =>
      [...new Set(clinics.flatMap((clinic) => clinic.specialties).filter(Boolean))]
        .sort()
        .slice(0, 8),
    [clinics],
  );

  const toggleSpecialty = (specialty: string) => {
    setSelectedSpecialties((current) =>
      current.includes(specialty)
        ? current.filter((entry) => entry !== specialty)
        : [...current, specialty],
    );
  };

  const filteredClinics = React.useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    return clinics.filter((clinic) => {
      const matchesSearch =
        !normalizedQuery ||
        [
          clinic.name,
          clinic.description,
          clinic.location,
          ...clinic.specialties,
          ...clinic.tags,
        ]
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery);

      const matchesAccepting = !acceptingOnly || clinic.acceptsNewPatients;
      const matchesInsurance = !insuranceOnly || clinic.acceptsInsurance;
      const matchesSpecialties =
        selectedSpecialties.length === 0 ||
        selectedSpecialties.some((specialty) => clinic.specialties.includes(specialty));

      return matchesSearch && matchesAccepting && matchesInsurance && matchesSpecialties;
    });
  }, [acceptingOnly, clinics, insuranceOnly, searchQuery, selectedSpecialties]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <section className="relative pt-32 pb-16 border-b border-surface-3/50 overflow-hidden">
        <div className="absolute inset-0 bg-[#05070A]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/10 rounded-full blur-[100px] opacity-40 mix-blend-screen" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-surface-2/80 backdrop-blur-xl border border-surface-3 flex items-center justify-center text-primary shadow-2xl">
                <Building2 className="w-8 h-8" />
              </div>
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-2/50 border border-surface-3 mb-3">
                  <ShieldCheck className="w-3 h-3 text-success" />
                  <span className="text-xs font-mono text-text-secondary uppercase tracking-wider">
                    Curated Provider Network
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">
                  Clinic Partnerships
                </h1>
                <p className="text-lg text-text-secondary max-w-2xl font-light">
                  Discover vetted clinics, access specialized care protocols, and establish referral partnerships.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Link to="/network">
                <Button variant="outline" className="border-surface-3 hover:bg-surface-2 text-white">
                  <Users className="w-4 h-4 mr-2" /> Partner Network
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 flex-grow bg-[#0B0F14] relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-8 relative z-10">
          <div className="w-full lg:w-72 space-y-6 flex-shrink-0">
            <Card className="p-6 bg-surface-1/80 backdrop-blur-xl border-surface-3 shadow-xl">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-surface-3/50">
                <Filter className="w-5 h-5 text-text-secondary" />
                <h3 className="font-bold text-white text-lg">Filters</h3>
              </div>

              <div className="space-y-8">
                <div>
                  <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Specialty</h4>
                  <div className="space-y-3">
                    {specialties.map((specialty) => (
                      <label
                        key={specialty}
                        className="flex items-center gap-3 text-sm text-text-secondary hover:text-white cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedSpecialties.includes(specialty)}
                          onChange={() => toggleSpecialty(specialty)}
                          className="rounded border-surface-3 bg-surface-2 text-primary focus:ring-primary/50 w-4 h-4"
                        />
                        {specialty}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Availability</h4>
                  <label className="flex items-center gap-3 text-sm text-text-secondary hover:text-white cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={acceptingOnly}
                      onChange={() => setAcceptingOnly((current) => !current)}
                      className="rounded border-surface-3 bg-surface-2 text-primary focus:ring-primary/50 w-4 h-4"
                    />
                    Accepting new patients
                  </label>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Payment Model</h4>
                  <label className="flex items-center gap-3 text-sm text-text-secondary hover:text-white cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={insuranceOnly}
                      onChange={() => setInsuranceOnly((current) => !current)}
                      className="rounded border-surface-3 bg-surface-2 text-primary focus:ring-primary/50 w-4 h-4"
                    />
                    Insurance-compatible intake
                  </label>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-surface-1 to-surface-2 border-surface-3 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-[24px]" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-mono uppercase tracking-wider mb-4">
                  <Zap className="w-3 h-3" /> Referral Matchmaker
                </div>
                <h4 className="text-white font-bold mb-2">Find your best partner</h4>
                <p className="text-sm text-text-secondary mb-4 leading-relaxed">
                  We can map your patient demand and overflow capacity to the best-fit clinic partners.
                </p>
                <Link to="/clinics/icp">
                  <Button className="w-full bg-surface-3 hover:bg-surface-3/80 text-white text-sm">
                    Run Match Analysis
                  </Button>
                </Link>
              </div>
            </Card>
          </div>

          <div className="flex-grow space-y-6">
            <div className="relative w-full group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-500" />
              <div className="relative flex items-center bg-surface-1/80 backdrop-blur-xl border border-surface-3 rounded-xl p-1">
                <Search className="w-5 h-5 text-text-secondary ml-4" />
                <input
                  type="text"
                  placeholder="Search clinics, specialties, or locations..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="w-full h-12 bg-transparent border-none text-white placeholder-text-secondary focus:outline-none focus:ring-0 px-4"
                />
              </div>
            </div>

            {error ? (
              <Card className="p-6 bg-danger/10 border-danger/20 text-danger">{error}</Card>
            ) : null}

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Card key={index} className="overflow-hidden border-surface-3 bg-surface-1/80">
                    <div className="h-48 bg-surface-2 animate-pulse" />
                    <div className="p-6 space-y-3">
                      <div className="h-4 w-24 rounded bg-surface-2 animate-pulse" />
                      <div className="h-6 w-3/4 rounded bg-surface-2 animate-pulse" />
                      <div className="h-16 rounded bg-surface-2 animate-pulse" />
                    </div>
                  </Card>
                ))}
              </div>
            ) : filteredClinics.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredClinics.map((clinic) => (
                  <Link key={clinic.id} to={`/clinics/${clinic.id}`}>
                    <Card className="p-0 bg-surface-1/80 backdrop-blur-sm border-surface-3 flex flex-col h-full overflow-hidden hover:border-primary/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.1)] transition-all duration-300 group">
                      <div className="h-48 bg-surface-2 relative overflow-hidden">
                        {clinic.image ? (
                          <img
                            src={clinic.image}
                            alt={clinic.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-surface-2 to-surface-3">
                            <Building2 className="w-10 h-10 text-text-secondary" />
                          </div>
                        )}
                        <div className="absolute top-3 left-3 bg-background/80 backdrop-blur-md border border-surface-3 px-2 py-1 rounded-md flex items-center gap-1 text-xs font-medium text-white">
                          <ShieldCheck className="w-3 h-3 text-primary" /> Verified Partner
                        </div>
                      </div>
                      <div className="p-6 flex-grow flex flex-col">
                        <div className="flex items-center gap-2 text-xs font-mono text-text-secondary uppercase tracking-wider mb-2">
                          <MapPin className="w-3 h-3" /> {clinic.location}
                        </div>
                        <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors mb-2 leading-tight">
                          {clinic.name}
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {clinic.specialties.slice(0, 2).map((specialty) => (
                            <span
                              key={specialty}
                              className="text-xs font-medium bg-surface-2 text-text-secondary px-2 py-1 rounded-md border border-surface-3"
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>
                        <p className="text-sm text-text-secondary mb-6 flex-grow leading-relaxed">
                          {clinic.description}
                        </p>

                        <div className="flex flex-col gap-3 mt-auto pt-4 border-t border-surface-3/50">
                          <div className="flex justify-between items-center">
                            <span className="font-mono font-medium text-white">{clinic.pricingTier}</span>
                            <span className="flex items-center gap-1 text-sm font-medium text-success bg-success/10 px-2 py-1 rounded-md">
                              ★ {clinic.rating.toFixed(1)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs font-medium text-text-secondary bg-surface-2/50 px-3 py-2 rounded-lg border border-surface-3">
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" /> {clinic.waitlist}
                            </span>
                            <span className="flex items-center gap-1 text-primary">
                              <TrendingUp className="w-3 h-3" />
                              {clinic.acceptsInsurance ? 'Insurance-friendly' : 'Direct pay'}
                            </span>
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
                    <Building2 className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white mb-4">
                    No live clinic partners match these filters
                  </h3>
                  <p className="text-text-secondary mb-8 leading-relaxed">
                    Adjust your criteria or contact the Novalyte team for a custom referral or partnership recommendation.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/clinics/apply">
                      <Button className="bg-primary hover:bg-primary-hover text-background font-semibold">
                        Apply to Join Network
                      </Button>
                    </Link>
                    <Link to="/contact?role=clinic&topic=clinic_marketplace_waitlist">
                      <Button variant="outline" className="border-surface-3 hover:bg-surface-2 text-white">
                        Get Partnership Help
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}

            {!loading && !error && clinics.length > 0 ? (
              <Card className="p-4 bg-surface-1/80 border-surface-3 text-sm text-text-secondary">
                {filteredClinics.length} of {clinics.length} live clinics shown.
              </Card>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}

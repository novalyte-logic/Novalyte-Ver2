import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Activity,
  Calendar,
  CheckCircle2,
  List,
  Loader2,
  Map as MapIcon,
  MapPin,
  MessageSquare,
  RefreshCcw,
  Scale,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  X,
} from 'lucide-react';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { PublicService, type PublicClinicCard } from '@/src/services/public';
import { buildPatientAssessmentPath } from '@/src/lib/patientJourney';

const SYMPTOMS = ['Fatigue', 'Brain Fog', 'Low Libido', 'Weight Gain', 'Poor Sleep', 'Muscle Loss', 'Joint Pain'];
const TREATMENTS = ['TRT', 'Peptides', 'Longevity', 'Weight Management', 'Cognitive Health', 'Hair Loss'];

const SYMPTOM_TO_SPECIALTY_TERMS: Record<string, string[]> = {
  Fatigue: ['hormone', 'longevity', 'metabolic', 'performance', 'weight'],
  'Brain Fog': ['cognitive', 'neuro', 'longevity', 'performance'],
  'Low Libido': ['trt', 'hormone', 'men', 'performance'],
  'Weight Gain': ['weight', 'metabolic', 'longevity', 'glp'],
  'Poor Sleep': ['longevity', 'recovery', 'hormone', 'performance'],
  'Muscle Loss': ['trt', 'performance', 'hormone', 'recovery'],
  'Joint Pain': ['recovery', 'performance', 'longevity', 'peptide'],
};

type DirectoryClinic = PublicClinicCard & {
  matchScore: number;
  searchableText: string;
};

type ViewMode = 'list' | 'coverage';

function normalizeText(value: string) {
  return value.trim().toLowerCase();
}

function buildSearchableText(clinic: PublicClinicCard) {
  return normalizeText(
    [
      clinic.name,
      clinic.location,
      clinic.description,
      clinic.tags.join(' '),
      clinic.specialties.join(' '),
      clinic.pricingTier,
      clinic.acceptsInsurance ? 'insurance' : 'direct pay',
      clinic.acceptsNewPatients ? 'accepting new patients' : 'waitlist',
    ].join(' '),
  );
}

function scoreClinic(
  clinic: PublicClinicCard,
  selectedSymptoms: string[],
  selectedTreatments: string[],
  searchQuery: string,
) {
  const searchable = buildSearchableText(clinic);
  const symptomScore = selectedSymptoms.reduce((score, symptom) => {
    const terms = SYMPTOM_TO_SPECIALTY_TERMS[symptom] ?? [];
    return terms.some((term) => searchable.includes(term)) ? score + 14 : score;
  }, 0);
  const treatmentScore = selectedTreatments.reduce((score, treatment) => {
    return searchable.includes(normalizeText(treatment)) ? score + 18 : score;
  }, 0);
  const searchScore =
    searchQuery.trim().length > 0 && searchable.includes(normalizeText(searchQuery)) ? 8 : 0;
  const ratingScore = Math.round(clinic.rating * 8);
  const reviewScore = Math.min(10, Math.round(Math.log10(clinic.reviewCount + 10) * 4));
  const readinessScore = clinic.acceptsNewPatients ? 6 : 1;

  return Math.max(55, Math.min(99, ratingScore + reviewScore + readinessScore + symptomScore + treatmentScore + searchScore));
}

function matchesDirectoryFilters(
  clinic: DirectoryClinic,
  searchQuery: string,
  selectedSymptoms: string[],
  selectedTreatments: string[],
) {
  const normalizedQuery = normalizeText(searchQuery);
  const matchesSearch = normalizedQuery.length === 0 || clinic.searchableText.includes(normalizedQuery);
  const matchesSymptoms =
    selectedSymptoms.length === 0 ||
    selectedSymptoms.every((symptom) =>
      (SYMPTOM_TO_SPECIALTY_TERMS[symptom] ?? []).some((term) => clinic.searchableText.includes(term)),
    );
  const matchesTreatments =
    selectedTreatments.length === 0 ||
    selectedTreatments.every((treatment) => clinic.searchableText.includes(normalizeText(treatment)));

  return matchesSearch && matchesSymptoms && matchesTreatments;
}

function DirectoryImage({ clinic }: { clinic: PublicClinicCard }) {
  if (clinic.image) {
    return <img src={clinic.image} alt={clinic.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />;
  }

  return (
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(53,212,255,0.28),_transparent_45%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.12),_transparent_40%),linear-gradient(135deg,#0E1722_0%,#081019_48%,#06080D_100%)]" />
  );
}

export function Directory() {
  const comparisonRef = useRef<HTMLDivElement | null>(null);
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [selectedTreatments, setSelectedTreatments] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [prioritizeMatch, setPrioritizeMatch] = useState(false);
  const [clinics, setClinics] = useState<PublicClinicCard[]>([]);

  const loadClinics = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await PublicService.getClinics();
      setClinics(response.clinics);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load the clinic directory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadClinics();
  }, []);

  useEffect(() => {
    const seededQuery = searchParams.get('q');
    if (seededQuery && !searchQuery) {
      setSearchQuery(seededQuery);
      setPrioritizeMatch(true);
    }
  }, [searchParams, searchQuery]);

  const toggleSelection = (
    item: string,
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    setList(list.includes(item) ? list.filter((entry) => entry !== item) : [...list, item]);
  };

  const toggleCompare = (clinicId: string) => {
    setCompareList((current) => {
      if (current.includes(clinicId)) {
        return current.filter((entry) => entry !== clinicId);
      }

      if (current.length >= 3) {
        return current;
      }

      return [...current, clinicId];
    });
  };

  const directoryClinics = useMemo<DirectoryClinic[]>(() => {
    return clinics.map((clinic) => ({
      ...clinic,
      searchableText: buildSearchableText(clinic),
      matchScore: scoreClinic(clinic, selectedSymptoms, selectedTreatments, searchQuery),
    }));
  }, [clinics, searchQuery, selectedSymptoms, selectedTreatments]);

  const filteredClinics = useMemo(() => {
    const results = directoryClinics.filter((clinic) =>
      matchesDirectoryFilters(clinic, searchQuery, selectedSymptoms, selectedTreatments),
    );

    return results.sort((left, right) => {
      if (prioritizeMatch) {
        return right.matchScore - left.matchScore || right.rating - left.rating;
      }

      return right.rating - left.rating || right.reviewCount - left.reviewCount;
    });
  }, [directoryClinics, prioritizeMatch, searchQuery, selectedSymptoms, selectedTreatments]);

  const selectedClinics = useMemo(
    () => compareList
      .map((clinicId) => filteredClinics.find((clinic) => clinic.id === clinicId) || directoryClinics.find((clinic) => clinic.id === clinicId))
      .filter((clinic): clinic is DirectoryClinic => Boolean(clinic)),
    [compareList, directoryClinics, filteredClinics],
  );

  const coverageGroups = useMemo(() => {
    const grouped = new Map<string, DirectoryClinic[]>();
    filteredClinics.forEach((clinic) => {
      const key = clinic.location;
      const current = grouped.get(key) ?? [];
      current.push(clinic);
      grouped.set(key, current);
    });

    return [...grouped.entries()]
      .map(([location, clinicsInLocation]) => ({
        location,
        clinics: clinicsInLocation.sort((left, right) => right.rating - left.rating),
      }))
      .sort((left, right) => right.clinics.length - left.clinics.length || left.location.localeCompare(right.location));
  }, [filteredClinics]);

  const activeFilterCount = selectedSymptoms.length + selectedTreatments.length;
  const hasPublishedClinics = clinics.length > 0;

  const handleRunAiMatch = () => {
    setPrioritizeMatch(true);

    if (selectedClinics.length >= 2 && comparisonRef.current) {
      comparisonRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const clearFilters = () => {
    setSelectedSymptoms([]);
    setSelectedTreatments([]);
    setSearchQuery('');
    setPrioritizeMatch(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05070A] flex items-center justify-center">
        <div className="flex items-center gap-3 rounded-2xl border border-surface-3 bg-[#0B0F14]/80 px-6 py-5 text-white">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          Loading verified clinics...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#05070A] flex items-center justify-center px-4">
        <Card className="w-full max-w-xl border-danger/30 bg-danger/10 p-8 text-center">
          <Activity className="mx-auto h-12 w-12 text-danger" />
          <h1 className="mt-4 text-2xl font-display font-bold text-white">Directory unavailable</h1>
          <p className="mt-3 text-sm text-danger">{error}</p>
          <Button className="mt-6 font-semibold" onClick={() => void loadClinics()}>
            Retry Directory Load
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05070A] flex flex-col font-sans text-text-primary">
      <section className="pt-32 pb-16 border-b border-surface-3 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-[#05070A] to-[#05070A]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-3 mb-6 justify-center">
            <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-widest uppercase flex items-center gap-2">
              <Sparkles className="w-3 h-3" />
              Verified Clinic Directory
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 text-center text-white tracking-tight">
            Find Your Ideal <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Clinic</span>
          </h1>
          <p className="text-text-secondary text-lg md:text-xl max-w-3xl mx-auto text-center mb-12">
            Search verified clinics, rank results against your current priorities, and compare finalists before you book.
          </p>

          <div className="max-w-5xl mx-auto bg-[#0B0F14]/80 backdrop-blur-xl border border-surface-3 p-2 rounded-2xl flex flex-col md:flex-row gap-2 shadow-2xl">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by clinic name, location, specialty, or care model..."
                className="w-full h-14 pl-12 pr-4 bg-transparent text-white focus:outline-none placeholder:text-text-secondary/50"
              />
            </div>
            <div className="hidden md:block w-px h-8 bg-surface-3 self-center mx-2" />
            <Button
              size="lg"
              className="h-14 px-8 bg-white text-black hover:bg-gray-200 font-bold"
              onClick={handleRunAiMatch}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Rank Matches
            </Button>
          </div>

          {prioritizeMatch ? (
            <div className="mt-4 text-center text-sm text-text-secondary">
              Ranked by fit using {activeFilterCount > 0 ? `${activeFilterCount} active filter${activeFilterCount === 1 ? '' : 's'}` : 'directory relevance'}, availability, and clinic quality signals.
            </div>
          ) : null}
        </div>
      </section>

      <section className="py-8 flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 pb-4 border-b border-surface-3">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <Button
                variant="outline"
                className={`gap-2 ${showFilters ? 'bg-surface-2 border-primary/50 text-white' : ''}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}
              </Button>

              {compareList.length > 0 ? (
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
                  <Scale className="w-4 h-4" />
                  Comparing {compareList.length}/3
                  <button type="button" onClick={() => setCompareList([])} className="ml-2 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : null}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <Button
                variant="outline"
                className="border-surface-3 text-white hover:bg-surface-2"
                onClick={() => void loadClinics()}
              >
                <RefreshCcw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <div className="flex items-center p-1 bg-[#0B0F14] border border-surface-3 rounded-lg">
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'list' ? 'bg-surface-3 text-white' : 'text-text-secondary hover:text-white'}`}
                >
                  <List className="w-4 h-4" /> List
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('coverage')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'coverage' ? 'bg-surface-3 text-white' : 'text-text-secondary hover:text-white'}`}
                >
                  <MapIcon className="w-4 h-4" /> Coverage
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className={`lg:col-span-1 space-y-8 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <div>
                <h3 className="text-sm font-bold tracking-widest text-text-secondary uppercase mb-4">Symptoms</h3>
                <div className="flex flex-wrap gap-2">
                  {SYMPTOMS.map((symptom) => (
                    <button
                      key={symptom}
                      type="button"
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
                  {TREATMENTS.map((treatment) => (
                    <button
                      key={treatment}
                      type="button"
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

              <Card className="p-5 bg-[#0B0F14] border-surface-3">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  Directory standards
                </div>
                <ul className="mt-4 space-y-3 text-sm text-text-secondary">
                  <li>Only routable public clinics are shown here.</li>
                  <li>Ranked results consider relevance, rating, reviews, and new-patient availability.</li>
                  <li>Use compare to review finalists side by side before intake.</li>
                </ul>
              </Card>
            </div>

            <div className="lg:col-span-3 space-y-6">
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-2xl font-display font-bold text-white">Verified Matches</h2>
                  <p className="text-text-secondary text-sm">
                    Showing {filteredClinics.length} clinic{filteredClinics.length === 1 ? '' : 's'} based on your current search and filters.
                  </p>
                </div>
              </div>

              {!hasPublishedClinics ? (
                <div className="text-center py-20 bg-[#0B0F14] border border-surface-3 rounded-2xl">
                  <ShieldCheck className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Directory publishing is in progress</h3>
                  <p className="text-text-secondary mb-6 max-w-xl mx-auto">
                    The public clinic catalog is live, but no clinics are currently published to this environment yet.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link to="/clinics/apply">
                      <Button>Apply as a Clinic</Button>
                    </Link>
                    <Link to="/contact?role=patient&topic=clinic_directory">
                      <Button variant="outline" className="border-surface-3 hover:bg-surface-2">Contact Concierge</Button>
                    </Link>
                  </div>
                </div>
              ) : null}

              {hasPublishedClinics && filteredClinics.length === 0 ? (
                <div className="text-center py-20 bg-[#0B0F14] border border-surface-3 rounded-2xl">
                  <Activity className="w-12 h-12 text-surface-4 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">No exact matches found</h3>
                  <p className="text-text-secondary mb-6">Try broadening your search area or removing one of the active filters.</p>
                  <Button variant="outline" onClick={clearFilters}>
                    Clear All Filters
                  </Button>
                </div>
              ) : null}

              {hasPublishedClinics && viewMode === 'list' ? (
                <div className="space-y-4">
                  <AnimatePresence>
                    {filteredClinics.map((clinic, index) => (
                      <motion.div
                        key={clinic.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.25, delay: index * 0.03 }}
                      >
                        <Card className={`overflow-hidden bg-[#0B0F14] border-surface-3 transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_30px_rgba(6,182,212,0.1)] ${compareList.includes(clinic.id) ? 'ring-2 ring-primary' : ''}`}>
                          <div className="flex flex-col sm:flex-row">
                            <div className="sm:w-64 h-48 sm:h-auto relative flex-shrink-0 overflow-hidden">
                              <DirectoryImage clinic={clinic} />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-primary" />
                                <span className="text-white font-bold text-sm">{clinic.matchScore}% Match</span>
                              </div>
                            </div>

                            <div className="p-6 flex-grow flex flex-col justify-between">
                              <div>
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-2">
                                  <div>
                                    <h3 className="text-xl font-display font-bold text-white hover:text-primary transition-colors">
                                      <Link to={`/clinics/${clinic.id}`}>{clinic.name}</Link>
                                    </h3>
                                    <div className="flex flex-wrap items-center gap-3 text-text-secondary text-sm mt-1">
                                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {clinic.location}</span>
                                      <span className="flex items-center gap-1 text-warning"><Star className="w-3.5 h-3.5 fill-current" /> {clinic.rating.toFixed(1)}</span>
                                      <span>{clinic.reviewCount} reviews</span>
                                      <span>{clinic.pricingTier}</span>
                                    </div>
                                  </div>

                                  <label className="flex items-center gap-2 cursor-pointer group">
                                    <span className="text-xs font-medium text-text-secondary group-hover:text-white transition-colors">Compare</span>
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${compareList.includes(clinic.id) ? 'bg-primary border-primary text-black' : 'border-surface-3 bg-[#05070A]'}`}>
                                      {compareList.includes(clinic.id) ? <CheckCircle2 className="w-3.5 h-3.5" /> : null}
                                    </div>
                                    <input
                                      type="checkbox"
                                      className="sr-only"
                                      checked={compareList.includes(clinic.id)}
                                      onChange={() => toggleCompare(clinic.id)}
                                    />
                                  </label>
                                </div>

                                <p className="text-sm text-text-secondary leading-6">{clinic.description}</p>

                                <div className="flex flex-wrap gap-2 mt-4">
                                  {clinic.tags.map((tag) => (
                                    <span key={`${clinic.id}-${tag}`} className="px-2 py-1 rounded bg-surface-2 border border-surface-3 text-xs text-text-secondary">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-4 border-t border-surface-3">
                                <Link
                                  to={buildPatientAssessmentPath({
                                    entryPoint: 'directory',
                                    goal: clinic.specialties[0],
                                    symptoms: selectedSymptoms,
                                    preferredClinicId: clinic.id,
                                    preferredClinicName: clinic.name,
                                    preferredClinicLocation: clinic.location,
                                    preferredClinicRating: clinic.rating,
                                    preferredClinicPricingTier: clinic.pricingTier,
                                  })}
                                  className="flex-grow flex"
                                >
                                  <Button className="w-full bg-white text-black hover:bg-gray-200 gap-2">
                                    <Calendar className="w-4 h-4" /> {clinic.acceptsNewPatients ? 'Start Intake' : 'Join Waitlist Intake'}
                                  </Button>
                                </Link>
                                <Link to={`/clinics/${clinic.id}`} className="flex-grow flex">
                                  <Button variant="outline" className="w-full gap-2 hover:bg-surface-2 hover:text-white">
                                    <MessageSquare className="w-4 h-4" /> View Clinic
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : hasPublishedClinics ? (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {coverageGroups.map((group) => (
                    <Card key={group.location} className="bg-[#0B0F14] border-surface-3 p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-primary" />
                            {group.location}
                          </h3>
                          <p className="mt-1 text-sm text-text-secondary">
                            {group.clinics.length} verified clinic{group.clinics.length === 1 ? '' : 's'} currently routable.
                          </p>
                        </div>
                        <div className="rounded-lg border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                          Top score {group.clinics[0]?.matchScore ?? '--'}%
                        </div>
                      </div>

                      <div className="mt-4 space-y-3">
                        {group.clinics.map((clinic) => (
                          <div key={clinic.id} className="flex items-center justify-between gap-3 rounded-xl border border-surface-3 bg-[#05070A] px-4 py-3">
                            <div className="min-w-0">
                              <Link to={`/clinics/${clinic.id}`} className="font-semibold text-white hover:text-primary transition-colors truncate block">
                                {clinic.name}
                              </Link>
                              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-text-secondary">
                                <span className="flex items-center gap-1 text-warning"><Star className="w-3 h-3 fill-current" /> {clinic.rating.toFixed(1)}</span>
                                <span>{clinic.pricingTier}</span>
                                <span>{clinic.waitlist}</span>
                              </div>
                            </div>
                            <Link
                              to={buildPatientAssessmentPath({
                                entryPoint: 'directory',
                                goal: clinic.specialties[0],
                                symptoms: selectedSymptoms,
                                preferredClinicId: clinic.id,
                                preferredClinicName: clinic.name,
                                preferredClinicLocation: clinic.location,
                                preferredClinicRating: clinic.rating,
                                preferredClinicPricingTier: clinic.pricingTier,
                              })}
                            >
                              <Button variant="outline" className="whitespace-nowrap border-surface-3 hover:bg-surface-2">
                                Start Intake
                              </Button>
                            </Link>
                          </div>
                        ))}
                      </div>
                    </Card>
                  ))}
                </div>
              ) : null}

              {selectedClinics.length >= 2 ? (
                <div ref={comparisonRef} className="pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-display font-bold text-white">Clinic Comparison</h2>
                      <p className="text-sm text-text-secondary">Side-by-side fit signals for your current finalists.</p>
                    </div>
                    <Button variant="outline" className="border-surface-3 hover:bg-surface-2" onClick={() => setCompareList([])}>
                      Reset Compare
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                    {selectedClinics.map((clinic) => (
                      <Card key={clinic.id} className="bg-[#0B0F14] border-surface-3 p-5 h-full">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <Link to={`/clinics/${clinic.id}`} className="text-xl font-display font-bold text-white hover:text-primary transition-colors">
                              {clinic.name}
                            </Link>
                            <p className="mt-1 text-sm text-text-secondary">{clinic.location}</p>
                          </div>
                          <div className="rounded-lg border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                            {clinic.matchScore}% fit
                          </div>
                        </div>

                        <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                          <MetricTile label="Rating" value={clinic.rating.toFixed(1)} />
                          <MetricTile label="Reviews" value={clinic.reviewCount.toString()} />
                          <MetricTile label="Pricing" value={clinic.pricingTier} />
                          <MetricTile label="Access" value={clinic.waitlist} />
                        </div>

                        <div className="mt-5">
                          <p className="text-xs uppercase tracking-[0.2em] text-text-secondary">Positioning</p>
                          <p className="mt-2 text-sm leading-6 text-text-secondary">{clinic.description}</p>
                        </div>

                        <div className="mt-5 flex flex-wrap gap-2">
                          {clinic.tags.map((tag) => (
                            <span key={`${clinic.id}-compare-${tag}`} className="px-2 py-1 rounded bg-surface-2 border border-surface-3 text-xs text-text-secondary">
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="mt-5">
                          <Link
                            to={buildPatientAssessmentPath({
                              entryPoint: 'directory',
                              goal: clinic.specialties[0],
                              symptoms: selectedSymptoms,
                              preferredClinicId: clinic.id,
                              preferredClinicName: clinic.name,
                              preferredClinicLocation: clinic.location,
                              preferredClinicRating: clinic.rating,
                              preferredClinicPricingTier: clinic.pricingTier,
                            })}
                            className="block"
                          >
                            <Button className="w-full">
                              Start Intake With This Clinic
                            </Button>
                          </Link>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {compareList.length > 0 ? (
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

              <div className="flex items-center gap-3 flex-wrap justify-center">
                {selectedClinics.map((clinic) => (
                  <div key={clinic.id} className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#05070A] border border-surface-3 rounded-lg text-sm">
                    <span className="text-white truncate max-w-[140px]">{clinic.name}</span>
                    <button type="button" onClick={() => toggleCompare(clinic.id)} className="text-text-secondary hover:text-danger">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                <Button
                  className="ml-0 sm:ml-4 bg-primary text-black hover:bg-primary-hover font-bold"
                  disabled={selectedClinics.length < 2}
                  onClick={() => comparisonRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                >
                  Compare Now
                </Button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function MetricTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-surface-3 bg-[#05070A] px-4 py-3">
      <p className="text-xs uppercase tracking-[0.2em] text-text-secondary">{label}</p>
      <p className="mt-2 text-base font-semibold text-white">{value}</p>
    </div>
  );
}

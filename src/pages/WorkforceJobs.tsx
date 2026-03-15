import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Briefcase,
  Building2,
  Filter,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Stethoscope,
} from 'lucide-react';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { useAuth } from '@/src/lib/auth/AuthContext';
import type { WorkforceCandidateCard, WorkforceOpportunity } from '@/src/lib/workforce/types';
import { WorkforceApiError, WorkforceService } from '@/src/services/workforce';

type ExchangeMode = 'talent' | 'clinic';

function includesQuery(values: string[], query: string) {
  const normalized = query.toLowerCase();
  return values.some((value) => value.toLowerCase().includes(normalized));
}

export function WorkforceJobs() {
  const { user, role } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [mode, setMode] = React.useState<ExchangeMode>(
    searchParams.get('mode') === 'clinic' ? 'clinic' : 'talent',
  );
  const requestId = searchParams.get('requestId') || undefined;
  const [searchQuery, setSearchQuery] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [opportunities, setOpportunities] = React.useState<WorkforceOpportunity[]>([]);
  const [candidates, setCandidates] = React.useState<WorkforceCandidateCard[]>([]);
  const canBrowseClinicMode = role === 'clinic' || role === 'clinic_admin' || role === 'admin' || role === 'system_admin';

  React.useEffect(() => {
    const urlMode = searchParams.get('mode') === 'clinic' ? 'clinic' : 'talent';
    if (urlMode !== mode) {
      setMode(urlMode);
    }
  }, [mode, searchParams]);

  React.useEffect(() => {
    const currentMode = searchParams.get('mode') === 'clinic' ? 'clinic' : 'talent';
    if (currentMode === mode) {
      return;
    }

    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('mode', mode);
    setSearchParams(nextParams, { replace: true });
  }, [mode, searchParams, setSearchParams]);

  React.useEffect(() => {
    let active = true;

    async function load() {
      try {
        setLoading(true);
        setError('');
        const liveOpportunities = await WorkforceService.getOpportunities();
        if (!active) {
          return;
        }

        setOpportunities(liveOpportunities);

        if (mode === 'clinic' && user && canBrowseClinicMode) {
          const liveCandidates = await WorkforceService.getCandidates(requestId);
          if (!active) {
            return;
          }
          setCandidates(liveCandidates);
        } else {
          setCandidates([]);
        }
      } catch (loadError) {
        if (!active) {
          return;
        }
        console.error('Failed to load workforce exchange:', loadError);
        setError(
          loadError instanceof WorkforceApiError
            ? loadError.message
            : 'Failed to load the workforce exchange.',
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [canBrowseClinicMode, mode, requestId, user]);

  const filteredOpportunities = opportunities.filter((item) => {
    if (!searchQuery) {
      return true;
    }

    return includesQuery(
      [item.title, item.clinicName, item.location.label, ...item.requiredProtocols],
      searchQuery,
    );
  });

  const filteredCandidates = candidates.filter((item) => {
    if (!searchQuery) {
      return true;
    }

    return includesQuery(
      [item.name, item.role, item.location, ...item.protocols, ...item.employmentPreferences],
      searchQuery,
    );
  });

  return (
    <div className="min-h-screen bg-[#05070A] flex flex-col selection:bg-surface-3 selection:text-white">
      <section className="pt-24 pb-8 border-b border-surface-3 bg-[#0B0F14] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-display font-bold text-white mb-2">
                {mode === 'talent' ? 'Live Staffing Opportunities' : 'Verified Candidate Directory'}
              </h1>
              <p className="text-text-secondary">
                {mode === 'talent'
                  ? 'Apply to real clinic staffing requests backed by production workflow state.'
                  : 'Review searchable practitioner profiles matched against your active staffing demand.'}
              </p>
            </div>

            <div className="bg-surface-2 p-1 rounded-xl border border-surface-3 flex">
              <button
                onClick={() => setMode('talent')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  mode === 'talent'
                    ? 'bg-secondary text-white shadow-[0_0_10px_rgba(139,92,246,0.3)]'
                    : 'text-text-secondary hover:text-white'
                }`}
              >
                <Stethoscope className="w-4 h-4" />
                Talent Mode
              </button>
              <button
                onClick={() => setMode('clinic')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  mode === 'clinic'
                    ? 'bg-primary text-black shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                    : 'text-text-secondary hover:text-white'
                }`}
              >
                <Building2 className="w-4 h-4" />
                Clinic Mode
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
              <input
                type="text"
                placeholder={
                  mode === 'talent'
                    ? 'Search roles, clinics, or protocols...'
                    : 'Search practitioners, specialties, or protocols...'
                }
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="w-full h-12 pl-12 pr-4 bg-surface-1 border border-surface-3 rounded-xl text-white focus:outline-none focus:border-primary/40 transition-all"
              />
            </div>
            <Button variant="outline" className="h-12 border-surface-3 bg-surface-1 hover:bg-surface-2">
              <Filter className="w-4 h-4 mr-2" />
              Live Filters
            </Button>
          </div>
        </div>
      </section>

      <section className="py-8 flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {requestId && mode === 'clinic' ? (
            <Card className="p-4 bg-primary/5 border-primary/20">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-primary font-bold">Requisition-linked browse</p>
                  <p className="mt-2 text-sm text-text-secondary">
                    Candidate match scores are being calculated against the staffing request you launched from the clinic dashboard.
                  </p>
                </div>
                <Link to="/dashboard/workforce?tab=requisitions">
                  <Button variant="outline" className="border-primary/20 text-primary hover:bg-primary/10">
                    Return to Requisitions
                  </Button>
                </Link>
              </div>
            </Card>
          ) : null}

          {mode === 'clinic' && !user ? (
            <Card className="p-6 bg-[#0B0F14] border-surface-3">
              <h2 className="text-xl font-bold text-white">Clinic login required</h2>
              <p className="mt-3 text-text-secondary">
                Candidate records are only available to authenticated clinics and admins because they link into interviews, offers, and staffing workflows.
              </p>
              <div className="mt-5">
                <Link to="/auth/clinic-login">
                  <Button className="bg-primary hover:bg-primary/90 text-black font-semibold">
                    Open Clinic Login
                  </Button>
                </Link>
              </div>
            </Card>
          ) : null}

          {mode === 'clinic' && user && !canBrowseClinicMode ? (
            <Card className="p-6 bg-[#0B0F14] border-surface-3">
              <h2 className="text-xl font-bold text-white">Clinic workspace access required</h2>
              <p className="mt-3 text-text-secondary">
                Candidate browsing is reserved for clinic and admin accounts because profile reviews hand off directly into requisitions, interviews, and offers.
              </p>
              <div className="mt-5">
                <Link to="/workforce/dashboard">
                  <Button className="bg-secondary hover:bg-secondary/90 text-white font-semibold">
                    Return to Talent Dashboard
                  </Button>
                </Link>
              </div>
            </Card>
          ) : null}

          {loading ? (
            <Card className="p-10 bg-surface-1 border-surface-3 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </Card>
          ) : null}

          {!loading && error ? (
            <Card className="p-6 bg-danger/10 border-danger/20 text-danger">{error}</Card>
          ) : null}

          {!loading && !error && mode === 'talent' ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {filteredOpportunities.length ? filteredOpportunities.map((item) => (
                <Card key={item.id} className="p-6 bg-[#0B0F14] border-surface-3 hover:border-secondary/30 transition-all flex flex-col h-full">
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">{item.title}</h3>
                      <p className="text-text-secondary mt-1">{item.clinicName}</p>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-1 rounded bg-success/10 text-success border border-success/20 text-xs font-mono font-bold inline-flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" />
                        {item.match?.score ?? 0}% Match
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary mb-5">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      {item.location.label}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4" />
                      {item.employmentType}
                    </span>
                    <span>{item.compensation}</span>
                  </div>

                  <p className="text-sm text-text-secondary leading-7 flex-grow">{item.description}</p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {item.requiredProtocols.map((protocol) => (
                      <span key={protocol} className="px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs">
                        {protocol}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 flex gap-3">
                    <Link to={`/workforce/apply/${item.id}`} className="flex-1">
                      <Button className="w-full bg-secondary hover:bg-secondary/90 text-white font-semibold">
                        {item.hasApplied ? 'View Application' : 'Apply'}
                      </Button>
                    </Link>
                    <Link to="/workforce/dashboard" className="flex-1">
                      <Button variant="outline" className="w-full border-surface-3 text-white hover:bg-surface-2">
                        Dashboard
                      </Button>
                    </Link>
                  </div>
                </Card>
              )) : (
                <Card className="p-10 bg-[#0B0F14] border-surface-3 text-center xl:col-span-2">
                  <h3 className="text-xl font-bold text-white">No staffing requests found</h3>
                  <p className="mt-3 text-text-secondary">
                    Live clinic demand will appear here once open requisitions exist in the exchange.
                  </p>
                </Card>
              )}
            </div>
          ) : null}

          {!loading && !error && mode === 'clinic' && user && canBrowseClinicMode ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {filteredCandidates.length ? filteredCandidates.map((item) => (
                <Card key={item.id} className="p-6 bg-[#0B0F14] border-surface-3 hover:border-primary/30 transition-all flex flex-col h-full">
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">{item.name}</h3>
                      <p className="text-text-secondary mt-1">{item.role}</p>
                    </div>
                    <div className="text-right">
                      {item.match ? (
                        <span className="px-2 py-1 rounded bg-success/10 text-success border border-success/20 text-xs font-mono font-bold inline-flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          {item.match.score}% Match
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="space-y-3 text-sm text-text-secondary flex-grow">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {item.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" />
                      {item.verified ? 'Verified practitioner' : 'Verification pending'}
                    </div>
                    <div>{item.yearsExperience} years experience</div>
                    <div>{item.targetCompensation}</div>
                    <div className="flex flex-wrap gap-2">
                      {item.protocols.map((protocol) => (
                        <span key={protocol} className="px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs">
                          {protocol}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <Link to={`/workforce/candidate/${item.id}`} className="flex-1">
                      <Button className="w-full bg-primary hover:bg-primary/90 text-black font-semibold">
                        Review Candidate
                      </Button>
                    </Link>
                    <Link to="/dashboard/workforce?tab=pipeline" className="flex-1">
                      <Button variant="outline" className="w-full border-surface-3 text-white hover:bg-surface-2">
                        Pipeline
                      </Button>
                    </Link>
                  </div>
                </Card>
              )) : (
                <Card className="p-10 bg-[#0B0F14] border-surface-3 text-center xl:col-span-2">
                  <h3 className="text-xl font-bold text-white">No candidates matched yet</h3>
                  <p className="mt-3 text-text-secondary">
                    Create or expand a staffing request to surface more practitioner profiles in the exchange.
                  </p>
                </Card>
              )}
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}

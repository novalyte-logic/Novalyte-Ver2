import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Activity,
  ArrowLeft,
  CheckCircle2,
  DollarSign,
  MapPin,
  Send,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { WorkforceAuthGate } from '@/src/components/workforce/WorkforceAuthGate';
import type { PractitionerProfile, WorkforceOpportunity } from '@/src/lib/workforce/types';
import { WorkforceApiError, WorkforceService } from '@/src/services/workforce';

export function WorkforceApply() {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [error, setError] = React.useState('');
  const [coverNote, setCoverNote] = React.useState('');
  const [authorized, setAuthorized] = React.useState(false);
  const [profile, setProfile] = React.useState<PractitionerProfile | null>(null);
  const [opportunity, setOpportunity] = React.useState<WorkforceOpportunity | null>(null);

  React.useEffect(() => {
    let active = true;

    async function load() {
      try {
        setLoading(true);
        const [loadedOpportunity, loadedProfile] = await Promise.all([
          WorkforceService.getOpportunity(id),
          WorkforceService.getPractitionerProfile(),
        ]);

        if (!active) {
          return;
        }

        setOpportunity(loadedOpportunity);
        setProfile(loadedProfile);
      } catch (loadError) {
        if (!active) {
          return;
        }
        console.error('Failed to load workforce application context:', loadError);
        setError(
          loadError instanceof WorkforceApiError
            ? loadError.message
            : 'Failed to load this staffing request.',
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
  }, [id]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!authorized) {
      setError('You must authorize profile sharing before submitting.');
      return;
    }

    if (!opportunity) {
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await WorkforceService.applyToRequest({
        requestId: opportunity.id,
        coverNote,
      });
      setSubmitted(true);
      window.setTimeout(() => navigate('/workforce/dashboard'), 1800);
    } catch (submitError) {
      console.error('Failed to submit workforce application:', submitError);
      setError(
        submitError instanceof WorkforceApiError
          ? submitError.message
          : 'Failed to submit your application.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <WorkforceAuthGate
      title="Apply to Live Staffing Requests"
      description="Applications are now written to the production workforce backend and routed directly into clinic staffing pipelines."
    >
      <div className="min-h-screen bg-[#05070A] flex flex-col selection:bg-secondary/30 selection:text-white">
        <header className="h-20 border-b border-surface-3 bg-[#0B0F14] flex items-center justify-between px-6 sticky top-0 z-50">
          <Link to="/" className="flex items-center gap-2">
            <Activity className="w-6 h-6 text-secondary" />
            <span className="font-display font-bold text-xl tracking-tight text-white">
              Novalyte <span className="text-secondary">AI</span>
            </span>
          </Link>
          <div className="text-sm text-text-secondary hidden md:block">Workforce application</div>
        </header>

        <main className="flex-grow max-w-6xl w-full mx-auto px-6 py-8 md:py-12">
          <Link to="/workforce/jobs" className="inline-flex items-center text-sm font-bold text-text-secondary hover:text-white transition-colors mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to opportunities
          </Link>

          {loading ? (
            <Card className="p-10 bg-surface-1 border-surface-3 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
            </Card>
          ) : null}

          {!loading && error && !opportunity ? (
            <Card className="p-6 bg-danger/10 border-danger/20 text-danger">{error}</Card>
          ) : null}

          {!loading && opportunity ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-5 space-y-6">
                <Card className="p-6 bg-[#0B0F14] border-surface-3">
                  <h1 className="text-2xl font-display font-bold text-white mb-2">{opportunity.title}</h1>
                  <p className="text-lg text-secondary font-medium">{opportunity.clinicName}</p>

                  <div className="mt-6 space-y-3 text-sm text-text-secondary">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4" />
                      <span>{opportunity.location.label}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="w-4 h-4" />
                      <span>{opportunity.role} • {opportunity.employmentType} • {opportunity.workMode}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-4 h-4" />
                      <span>{opportunity.compensation}</span>
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl bg-surface-2 border border-surface-3 p-4">
                    <p className="text-xs uppercase tracking-wider text-text-secondary">Clinic brief</p>
                    <p className="mt-2 text-sm text-text-secondary leading-7">{opportunity.description}</p>
                  </div>

                  <div className="mt-6">
                    <p className="text-sm font-medium text-text-secondary mb-3">Required protocols</p>
                    <div className="flex flex-wrap gap-2">
                      {opportunity.requiredProtocols.map((protocol) => (
                        <span key={protocol} className="px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary">
                          {protocol}
                        </span>
                      ))}
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-secondary/5 border-secondary/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Sparkles className="w-20 h-20 text-secondary" />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-secondary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white">Live match score</h3>
                        <p className="text-sm text-secondary font-bold">
                          {opportunity.match?.score ?? 0}% compatibility
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {(opportunity.match?.reasons || []).map((reason) => (
                        <div key={reason} className="flex items-start gap-3 text-sm text-text-secondary">
                          <CheckCircle2 className="w-4 h-4 text-success mt-0.5 shrink-0" />
                          <span>{reason}</span>
                        </div>
                      ))}
                      {(opportunity.match?.gaps || []).map((gap) => (
                        <div key={gap} className="flex items-start gap-3 text-sm text-warning">
                          <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0" />
                          <span>{gap}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>

              <div className="lg:col-span-7">
                <Card className="p-6 md:p-8 bg-surface-1 border-surface-3">
                  <h2 className="text-xl font-bold text-white mb-6">Submit production application</h2>

                  {submitted ? (
                    <div className="rounded-2xl border border-success/20 bg-success/10 p-6 text-success">
                      Application submitted. Redirecting to your workforce dashboard.
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="rounded-2xl bg-[#0B0F14] border border-surface-3 p-5">
                        {profile ? (
                          <>
                            <div className="flex items-center justify-between gap-4">
                              <div>
                                <h3 className="font-bold text-white">
                                  {profile.firstName} {profile.lastName}
                                </h3>
                                <p className="text-sm text-text-secondary mt-1">
                                  {profile.role} • {profile.location.label}
                                </p>
                              </div>
                              <Link to="/workforce/profile">
                                <Button variant="outline" size="sm" className="border-surface-3 text-white hover:bg-surface-2">
                                  Edit Profile
                                </Button>
                              </Link>
                            </div>
                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                              <div className="rounded-xl border border-surface-3 bg-surface-2/70 p-3">
                                <p className="text-text-secondary">Profile strength</p>
                                <p className="mt-1 font-semibold text-white">{profile.profileStrength}%</p>
                              </div>
                              <div className="rounded-xl border border-surface-3 bg-surface-2/70 p-3">
                                <p className="text-text-secondary">Availability</p>
                                <p className="mt-1 font-semibold text-white capitalize">{profile.availabilityStatus}</p>
                              </div>
                              <div className="rounded-xl border border-surface-3 bg-surface-2/70 p-3">
                                <p className="text-text-secondary">Resume</p>
                                <p className="mt-1 font-semibold text-white">
                                  {profile.resumeUploaded ? profile.resumeFileName || 'Uploaded' : 'Missing'}
                                </p>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div>
                            <p className="text-white font-semibold">No practitioner profile found</p>
                            <p className="mt-2 text-sm text-text-secondary">
                              Create your profile before applying so the clinic receives your verified credentials and match data.
                            </p>
                            <div className="mt-4">
                              <Link to="/workforce/profile">
                                <Button className="bg-secondary hover:bg-secondary/90 text-white font-semibold">
                                  Create Practitioner Profile
                                </Button>
                              </Link>
                            </div>
                          </div>
                        )}
                      </div>

                      <label className="block space-y-2">
                        <span className="text-sm font-medium text-text-secondary">Cover note</span>
                        <textarea
                          value={coverNote}
                          onChange={(event) => setCoverNote(event.target.value)}
                          rows={7}
                          placeholder="Explain your relevant protocols, licensing coverage, patient load, and why you fit this clinic’s staffing need."
                          className="w-full rounded-2xl border border-surface-3 bg-[#0B0F14] px-4 py-3 text-white outline-none focus:border-secondary/40"
                        />
                      </label>

                      <label className="flex items-start gap-3 rounded-2xl border border-surface-3 bg-[#0B0F14] p-4">
                        <input
                          type="checkbox"
                          checked={authorized}
                          onChange={(event) => setAuthorized(event.target.checked)}
                          className="mt-1 w-4 h-4 rounded border-surface-3 bg-surface-2"
                        />
                        <span className="text-sm text-text-secondary leading-7">
                          I authorize Novalyte AI to send my practitioner profile, credentials, and contact information to {opportunity.clinicName} for this staffing request.
                        </span>
                      </label>

                      {error ? (
                        <div className="rounded-2xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">
                          {error}
                        </div>
                      ) : null}

                      <div className="flex flex-col sm:flex-row gap-3">
                        <Link to="/workforce/dashboard" className="sm:flex-1">
                          <Button variant="outline" className="w-full border-surface-3 text-white hover:bg-surface-2">
                            View Dashboard
                          </Button>
                        </Link>
                        <Button
                          type="submit"
                          className="sm:flex-1 bg-secondary hover:bg-secondary/90 text-white font-semibold"
                          disabled={submitting || !profile || opportunity.hasApplied}
                        >
                          {opportunity.hasApplied
                            ? `Already ${opportunity.applicationStatus?.replace(/_/g, ' ')}`
                            : submitting
                              ? 'Submitting application...'
                              : 'Submit Application'}
                          <Send className="ml-2 w-4 h-4" />
                        </Button>
                      </div>
                    </form>
                  )}
                </Card>
              </div>
            </div>
          ) : null}
        </main>
      </div>
    </WorkforceAuthGate>
  );
}

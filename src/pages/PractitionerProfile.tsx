import React from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Award,
  Briefcase,
  Clock,
  FileText,
  MapPin,
  ShieldCheck,
  Star,
  User,
} from 'lucide-react';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { WorkforceAuthGate } from '@/src/components/workforce/WorkforceAuthGate';
import { applicationStatusClasses, formatApplicationStatus, formatRelativeDate } from '@/src/lib/workforce/ui';
import type { PractitionerProfile, WorkforceApplication, WorkforceOffer } from '@/src/lib/workforce/types';
import { WorkforceApiError, WorkforceService } from '@/src/services/workforce';

export function PractitionerProfile() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [profile, setProfile] = React.useState<PractitionerProfile | null>(null);
  const [applications, setApplications] = React.useState<WorkforceApplication[]>([]);
  const [offers, setOffers] = React.useState<WorkforceOffer[]>([]);

  React.useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        setLoading(true);
        setError('');

        if (id) {
          const response = await WorkforceService.getPractitionerProfileById(id);
          if (!active) {
            return;
          }

          setProfile(response.profile);
          setApplications(response.applications);
          setOffers([]);
        } else {
          const dashboard = await WorkforceService.getPractitionerDashboard();
          if (!active) {
            return;
          }

          setProfile(dashboard.profile);
          setApplications(dashboard.applications);
          setOffers(dashboard.offers);
        }
      } catch (loadError) {
        if (!active) {
          return;
        }

        console.error('Failed to load practitioner profile:', loadError);
        setError(
          loadError instanceof WorkforceApiError
            ? loadError.message
            : 'Failed to load practitioner profile.',
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProfile();
    return () => {
      active = false;
    };
  }, [id]);

  const isOwnProfile = !id;

  return (
    <WorkforceAuthGate
      title={isOwnProfile ? 'View Your Practitioner Profile' : 'View Candidate Profile'}
      description="Profiles, assignment history, and application stages now resolve against the live workforce exchange."
    >
      <div className="min-h-screen bg-black text-white pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-8">
          {loading ? (
            <Card className="p-8 bg-surface-1 border-surface-3 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </Card>
          ) : null}

          {!loading && error ? (
            <Card className="p-6 bg-danger/10 border-danger/20 text-danger">
              {error}
            </Card>
          ) : null}

          {!loading && !profile && !error ? (
            <Card className="p-8 bg-surface-1 border-surface-3">
              <h1 className="text-3xl font-display font-bold text-white">No practitioner profile yet</h1>
              <p className="mt-3 text-text-secondary">
                Create your profile to unlock staffing requests, interviews, and offers.
              </p>
              <div className="mt-6">
                <Link to="/workforce/profile">
                  <Button className="bg-primary text-black hover:bg-primary-hover font-semibold">
                    Create Profile
                  </Button>
                </Link>
              </div>
            </Card>
          ) : null}

          {profile ? (
            <>
              <Card className="p-8 bg-surface-1 border-surface-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />

                <div className="relative z-10 flex flex-col lg:flex-row justify-between gap-8">
                  <div className="flex items-start gap-6">
                    <div className="w-24 h-24 rounded-full bg-surface-2 border border-surface-3 flex items-center justify-center">
                      <User className="w-10 h-10 text-text-secondary" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h1 className="text-3xl font-display font-bold">
                          {profile.firstName} {profile.lastName}
                        </h1>
                        <span className={`px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${
                          profile.verified
                            ? 'border-success/20 bg-success/10 text-success'
                            : 'border-warning/20 bg-warning/10 text-warning'
                        }`}>
                          {profile.verified ? 'Verified' : 'Pending verification'}
                        </span>
                      </div>
                      <p className="mt-2 text-lg text-text-secondary">{profile.role}</p>
                      <div className="mt-4 flex flex-wrap gap-4 text-sm text-text-secondary">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4" />
                          {profile.location.label}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          {profile.yearsExperience} years experience
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Briefcase className="w-4 h-4" />
                          {profile.targetCompensation}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="min-w-[240px] rounded-2xl bg-[#0B0F14] border border-surface-3 p-5">
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-text-secondary">Profile strength</p>
                    <div className="mt-3 flex items-end justify-between">
                      <span className="text-4xl font-display font-bold text-primary">{profile.profileStrength}%</span>
                      {isOwnProfile ? (
                        <Link to="/workforce/profile">
                          <Button variant="outline" size="sm" className="border-surface-3 text-white hover:bg-surface-2">
                            Edit
                          </Button>
                        </Link>
                      ) : null}
                    </div>
                    <div className="mt-4 h-2 rounded-full bg-surface-2 overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${profile.profileStrength}%` }} />
                    </div>
                  </div>
                </div>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <Card className="p-6 bg-surface-1 border-surface-3">
                    <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                      <FileText className="w-5 h-5 text-primary" />
                      Summary
                    </h2>
                    <p className="text-text-secondary leading-7">{profile.summary || 'No professional summary has been added yet.'}</p>
                  </Card>

                  <Card className="p-6 bg-surface-1 border-surface-3">
                    <h2 className="text-xl font-bold flex items-center gap-2 mb-5">
                      <Award className="w-5 h-5 text-primary" />
                      Credentials
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="rounded-2xl bg-[#0B0F14] border border-surface-3 p-4">
                        <p className="text-xs uppercase tracking-wider text-text-secondary">License states</p>
                        <p className="mt-2 font-semibold text-white">
                          {profile.licenseStates.length ? profile.licenseStates.join(', ') : 'Not provided'}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-[#0B0F14] border border-surface-3 p-4">
                        <p className="text-xs uppercase tracking-wider text-text-secondary">License number</p>
                        <p className="mt-2 font-semibold text-white">{profile.licenseNumber || 'Not provided'}</p>
                      </div>
                      <div className="rounded-2xl bg-[#0B0F14] border border-surface-3 p-4">
                        <p className="text-xs uppercase tracking-wider text-text-secondary">NPI</p>
                        <p className="mt-2 font-semibold text-white">{profile.npi || 'Not provided'}</p>
                      </div>
                      <div className="rounded-2xl bg-[#0B0F14] border border-surface-3 p-4">
                        <p className="text-xs uppercase tracking-wider text-text-secondary">DEA</p>
                        <p className="mt-2 font-semibold text-white">{profile.dea || 'Not provided'}</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6 bg-surface-1 border-surface-3">
                    <h2 className="text-xl font-bold flex items-center gap-2 mb-5">
                      <Star className="w-5 h-5 text-primary" />
                      Specialties and protocols
                    </h2>
                    <div className="space-y-5">
                      <div>
                        <p className="text-sm font-medium text-text-secondary mb-3">Specialties</p>
                        <div className="flex flex-wrap gap-2">
                          {profile.specialties.length ? profile.specialties.map((specialty) => (
                            <span key={specialty} className="px-3 py-1.5 rounded-full bg-surface-2 border border-surface-3 text-sm text-white">
                              {specialty}
                            </span>
                          )) : <span className="text-sm text-text-secondary">No specialties added.</span>}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text-secondary mb-3">Protocols</p>
                        <div className="flex flex-wrap gap-2">
                          {profile.protocols.length ? profile.protocols.map((protocol) => (
                            <span key={protocol} className="px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary">
                              {protocol}
                            </span>
                          )) : <span className="text-sm text-text-secondary">No protocols added.</span>}
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>

                <div className="space-y-8">
                  <Card className="p-6 bg-surface-1 border-surface-3">
                    <h2 className="text-xl font-bold flex items-center gap-2 mb-5">
                      <ShieldCheck className="w-5 h-5 text-primary" />
                      Availability
                    </h2>
                    <div className="space-y-4 text-sm">
                      <div className="rounded-2xl bg-[#0B0F14] border border-surface-3 p-4">
                        <p className="text-xs uppercase tracking-wider text-text-secondary">Status</p>
                        <p className="mt-2 text-white font-semibold capitalize">{profile.availabilityStatus}</p>
                      </div>
                      <div className="rounded-2xl bg-[#0B0F14] border border-surface-3 p-4">
                        <p className="text-xs uppercase tracking-wider text-text-secondary">Work modes</p>
                        <p className="mt-2 text-white font-semibold">{profile.workModes.join(', ') || 'Not specified'}</p>
                      </div>
                      <div className="rounded-2xl bg-[#0B0F14] border border-surface-3 p-4">
                        <p className="text-xs uppercase tracking-wider text-text-secondary">Employment preferences</p>
                        <p className="mt-2 text-white font-semibold">{profile.employmentPreferences.join(', ') || 'Not specified'}</p>
                      </div>
                      <div className="rounded-2xl bg-[#0B0F14] border border-surface-3 p-4">
                        <p className="text-xs uppercase tracking-wider text-text-secondary">Travel preference</p>
                        <p className="mt-2 text-white font-semibold">{profile.travelPreference || 'Not specified'}</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6 bg-surface-1 border-surface-3">
                    <h2 className="text-xl font-bold flex items-center gap-2 mb-5">
                      <Briefcase className="w-5 h-5 text-primary" />
                      Active workflow
                    </h2>
                    <div className="space-y-4">
                      {applications.length ? applications.slice(0, 5).map((application) => (
                        <div key={application.id} className="rounded-2xl bg-[#0B0F14] border border-surface-3 p-4">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="font-semibold text-white">{application.requestTitle}</p>
                              <p className="text-sm text-text-secondary mt-1">{application.clinicName}</p>
                            </div>
                            <span className={`px-2.5 py-1 rounded-full border text-[10px] uppercase tracking-wider font-bold ${applicationStatusClasses(application.status)}`}>
                              {formatApplicationStatus(application.status)}
                            </span>
                          </div>
                          <div className="mt-3 flex items-center justify-between text-xs text-text-secondary">
                            <span>Match {application.match.score}%</span>
                            <span>{formatRelativeDate(application.updatedAt)}</span>
                          </div>
                        </div>
                      )) : (
                        <div className="rounded-2xl bg-[#0B0F14] border border-dashed border-surface-3 p-5 text-sm text-text-secondary">
                          No active applications yet.
                        </div>
                      )}
                    </div>

                    {offers.length ? (
                      <div className="mt-5 rounded-2xl bg-success/10 border border-success/20 p-4">
                        <p className="text-xs uppercase tracking-wider text-success font-bold">Open offers</p>
                        <p className="mt-2 text-white font-semibold">
                          {offers.filter((offer) => offer.status === 'extended').length} active offer{offers.filter((offer) => offer.status === 'extended').length === 1 ? '' : 's'}
                        </p>
                      </div>
                    ) : null}

                    <div className="mt-5">
                      {isOwnProfile ? (
                        <Link to="/workforce/jobs">
                          <Button className="w-full bg-primary text-black hover:bg-primary-hover font-semibold">
                            Explore Opportunities
                          </Button>
                        </Link>
                      ) : (
                        <Link to="/dashboard/workforce?tab=pipeline">
                          <Button className="w-full bg-primary text-black hover:bg-primary-hover font-semibold">
                            Return to Staffing Pipeline
                          </Button>
                        </Link>
                      )}
                    </div>
                  </Card>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </WorkforceAuthGate>
  );
}

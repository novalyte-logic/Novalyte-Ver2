import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Link, useParams } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileText,
  Globe,
  Mail,
  MapPin,
  MessageSquare,
  Microscope,
  Phone,
  Shield,
  Sparkles,
  Star,
  Users,
} from 'lucide-react';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import {
  PublicService,
  type ClinicAvailabilityResponse,
  type PublicClinicCard,
  type PublicClinicProfile,
} from '@/src/services/public';
import { buildClinicAssessmentPath } from '@/src/lib/patientJourney';

function HeroMedia({ clinic }: { clinic: PublicClinicProfile }) {
  if (clinic.image) {
    return (
      <img
        src={clinic.image}
        alt={clinic.name}
        className="absolute inset-0 w-full h-full object-cover"
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(53,212,255,0.24),_transparent_38%),radial-gradient(circle_at_75%_25%,_rgba(255,255,255,0.08),_transparent_25%),linear-gradient(135deg,#09111B_0%,#05070A_55%,#040507_100%)]" />
  );
}

function RelatedClinicCard({ clinic }: { clinic: PublicClinicCard }) {
  return (
    <Link to={`/clinics/${clinic.id}`}>
      <Card className="overflow-hidden bg-[#0B0F14] border-surface-3 hover:border-primary/30 transition-all group cursor-pointer h-full flex flex-col">
        <div className="h-40 relative overflow-hidden">
          {clinic.image ? (
            <img
              src={clinic.image}
              alt={clinic.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(53,212,255,0.24),_transparent_40%),linear-gradient(135deg,#0D1622_0%,#081019_52%,#05070A_100%)]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F14] to-transparent" />
        </div>
        <div className="p-5 flex-grow flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-white text-lg mb-1 group-hover:text-primary transition-colors">{clinic.name}</h3>
            <div className="flex flex-wrap items-center gap-3 text-text-secondary text-sm mb-4">
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {clinic.location}</span>
              <span className="flex items-center gap-1 text-warning"><Star className="w-3.5 h-3.5 fill-current" /> {clinic.rating.toFixed(1)}</span>
            </div>
            <p className="text-sm text-text-secondary leading-6">{clinic.description}</p>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {clinic.tags.slice(0, 3).map((tag) => (
              <span key={`${clinic.id}-${tag}`} className="px-2 py-1 rounded bg-surface-2 border border-surface-3 text-xs text-text-secondary">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Card>
    </Link>
  );
}

export function ClinicProfile() {
  const { id } = useParams<{ id: string }>();
  const [clinic, setClinic] = useState<PublicClinicProfile | null>(null);
  const [relatedClinics, setRelatedClinics] = useState<PublicClinicCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [availability, setAvailability] = useState<ClinicAvailabilityResponse | null>(null);
  const [availabilityLoading, setAvailabilityLoading] = useState(true);
  const [availabilityError, setAvailabilityError] = useState('');
  const [availabilityReloadToken, setAvailabilityReloadToken] = useState(0);

  useEffect(() => {
    let active = true;

    const loadClinic = async () => {
      if (!id) {
        setError('Clinic not found.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');
      setAvailabilityLoading(true);
      setAvailabilityError('');

      try {
        const response = await PublicService.getClinicProfile(id);
        if (!active) {
          return;
        }
        setClinic(response.clinic);
        setRelatedClinics(response.relatedClinics);

        try {
          const availabilityResponse = await PublicService.getClinicAvailability(id);
          if (!active) {
            return;
          }
          setAvailability(availabilityResponse);
        } catch (availabilityLoadError) {
          if (!active) {
            return;
          }
          setAvailability(null);
          setAvailabilityError(
            availabilityLoadError instanceof Error
              ? availabilityLoadError.message
              : 'Unable to load clinic availability right now.',
          );
        } finally {
          if (active) {
            setAvailabilityLoading(false);
          }
        }
      } catch (loadError) {
        if (!active) {
          return;
        }
        setError(loadError instanceof Error ? loadError.message : 'Failed to load clinic profile.');
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadClinic();

    return () => {
      active = false;
    };
  }, [availabilityReloadToken, id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05070A] flex items-center justify-center">
        <div className="flex items-center gap-3 rounded-2xl border border-surface-3 bg-[#0B0F14]/80 px-6 py-5 text-white">
          <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          Loading clinic profile...
        </div>
      </div>
    );
  }

  if (!clinic || error) {
    return (
      <div className="min-h-screen bg-[#05070A] flex items-center justify-center px-4">
        <Card className="w-full max-w-xl border-danger/20 bg-danger/10 p-8 text-center">
          <Activity className="mx-auto h-12 w-12 text-danger" />
          <h1 className="mt-4 text-2xl font-display font-bold text-white">Clinic profile unavailable</h1>
          <p className="mt-3 text-sm text-danger">{error || 'This clinic is not currently published.'}</p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/directory">
              <Button className="font-semibold">Return to Directory</Button>
            </Link>
            <Link to="/contact?role=patient&topic=clinic_directory">
              <Button variant="outline" className="border-surface-3 hover:bg-surface-2">Contact Concierge</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  const assessmentPath = buildClinicAssessmentPath(clinic, 'clinic_profile');

  return (
    <div className="min-h-screen bg-[#05070A] font-sans text-text-primary pb-24">
      <div className="relative h-[56vh] min-h-[460px] w-full overflow-hidden">
        <HeroMedia clinic={clinic} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05070A] via-[#05070A]/65 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#05070A]/80 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="max-w-4xl"
            >
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <div className="px-3 py-1 rounded-full bg-success/20 border border-success/30 flex items-center gap-1.5 backdrop-blur-md">
                  <Shield className="w-3.5 h-3.5 text-success" />
                  <span className="text-xs font-bold text-success tracking-wide uppercase">Verified directory listing</span>
                </div>
                <div className="px-3 py-1 rounded-full bg-primary/20 border border-primary/30 flex items-center gap-1.5 backdrop-blur-md">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xs font-bold text-white tracking-wide uppercase">{clinic.acceptsNewPatients ? 'Accepting new patients' : 'Waitlist or limited capacity'}</span>
                </div>
              </div>

              <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-4 tracking-tight leading-tight">
                {clinic.name}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-text-secondary text-lg">
                <span className="flex items-center gap-2"><MapPin className="w-5 h-5 text-primary" /> {clinic.location}</span>
                <span className="flex items-center gap-2 text-warning"><Star className="w-5 h-5 fill-current" /> {clinic.rating.toFixed(1)} ({clinic.reviewCount} reviews)</span>
                <span>{clinic.pricingTier}</span>
              </div>

              <p className="mt-6 max-w-3xl text-base md:text-lg text-text-secondary leading-8">
                {clinic.description}
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-14">
            <section>
              <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-2">
                <Activity className="w-6 h-6 text-primary" /> Clinic Overview
              </h2>
              <div className="flex flex-wrap gap-2 mb-6">
                {clinic.specialties.map((specialty) => (
                  <span key={specialty} className="px-4 py-2 rounded-lg bg-[#0B0F14] border border-surface-3 text-sm font-medium text-white">
                    {specialty}
                  </span>
                ))}
              </div>
              <p className="text-text-secondary text-lg leading-relaxed">
                {clinic.description}
              </p>
            </section>

            <section>
              <Card className="p-8 bg-gradient-to-br from-[#0B0F14] to-[#05070A] border-primary/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="text-2xl font-display font-bold text-white">Care Model Snapshot</h2>
                  </div>

                  <p className="text-text-secondary text-lg mb-8">
                    This profile reflects the clinic data currently published to the Novalyte directory. Intake, booking, and concierge routing use the live backend record for this clinic.
                  </p>

                  {clinic.outcomes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {clinic.outcomes.map((outcome) => (
                        <div key={`${outcome.metric}-${outcome.label}`} className="p-4 rounded-xl bg-[#05070A] border border-surface-3 text-center">
                          <div className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-1">
                            {outcome.metric}
                          </div>
                          <div className="text-sm font-bold text-white mb-1">{outcome.label}</div>
                          <div className="text-xs text-text-secondary uppercase tracking-wider">{outcome.timeframe}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Card className="border-surface-3 bg-[#05070A] p-5">
                      <p className="font-semibold text-white">Outcome metrics not published yet</p>
                      <p className="mt-2 text-sm text-text-secondary">The clinic is visible and routable, but quantified outcome data has not been added to its public profile yet.</p>
                    </Card>
                  )}
                </div>
              </Card>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-2">
                <Microscope className="w-6 h-6 text-primary" /> Protocols
              </h2>
              {clinic.protocols.length > 0 ? (
                <div className="space-y-4">
                  {clinic.protocols.map((protocol) => (
                    <Card key={protocol.name} className="p-6 bg-[#0B0F14] border-surface-3 hover:border-primary/30 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                        <h3 className="text-xl font-bold text-white">{protocol.name}</h3>
                        <div className="flex items-center gap-3 text-sm font-medium">
                          <span className="px-3 py-1 rounded bg-surface-2 text-text-secondary">{protocol.duration}</span>
                          <span className="px-3 py-1 rounded bg-primary/10 text-primary border border-primary/20">{protocol.price}</span>
                        </div>
                      </div>
                      <p className="text-text-secondary leading-relaxed">{protocol.description}</p>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-6 bg-[#0B0F14] border-surface-3">
                  <p className="font-semibold text-white">Protocol catalog available during intake</p>
                  <p className="mt-2 text-sm text-text-secondary">This clinic has not published protocol cards to the directory yet. Continue to intake or contact concierge for current treatment availability.</p>
                </Card>
              )}
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-2">
                <Users className="w-6 h-6 text-primary" /> Medical Team
              </h2>
              {clinic.providers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {clinic.providers.map((provider) => (
                    <Card key={`${provider.name}-${provider.role}`} className="p-6 bg-[#0B0F14] border-surface-3">
                      <div className="flex items-center gap-4 mb-4">
                        {provider.image ? (
                          <img
                            src={provider.image}
                            alt={provider.name}
                            className="w-16 h-16 rounded-full object-cover border-2 border-surface-3"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full border-2 border-surface-3 bg-surface-2 flex items-center justify-center text-white font-semibold">
                            {provider.name.slice(0, 1)}
                          </div>
                        )}
                        <div>
                          <h3 className="font-bold text-white text-lg">{provider.name}</h3>
                          {provider.credentials ? <p className="text-primary text-sm font-medium">{provider.credentials}</p> : null}
                          <p className="text-text-secondary text-sm">{provider.role}</p>
                        </div>
                      </div>
                      <p className="text-text-secondary text-sm leading-relaxed">
                        {provider.bio || 'Provider biography has not been published yet.'}
                      </p>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-6 bg-[#0B0F14] border-surface-3">
                  <p className="font-semibold text-white">Provider roster not published</p>
                  <p className="mt-2 text-sm text-text-secondary">Clinical staffing details are often shared during the intake and scheduling process rather than on the public directory page.</p>
                </Card>
              )}
            </section>

            {clinic.gallery.length > 0 ? (
              <section>
                <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-primary" /> Facility & Experience
                </h2>
                <div className={`grid gap-4 ${clinic.gallery.length === 1 ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-3'}`}>
                  {clinic.gallery.map((image, index) => (
                    <div
                      key={`${image}-${index}`}
                      className={`rounded-xl overflow-hidden border border-surface-3 ${index === 0 && clinic.gallery.length > 1 ? 'lg:col-span-3 h-64' : 'h-48'}`}
                    >
                      <img src={image} alt={`${clinic.name} facility`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                    </div>
                  ))}
                </div>
              </section>
            ) : null}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <Card className="p-6 bg-[#0B0F14] border-primary/30 shadow-[0_0_40px_rgba(6,182,212,0.1)]">
                <h3 className="text-2xl font-display font-bold text-white mb-2">Ready to Start?</h3>
                <p className="text-text-secondary text-sm mb-6">
                  Novalyte uses a standardized intake workflow before consultation routing so the right clinic receives the right patient context.
                </p>

                <div className="space-y-6">
                  <div className="space-y-4 relative before:absolute before:inset-0 before:ml-3.5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary before:via-surface-3 before:to-transparent">
                    {[
                      { label: '1. Clinical Triage', icon: FileText, active: true },
                      { label: '2. Assessment Review', icon: Microscope, active: false },
                      { label: '3. Consultation Routing', icon: Calendar, active: false },
                    ].map((step) => (
                      <div key={step.label} className="relative flex items-center gap-4">
                        <div className={`flex items-center justify-center w-7 h-7 rounded-full border-2 ${step.active ? 'border-primary text-primary' : 'border-surface-3 text-text-secondary'} bg-[#05070A] z-10`}>
                          <step.icon className="w-3 h-3" />
                        </div>
                        <div className={`flex-grow p-3 rounded-lg ${step.active ? 'bg-surface-2 border border-surface-3' : 'bg-surface-1 border border-surface-2 opacity-60'}`}>
                          <h4 className="font-bold text-white text-sm">{step.label}</h4>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Link to={assessmentPath} className="block">
                    <Button className="w-full h-14 text-lg font-bold bg-white text-black hover:bg-gray-200">
                      Start Assessment <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <Link to={`/contact?role=patient&topic=clinic_${encodeURIComponent(clinic.id)}`}>
                    <Button variant="outline" className="w-full gap-2">
                      <MessageSquare className="w-4 h-4" /> Contact Concierge
                    </Button>
                  </Link>
                </div>
              </Card>

              <Card className="p-6 bg-[#0B0F14] border-surface-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-white">Next Available Consultation Windows</h3>
                    <p className="mt-1 text-sm text-text-secondary">Availability is generated from the live clinic record. Final booking happens after intake.</p>
                  </div>
                  <Calendar className="w-5 h-5 text-primary" />
                </div>

                {availabilityLoading ? (
                  <div className="mt-5 rounded-xl border border-surface-3 bg-[#05070A] px-4 py-5 text-sm text-text-secondary">
                    Loading live availability...
                  </div>
                ) : availabilityError ? (
                  <div className="mt-5 space-y-3">
                    <div className="rounded-xl border border-danger/20 bg-danger/10 px-4 py-4 text-sm text-danger">
                      {availabilityError}
                    </div>
                    <Button variant="outline" className="w-full" onClick={() => setAvailabilityReloadToken((value) => value + 1)}>
                      Retry Availability
                    </Button>
                  </div>
                ) : availability?.slots.length ? (
                  <div className="mt-5 space-y-3">
                    {availability.slots.slice(0, 3).map((slot) => (
                      <div key={slot.key} className="rounded-xl border border-surface-3 bg-[#05070A] px-4 py-4">
                        <p className="font-semibold text-white">{slot.label}</p>
                        <p className="mt-1 text-sm text-text-secondary">
                          Complete the Novalyte intake to request this slot with {clinic.name}.
                        </p>
                      </div>
                    ))}
                    <Link to={assessmentPath} className="block">
                      <Button variant="outline" className="w-full">
                        Continue to Intake
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="mt-5 rounded-xl border border-surface-3 bg-[#05070A] px-4 py-5 text-sm text-text-secondary">
                    This clinic does not have open consultation windows published right now. You can still complete intake and our concierge team will route the best next option.
                  </div>
                )}
              </Card>

              <Card className="p-6 bg-[#0B0F14] border-surface-3">
                <h3 className="font-bold text-white mb-4">Clinic Information</h3>
                <div className="space-y-4">
                  <InfoRow icon={MapPin} label="Location" value={clinic.address} />
                  <InfoRow icon={Clock} label="Hours" value={clinic.hours} />
                  {clinic.phone ? <InfoRow icon={Phone} label="Phone" value={clinic.phone} /> : null}
                  {clinic.email ? <InfoRow icon={Mail} label="Email" value={clinic.email} /> : null}
                  {clinic.website ? (
                    <div className="flex items-start gap-3 text-text-secondary text-sm">
                      <Globe className="w-5 h-5 text-primary shrink-0" />
                      <div>
                        <p className="text-white font-medium mb-1">Website</p>
                        <a href={clinic.website} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors break-all">
                          {clinic.website.replace(/^https?:\/\//, '')}
                        </a>
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className="mt-6 pt-6 border-t border-surface-3">
                  <h4 className="font-bold text-white text-sm mb-3">Amenities & Features</h4>
                  <ul className="space-y-2">
                    {clinic.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-text-secondary">
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

      {relatedClinics.length > 0 ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 pt-12 border-t border-surface-3">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-display font-bold text-white">Related Clinics</h2>
            <Link to="/directory" className="text-primary hover:text-primary-hover text-sm font-bold flex items-center gap-1">
              View Directory <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedClinics.map((relatedClinic) => (
              <div key={relatedClinic.id}>
                <RelatedClinicCard clinic={relatedClinic} />
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 text-text-secondary text-sm">
      <Icon className="w-5 h-5 text-primary shrink-0" />
      <div>
        <p className="text-white font-medium mb-1">{label}</p>
        <p>{value}</p>
      </div>
    </div>
  );
}

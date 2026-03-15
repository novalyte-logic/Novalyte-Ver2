import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  Briefcase,
  FileText,
  MapPin,
  Save,
  ShieldCheck,
  Sparkles,
  User,
} from 'lucide-react';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { WorkforceAuthGate } from '@/src/components/workforce/WorkforceAuthGate';
import { useAuth } from '@/src/lib/auth/AuthContext';
import { calculateProfileStrength } from '@/src/lib/workforce/scoring';
import type {
  AvailabilityStatus,
  EmploymentType,
  PractitionerProfile,
  PractitionerProfileInput,
  PractitionerRole,
  WorkMode,
} from '@/src/lib/workforce/types';
import { WorkforceApiError, WorkforceService } from '@/src/services/workforce';

const ROLE_OPTIONS: PractitionerRole[] = [
  'Medical Director (MD/DO)',
  'Nurse Practitioner (NP)',
  'Physician Assistant (PA)',
  'Registered Nurse (RN)',
  'Medical Assistant',
  'Other',
];

const PROTOCOL_OPTIONS = [
  'TRT / HRT',
  'Peptide Therapy',
  'Weight Loss (GLP-1)',
  'IV Therapy',
  'Longevity Medicine',
  'Telehealth Intake',
  'Aesthetics',
  'Phlebotomy',
];

const EMPLOYMENT_OPTIONS: EmploymentType[] = [
  'Full-time',
  'Part-time',
  'Contract',
  'Per Diem',
  'Telehealth Only',
];

const WORK_MODE_OPTIONS: WorkMode[] = ['Onsite', 'Hybrid', 'Remote'];
const AVAILABILITY_OPTIONS: AvailabilityStatus[] = [
  'available',
  'interviewing',
  'placed',
  'inactive',
];

const EMPTY_FORM: PractitionerProfileInput = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  city: '',
  state: '',
  role: 'Nurse Practitioner (NP)',
  yearsExperience: 0,
  licenseStates: [],
  licenseNumber: '',
  npi: '',
  dea: '',
  specialties: [],
  protocols: [],
  employmentPreferences: [],
  workModes: ['Remote'],
  availabilityStatus: 'available',
  targetCompensation: '',
  targetRateMin: undefined,
  targetRateMax: undefined,
  travelPreference: '',
  summary: '',
  resumeFileName: '',
  resumeUploaded: false,
  searchable: true,
};

function joinValues(values: string[]) {
  return values.join(', ');
}

function parseCsv(value: string) {
  return value
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function mapProfileToInput(profile: PractitionerProfile): PractitionerProfileInput {
  return {
    firstName: profile.firstName,
    lastName: profile.lastName,
    email: profile.email,
    phone: profile.phone,
    city: profile.location.city,
    state: profile.location.state,
    role: profile.role,
    yearsExperience: profile.yearsExperience,
    licenseStates: profile.licenseStates,
    licenseNumber: profile.licenseNumber || '',
    npi: profile.npi || '',
    dea: profile.dea || '',
    specialties: profile.specialties,
    protocols: profile.protocols,
    employmentPreferences: profile.employmentPreferences,
    workModes: profile.workModes,
    availabilityStatus: profile.availabilityStatus,
    targetCompensation: profile.targetCompensation,
    targetRateMin: profile.targetRateMin,
    targetRateMax: profile.targetRateMax,
    travelPreference: profile.travelPreference,
    summary: profile.summary,
    resumeFileName: profile.resumeFileName || '',
    resumeUploaded: profile.resumeUploaded,
    searchable: profile.searchable,
  };
}

const ToggleChip: React.FC<{
  active: boolean;
  label: string;
  onClick: () => void;
}> = ({
  active,
  label,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
        active
          ? 'border-secondary/30 bg-secondary/10 text-secondary'
          : 'border-surface-3 bg-surface-2 text-text-secondary hover:text-white'
      }`}
    >
      {label}
    </button>
  );
};

export function WorkforceProfile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = React.useState<PractitionerProfileInput>(EMPTY_FORM);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');

  React.useEffect(() => {
    let active = true;

    async function loadProfile() {
      if (!user) {
        return;
      }

      try {
        setLoading(true);
        const profile = await WorkforceService.getPractitionerProfile();
        if (!active) {
          return;
        }

        if (profile) {
          setFormData(mapProfileToInput(profile));
        } else {
          setFormData((current) => ({
            ...EMPTY_FORM,
            ...current,
            email: user.email || '',
          }));
        }
      } catch (loadError) {
        if (!active) {
          return;
        }
        console.error('Failed to load practitioner profile:', loadError);
        setError('Failed to load your practitioner profile.');
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
  }, [user]);

  const profileStrength = calculateProfileStrength({
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    phone: formData.phone,
    location: {
      city: formData.city,
      state: formData.state,
      label: `${formData.city}, ${formData.state}`,
    },
    role: formData.role,
    licenseStates: formData.licenseStates,
    licenseNumber: formData.licenseNumber,
    yearsExperience: formData.yearsExperience,
    protocols: formData.protocols,
    employmentPreferences: formData.employmentPreferences,
    workModes: formData.workModes,
    summary: formData.summary,
    resumeUploaded: formData.resumeUploaded,
  });

  const updateField = <K extends keyof PractitionerProfileInput>(
    field: K,
    value: PractitionerProfileInput[K],
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
    setSuccess('');
    setError('');
  };

  const toggleArrayValue = (
    field: 'protocols' | 'employmentPreferences' | 'workModes',
    value: string,
  ) => {
    const currentValues = formData[field] as string[];
    updateField(
      field,
      (currentValues.includes(value)
        ? currentValues.filter((entry) => entry !== value)
        : [...currentValues, value]) as PractitionerProfileInput[typeof field],
    );
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      const profile = await WorkforceService.savePractitionerProfile({
        ...formData,
        email: user?.email || formData.email,
      });
      setFormData(mapProfileToInput(profile));
      setSuccess('Practitioner profile saved to the workforce exchange.');
    } catch (saveError) {
      console.error('Failed to save practitioner profile:', saveError);
      setError(
        saveError instanceof WorkforceApiError
          ? saveError.message
          : 'Failed to save practitioner profile.',
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <WorkforceAuthGate
      title="Create Your Practitioner Profile"
      description="Build a searchable practitioner record that clinics, staffing workflows, interviews, and offers can all reference in production."
    >
      <div className="min-h-screen bg-[#05070A] px-6 py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-secondary/20 bg-secondary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-secondary">
                <Sparkles className="w-4 h-4" />
                Workforce profile
              </div>
              <h1 className="mt-5 text-4xl font-display font-bold text-white">
                Production practitioner record
              </h1>
              <p className="mt-3 max-w-3xl text-text-secondary leading-7">
                Your profile now backs real opportunity scoring, applications, interviews, and offers. Keep it complete so the clinic-side exchange can match you accurately.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/workforce/dashboard">
                <Button variant="outline" className="w-full border-surface-3 text-white hover:bg-surface-2">
                  View Dashboard
                </Button>
              </Link>
              <Button onClick={handleSave} className="w-full bg-secondary hover:bg-secondary/90 text-white font-semibold" disabled={saving || loading}>
                {saving ? 'Saving profile...' : 'Save Profile'}
                <Save className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[1.15fr_0.85fr] gap-8">
            <div className="space-y-6">
              <Card className="bg-[#0B0F14] border-surface-3 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-11 h-11 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center">
                    <User className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Identity</h2>
                    <p className="text-sm text-text-secondary">Core contact details for the exchange.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-text-secondary">First name</span>
                    <input
                      value={formData.firstName}
                      onChange={(event) => updateField('firstName', event.target.value)}
                      className="w-full rounded-xl border border-surface-3 bg-surface-2 px-4 py-3 text-white outline-none focus:border-secondary/40"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-text-secondary">Last name</span>
                    <input
                      value={formData.lastName}
                      onChange={(event) => updateField('lastName', event.target.value)}
                      className="w-full rounded-xl border border-surface-3 bg-surface-2 px-4 py-3 text-white outline-none focus:border-secondary/40"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-text-secondary">Email</span>
                    <input
                      value={formData.email}
                      onChange={(event) => updateField('email', event.target.value)}
                      className="w-full rounded-xl border border-surface-3 bg-surface-2 px-4 py-3 text-white outline-none focus:border-secondary/40"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-text-secondary">Phone</span>
                    <input
                      value={formData.phone}
                      onChange={(event) => updateField('phone', event.target.value)}
                      className="w-full rounded-xl border border-surface-3 bg-surface-2 px-4 py-3 text-white outline-none focus:border-secondary/40"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-text-secondary">City</span>
                    <input
                      value={formData.city}
                      onChange={(event) => updateField('city', event.target.value)}
                      className="w-full rounded-xl border border-surface-3 bg-surface-2 px-4 py-3 text-white outline-none focus:border-secondary/40"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-text-secondary">State</span>
                    <input
                      value={formData.state}
                      onChange={(event) => updateField('state', event.target.value)}
                      className="w-full rounded-xl border border-surface-3 bg-surface-2 px-4 py-3 text-white outline-none focus:border-secondary/40"
                    />
                  </label>
                </div>
              </Card>

              <Card className="bg-[#0B0F14] border-surface-3 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Credentials</h2>
                    <p className="text-sm text-text-secondary">Licensure and practice eligibility.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="space-y-2 md:col-span-2">
                    <span className="text-sm font-medium text-text-secondary">Primary role</span>
                    <select
                      value={formData.role}
                      onChange={(event) => updateField('role', event.target.value as PractitionerRole)}
                      className="w-full rounded-xl border border-surface-3 bg-surface-2 px-4 py-3 text-white outline-none focus:border-primary/40"
                    >
                      {ROLE_OPTIONS.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-text-secondary">Years of experience</span>
                    <input
                      type="number"
                      min={0}
                      value={formData.yearsExperience}
                      onChange={(event) => updateField('yearsExperience', Number(event.target.value))}
                      className="w-full rounded-xl border border-surface-3 bg-surface-2 px-4 py-3 text-white outline-none focus:border-primary/40"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-text-secondary">License states</span>
                    <input
                      value={joinValues(formData.licenseStates)}
                      onChange={(event) => updateField('licenseStates', parseCsv(event.target.value))}
                      placeholder="TX, FL, NY"
                      className="w-full rounded-xl border border-surface-3 bg-surface-2 px-4 py-3 text-white outline-none focus:border-primary/40"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-text-secondary">License number</span>
                    <input
                      value={formData.licenseNumber}
                      onChange={(event) => updateField('licenseNumber', event.target.value)}
                      className="w-full rounded-xl border border-surface-3 bg-surface-2 px-4 py-3 text-white outline-none focus:border-primary/40"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-text-secondary">NPI</span>
                    <input
                      value={formData.npi}
                      onChange={(event) => updateField('npi', event.target.value)}
                      className="w-full rounded-xl border border-surface-3 bg-surface-2 px-4 py-3 text-white outline-none focus:border-primary/40"
                    />
                  </label>
                  <label className="space-y-2 md:col-span-2">
                    <span className="text-sm font-medium text-text-secondary">DEA</span>
                    <input
                      value={formData.dea}
                      onChange={(event) => updateField('dea', event.target.value)}
                      className="w-full rounded-xl border border-surface-3 bg-surface-2 px-4 py-3 text-white outline-none focus:border-primary/40"
                    />
                  </label>
                </div>
              </Card>

              <Card className="bg-[#0B0F14] border-surface-3 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-11 h-11 rounded-xl bg-warning/10 border border-warning/20 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-warning" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Clinical fit</h2>
                    <p className="text-sm text-text-secondary">Specialties, protocols, and work preferences used for matching.</p>
                  </div>
                </div>

                <label className="space-y-2 block">
                  <span className="text-sm font-medium text-text-secondary">Specialties</span>
                  <input
                    value={joinValues(formData.specialties)}
                    onChange={(event) => updateField('specialties', parseCsv(event.target.value))}
                    placeholder="Longevity Medicine, Men's Health, Telehealth"
                    className="w-full rounded-xl border border-surface-3 bg-surface-2 px-4 py-3 text-white outline-none focus:border-warning/40"
                  />
                </label>

                <div className="mt-6">
                  <span className="text-sm font-medium text-text-secondary">Protocols</span>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {PROTOCOL_OPTIONS.map((protocol) => (
                      <ToggleChip
                        key={protocol}
                        active={formData.protocols.includes(protocol)}
                        label={protocol}
                        onClick={() => toggleArrayValue('protocols', protocol)}
                      />
                    ))}
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <span className="text-sm font-medium text-text-secondary">Employment preferences</span>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {EMPLOYMENT_OPTIONS.map((option) => (
                        <ToggleChip
                          key={option}
                          active={formData.employmentPreferences.includes(option)}
                          label={option}
                          onClick={() => toggleArrayValue('employmentPreferences', option)}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-text-secondary">Work modes</span>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {WORK_MODE_OPTIONS.map((option) => (
                        <ToggleChip
                          key={option}
                          active={formData.workModes.includes(option)}
                          label={option}
                          onClick={() => toggleArrayValue('workModes', option)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="bg-[#0B0F14] border-surface-3 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-11 h-11 rounded-xl bg-success/10 border border-success/20 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Availability and summary</h2>
                    <p className="text-sm text-text-secondary">Signals that drive staffing decisions and interview outreach.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-text-secondary">Availability status</span>
                    <select
                      value={formData.availabilityStatus}
                      onChange={(event) => updateField('availabilityStatus', event.target.value as AvailabilityStatus)}
                      className="w-full rounded-xl border border-surface-3 bg-surface-2 px-4 py-3 text-white outline-none focus:border-success/40"
                    >
                      {AVAILABILITY_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-text-secondary">Target compensation</span>
                    <input
                      value={formData.targetCompensation}
                      onChange={(event) => updateField('targetCompensation', event.target.value)}
                      placeholder="$120k - $145k / yr"
                      className="w-full rounded-xl border border-surface-3 bg-surface-2 px-4 py-3 text-white outline-none focus:border-success/40"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-text-secondary">Target rate min</span>
                    <input
                      type="number"
                      min={0}
                      value={formData.targetRateMin ?? ''}
                      onChange={(event) => updateField('targetRateMin', Number(event.target.value) || undefined)}
                      className="w-full rounded-xl border border-surface-3 bg-surface-2 px-4 py-3 text-white outline-none focus:border-success/40"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-text-secondary">Target rate max</span>
                    <input
                      type="number"
                      min={0}
                      value={formData.targetRateMax ?? ''}
                      onChange={(event) => updateField('targetRateMax', Number(event.target.value) || undefined)}
                      className="w-full rounded-xl border border-surface-3 bg-surface-2 px-4 py-3 text-white outline-none focus:border-success/40"
                    />
                  </label>
                  <label className="space-y-2 md:col-span-2">
                    <span className="text-sm font-medium text-text-secondary">Travel preference</span>
                    <input
                      value={formData.travelPreference}
                      onChange={(event) => updateField('travelPreference', event.target.value)}
                      placeholder="Willing to travel within Texas twice per month"
                      className="w-full rounded-xl border border-surface-3 bg-surface-2 px-4 py-3 text-white outline-none focus:border-success/40"
                    />
                  </label>
                  <label className="space-y-2 md:col-span-2">
                    <span className="text-sm font-medium text-text-secondary">Professional summary</span>
                    <textarea
                      value={formData.summary}
                      onChange={(event) => updateField('summary', event.target.value)}
                      rows={5}
                      placeholder="Describe your clinical background, protocols, patient volume, and what kinds of clinics you support best."
                      className="w-full rounded-2xl border border-surface-3 bg-surface-2 px-4 py-3 text-white outline-none focus:border-success/40"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-text-secondary">Resume file name</span>
                    <input
                      value={formData.resumeFileName}
                      onChange={(event) => updateField('resumeFileName', event.target.value)}
                      placeholder="jane-doe-resume.pdf"
                      className="w-full rounded-xl border border-surface-3 bg-surface-2 px-4 py-3 text-white outline-none focus:border-success/40"
                    />
                  </label>
                  <label className="flex items-center gap-3 pt-8">
                    <input
                      type="checkbox"
                      checked={formData.resumeUploaded}
                      onChange={(event) => updateField('resumeUploaded', event.target.checked)}
                      className="w-4 h-4 rounded border-surface-3 bg-surface-2"
                    />
                    <span className="text-sm text-text-secondary">Resume ready to share with clinics</span>
                  </label>
                  <label className="md:col-span-2 flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={formData.searchable}
                      onChange={(event) => updateField('searchable', event.target.checked)}
                      className="w-4 h-4 rounded border-surface-3 bg-surface-2"
                    />
                    <span className="text-sm text-text-secondary">Allow clinics to discover this profile in the candidate directory</span>
                  </label>
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="bg-[#0B0F14] border-surface-3 p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-text-secondary">Profile strength</p>
                    <h3 className="mt-2 text-4xl font-display font-bold text-white">{profileStrength}%</h3>
                  </div>
                  <div className="w-16 h-16 rounded-full border-4 border-surface-3 relative flex items-center justify-center">
                    <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="46"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        className="text-secondary"
                        strokeDasharray={`${profileStrength * 2.89} 289`}
                      />
                    </svg>
                    <span className="text-xs font-bold text-secondary">{profileStrength}</span>
                  </div>
                </div>
                <div className="h-3 rounded-full bg-surface-2 overflow-hidden">
                  <div className="h-full bg-secondary transition-all duration-500" style={{ width: `${profileStrength}%` }} />
                </div>
                <div className="mt-5 space-y-3 text-sm text-text-secondary">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-secondary mt-0.5" />
                    <span>Location, licensure, protocol coverage, and availability directly feed match scoring.</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-4 h-4 text-secondary mt-0.5" />
                    <span>Clinics can only move candidates into interviews and offers once a real profile exists.</span>
                  </div>
                </div>
              </Card>

              <Card className="bg-[#0B0F14] border-surface-3 p-6">
                <h3 className="text-xl font-bold text-white mb-4">Operational next steps</h3>
                <div className="space-y-4 text-sm text-text-secondary">
                  <div className="rounded-2xl border border-surface-3 bg-surface-2/70 p-4">
                    Save the profile, then apply to open staffing requests from the live workforce exchange.
                  </div>
                  <div className="rounded-2xl border border-surface-3 bg-surface-2/70 p-4">
                    Interview scheduling and offer notifications will flow into your practitioner dashboard automatically.
                  </div>
                  <div className="rounded-2xl border border-surface-3 bg-surface-2/70 p-4">
                    Keep the candidate directory enabled if you want clinics to discover you proactively.
                  </div>
                </div>
                <div className="mt-6 space-y-3">
                  <Link to="/workforce/jobs">
                    <Button className="w-full bg-white text-black hover:bg-white/90 font-semibold">
                      Browse Live Opportunities
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <Link to="/practitioners/profile">
                    <Button variant="outline" className="w-full border-surface-3 text-white hover:bg-surface-2">
                      View Practitioner Profile
                    </Button>
                  </Link>
                </div>
              </Card>

              {error ? (
                <div className="rounded-2xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">
                  {error}
                </div>
              ) : null}

              {success ? (
                <div className="rounded-2xl border border-success/20 bg-success/10 px-4 py-3 text-sm text-success">
                  {success}
                </div>
              ) : null}

              {loading ? (
                <Card className="bg-[#0B0F14] border-surface-3 p-6 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
                </Card>
              ) : null}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Link to="/workforce/dashboard">
              <Button variant="outline" className="border-surface-3 text-white hover:bg-surface-2">
                Back to Dashboard
              </Button>
            </Link>
            <Button onClick={handleSave} className="bg-secondary hover:bg-secondary/90 text-white font-semibold" disabled={saving}>
              {saving ? 'Saving profile...' : 'Save Practitioner Profile'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </WorkforceAuthGate>
  );
}

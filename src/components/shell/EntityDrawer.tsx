import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useShell } from './ShellContext';
import { X, User, Activity, Calendar, FileText, Shield, Clock } from 'lucide-react';
import { Button } from '@/src/components/ui/Button';
import { doc, getDoc } from '@/src/lib/supabase/firestore';
import { db } from '@/src/firebase';
import { useAuth } from '@/src/lib/auth/AuthContext';
import { useNavigate } from 'react-router-dom';

type DrawerData = {
  name: string;
  status: string;
  score: string;
  scoreLabel: string;
  intent: string;
  intentLabel: string;
  email: string;
  phone: string;
  history: Array<{ action: string; time: string }>;
};

function toDate(value: unknown) {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return value;
  }

  if (typeof value === 'string' || typeof value === 'number') {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  if (typeof value === 'object' && value && 'toDate' in value && typeof (value as { toDate: () => Date }).toDate === 'function') {
    return (value as { toDate: () => Date }).toDate();
  }

  return null;
}

function formatRelativeTime(value: unknown) {
  const date = toDate(value);
  if (!date) {
    return 'Recently';
  }

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.max(0, Math.floor(diffMs / 60000));

  if (diffMinutes < 1) {
    return 'Just now';
  }

  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export function EntityDrawer() {
  const { entityDrawer, closeEntity } = useShell();
  const { isOpen, type, id } = entityDrawer;
  const { isAdminUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [data, setData] = React.useState<DrawerData | null>(null);

  React.useEffect(() => {
    let active = true;

    async function loadEntity() {
      if (!isOpen || !type || !id) {
        setData(null);
        setError('');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');

        if (type === 'patient') {
          const leadSnap = await getDoc(doc(db, 'leads', id));
          if (!leadSnap.exists()) {
            throw new Error('Lead record not found.');
          }

          const lead = leadSnap.data();
          const patientSnap = lead.patientId ? await getDoc(doc(db, 'patients', lead.patientId)) : null;
          const patient = patientSnap?.exists() ? patientSnap.data() : {};
          const history = [
            ...(Array.isArray(lead.notes)
              ? lead.notes.map((note: { text?: string; date?: string }) => ({
                  action: note.text || 'Lead note added',
                  time: note.date || 'Recently',
                }))
              : []),
            {
              action: `Lead status: ${lead.status || 'new'}`,
              time: formatRelativeTime(lead.updatedAt || lead.createdAt),
            },
          ].slice(0, 6);

          if (!active) {
            return;
          }

          setData({
            name:
              patient.firstName || patient.lastName
                ? `${patient.firstName || ''} ${patient.lastName || ''}`.trim()
                : lead.name || 'Unnamed lead',
            status: lead.status || 'Active',
            score: lead.score ? String(lead.score) : '--',
            scoreLabel: 'Qualification Score',
            intent: lead.treatmentInterest || lead.intentSignal || 'General consultation',
            intentLabel: 'Primary Intent',
            email: patient.email || lead.email || '--',
            phone: patient.phone || lead.phone || '--',
            history: history.length ? history : [{ action: 'Lead created', time: formatRelativeTime(lead.createdAt) }],
          });
          return;
        }

        if (type === 'clinic') {
          const clinicSnap = await getDoc(doc(db, 'clinics', id));
          if (!clinicSnap.exists()) {
            throw new Error('Clinic record not found.');
          }

          const clinic = clinicSnap.data();
          const clinicHistory = [
            clinic.updatedAt
              ? { action: 'Clinic profile updated', time: formatRelativeTime(clinic.updatedAt) }
              : null,
            clinic.billingSetup ? { action: 'Billing configured', time: 'Ready' } : null,
            clinic.medicalDirectorVerified ? { action: 'Medical director verified', time: 'Verified' } : null,
            clinic.createdAt ? { action: 'Clinic onboarded', time: formatRelativeTime(clinic.createdAt) } : null,
          ].filter(Boolean) as Array<{ action: string; time: string }>;

          if (!active) {
            return;
          }

          setData({
            name: clinic.name || 'Clinic record',
            status: clinic.status || 'Active',
            score: clinic.rating ? `${clinic.rating}` : clinic.isPublic ? 'Live' : '--',
            scoreLabel: clinic.rating ? 'Directory Rating' : 'Directory Status',
            intent: Array.isArray(clinic.specialties) && clinic.specialties.length
              ? clinic.specialties.join(', ')
              : clinic.city && clinic.state
              ? `${clinic.city}, ${clinic.state}`
              : 'Clinic profile',
            intentLabel: Array.isArray(clinic.specialties) && clinic.specialties.length ? 'Specialties' : 'Location',
            email: clinic.email || '--',
            phone: clinic.phone || '--',
            history: clinicHistory.length ? clinicHistory : [{ action: 'Clinic record available', time: 'Recently' }],
          });
          return;
        }

        throw new Error('Unsupported entity type.');
      } catch (loadError) {
        console.error('Failed to load entity drawer record:', loadError);
        if (active) {
          setData(null);
          setError(loadError instanceof Error ? loadError.message : 'Unable to load record.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadEntity();

    return () => {
      active = false;
    };
  }, [id, isOpen, type]);

  const handleNavigate = (path: string) => {
    closeEntity();
    navigate(path);
  };

  const primaryAction = type === 'patient'
    ? isAdminUser
      ? { label: 'Open in CRM', path: `/admin/crm?leadId=${encodeURIComponent(id || '')}` }
      : { label: 'Open Lead Queue', path: '/dashboard/leads' }
    : isAdminUser
    ? { label: 'Open Directory Record', path: `/admin/directory?clinicId=${encodeURIComponent(id || '')}` }
    : { label: 'View Public Profile', path: `/clinics/${encodeURIComponent(id || '')}` };

  const secondaryAction = type === 'patient'
    ? isAdminUser
      ? { label: 'Open Outreach Queue', path: '/admin/outreacher?tab=queue' }
      : { label: 'Open Pipeline', path: '/dashboard/pipeline' }
    : { label: 'Contact Operations', path: `/contact?role=clinic&topic=record_followup&product=${encodeURIComponent(id || '')}` };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[80] bg-background/40 backdrop-blur-sm"
            onClick={closeEntity}
          />
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full md:w-[600px] bg-surface-1 border-l border-surface-3 shadow-2xl z-[85] flex flex-col"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-surface-3 bg-surface-2/50 flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-surface-3 border border-surface-3 flex items-center justify-center">
                  {type === 'patient' ? <User className="w-6 h-6 text-primary" /> : <Activity className="w-6 h-6 text-secondary" />}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-2xl font-display font-bold">{data?.name || 'Entity Details'}</h2>
                    <span className="px-2 py-0.5 rounded text-xs font-mono bg-success/10 text-success border border-success/20">
                      {data?.status || 'Active'}
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary capitalize">{type} Record â€¢ ID: {id}</p>
                </div>
              </div>
              <button onClick={closeEntity} className="p-2 text-text-secondary hover:text-text-primary rounded-lg hover:bg-surface-3 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-grow overflow-y-auto p-6 space-y-8 hide-scrollbar">
              {loading ? (
                <div className="h-full min-h-[240px] flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : error ? (
                <div className="rounded-xl border border-danger/20 bg-danger/10 p-5 text-sm text-danger">
                  {error}
                </div>
              ) : data ? (
                <>
                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-surface-2 border border-surface-3">
                      <p className="text-xs text-text-secondary mb-1">{data.scoreLabel}</p>
                      <p className="text-2xl font-mono font-bold text-success">{data.score}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-surface-2 border border-surface-3 col-span-2">
                      <p className="text-xs text-text-secondary mb-1">{data.intentLabel}</p>
                      <p className="text-lg font-medium text-text-primary">{data.intent}</p>
                    </div>
                  </div>

                  {/* Details */}
                  <div>
                    <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4 border-b border-surface-3 pb-2">Contact Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 rounded-lg bg-surface-2 border border-surface-3">
                        <span className="text-text-secondary text-sm">Email</span>
                        <span className="text-text-primary font-medium">{data.email}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 rounded-lg bg-surface-2 border border-surface-3">
                        <span className="text-text-secondary text-sm">Phone</span>
                        <span className="text-text-primary font-medium">{data.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div>
                    <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4 border-b border-surface-3 pb-2 flex items-center gap-2">
                      <Clock className="w-4 h-4" /> Activity Timeline
                    </h3>
                    <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-surface-3 before:to-transparent">
                      {data.history.map((event, i) => (
                        <div key={`${event.action}-${i}`} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full border border-surface-3 bg-surface-2 text-text-secondary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                            <div className="w-2 h-2 rounded-full bg-primary" />
                          </div>
                          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-surface-3 bg-surface-2 shadow">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-bold text-sm">{event.action}</h4>
                            </div>
                            <time className="text-xs font-mono text-text-secondary">{event.time}</time>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : null}
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-surface-3 bg-surface-2/50 flex gap-3">
              <Button className="flex-grow" onClick={() => handleNavigate(primaryAction.path)} disabled={loading || Boolean(error)}>
                {primaryAction.label}
              </Button>
              <Button
                variant="outline"
                className="flex-grow"
                onClick={() => handleNavigate(secondaryAction.path)}
                disabled={loading || Boolean(error)}
              >
                {secondaryAction.label}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

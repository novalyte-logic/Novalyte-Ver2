import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useSearchParams } from 'react-router-dom';
import {
  Building2,
  Loader2,
  MapPin,
  MessageSquare,
  ShieldCheck,
  Star,
  Users,
  X,
  Zap,
} from 'lucide-react';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { SensitiveActionDialog } from '@/src/components/admin/SensitiveActionDialog';
import { AdminService } from '@/src/services/admin';
import type {
  DirectoryClinicRecord,
  DirectoryClinicStatus,
  DirectoryRelationshipStatus,
  DirectoryResponse,
} from '@/src/lib/admin/types';

type View = 'all' | 'verified' | 'pending' | 'suspended';

const VIEW_OPTIONS: Array<{ id: View; label: string }> = [
  { id: 'all', label: 'All Clinics' },
  { id: 'verified', label: 'Verified' },
  { id: 'pending', label: 'Pending Review' },
  { id: 'suspended', label: 'Suspended' },
];

const DIRECTORY_STATUSES: DirectoryClinicStatus[] = ['Verified', 'Pending Review', 'Suspended'];
const RELATIONSHIP_STATUSES: DirectoryRelationshipStatus[] = ['Active', 'Nurture', 'Churn Risk', 'Onboarding'];

export function DirectoryManager() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState<DirectoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [statusDraft, setStatusDraft] = useState<DirectoryClinicStatus>('Verified');
  const [relationshipDraft, setRelationshipDraft] = useState<DirectoryRelationshipStatus>('Active');
  const [tagsDraft, setTagsDraft] = useState('');
  const [noteDraft, setNoteDraft] = useState('');
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const view = (searchParams.get('view') as View) || 'all';
  const clinicId = searchParams.get('clinicId');
  const query = searchParams.get('q') || '';

  const loadData = async (silent = false) => {
    if (silent) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError('');
    try {
      const response = await AdminService.getDirectory();
      setData(response);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load directory.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    void loadData();
    const interval = window.setInterval(() => {
      void loadData(true);
    }, 30000);

    return () => window.clearInterval(interval);
  }, []);

  const filteredClinics = useMemo(() => {
    if (!data) {
      return [];
    }
    return data.clinics.filter((clinic) => {
      const matchesView =
        view === 'all'
          ? true
          : view === 'verified'
            ? clinic.status === 'Verified'
            : view === 'pending'
              ? clinic.status === 'Pending Review'
              : clinic.status === 'Suspended';
      const normalizedQuery = query.toLowerCase();
      const matchesQuery =
        normalizedQuery.length === 0 ||
        clinic.name.toLowerCase().includes(normalizedQuery) ||
        clinic.location.toLowerCase().includes(normalizedQuery) ||
        clinic.id.toLowerCase().includes(normalizedQuery);

      return matchesView && matchesQuery;
    });
  }, [data, query, view]);

  const selectedClinic = useMemo(
    () => data?.clinics.find((clinic) => clinic.id === clinicId) || null,
    [clinicId, data],
  );

  useEffect(() => {
    if (!selectedClinic) {
      setStatusDraft('Verified');
      setRelationshipDraft('Active');
      setTagsDraft('');
      setNoteDraft('');
      return;
    }

    setStatusDraft(selectedClinic.status);
    setRelationshipDraft(selectedClinic.outreachStatus);
    setTagsDraft(selectedClinic.tags.join(', '));
    setNoteDraft(selectedClinic.internalNote);
  }, [selectedClinic]);

  const setViewParam = (nextView: View) => {
    const next = new URLSearchParams(searchParams);
    next.set('view', nextView);
    setSearchParams(next);
  };

  const setQueryParam = (value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value.trim()) {
      next.set('q', value);
    } else {
      next.delete('q');
    }
    setSearchParams(next);
  };

  const openClinic = (clinic: DirectoryClinicRecord) => {
    const next = new URLSearchParams(searchParams);
    next.set('clinicId', clinic.id);
    setSearchParams(next);
  };

  const closeClinic = () => {
    const next = new URLSearchParams(searchParams);
    next.delete('clinicId');
    setSearchParams(next);
  };

  const persistClinic = async (extra?: { reason?: string; confirmationCode?: string }) => {
    if (!selectedClinic) {
      return;
    }
    setSaving(true);
    setError('');
    try {
      await AdminService.updateClinic(selectedClinic.id, {
        status: statusDraft,
        outreachStatus: relationshipDraft,
        internalNote: noteDraft,
        tags: tagsDraft
          .split(',')
          .map((entry) => entry.trim())
          .filter(Boolean),
        reason: extra?.reason,
        confirmationCode: extra?.confirmationCode,
      });
      setConfirmOpen(false);
      await loadData(true);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Failed to update clinic.');
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    if (statusDraft === 'Suspended') {
      setConfirmOpen(true);
      return;
    }

    await persistClinic();
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error && !data) {
    return (
      <Card className="border-danger/20 bg-danger/10 p-6 text-danger">
        <p className="font-semibold text-white">Directory unavailable</p>
        <p className="mt-2 text-sm">{error}</p>
        <Button onClick={() => void loadData()} className="mt-4 font-semibold">
          Retry
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12 font-sans">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-surface-1/50 p-6 rounded-2xl border border-surface-3 backdrop-blur-xl">
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">Directory Management</h1>
          <p className="text-text-secondary text-sm mt-1">
            Verified clinic inventory, operator-only relationship state, and revenue visibility from the admin API.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <Button variant="outline" className="border-surface-3 bg-[#0B0F14] text-white hover:bg-surface-2">
            {refreshing ? 'Refreshing...' : 'Live Backend'}
          </Button>
          <Button onClick={() => void loadData(true)} className="bg-primary hover:bg-primary/90 text-black font-bold">
            Refresh Directory
          </Button>
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-danger/25 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      ) : null}

      {data ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard title="Total Network Nodes" value={data.summary.totalNetworkNodes.toLocaleString()} icon={Building2} />
          <MetricCard title="Verified Partners" value={data.summary.verifiedPartners.toLocaleString()} icon={ShieldCheck} />
          <MetricCard title="Leads Routed" value={data.summary.totalLeadsRouted.toLocaleString()} icon={Users} />
          <MetricCard title="Network Revenue" value={data.summary.formattedNetworkRevenue} icon={Zap} />
        </div>
      ) : null}

      <Card className="bg-surface-1 border-surface-3 p-0 overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-surface-3 bg-gradient-to-r from-surface-2 to-surface-1 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
          <div className="flex items-center gap-1 bg-[#0B0F14] p-1 rounded-xl border border-surface-3 w-full xl:w-auto overflow-x-auto">
            {VIEW_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setViewParam(option.id)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
                  view === option.id
                    ? 'bg-primary/10 text-primary shadow-[0_0_15px_rgba(53,212,255,0.1)]'
                    : 'text-text-secondary hover:text-white hover:bg-surface-2'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <div className="w-full xl:w-80">
            <input
              value={query}
              onChange={(event) => setQueryParam(event.target.value)}
              placeholder="Search ID, clinic, or location..."
              className="h-11 w-full rounded-xl border border-surface-3 bg-[#0B0F14] px-4 text-sm text-white outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#0B0F14] text-[10px] uppercase tracking-[0.2em] text-text-secondary">
              <tr>
                <th className="px-6 py-4">Clinic & ID</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Status & Relationship</th>
                <th className="px-6 py-4">Performance</th>
                <th className="px-6 py-4">Tags</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-3 text-sm">
              {filteredClinics.map((clinic) => (
                <tr key={clinic.id} className="hover:bg-surface-2/50 transition-colors">
                  <td className="px-6 py-4">
                    <button type="button" onClick={() => openClinic(clinic)} className="text-left">
                      <p className="font-semibold text-white hover:text-primary transition-colors">{clinic.name}</p>
                    </button>
                    <p className="mt-1 text-xs text-text-secondary font-mono">{clinic.id}</p>
                    <p className="mt-1 text-xs text-text-secondary">Joined {new Date(clinic.joined).toLocaleDateString()}</p>
                  </td>
                  <td className="px-6 py-4 text-text-secondary">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      {clinic.location}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={clinic.status} />
                    <p className="mt-2 text-xs text-text-secondary flex items-center gap-1.5">
                      <MessageSquare className="h-3.5 w-3.5" />
                      {clinic.outreachStatus}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2 text-xs text-text-secondary">
                      <div className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5" />
                        {clinic.leads} leads routed
                      </div>
                      <div className="flex items-center gap-1.5 text-success">
                        <Zap className="h-3.5 w-3.5" />
                        {clinic.formattedRevenue}
                      </div>
                      {clinic.rating > 0 ? (
                        <div className="flex items-center gap-1.5 text-warning">
                          <Star className="h-3.5 w-3.5 fill-current" />
                          {clinic.rating.toFixed(1)}
                        </div>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {clinic.tags.map((tag) => (
                        <span key={tag} className="rounded-full border border-surface-3 bg-surface-2 px-2 py-1 text-[10px] text-white">
                          {tag}
                        </span>
                      ))}
                      {clinic.tags.length === 0 ? <span className="text-xs text-text-secondary">No tags</span> : null}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="sm" className="text-text-secondary hover:text-white" onClick={() => openClinic(clinic)}>
                      Inspect
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredClinics.length === 0 ? (
            <div className="p-16 text-center">
              <Building2 className="h-12 w-12 text-surface-4 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">No clinics found</h3>
              <p className="text-sm text-text-secondary">Adjust the view or search query.</p>
            </div>
          ) : null}
        </div>
      </Card>

      <AnimatePresence>
        {selectedClinic ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              onClick={closeClinic}
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 24, stiffness: 220 }}
              className="fixed top-0 right-0 z-50 h-full w-full max-w-xl overflow-y-auto border-l border-surface-3 bg-surface-1 shadow-2xl"
            >
              <div className="sticky top-0 z-10 border-b border-surface-3 bg-surface-1/95 p-6 backdrop-blur-md">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
                        {selectedClinic.id}
                      </span>
                      <StatusBadge status={selectedClinic.status} />
                    </div>
                    <h2 className="mt-3 text-2xl font-display font-bold text-white">{selectedClinic.name}</h2>
                    <p className="mt-2 text-sm text-text-secondary">{selectedClinic.location}</p>
                  </div>
                  <button type="button" onClick={closeClinic} className="rounded-lg bg-surface-2 p-2 text-text-secondary hover:text-white">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-8">
                <div className="grid grid-cols-2 gap-3">
                  <InfoCard label="Leads Routed" value={selectedClinic.leads.toLocaleString()} />
                  <InfoCard label="Revenue" value={selectedClinic.formattedRevenue} />
                  <InfoCard label="Relationship" value={selectedClinic.outreachStatus} />
                  <InfoCard label="Last Contact" value={selectedClinic.lastContact === 'Never' ? 'Never' : new Date(selectedClinic.lastContact).toLocaleString()} />
                </div>

                <section>
                  <h3 className="text-xs font-bold uppercase tracking-[0.24em] text-text-secondary">Operator Controls</h3>
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-text-secondary">Clinic status</label>
                      <select
                        value={statusDraft}
                        onChange={(event) => setStatusDraft(event.target.value as DirectoryClinicStatus)}
                        className="h-12 w-full rounded-xl border border-surface-3 bg-[#0B0F14] px-4 text-sm text-white outline-none"
                      >
                        {DIRECTORY_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-text-secondary">Relationship state</label>
                      <select
                        value={relationshipDraft}
                        onChange={(event) => setRelationshipDraft(event.target.value as DirectoryRelationshipStatus)}
                        className="h-12 w-full rounded-xl border border-surface-3 bg-[#0B0F14] px-4 text-sm text-white outline-none"
                      >
                        {RELATIONSHIP_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-text-secondary">Tags</label>
                      <input
                        value={tagsDraft}
                        onChange={(event) => setTagsDraft(event.target.value)}
                        placeholder="Comma separated tags"
                        className="h-12 w-full rounded-xl border border-surface-3 bg-[#0B0F14] px-4 text-sm text-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-text-secondary">Internal relationship note</label>
                      <textarea
                        value={noteDraft}
                        onChange={(event) => setNoteDraft(event.target.value)}
                        placeholder="Store an operator-only note for this clinic."
                        className="min-h-32 w-full rounded-xl border border-surface-3 bg-[#0B0F14] px-4 py-3 text-sm text-white outline-none"
                      />
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-xs font-bold uppercase tracking-[0.24em] text-text-secondary">Current Tags</h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {selectedClinic.tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-surface-3 bg-[#0B0F14] px-3 py-1 text-xs text-white">
                        {tag}
                      </span>
                    ))}
                    {selectedClinic.tags.length === 0 ? <span className="text-sm text-text-secondary">No tags stored.</span> : null}
                  </div>
                </section>

                <div className="flex justify-end">
                  <Button onClick={() => void handleSave()} disabled={saving} className="font-semibold">
                    {saving ? 'Saving...' : 'Save Clinic'}
                  </Button>
                </div>
              </div>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>

      <SensitiveActionDialog
        open={confirmOpen}
        title="Suspend Clinic Access"
        description="Suspending a clinic changes its operator status in the live directory. Document the reason and confirm with the internal admin code before proceeding."
        confirmLabel="Suspend Clinic"
        busy={saving}
        onClose={() => setConfirmOpen(false)}
        onConfirm={(payload) => persistClinic(payload)}
      />
    </div>
  );
}

function MetricCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string;
  icon: React.ComponentType<any>;
}) {
  return (
    <Card className="bg-surface-1 border-surface-3 p-5 shadow-2xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-text-secondary">{title}</p>
          <p className="mt-3 text-3xl font-display font-bold text-white">{value}</p>
        </div>
        <div className="rounded-2xl border border-primary/20 bg-primary/10 p-3 text-primary">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}

function StatusBadge({ status }: { status: DirectoryClinicStatus }) {
  const classes =
    status === 'Verified'
      ? 'border-success/20 bg-success/10 text-success'
      : status === 'Suspended'
        ? 'border-danger/20 bg-danger/10 text-danger'
        : 'border-warning/20 bg-warning/10 text-warning';

  return (
    <span className={`inline-flex rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] ${classes}`}>
      {status}
    </span>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-surface-3 bg-[#0B0F14] p-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-secondary">{label}</p>
      <p className="mt-2 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

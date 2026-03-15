import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Activity,
  CheckSquare,
  Clock,
  Filter,
  Loader2,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Plus,
  Send,
  Square,
  Tag,
  Users,
  X,
} from 'lucide-react';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { AdminService } from '@/src/services/admin';
import type { CrmLeadRecord, CrmLeadStatus, CrmResponse } from '@/src/lib/admin/types';

type View = 'all' | 'new' | 'contacted' | 'qualified' | 'nurture' | 'lost';

const VIEW_OPTIONS: Array<{ id: View; label: string }> = [
  { id: 'all', label: 'All Leads' },
  { id: 'new', label: 'New' },
  { id: 'contacted', label: 'Contacted' },
  { id: 'qualified', label: 'Qualified' },
  { id: 'nurture', label: 'Nurture' },
  { id: 'lost', label: 'Lost' },
];

const STAGES: CrmLeadStatus[] = ['New', 'Contacted', 'Qualified', 'Nurture', 'Lost'];

export function CRM() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState<CrmResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [bulkStage, setBulkStage] = useState<CrmLeadStatus>('Qualified');
  const [bulkTag, setBulkTag] = useState('');
  const [bulkCampaignId, setBulkCampaignId] = useState('');
  const [leadStageDraft, setLeadStageDraft] = useState<CrmLeadStatus>('New');
  const [leadNoteDraft, setLeadNoteDraft] = useState('');
  const [leadTagsDraft, setLeadTagsDraft] = useState('');
  const [savingLead, setSavingLead] = useState(false);
  const [processingBulk, setProcessingBulk] = useState(false);

  const view = (searchParams.get('view') as View) || 'all';
  const leadId = searchParams.get('leadId');
  const searchQuery = searchParams.get('q') || '';

  const loadData = async (silent = false) => {
    if (silent) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError('');
    try {
      const response = await AdminService.getCrm();
      setData(response);
      if (!bulkCampaignId && response.campaigns.length > 0) {
        setBulkCampaignId(response.campaigns[0].id);
      }
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load CRM.');
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

  const filteredLeads = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.leads.filter((lead) => {
      const matchesView =
        view === 'all'
          ? true
          : view === 'new'
            ? lead.status === 'New'
            : view === 'contacted'
              ? lead.status === 'Contacted'
              : view === 'qualified'
                ? lead.status === 'Qualified'
                : view === 'nurture'
                  ? lead.status === 'Nurture'
                  : lead.status === 'Lost';
      const normalizedQuery = searchQuery.toLowerCase();
      const matchesSearch =
        normalizedQuery.length === 0 ||
        lead.name.toLowerCase().includes(normalizedQuery) ||
        lead.email.toLowerCase().includes(normalizedQuery) ||
        lead.id.toLowerCase().includes(normalizedQuery) ||
        lead.intent.toLowerCase().includes(normalizedQuery);

      return matchesView && matchesSearch;
    });
  }, [data, searchQuery, view]);

  const selectedLead = useMemo(
    () => data?.leads.find((lead) => lead.id === leadId) || null,
    [data, leadId],
  );

  useEffect(() => {
    if (!selectedLead) {
      setLeadStageDraft('New');
      setLeadNoteDraft('');
      setLeadTagsDraft('');
      return;
    }

    setLeadStageDraft(selectedLead.status);
    setLeadNoteDraft('');
    setLeadTagsDraft(selectedLead.tags.join(', '));
  }, [selectedLead]);

  const setViewParam = (nextView: View) => {
    const next = new URLSearchParams(searchParams);
    next.set('view', nextView);
    setSearchParams(next);
  };

  const setSearchParam = (value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value.trim()) {
      next.set('q', value);
    } else {
      next.delete('q');
    }
    setSearchParams(next);
  };

  const toggleSelect = (id: string) => {
    setSelectedLeadIds((current) =>
      current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id],
    );
  };

  const toggleSelectAll = () => {
    if (selectedLeadIds.length === filteredLeads.length) {
      setSelectedLeadIds([]);
      return;
    }
    setSelectedLeadIds(filteredLeads.map((lead) => lead.id));
  };

  const openLead = (nextLead: CrmLeadRecord) => {
    const next = new URLSearchParams(searchParams);
    next.set('leadId', nextLead.id);
    setSearchParams(next);
  };

  const closeLead = () => {
    const next = new URLSearchParams(searchParams);
    next.delete('leadId');
    setSearchParams(next);
  };

  const handleBulkStageChange = async () => {
    if (selectedLeadIds.length === 0) {
      return;
    }
    setProcessingBulk(true);
    setError('');
    try {
      await AdminService.bulkCrmAction({
        action: 'change_stage',
        leadIds: selectedLeadIds,
        status: bulkStage,
      });
      setSelectedLeadIds([]);
      await loadData(true);
    } catch (bulkError) {
      setError(bulkError instanceof Error ? bulkError.message : 'Failed to update selected leads.');
    } finally {
      setProcessingBulk(false);
    }
  };

  const handleBulkTag = async () => {
    if (selectedLeadIds.length === 0 || !bulkTag.trim()) {
      return;
    }
    setProcessingBulk(true);
    setError('');
    try {
      await AdminService.bulkCrmAction({
        action: 'add_tag',
        leadIds: selectedLeadIds,
        tag: bulkTag.trim(),
      });
      setBulkTag('');
      await loadData(true);
    } catch (bulkError) {
      setError(bulkError instanceof Error ? bulkError.message : 'Failed to tag selected leads.');
    } finally {
      setProcessingBulk(false);
    }
  };

  const handleBulkPush = async () => {
    if (selectedLeadIds.length === 0) {
      return;
    }
    setProcessingBulk(true);
    setError('');
    try {
      const response = await AdminService.bulkCrmAction({
        action: 'push_to_outreach',
        leadIds: selectedLeadIds,
        campaignId: bulkCampaignId || undefined,
        channel: 'Email',
      });
      setSelectedLeadIds([]);
      await loadData(true);
      navigate(`/admin/outreacher?tab=queue${response.campaignId ? `&campaignId=${encodeURIComponent(response.campaignId)}` : ''}`);
    } catch (bulkError) {
      setError(bulkError instanceof Error ? bulkError.message : 'Failed to push selected leads.');
    } finally {
      setProcessingBulk(false);
    }
  };

  const handleLeadSave = async () => {
    if (!selectedLead) {
      return;
    }
    setSavingLead(true);
    setError('');
    try {
      await AdminService.updateLead(selectedLead.id, {
        status: leadStageDraft,
        note: leadNoteDraft.trim() || undefined,
        tags: leadTagsDraft
          .split(',')
          .map((entry) => entry.trim())
          .filter(Boolean),
      });
      await loadData(true);
      setLeadNoteDraft('');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Failed to save lead.');
    } finally {
      setSavingLead(false);
    }
  };

  const handleLeadPush = async () => {
    if (!selectedLead) {
      return;
    }
    setSavingLead(true);
    setError('');
    try {
      await AdminService.updateLead(selectedLead.id, {
        campaignId: bulkCampaignId || undefined,
        channel: 'Email',
      });
      await loadData(true);
      navigate(`/admin/outreacher?tab=queue${bulkCampaignId ? `&campaignId=${encodeURIComponent(bulkCampaignId)}` : ''}`);
    } catch (pushError) {
      setError(pushError instanceof Error ? pushError.message : 'Failed to push lead to outreach.');
    } finally {
      setSavingLead(false);
    }
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
        <p className="font-semibold text-white">CRM unavailable</p>
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
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">Patient CRM</h1>
          <p className="text-text-secondary text-sm mt-1">
            Admin-managed lead pipeline with persisted notes, segmentation, and outreach handoff.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <Button variant="outline" className="border-surface-3 bg-[#0B0F14] text-white hover:bg-surface-2">
            {refreshing ? 'Refreshing...' : 'Live Backend'}
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-black font-bold" onClick={() => void loadData(true)}>
            Refresh CRM
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
          <MetricCard title="Total Leads (30d)" value={data.summary.totalLeads30d.toLocaleString()} icon={Users} />
          <MetricCard title="Qualification Rate" value={`${data.summary.qualificationRate}%`} icon={Activity} />
          <MetricCard title="Avg Routing Time" value={`${data.summary.avgRoutingMinutes}m`} icon={Clock} />
          <MetricCard title="Pipeline Value" value={data.summary.formattedPipelineValue} icon={Send} />
        </div>
      ) : null}

      <Card className="bg-surface-1 border-surface-3 p-0 overflow-hidden flex flex-col shadow-2xl">
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

          <div className="flex items-center gap-3 w-full xl:w-auto">
            <div className="relative w-full xl:w-80">
              <input
                value={searchQuery}
                onChange={(event) => setSearchParam(event.target.value)}
                placeholder="Search name, email, ID, or intent..."
                className="w-full rounded-lg border border-surface-3 bg-[#0B0F14] px-4 py-2 text-sm text-white outline-none transition-colors focus:border-primary/50"
              />
            </div>
            <Button variant="outline" className="border-surface-3 bg-[#0B0F14] text-white hover:bg-surface-2 shrink-0">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {selectedLeadIds.length > 0 ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-b border-primary/20 bg-primary/5 px-4 py-4"
            >
              <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-primary">{selectedLeadIds.length} leads selected</p>
                  <p className="mt-1 text-xs text-text-secondary">Bulk actions persist immediately to the operator backend.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 w-full xl:w-auto">
                  <select
                    value={bulkStage}
                    onChange={(event) => setBulkStage(event.target.value as CrmLeadStatus)}
                    className="h-10 rounded-lg border border-surface-3 bg-[#0B0F14] px-3 text-sm text-white outline-none"
                  >
                    {STAGES.map((stage) => (
                      <option key={stage} value={stage}>
                        Move to {stage}
                      </option>
                    ))}
                  </select>
                  <Button onClick={() => void handleBulkStageChange()} disabled={processingBulk} className="font-semibold">
                    Apply Stage
                  </Button>
                  <input
                    value={bulkTag}
                    onChange={(event) => setBulkTag(event.target.value)}
                    placeholder="Add tag"
                    className="h-10 rounded-lg border border-surface-3 bg-[#0B0F14] px-3 text-sm text-white outline-none"
                  />
                  <Button variant="outline" onClick={() => void handleBulkTag()} disabled={processingBulk || !bulkTag.trim()} className="border-surface-3 bg-[#0B0F14] text-white hover:bg-surface-2">
                    <Tag className="mr-2 h-4 w-4" />
                    Add Tag
                  </Button>
                </div>
              </div>
              <div className="mt-4 flex flex-col md:flex-row items-start md:items-center gap-3">
                <select
                  value={bulkCampaignId}
                  onChange={(event) => setBulkCampaignId(event.target.value)}
                  className="h-10 rounded-lg border border-surface-3 bg-[#0B0F14] px-3 text-sm text-white outline-none min-w-64"
                >
                  <option value="">Create ad hoc campaign</option>
                  {data?.campaigns.map((campaign) => (
                    <option key={campaign.id} value={campaign.id}>
                      {campaign.name} · {campaign.channel}
                    </option>
                  ))}
                </select>
                <Button onClick={() => void handleBulkPush()} disabled={processingBulk} className="font-semibold">
                  <Send className="mr-2 h-4 w-4" />
                  Push to Outreacher
                </Button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="overflow-x-auto flex-grow">
          <table className="w-full text-left">
            <thead className="bg-[#0B0F14] text-[10px] uppercase tracking-[0.2em] text-text-secondary">
              <tr>
                <th className="px-6 py-4 w-10">
                  <button type="button" onClick={toggleSelectAll} className="text-text-secondary hover:text-white transition-colors">
                    {selectedLeadIds.length === filteredLeads.length && filteredLeads.length > 0 ? (
                      <CheckSquare className="h-4 w-4 text-primary" />
                    ) : (
                      <Square className="h-4 w-4" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-4">Patient</th>
                <th className="px-6 py-4">Intent & Score</th>
                <th className="px-6 py-4">Stage</th>
                <th className="px-6 py-4">Pipeline Value</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-3 text-sm">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className={`hover:bg-surface-2/50 transition-colors ${selectedLeadIds.includes(lead.id) ? 'bg-primary/5' : ''}`}>
                  <td className="px-6 py-4">
                    <button type="button" onClick={() => toggleSelect(lead.id)} className="text-text-secondary hover:text-white transition-colors">
                      {selectedLeadIds.includes(lead.id) ? <CheckSquare className="h-4 w-4 text-primary" /> : <Square className="h-4 w-4" />}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <button type="button" onClick={() => openLead(lead)} className="text-left">
                      <p className="font-semibold text-white hover:text-primary transition-colors">{lead.name}</p>
                    </button>
                    <div className="mt-2 space-y-1 text-xs text-text-secondary">
                      <div className="flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5" />
                        {lead.email}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5" />
                        {lead.phone}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        {lead.location}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-white">{lead.intent}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="h-2 w-24 overflow-hidden rounded-full border border-surface-3 bg-[#0B0F14]">
                        <div
                          className={`${lead.score >= 90 ? 'bg-success' : lead.score >= 80 ? 'bg-primary' : 'bg-warning'} h-full`}
                          style={{ width: `${lead.score}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono font-bold text-white">{lead.score}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={lead.status} />
                    <p className="mt-2 text-xs text-text-secondary">{new Date(lead.updatedAt).toLocaleString()}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-mono font-bold text-success">{lead.formattedEstimatedValue}</p>
                    <p className="mt-1 text-xs text-text-secondary">
                      {lead.lastQueuedCampaignName ? `Queued to ${lead.lastQueuedCampaignName}` : 'Not queued'}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" className="text-text-secondary hover:text-white" onClick={() => openLead(lead)}>
                        Inspect
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredLeads.length === 0 ? (
            <div className="p-16 text-center">
              <Users className="h-12 w-12 text-surface-4 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">No leads match this view</h3>
              <p className="text-sm text-text-secondary">Adjust your stage filter or search query.</p>
            </div>
          ) : null}
        </div>

        <div className="p-4 border-t border-surface-3 bg-[#0B0F14] flex items-center justify-between text-xs text-text-secondary">
          <span>
            Showing {filteredLeads.length} of {data?.leads.length || 0} leads
          </span>
          <span>{refreshing ? 'Syncing backend…' : 'CRM is synced to operator API'}</span>
        </div>
      </Card>

      <AnimatePresence>
        {selectedLead ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              onClick={closeLead}
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
                        {selectedLead.id}
                      </span>
                      <StatusBadge status={selectedLead.status} />
                    </div>
                    <h2 className="mt-3 text-2xl font-display font-bold text-white">{selectedLead.name}</h2>
                    <p className="mt-2 text-sm text-text-secondary">
                      {selectedLead.intent} · {selectedLead.formattedEstimatedValue}
                      {selectedLead.clinicName ? ` · Routed to ${selectedLead.clinicName}` : ''}
                    </p>
                  </div>
                  <button type="button" onClick={closeLead} className="rounded-lg bg-surface-2 p-2 text-text-secondary hover:text-white">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-8">
                <div className="grid grid-cols-2 gap-3">
                  <Button onClick={() => void handleLeadPush()} disabled={savingLead} className="font-semibold">
                    <Send className="mr-2 h-4 w-4" />
                    Push to Outreach
                  </Button>
                  <Button variant="outline" onClick={() => void handleLeadSave()} disabled={savingLead} className="border-surface-3 bg-[#0B0F14] text-white hover:bg-surface-2">
                    Save Lead
                  </Button>
                </div>

                <section>
                  <h3 className="text-xs font-bold uppercase tracking-[0.24em] text-text-secondary">Contact Information</h3>
                  <div className="mt-4 space-y-3">
                    <InfoRow icon={<Mail className="h-4 w-4 text-text-secondary" />} label="Email" value={selectedLead.email} />
                    <InfoRow icon={<Phone className="h-4 w-4 text-text-secondary" />} label="Phone" value={selectedLead.phone} />
                    <InfoRow icon={<MapPin className="h-4 w-4 text-text-secondary" />} label="Location" value={selectedLead.location} />
                  </div>
                </section>

                <section>
                  <h3 className="text-xs font-bold uppercase tracking-[0.24em] text-text-secondary">Workflow State</h3>
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-text-secondary">CRM stage</label>
                      <select
                        value={leadStageDraft}
                        onChange={(event) => setLeadStageDraft(event.target.value as CrmLeadStatus)}
                        className="h-12 w-full rounded-xl border border-surface-3 bg-[#0B0F14] px-4 text-sm text-white outline-none"
                      >
                        {STAGES.map((stage) => (
                          <option key={stage} value={stage}>
                            {stage}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-text-secondary">Tags</label>
                      <input
                        value={leadTagsDraft}
                        onChange={(event) => setLeadTagsDraft(event.target.value)}
                        placeholder="Comma separated tags"
                        className="h-12 w-full rounded-xl border border-surface-3 bg-[#0B0F14] px-4 text-sm text-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-text-secondary">Add internal note</label>
                      <textarea
                        value={leadNoteDraft}
                        onChange={(event) => setLeadNoteDraft(event.target.value)}
                        placeholder="Persist an operator note on this lead."
                        className="min-h-28 w-full rounded-xl border border-surface-3 bg-[#0B0F14] px-4 py-3 text-sm text-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-text-secondary">Outreach campaign</label>
                      <select
                        value={bulkCampaignId}
                        onChange={(event) => setBulkCampaignId(event.target.value)}
                        className="h-12 w-full rounded-xl border border-surface-3 bg-[#0B0F14] px-4 text-sm text-white outline-none"
                      >
                        <option value="">Create ad hoc campaign</option>
                        {data?.campaigns.map((campaign) => (
                          <option key={campaign.id} value={campaign.id}>
                            {campaign.name} · {campaign.channel}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-xs font-bold uppercase tracking-[0.24em] text-text-secondary">Persisted Notes</h3>
                  <div className="mt-4 space-y-3">
                    {selectedLead.notes.length === 0 ? (
                      <div className="rounded-xl border border-surface-3 bg-[#0B0F14] px-4 py-4 text-sm text-text-secondary">
                        No admin notes recorded yet.
                      </div>
                    ) : (
                      selectedLead.notes.map((note) => (
                        <div key={note.id} className="rounded-xl border border-surface-3 bg-[#0B0F14] p-4">
                          <p className="text-sm text-white">{note.text}</p>
                          <p className="mt-2 text-xs text-text-secondary">
                            {note.createdBy} · {new Date(note.createdAt).toLocaleString()}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </section>

                <section>
                  <h3 className="text-xs font-bold uppercase tracking-[0.24em] text-text-secondary">Current Tags</h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {selectedLead.tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-surface-3 bg-[#0B0F14] px-3 py-1 text-xs text-white">
                        {tag}
                      </span>
                    ))}
                    {selectedLead.tags.length === 0 ? (
                      <span className="text-sm text-text-secondary">No tags on this lead.</span>
                    ) : null}
                  </div>
                </section>
              </div>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
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

function StatusBadge({ status }: { status: CrmLeadStatus }) {
  const classes =
    status === 'Qualified'
      ? 'bg-success/10 text-success border-success/20'
      : status === 'Contacted'
        ? 'bg-secondary/10 text-secondary border-secondary/20'
        : status === 'Nurture'
          ? 'bg-warning/10 text-warning border-warning/20'
          : status === 'Lost'
            ? 'bg-danger/10 text-danger border-danger/20'
            : 'bg-primary/10 text-primary border-primary/20';

  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] ${classes}`}>
      {status}
    </span>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-surface-3 bg-[#0B0F14] px-4 py-3">
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-text-secondary">{label}</p>
          <p className="mt-1 text-sm text-white">{value}</p>
        </div>
      </div>
    </div>
  );
}

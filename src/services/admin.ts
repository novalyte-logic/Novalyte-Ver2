import { auth } from '@/src/firebase';
import type {
  AdminSessionResponse,
  CommandCenterResponse,
  CrmLeadStatus,
  CrmResponse,
  DirectoryClinicStatus,
  DirectoryRelationshipStatus,
  DirectoryResponse,
  LaunchResponse,
  McpResponse,
  OutreachCampaignStatus,
  OutreachChannel,
  OutreachResponse,
} from '@/src/lib/admin/types';

export class AdminApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

type RequestOptions = {
  method?: string;
  body?: unknown;
};

async function requestJson<T>(path: string, options: RequestOptions = {}) {
  const { method = 'GET', body } = options;
  const token = await auth.currentUser?.getIdToken();
  if (!token) {
    throw new AdminApiError(401, 'Authentication required.');
  }

  const headers = new Headers({
    Authorization: `Bearer ${token}`,
  });
  if (body !== undefined) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(path, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const payload = (await response.json()) as { error?: string };
      if (payload.error) {
        message = payload.error;
      }
    } catch {
      // Ignore error payload parsing issues.
    }

    throw new AdminApiError(response.status, message);
  }

  return (await response.json()) as T;
}

export const AdminService = {
  getSession() {
    return requestJson<AdminSessionResponse>('/api/admin/session');
  },

  getCommandCenter() {
    return requestJson<CommandCenterResponse>('/api/admin/command-center');
  },

  getCrm() {
    return requestJson<CrmResponse>('/api/admin/crm');
  },

  updateLead(
    id: string,
    payload: {
      status?: CrmLeadStatus;
      tags?: string[];
      note?: string;
      campaignId?: string;
      channel?: OutreachChannel;
    },
  ) {
    return requestJson<{ lead?: CrmResponse['leads'][number] }>(`/api/admin/crm/leads/${id}`, {
      method: 'PATCH',
      body: payload,
    });
  },

  bulkCrmAction(payload: {
    action: 'push_to_outreach' | 'change_stage' | 'add_tag';
    leadIds: string[];
    campaignId?: string;
    channel?: OutreachChannel;
    status?: CrmLeadStatus;
    tag?: string;
  }) {
    return requestJson<{ success: boolean; pushed?: number; updated?: number; tagged?: number; campaignId?: string }>(
      '/api/admin/crm/bulk',
      {
        method: 'POST',
        body: payload,
      },
    );
  },

  getOutreach() {
    return requestJson<OutreachResponse>('/api/admin/outreach');
  },

  createCampaign(payload: {
    name: string;
    audience: string;
    channel: OutreachChannel;
    objective?: string;
    leadIds?: string[];
  }) {
    return requestJson<{ campaign: { id: string; name: string; audience: string; channel: OutreachChannel; status: string } }>(
      '/api/admin/outreach/campaigns',
      {
        method: 'POST',
        body: payload,
      },
    );
  },

  updateCampaign(id: string, payload: { status?: OutreachCampaignStatus; objective?: string }) {
    return requestJson<{ success: boolean }>(`/api/admin/outreach/campaigns/${id}`, {
      method: 'PATCH',
      body: payload,
    });
  },

  personalizeQueueItem(id: string) {
    return requestJson<{ queueItem: OutreachResponse['queue'][number] }>(`/api/admin/outreach/queue/${id}/personalize`, {
      method: 'POST',
    });
  },

  sendQueueItem(id: string) {
    return requestJson<{ queueItem: OutreachResponse['queue'][number] }>(`/api/admin/outreach/queue/${id}/send`, {
      method: 'POST',
    });
  },

  createSenderAccount(payload: {
    email: string;
    provider: string;
    healthScore?: number;
    dailyLimit?: number;
    status?: 'Healthy' | 'Warning' | 'Paused' | 'Warming Up';
  }) {
    return requestJson<{ id: string }>('/api/admin/outreach/accounts', {
      method: 'POST',
      body: payload,
    });
  },

  getDirectory() {
    return requestJson<DirectoryResponse>('/api/admin/directory');
  },

  updateClinic(
    id: string,
    payload: {
      status?: DirectoryClinicStatus;
      outreachStatus?: DirectoryRelationshipStatus;
      internalNote?: string;
      tags?: string[];
      reason?: string;
      confirmationCode?: string;
    },
  ) {
    return requestJson<{ success: boolean }>(`/api/admin/directory/clinics/${id}`, {
      method: 'PATCH',
      body: payload,
    });
  },

  getLaunch() {
    return requestJson<LaunchResponse>('/api/admin/launch');
  },

  controlLaunch(payload: {
    action: 'pause' | 'resume' | 'trigger_blast';
    reason: string;
    confirmationCode: string;
  }) {
    return requestJson<{ success: boolean }>('/api/admin/launch/control', {
      method: 'POST',
      body: payload,
    });
  },

  getMcp() {
    return requestJson<McpResponse>('/api/admin/mcp');
  },

  runMcpCommand(payload: {
    action: string;
    reason: string;
    confirmationCode: string;
    command?: string;
  }) {
    return requestJson<{ success: boolean }>('/api/admin/mcp/commands', {
      method: 'POST',
      body: payload,
    });
  },
};

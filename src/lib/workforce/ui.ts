import type {
  ApplicationStatus,
  WorkforceRequestStatus,
  WorkforceOffer,
  WorkforceInterview,
} from './types';

export function formatRelativeDate(value: string) {
  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) {
    return 'Just now';
  }

  const seconds = Math.max(1, Math.floor((Date.now() - timestamp) / 1000));
  if (seconds < 60) return `${seconds}s ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;

  return new Date(value).toLocaleDateString();
}

export function formatApplicationStatus(status: ApplicationStatus) {
  return status.replace(/_/g, ' ');
}

export function applicationStatusClasses(status: ApplicationStatus) {
  if (status === 'offer_accepted') return 'bg-success/10 text-success border-success/20';
  if (status === 'offer_extended' || status === 'interview_scheduled') {
    return 'bg-secondary/10 text-secondary border-secondary/20';
  }
  if (status === 'rejected' || status === 'offer_declined') {
    return 'bg-danger/10 text-danger border-danger/20';
  }
  if (status === 'applied' || status === 'screening') {
    return 'bg-warning/10 text-warning border-warning/20';
  }

  return 'bg-surface-3 text-text-secondary border-surface-3';
}

export function requestStatusClasses(status: WorkforceRequestStatus) {
  if (status === 'filled') return 'bg-success/10 text-success border-success/20';
  if (status === 'offer_extended' || status === 'interviewing') {
    return 'bg-secondary/10 text-secondary border-secondary/20';
  }
  if (status === 'screening' || status === 'open') {
    return 'bg-primary/10 text-primary border-primary/20';
  }

  return 'bg-surface-3 text-text-secondary border-surface-3';
}

export function nextInterviewForApplication(
  applicationId: string,
  interviews: WorkforceInterview[],
) {
  return interviews
    .filter((interview) => interview.applicationId === applicationId)
    .sort((left, right) => new Date(left.scheduledAt).getTime() - new Date(right.scheduledAt).getTime())[0];
}

export function activeOfferForApplication(
  applicationId: string,
  offers: WorkforceOffer[],
) {
  return offers.find((offer) => offer.applicationId === applicationId && offer.status === 'extended');
}

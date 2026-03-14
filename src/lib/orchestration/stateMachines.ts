import { Lead } from '../../types/models';

export const LeadStateMachine = {
  initial: 'new',
  transitions: {
    new: ['triaged', 'dismissed'],
    triaged: ['routed', 'dismissed'],
    routed: ['contacted', 'dismissed'],
    contacted: ['consult_scheduled', 'dismissed'],
    consult_scheduled: ['enrolled', 'dismissed'],
    enrolled: [],
    dismissed: ['new'] // Re-engagement
  },
  
  canTransition: (currentStatus: Lead['status'], nextStatus: Lead['status']): boolean => {
    return LeadStateMachine.transitions[currentStatus]?.includes(nextStatus) || false;
  }
};

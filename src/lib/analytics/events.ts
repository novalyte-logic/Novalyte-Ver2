export type EventType = 
  | 'page_view' 
  | 'cta_click' 
  | 'assessment_start' 
  | 'assessment_complete' 
  | 'lead_routed' 
  | 'clinic_login' 
  | 'ai_query';

export interface TrackingEvent {
  id: string;
  type: EventType;
  userId?: string;
  sessionId: string;
  timestamp: string;
  properties: Record<string, any>;
}

export const AnalyticsEngine = {
  track: (type: EventType, properties: Record<string, any> = {}) => {
    const event: TrackingEvent = {
      id: crypto.randomUUID(),
      type,
      sessionId: sessionStorage.getItem('novalyte_session_id') || 'unknown',
      timestamp: new Date().toISOString(),
      properties
    };
    
    // In a real app, this would send to a backend or BigQuery
    console.log('[Analytics]', event);
    
    // Store locally for demo purposes
    const history = JSON.parse(localStorage.getItem('novalyte_events') || '[]');
    localStorage.setItem('novalyte_events', JSON.stringify([...history, event].slice(-1000)));
  }
};

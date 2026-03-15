import { Patient, Clinic } from '../types/models';

export const AIService = {
  generatePatientInsights: async (patient: Patient) => {
    try {
      const response = await fetch('/api/ai/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientData: patient })
      });
      if (!response.ok) throw new Error('Failed to fetch insights');
      const data = await response.json();
      return {
        summary: data.rationale || `Patient is a ${patient.demographics.age || 'unknown'} year old seeking ${patient.healthProfile.primaryGoals.join(', ')}.`,
        riskFactors: [data.riskLevel],
        recommendedProtocols: [data.nextBestAction],
        confidenceScore: data.confidenceScore,
        score: data.score
      };
    } catch (error) {
      console.error('AI Service error:', error);
      return {
        summary: `Patient is a ${patient.demographics.age || 'unknown'} year old seeking ${patient.healthProfile.primaryGoals.join(', ')}.`,
        riskFactors: ['High stress', 'Poor sleep'],
        recommendedProtocols: ['TRT Evaluation', 'Sleep Optimization']
      };
    }
  },

  generateRoutingExplanation: async (patient: Patient, clinic: Clinic, score: number) => {
    try {
      const response = await fetch('/api/ai/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: patient, context: `Routing to clinic ${clinic.clinicDetails.name} with score ${score}` })
      });
      if (!response.ok) throw new Error('Failed to fetch routing explanation');
      const data = await response.json();
      return data.rationale;
    } catch (error) {
      console.error('AI Service error:', error);
      return `AI routed patient to ${clinic.clinicDetails.name} due to a ${score}% match on preferred treatments and budget alignment.`;
    }
  },
  
  draftOutreachMessage: async (patientName: string, intent: string) => {
    try {
      const response = await fetch('/api/ai/outreach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientName, intent, context: 'Initial outreach' })
      });
      if (!response.ok) throw new Error('Failed to fetch outreach message');
      const data = await response.json();
      return data.message;
    } catch (error) {
      console.error('AI Service error:', error);
      return `Hi ${patientName}, based on your interest in ${intent}, we have a few clinics that match your profile perfectly. Would you like to schedule a consultation?`;
    }
  },

  chat: async (message: string, history: any[]) => {
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history })
      });
      if (!response.ok) throw new Error('Failed to fetch chat response');
      return await response.json();
    } catch (error) {
      console.error('AI Service error:', error);
      return {
        response: 'I am currently operating in offline mode. Please contact support for assistance.',
        rationale: 'AI service unavailable.',
        confidenceScore: 1.0,
        nextBestAction: 'Contact human support.',
        suggestedActions: []
      };
    }
  },

  generateClinicInsights: async (clinicData: any, metrics: any) => {
    try {
      const response = await fetch('/api/ai/clinic-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clinicData, metrics })
      });
      if (!response.ok) throw new Error('Failed to fetch clinic insights');
      return await response.json();
    } catch (error) {
      console.error('AI Service error:', error);
      return {
        insights: ['Performance is stable.'],
        rationale: 'Fallback insights.',
        confidenceScore: 0.5,
        nextBestAction: 'Continue current operations.'
      };
    }
  },

  performResearch: async (query: string) => {
    try {
      const response = await fetch('/api/ai/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      if (!response.ok) throw new Error('Failed to fetch research');
      return await response.json();
    } catch (error) {
      console.error('AI Service error:', error);
      return {
        findings: 'Research unavailable in offline mode.',
        rationale: 'AI service unavailable.',
        confidenceScore: 0.0,
        nextBestAction: 'Try again later.'
      };
    }
  },

  getWorkflowSuggestions: async (currentState: any, role: string) => {
    try {
      const response = await fetch('/api/ai/workflow-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentState, role })
      });
      if (!response.ok) throw new Error('Failed to fetch workflow suggestions');
      return await response.json();
    } catch (error) {
      console.error('AI Service error:', error);
      return {
        suggestions: ['Review pending tasks.'],
        rationale: 'Fallback suggestions.',
        confidenceScore: 0.5,
        nextBestAction: 'Manual review.'
      };
    }
  }
};

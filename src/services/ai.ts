import { Patient, Clinic } from '../types/models';

export const AIService = {
  generatePatientInsights: async (patient: Patient) => {
    // Simulated AI call
    return {
      summary: `Patient is a ${patient.demographics.age || 'unknown'} year old seeking ${patient.healthProfile.primaryGoals.join(', ')}.`,
      riskFactors: ['High stress', 'Poor sleep'],
      recommendedProtocols: ['TRT Evaluation', 'Sleep Optimization']
    };
  },

  generateRoutingExplanation: (patient: Patient, clinic: Clinic, score: number) => {
    // Simulated AI explanation
    return `AI routed patient to ${clinic.clinicDetails.name} due to a ${score}% match on preferred treatments and budget alignment.`;
  },
  
  draftOutreachMessage: (patientName: string, intent: string) => {
    return `Hi ${patientName}, based on your interest in ${intent}, we have a few clinics that match your profile perfectly. Would you like to schedule a consultation?`;
  }
};

import { Patient, Clinic, Lead } from '../../types/models';
import { ScoringEngine } from './scoring';

export const RoutingEngine = {
  findBestClinic: (patient: Patient, availableClinics: Clinic[]): { clinic: Clinic, score: number, explanation: string } | null => {
    if (availableClinics.length === 0) return null;

    const scoredClinics = availableClinics.map(clinic => ({
      clinic,
      score: ScoringEngine.calculateClinicalFit(patient, clinic)
    })).sort((a, b) => b.score - a.score);

    const bestMatch = scoredClinics[0];
    
    if (bestMatch.score < 50) {
      return null; // No good match
    }

    return {
      clinic: bestMatch.clinic,
      score: bestMatch.score,
      explanation: `Matched based on ${bestMatch.score}% clinical and financial alignment. Clinic specializes in patient's primary goals.`
    };
  }
};

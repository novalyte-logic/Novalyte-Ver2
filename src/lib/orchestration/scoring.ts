import { Patient, Clinic } from '../../types/models';

export const ScoringEngine = {
  calculatePatientLTV: (patient: Patient): number => {
    const baseLtv = patient.financialProfile.monthlyBudget * 12; // 1 year assumption
    const commitmentMultiplier = patient.financialProfile.willingToPayOOP ? 1.5 : 0.5;
    return baseLtv * commitmentMultiplier;
  },

  calculateClinicalFit: (patient: Patient, clinic: Clinic): number => {
    let score = 0;
    
    // Match patient goals to clinic specialties
    const matchingGoals = patient.healthProfile.primaryGoals.filter(goal => 
      clinic.clinicDetails.specialties.includes(goal)
    );
    
    if (patient.healthProfile.primaryGoals.length > 0) {
      score += (matchingGoals.length / patient.healthProfile.primaryGoals.length) * 50;
    } else {
      score += 25; // Default if no goals specified
    }

    // Match budget
    if (patient.financialProfile.monthlyBudget >= clinic.icp.minimumBudget) {
      score += 50;
    }

    return score;
  },

  calculateUrgency: (patient: Patient): number => {
    // Logic: based on symptoms severity
    const severeSymptoms = ['chest_pain', 'severe_fatigue', 'acute_injury'];
    const hasSevere = patient.healthProfile.symptoms.some(s => severeSymptoms.includes(s));
    return hasSevere ? 95 : 50;
  }
};

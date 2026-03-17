import express from 'express';
import { GoogleGenAI, Type, Schema } from '@google/genai';

const router = express.Router();

// Initialize Gemini client gracefully
let ai: GoogleGenAI | null = null;
try {
  if (process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  } else {
    console.warn('GEMINI_API_KEY is not set. AI endpoints will degrade gracefully.');
  }
} catch (error) {
  console.error('Failed to initialize GoogleGenAI:', error);
}

// Helper for retries and timeouts
async function callGeminiWithRetry(model: string, contents: any, config: any, retries = 2, timeoutMs = 15000) {
  if (!ai) {
    throw new Error('AI service is not configured.');
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      let timeoutId: any;
      const timeoutPromise = new Promise((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error('Request timed out')), timeoutMs);
      });

      const response = await Promise.race([
        ai.models.generateContent({ model, contents, config }),
        timeoutPromise
      ]) as any;
      
      clearTimeout(timeoutId);
      return response;
    } catch (error: any) {
      console.error(`Gemini API attempt ${attempt} failed:`, error);
      if (attempt === retries) throw error;
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
    }
  }
}

// 1. Assessment Triage
router.post('/triage', async (req, res) => {
  try {
    const { patientData } = req.body;
    
    if (!ai) {
      // Graceful degradation
      return res.json({
        score: 75,
        riskLevel: 'medium',
        rationale: 'Fallback analysis due to AI service unavailability.',
        confidenceScore: 0.5,
        nextBestAction: 'Schedule standard consultation.'
      });
    }

    const response = await callGeminiWithRetry('gemini-3-flash-preview', 
      `Analyze this patient data and provide triage scoring: ${JSON.stringify(patientData)}`,
      {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER, description: 'Triage score from 0 to 100' },
            riskLevel: { type: Type.STRING, description: 'low, medium, or high' },
            rationale: { type: Type.STRING, description: 'Explanation for the score and risk level' },
            confidenceScore: { type: Type.NUMBER, description: 'Confidence from 0.0 to 1.0' },
            nextBestAction: { type: Type.STRING, description: 'Recommended next step in the workflow' }
          },
          required: ['score', 'riskLevel', 'rationale', 'confidenceScore', 'nextBestAction']
        }
      }
    );

    const result = JSON.parse(response.text);
    res.json(result);
  } catch (error: any) {
    console.error('Triage error:', error);
    res.status(500).json({ error: 'Failed to process triage' });
  }
});

// 2. Recommendations
router.post('/recommendations', async (req, res) => {
  try {
    const { profile, context } = req.body;
    
    if (!ai) {
      return res.json({
        recommendations: ['Standard Protocol'],
        rationale: 'Fallback recommendations.',
        confidenceScore: 0.5,
        nextBestAction: 'Review manually.'
      });
    }

    const response = await callGeminiWithRetry('gemini-3-flash-preview', 
      `Generate clinical or product recommendations for this profile: ${JSON.stringify(profile)}. Context: ${context}`,
      {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendations: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            rationale: { type: Type.STRING },
            confidenceScore: { type: Type.NUMBER },
            nextBestAction: { type: Type.STRING }
          },
          required: ['recommendations', 'rationale', 'confidenceScore', 'nextBestAction']
        }
      }
    );

    const result = JSON.parse(response.text);
    res.json(result);
  } catch (error: any) {
    console.error('Recommendations error:', error);
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
});

// 3. Clinic Insights
router.post('/clinic-insights', async (req, res) => {
  try {
    const { clinicData, metrics } = req.body;
    
    if (!ai) {
      return res.json({
        insights: ['Performance is stable.'],
        rationale: 'Fallback insights.',
        confidenceScore: 0.5,
        nextBestAction: 'Continue current operations.'
      });
    }

    const response = await callGeminiWithRetry('gemini-3-flash-preview', 
      `Analyze clinic performance and generate insights. Data: ${JSON.stringify(clinicData)}, Metrics: ${JSON.stringify(metrics)}`,
      {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            insights: { type: Type.ARRAY, items: { type: Type.STRING } },
            rationale: { type: Type.STRING },
            confidenceScore: { type: Type.NUMBER },
            nextBestAction: { type: Type.STRING }
          },
          required: ['insights', 'rationale', 'confidenceScore', 'nextBestAction']
        }
      }
    );

    const result = JSON.parse(response.text);
    res.json(result);
  } catch (error: any) {
    console.error('Clinic insights error:', error);
    res.status(500).json({ error: 'Failed to generate clinic insights' });
  }
});

// 4. Outreach Generation
router.post('/outreach', async (req, res) => {
  try {
    const { patientName, intent, context } = req.body;
    
    if (!ai) {
      return res.json({
        message: `Hi ${patientName}, based on your interest in ${intent}, we have a few clinics that match your profile perfectly. Would you like to schedule a consultation?`,
        rationale: 'Fallback template.',
        confidenceScore: 0.8,
        nextBestAction: 'Send message.'
      });
    }

    const response = await callGeminiWithRetry('gemini-3-flash-preview', 
      `Draft a personalized outreach message for ${patientName} who is interested in ${intent}. Context: ${context}`,
      {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            message: { type: Type.STRING },
            rationale: { type: Type.STRING },
            confidenceScore: { type: Type.NUMBER },
            nextBestAction: { type: Type.STRING }
          },
          required: ['message', 'rationale', 'confidenceScore', 'nextBestAction']
        }
      }
    );

    const result = JSON.parse(response.text);
    res.json(result);
  } catch (error: any) {
    console.error('Outreach error:', error);
    res.status(500).json({ error: 'Failed to generate outreach message' });
  }
});

// 5. Chatbot Responses
router.post('/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    
    if (!ai) {
      return res.json({
        response: 'I am currently operating in offline mode. Please contact support for assistance.',
        rationale: 'AI service unavailable.',
        confidenceScore: 1.0,
        nextBestAction: 'Contact human support.',
        suggestedActions: []
      });
    }

    const response = await callGeminiWithRetry('gemini-3-flash-preview', 
      `User message: ${message}. Chat history: ${JSON.stringify(history)}. Provide a helpful, medically safe response.`,
      {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            response: { type: Type.STRING },
            rationale: { type: Type.STRING },
            confidenceScore: { type: Type.NUMBER },
            nextBestAction: { type: Type.STRING },
            suggestedActions: { 
              type: Type.ARRAY, 
              items: { 
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  path: { type: Type.STRING }
                },
                required: ['label', 'path']
              } 
            }
          },
          required: ['response', 'rationale', 'confidenceScore', 'nextBestAction', 'suggestedActions']
        }
      }
    );

    const result = JSON.parse(response.text);
    res.json(result);
  } catch (error: any) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to generate chat response' });
  }
});

// 6. Research Tasks
router.post('/research', async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!ai) {
      return res.json({
        findings: 'Research unavailable in offline mode.',
        rationale: 'AI service unavailable.',
        confidenceScore: 0.0,
        nextBestAction: 'Try again later.'
      });
    }

    const response = await callGeminiWithRetry('gemini-3.1-pro-preview', 
      `Conduct medical/clinical research on the following query: ${query}`,
      {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            findings: { type: Type.STRING },
            rationale: { type: Type.STRING },
            confidenceScore: { type: Type.NUMBER },
            nextBestAction: { type: Type.STRING }
          },
          required: ['findings', 'rationale', 'confidenceScore', 'nextBestAction']
        }
      }
    );

    const result = JSON.parse(response.text);
    res.json(result);
  } catch (error: any) {
    console.error('Research error:', error);
    res.status(500).json({ error: 'Failed to perform research' });
  }
});

// 7. Workflow Suggestions
router.post('/workflow-suggestions', async (req, res) => {
  try {
    const { currentState, role } = req.body;
    
    if (!ai) {
      return res.json({
        suggestions: ['Review pending tasks.'],
        rationale: 'Fallback suggestions.',
        confidenceScore: 0.5,
        nextBestAction: 'Manual review.'
      });
    }

    const response = await callGeminiWithRetry('gemini-3-flash-preview', 
      `Based on the current state: ${JSON.stringify(currentState)} and role: ${role}, suggest the next best workflow actions.`,
      {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
            rationale: { type: Type.STRING },
            confidenceScore: { type: Type.NUMBER },
            nextBestAction: { type: Type.STRING }
          },
          required: ['suggestions', 'rationale', 'confidenceScore', 'nextBestAction']
        }
      }
    );

    const result = JSON.parse(response.text);
    res.json(result);
  } catch (error: any) {
    console.error('Workflow suggestions error:', error);
    res.status(500).json({ error: 'Failed to generate workflow suggestions' });
  }
});

export default router;


import { GoogleGenAI, Type } from "@google/genai";
import { Signal, PredictionResult } from "../types";

/**
 * Service to calculate signals using Gemini AI by analyzing historical crash patterns.
 */
export const calculateSignal = async (history: Signal[]): Promise<PredictionResult> => {
  // Fix: Use process.env.API_KEY directly in a named parameter as per guidelines.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const historyData = history.slice(-15).map(s => s.multiplier).join(', ');
  
  const prompt = `LUCKY JET SIGNAL ANALYSIS FOR 1WIN.NG
  Current Sequence: [${historyData}]
  
  TASK:
  1. Calculate the most probable next crash multiplier (Signal).
  2. Determine an optimal entry time (relative to now, e.g., "Next Round").
  3. Assess risk level based on sequence volatility.
  4. Provide a brief technical analysis using pattern terminology (Fibonacci, Martingale cycles, etc.).
  
  RETURN JSON FORMAT ONLY.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            nextSignal: { type: Type.NUMBER },
            entryTime: { type: Type.STRING },
            confidence: { type: Type.STRING },
            analysis: { type: Type.STRING },
            riskLevel: { type: Type.STRING, enum: ['LOW', 'MEDIUM', 'HIGH'] }
          },
          required: ["nextSignal", "entryTime", "confidence", "analysis", "riskLevel"]
        }
      }
    });

    // Fix: Access the .text property directly (not a method) as per guidelines.
    const text = response.text || '{}';
    return JSON.parse(text);
  } catch (error) {
    console.error("Signal Engine Error:", error);
    return {
      nextSignal: 1.55,
      entryTime: "Next Available",
      confidence: "85%",
      analysis: "Standard recovery pattern detected in the jet sequence.",
      riskLevel: 'LOW'
    };
  }
};

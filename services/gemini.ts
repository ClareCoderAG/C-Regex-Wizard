import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';
import { RegexResult } from '../types';

export const generateRegexSolution = async (userPrompt: string): Promise<RegexResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: userPrompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          pattern: { type: Type.STRING },
          csharpCode: { type: Type.STRING },
          explanation: { type: Type.STRING },
          jsPattern: { type: Type.STRING, nullable: true },
        },
        required: ["pattern", "csharpCode", "explanation"],
      }
    }
  });

  const text = response.text;
  if (!text) {
    throw new Error("No response from AI");
  }

  try {
    return JSON.parse(text) as RegexResult;
  } catch (e) {
    console.error("Failed to parse JSON", e);
    throw new Error("AI returned invalid format");
  }
};

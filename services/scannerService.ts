import { GoogleGenerativeAI } from "@google/generative-ai";
import { Question } from "./aiService";

const API_KEY = "AIzaSyCsdEKaaeg1xlK-oGZhBOGYGg59B5T-NbA"; // Best to use .env
const genAI = new GoogleGenerativeAI(API_KEY);

export const extractAllQuestionsFromImage = async (base64Image: string): Promise<Question[]> => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  
  const prompt = `
    PROMPT INSTRUCTION:
      Extract questions from the image. 
      Identify all mathematical symbols, equations, and formulas. 
      Wrap these parts ONLY in single dollar signs. 
      Example: "A particle travels with an acceleration of $(9 - 4v^2)ms^{-2}$."
      Return as JSON.

    STRUCTURE RULES:
    - Return ONLY a raw JSON array.
    - 'subQuestions' must be an array of simple strings.
  `;

  try {
    const result = await model.generateContent([
      prompt,
      { inlineData: { data: base64Image, mimeType: "image/jpeg" } }
    ]);
    
    const text = result.response.text();
    const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed: any[] = JSON.parse(cleanJson);

    return parsed.map(q => ({
      ...q,
      id: Math.random().toString(36).substring(2, 9) + Date.now().toString(),
      // Force subQuestions to be strings immediately to prevent the Object crash
      subQuestions: Array.isArray(q.subQuestions) 
        ? q.subQuestions.map((s: any) => typeof s === 'object' ? (s.question || JSON.stringify(s)) : String(s))
        : [],
      type: (q.options?.length > 0) ? 'MCQ' : 'Structural'
    }));
  } catch (error) {
    console.error("Scanner Service Error:", error);
    return [];
  }
};
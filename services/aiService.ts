import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. THE BLUEPRINT
export interface Question {
  id: string; // Changed to string to fix your card errors
  type: 'MCQ' | 'Structural';
  question: string;
  options?: string[];       
  subQuestions?: string[];  
  marks?: number;
}

// 2. CONFIGURATION
const API_KEY = "AIzaSyCsdEKaaeg1xlK-oGZhBOGYGg59B5T-NbA"; 
const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * GENERATE QUESTIONS VIA TEXT PROMPT (Quick AI Tab)
 * Uses your specific prompt.
 */
export const fetchQuestionsFromAI = async (
  topic: string, 
  count: number, 
  difficulty: string,
  type: 'MCQ' | 'Structural'
): Promise<Question[]> => {
  // Use 1.5-flash to avoid the 400 error (2.5 doesn't exist)
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    Generate ${count} ${type} exam questions about "${topic}" at a ${difficulty} level.
    1. Do NOT include numbers like "1." or "Question 1" in the question text.
    2. For MCQs: provide 4 options starting with A), B), C), D).
    3. For Structural: provide 2-3 sub-parts in a "subQuestions" array.
    
    Return ONLY a raw JSON array:
    [
      {
        "id": "string",
        "type": "${type}",
        "question": "string",
        ${type === 'MCQ' ? '"options": ["A)...", "B)...", "C)...", "D)..."]' : '"subQuestions": ["i...", "ii..."]'}
      }
    ]
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    // The "q: any" fix prevents the ts(7006) error
    const data = JSON.parse(cleanJson);
    return data.map((q: any) => ({
      ...q,
      id: String(q.id || Math.random()) // Ensures id is always a string for your cards
    }));
  } catch (error) {
    console.error("AI Generation Error:", error);
    return [];
  }
};
import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. THE BLUEPRINT
export interface Question {
  id: string; 
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
 */
export const fetchQuestionsFromAI = async (
  topic: string, 
  count: number, 
  difficulty: string,
  type: 'MCQ' | 'Structural',
  className: string // Added class parameter
): Promise<Question[]> => {
  
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    Generate ${count} ${type} exam questions for a ${className} class.
    Topic: ${topic}
    Difficulty: ${difficulty}

    REQUIREMENTS:
    1. Do NOT include question numbers (like "1." or "Question 1") in the text.
    2. For MCQ: Provide 4 distinct options in an array.
    3. For Structural: Provide 2-3 sub-questions in an array.
    4. Ensure the content is strictly relevant to the topic and grade level.

    Return ONLY a raw JSON array:
    [
      {
        "id": "unique_string",
        "type": "${type}",
        "question": "string",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "subQuestions": ["Sub-part i", "Sub-part ii"]
      }
    ]
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Simple cleaning of the AI response
    const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const data = JSON.parse(cleanJson);
    
    // Map data to ensure compatibility with your Question Cards
    return data.map((q: any) => ({
      ...q,
      id: String(q.id || Math.random().toString(36).substring(2, 9)),
      options: Array.isArray(q.options) ? q.options : [],
      subQuestions: Array.isArray(q.subQuestions) ? q.subQuestions : []
    }));
  } catch (error) {
    console.error("AI Generation Error:", error);
    return [];
  }
};
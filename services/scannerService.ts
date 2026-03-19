import { GoogleGenerativeAI } from "@google/generative-ai";
import { Question } from "./aiService";

const API_KEY = "AIzaSyCsdEKaaeg1xlK-oGZhBOGYGg59B5T-NbA"; // Ensure your key is here
const genAI = new GoogleGenerativeAI(API_KEY);

export const extractAllQuestionsFromImage = async (base64Image: string): Promise<Question[]> => {
  // Use 1.5-flash for speed and vision accuracy
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  
  const prompt = `
    Extract ALL questions from the provided image for an exam maker app.
    
    STRUCTURE RULES:
    - 'MCQ': Must have an 'options' array.
    - 'Structural': Questions with parts (i, ii) go into 'subQuestions' array.
    
    Return ONLY a raw JSON array:
    [{"type": "MCQ" | "Structural", "question": "...", "options": [], "subQuestions": []}]
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
      options: Array.isArray(q.options) ? q.options : [],
      subQuestions: Array.isArray(q.subQuestions) ? q.subQuestions : [],
      type: q.options?.length > 0 ? 'MCQ' : 'Structural'
    }));
  } catch (error) {
    console.error("Scanner Service Error:", error);
    return [];
  }
};
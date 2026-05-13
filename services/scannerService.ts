// services/scannerService.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Question } from './aiService'; // Import Question interface

/**
 * .env CONFIGURATION:
 * Ensure your file is named ".env" (no extension) in the root folder.
 * Contents: EXPO_PUBLIC_GEMINI_API_KEY=AIza...
 */
const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY || '');

export async function extractAllQuestionsFromImage(base64Image: string): Promise<{ questions: Question[] }> {
  if (!process.env.EXPO_PUBLIC_GEMINI_API_KEY) {
    throw new Error("API Configuration Error. Ensure your .env is set and Expo is restarted with 'npx expo start -c'");
  }

  const systemInstruction = `
    You are an expert exam scanner designed to extract questions from printed or handwritten exam papers.
    Your output MUST be a strict JSON object with a single "questions" array.
    
    CRITICAL RULES:
    1. Convert math to LaTeX wrapped in single dollar signs $...$.
    2. For MCQ: Use type: "MCQ", provide an "options" array, and leave "subQuestions" empty.
    3. For Structural: Use type: "Structural", provide a "subQuestions" array, and leave "options" empty.
    4. Tables: If the image contains tabular data, format it using standard HTML <table> tags (e.g., <table><tr><td>...</td></tr></table>). Ensure no newlines within table cells.
    5. Generate a unique string 'id' for each question.
    6. Do NOT include question numbers (e.g., "1.") in the question text.
    
    JSON Output Format:
    {
      "questions": [
        {
          "id": "unique-id",
          "type": "MCQ",
          "question": "text",
          "options": ["A", "B", "C", "D"],
          "subQuestions": []
        }
      ]
    }
  `;

  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      systemInstruction: systemInstruction,
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.1,
      }
    });

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: 'image/jpeg',
          data: base64Image
        }
      },
      { text: "Extract all questions from this exam image into the specified JSON format." }
    ]);

    const response = await result.response;
    const text = response.text();
    
    // Clean up potential markdown blocks if the API ignores responseMimeType
    const cleanJson = text.replace(/```json|```/g, "").trim();
    // Rely on responseMimeType: "application/json" to handle escaping correctly.
    const parsed = JSON.parse(cleanJson);

    // Validation: Ensure the model returned the expected "questions" key
    if (!parsed.questions || !Array.isArray(parsed.questions)) {
      console.warn("AI returned JSON without a questions array:", parsed);
      return { questions: [] };
    }
    return parsed;
    
  } catch (error: any) {
    console.error("Scanner Error:", error);
    throw new Error(error.message || "Extraction failed. Check API Key or image quality.");
  }
}
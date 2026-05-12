// services/scannerService.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * .env CONFIGURATION:
 * Ensure your file is named ".env" (no extension) in the root folder.
 * Contents: EXPO_PUBLIC_GEMINI_API_KEY=AIza...
 */
const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export async function extractAllQuestionsFromImage(base64Image: string): Promise<any> {
  if (!API_KEY || API_KEY === '' || !genAI) {
    throw new Error("API Configuration Error. Ensure your .env is set and Expo is restarted with 'npx expo start -c'");
  }

  const systemInstruction = `
    You are an expert exam scanner designed to extract questions from printed or handwritten exam papers.
    Your output MUST be a strict JSON object with a single "questions" array.
    
    CRITICAL RULES:
    1. Convert math to LaTeX wrapped in single dollar signs $...$.
    2. For MCQ: Use type: "MCQ", provide an "options" array, and leave "subQuestions" empty.
    3. For Structural: Use type: "Structural", provide a "subQuestions" array, and leave "options" empty.
    4. Format tables using standard HTML <table> tags (e.g., <table><tr><td>Value</td></tr></table>).
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
    const cleanText = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleanText);

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
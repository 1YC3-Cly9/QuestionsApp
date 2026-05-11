// 2. CONFIGURATION
//const API_KEY = "AIzaSyCsdEKaaeg1xlK-oGZhBOGYGg59B5T-NbA"; 

export interface Question {
  id: string;
  type: 'MCQ' | 'Structural';
  question: string;
  options?: string[];
  subQuestions?: string[];
}

// services/scannerService.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize your API Client (Make sure your API key is correctly configured)
const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY || '');

/**
 * Fetches generated questions based on a text prompt (used by Quick AI tab)
 */
export async function fetchQuestionsFromAI(topic: string, count: number, difficulty: string, type: string): Promise<Question[]> {
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: { 
        responseMimeType: 'application/json',
        temperature: 0.7 
      },
      systemInstruction: `You are an academic exam generator. 
      Generate exactly ${count} ${difficulty} difficulty ${type} questions about ${topic}.
      Return a JSON object with a "questions" array. 
      Schema: { "questions": [{ "id": "string", "type": "${type}", "question": "string", "options": ["string"], "subQuestions": ["string"] }] }
      - Use LaTeX for math wrapped in single dollar signs $...$.
      - For MCQ: provide 4 options.
      - For Structural: provide sub-parts in subQuestions.`
    });

    const prompt = `Generate the questions now.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
    
    return parsed.questions || [];
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw error;
  }
}

export async function scanExamImage(base64Image: string): Promise<any> {
  const systemInstruction = `
    You are an expert exam scanner designed to extract questions from printed or handwritten exam papers.
    Your output MUST be a strict JSON object with a single "questions" array.
    
    CRITICAL RULES FOR EXTRACTION:
    1. If a question contains a table (for example: a frequency distribution, a mapping, or a data set):
       - Do NOT split the rows, headers, or any part of the table into subQuestions.
       - The entire table MUST remain in the "question" field.
       - Format the table inside the "question" field using standard Markdown pipe characters (|).
       - Ensure all columns line up. Example:
         | Time in minutes | 1-3 | 4-6 | 7-9 |
         | Frequency       |  3  |  5  |  9  |
    
    2. "subQuestions" must ONLY contain actual distinct child parts of a question (typically marked with (i), (ii), (a), (b)).
    3. Convert mathematical expressions, formulas, variables, and symbols to LaTeX format wrapped in single dollar signs like $x^2 + y^2 = r^2$.
    4. Remove any explicit question numbers from the extracted text (e.g., do not output "3. Calculate...", instead output "Calculate...").
    
    JSON Output Format:
    {
      "questions": [
        {
          "id": "generate-a-unique-string-uuid",
          "question": "Use the table below to answer the following questions:\\n\\n| Time in minutes | 1-3 | 4-6 | 7-9 |\\n| Frequency       |  3  |  5  |  9  |",
          "subQuestions": [
            "State the modal class.",
            "Calculate an estimate of the mean time."
          ]
        }
      ]
    }
  `;

  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      systemInstruction: systemInstruction,
      generationConfig: { responseMimeType: 'application/json' }
    });

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: 'image/jpeg',
          data: base64Image
        }
      },
      { text: "Extract the questions from this exam sheet following the system instructions strictly." }
    ]);

    const responseText = result.response.text();
    if (!responseText) {
      throw new Error("No response content from Gemini API.");
    }

    // Ensure we handle potential markdown wrapping even with JSON mimeType
    const cleanJson = responseText.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("Scanner Service Error:", error);
    throw error;
  }
}
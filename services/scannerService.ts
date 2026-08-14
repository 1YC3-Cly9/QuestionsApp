// services/scannerService.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as ImageManipulator from 'expo-image-manipulator';
import { Question } from './aiService'; // Import Question interface

/**
 * .env CONFIGURATION:
 * Ensure your file is named ".env" (no extension) in the root folder.
 * Contents: EXPO_PUBLIC_GEMINI_API_KEY=AIza...
 */
const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY || '');

export async function extractAllQuestionsFromImage(
  base64Image: string, 
  imageUri: string, 
  mode: 'question' | 'notes' = 'question',
  difficulty?: 'Easy' | 'Medium' | 'Hard',
  targetCount?: number,
  questionType?: 'MCQ' | 'Structural'
): Promise<{ questions: Question[] }> {
  if (!process.env.EXPO_PUBLIC_GEMINI_API_KEY) {
    throw new Error("API Configuration Error. Ensure your .env is set and Expo is restarted with 'npx expo start -c'");
  }

  const roleInstruction = mode === 'notes'
    ? `You are an expert educational AI. Analyze the provided study notes, textbook page, or summary document. Your task is to generate relevant, high-quality exam questions based on the key concepts, definitions, and formulas found in the notes.`
    : `You are an expert exam scanner designed to extract questions from printed or handwritten exam papers.`;

  const difficultyInstruction = (mode === 'notes' && difficulty)
    ? `\n    9. Difficulty: Generate questions at the "${difficulty}" difficulty level.
       - Easy: Basic recall, definitions, and simple calculations.
       - Medium: Application of concepts, moderate problem-solving.
       - Hard: Analysis, complex multi-step problems, and deeper reasoning.`
    : '';

  const countInstruction = (mode === 'notes' && targetCount && targetCount > 0)
    ? `\n    ${difficulty ? '10' : '9'}. Question Count: Generate approximately ${targetCount} questions. Do not exceed this limit.`
    : '';
  
  const typeInstruction = (mode === 'notes' && questionType)
    ? `\n    11. Question Type: Generate ONLY "${questionType}" type questions.`
    : '';

  const systemInstruction = `
    ${roleInstruction}
    Your output MUST be a strict JSON object with a single "questions" array.
    
    CRITICAL RULES:
    1. NO DOCUMENT REFERENCES: Questions must be completely self-contained. It is forbidden to use phrases like "According to the text...", "Based on the provided notes...", or "As shown in the image...". The question must make sense on its own.
    2. Convert math to LaTeX wrapped in single dollar signs $...$.
       IMPORTANT: All backslashes MUST be double-escaped for valid JSON (e.g., "\\\\tan", "\\\\frac", "\\\\equiv").
    3. For MCQ: Use type: "MCQ", provide an "options" array, and leave "subQuestions" empty.
    4. For Structural: Identify the main question stem. If a question has sub-parts (labeled i, ii, iii or a, b, c), group them into the "subQuestions" array. 
       The main "question" field should contain the introductory text, and sub-parts MUST NOT be treated as separate top-level questions.
    5. Tables: If the image contains tabular data, format it using standard HTML <table> tags (e.g., <table><tr><td>...</td></tr></table>). Ensure no newlines within table cells.
    6. Diagrams: If a question has a diagram, figure, or chart, provide its location in a "boxes" array.
       Each box MUST be [ymin, xmin, ymax, xmax] normalized to a 0-1000 scale.
    7. Generate a unique string 'id' for each question.
    8. Do NOT include question numbers (e.g., "1.") in the question text.
    9. Hierarchy: Maintain the logical structure of the exam paper or notes.${difficultyInstruction}${countInstruction}${typeInstruction}

    JSON Output Format:
    {
      "questions": [
        {
          "id": "unique-id",
          "type": "MCQ",
          "question": "text",
          "options": ["A", "B", "C", "D"],
          "subQuestions": [],
          "boxes": [[420, 280, 560, 700]],
          "imageScales": []
        }
      ]
    }
  `;

  try {
    // Get original image dimensions reliably using ImageManipulator
    // This also helps normalize orientation issues
    const initialInfo = await ImageManipulator.manipulateAsync(imageUri, [], { format: ImageManipulator.SaveFormat.JPEG });
    const { width, height } = initialInfo;

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      systemInstruction: systemInstruction,
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.1,
      }
    });

    const countHint = (mode === 'notes' && targetCount) ? ` Generate approximately ${targetCount} questions.` : '';
    const difficultyHint = (mode === 'notes' && difficulty) ? ` Target difficulty: ${difficulty}.` : '';
    const promptText = mode === 'notes' 
      ? `Analyze these study notes and extract or generate all relevant exam questions into the specified JSON format.${difficultyHint}${countHint}`
      : "Extract all questions from this exam image into the specified JSON format.";

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: 'image/jpeg',
          data: base64Image
        }
      },
      { text: promptText }
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

    // Process and crop diagrams
    const processedQuestions = await Promise.all(parsed.questions.map(async (q: any, idx: number) => {
      // Flatten parent question if it's an object
      const mainQuestion = typeof q.question === 'object' 
        ? (q.question.text || q.question.question || JSON.stringify(q.question)) 
        : String(q.question || "");

      let croppedImages: string[] = [];
      
      // If AI detected a diagram area and we have valid image dimensions
      if (q.boxes && q.boxes.length > 0 && width > 0) {
        for (const box of q.boxes) {
          const [ymin, xmin, ymax, xmax] = box;
          try {
            // Gemini coordinates are ymin, xmin, ymax, xmax (normalized 0-1000)
            const cropResult = await ImageManipulator.manipulateAsync(
              imageUri,
              [{
                crop: {
                  originX: Math.floor((xmin / 1000) * width),
                  originY: Math.floor((ymin / 1000) * height),
                  width: Math.max(1, Math.floor(((xmax - xmin) / 1000) * width)),
                  height: Math.max(1, Math.floor(((ymax - ymin) / 1000) * height)),
                }
              }],
              { base64: true, compress: 0.9, format: ImageManipulator.SaveFormat.JPEG }
            );
            croppedImages.push(`data:image/jpeg;base64,${cropResult.base64}`);
          } catch (e) {
            console.error("Scanner: Failed to crop image section:", e);
          }
        }
      }

      return {
        ...q,
        id: `scan-${Date.now()}-${Math.random().toString(36).substring(2, 5)}-${q.id || idx}`,
        question: mainQuestion,
        images: croppedImages,
        subQuestions: Array.isArray(q.subQuestions)
          ? q.subQuestions.map((s: any) => (typeof s === 'object' ? (s.question || s.text || JSON.stringify(s)) : String(s)))
          : []
      };
    }));

    return { questions: processedQuestions };
    
  } catch (error: any) {
    console.error("Scanner Error:", error);
    throw new Error(error.message || "Extraction failed. Check API Key or image quality.");
  }
}
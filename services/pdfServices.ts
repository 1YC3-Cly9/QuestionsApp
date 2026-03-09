import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Question } from './aiService';

export const generateExamPDF = async (
  schoolName: string,
  topic: string,
  totalMarks: string,
  questions: Question[]
) => {
  // 1. Build the HTML content
  // We include MathJax in the <head> so the PDF engine renders the LaTeX perfectly
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
      <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 20px; font-size: 12px; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 10px; }
        .header h1 { margin: 0; font-size: 24px; text-transform: uppercase; }
        .header h3 { margin: 5px 0; font-size: 16px; color: #555; }
        
        /* 2-Column Layout for the Exam Body */
        .exam-body {
          column-count: 2;
          column-gap: 40px;
          column-rule: 1px solid #ddd;
        }
        
        .question-block { break-inside: avoid; margin-bottom: 25px; }
        .question-text { font-weight: bold; margin-bottom: 8px; font-size: 13px; }
        
        .options-list { list-style-type: none; padding-left: 15px; margin: 0; }
        .options-list li { margin-bottom: 5px; }
        
        .sub-questions { margin-top: 10px; padding-left: 15px; }
        .sub-row { margin-bottom: 8px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${schoolName || 'Examination Paper'}</h1>
        <h3>Topic: ${topic || 'General Assessment'} | Total Marks: ${totalMarks || '100'}</h3>
      </div>

      <div class="exam-body">
        ${questions.map((q, index) => `
          <div class="question-block">
            <div class="question-text">${index + 1}. ${q.question}</div>
            
            ${q.type === 'MCQ' && q.options ? `
              <ul class="options-list">
                ${q.options.map((opt, i) => `<li>${['A', 'B', 'C', 'D'][i]}) ${opt}</li>`).join('')}
              </ul>
            ` : ''}

            ${q.type === 'Structural' && q.subQuestions ? `
              <div class="sub-questions">
                ${q.subQuestions.map((sub, i) => `
                  <div class="sub-row">(${['i', 'ii', 'iii', 'iv', 'v'][i]}) ${sub}</div>
                `).join('')}
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    </body>
    </html>
  `;

  try {
    // 2. Convert the HTML to a PDF file stored in local device cache
    const { uri } = await Print.printToFileAsync({ html: htmlContent });
    
    // 3. Open the native share dialog so the user can save, print, or WhatsApp the file
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    }
  } catch (error) {
    console.error("PDF Generation Error: ", error);
  }
};
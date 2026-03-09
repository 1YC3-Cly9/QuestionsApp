import * as Print from 'expo-print';

// 1. THIS IS THE ENGINE: It creates the HTML string
export const getExamHtmlContent = (schoolName: string, className: string, totalMarks: string, logoUri: string | null, questions: any[]) => {
  return `
    <html>
      <head>
        <style>
          body { font-family: 'Helvetica'; padding: 20px; color: #333; }
          .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
          .logo { width: 80px; height: 80px; object-fit: contain; margin-bottom: 10px; }
          .q-box { margin-bottom: 15px; page-break-inside: avoid; }
          .options-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 5px; }
          .sub-q { margin-left: 20px; margin-top: 5px; }
        </style>
      </head>
      <body>
        <div class="header">
          ${logoUri ? `<img src="${logoUri}" class="logo" />` : ''}
          <h1>${schoolName || 'EXAMINATION PAPER'}</h1>
          <p>Class: ${className} | Total Marks: ${totalMarks}</p>
        </div>
        ${questions.map((q, i) => `
          <div class="q-box">
            <p><strong>Q${i + 1}. ${q.question}</strong></p>
            ${q.type === 'MCQ' ? `
              <div class="options-grid">
                ${q.options.map((opt: string, oi: number) => `<div>${String.fromCharCode(65 + oi)}) ${opt}</div>`).join('')}
              </div>
            ` : `
              ${q.subQuestions ? q.subQuestions.map((sub: string, si: number) => `
                <div class="sub-q">(${['i','ii','iii','iv','v'][si]}) ${sub}</div>
              `).join('') : ''}
            `}
          </div>
        `).join('')}
      </body>
    </html>
  `;
};

// 2. THIS IS THE EXPORT ACTION: It triggers the printer
export const generateExamPDF = async (schoolName: string, className: string, totalMarks: string, logoUri: string | null, questions: any[]) => {
  const html = getExamHtmlContent(schoolName, className, totalMarks, logoUri, questions);
  await Print.printAsync({ html });
};
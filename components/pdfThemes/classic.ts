import { Question } from '../../services/aiService';
import { PdfTheme, PdfThemeData } from '../../services/pdfThemes';

const classicStyles = `
  body { font-family: 'Times New Roman', Times, serif; padding: 25px; font-size: 12pt; }
  .header { text-align: center; margin-bottom: 20px; }
  .logo { max-height: 60px; max-width: 100px; object-fit: contain; margin-bottom: 10px; }
  .header h1 { margin: 0; font-size: 20pt; }
  .header-details { display: flex; justify-content: space-between; margin-top: 15px; border-top: 1px solid #000; border-bottom: 1px solid #000; padding: 8px 0; }
  .exam-body { column-count: 2; column-gap: 30px; column-rule: 1px solid #eee; }
  .question-block { break-inside: avoid; margin-bottom: 20px; }
  .question-text { font-weight: bold; margin-bottom: 8px; }
  .options-list { list-style-type: none; padding-left: 15px; margin: 0; }
  .sub-questions { margin-top: 8px; padding-left: 20px; }
`;

const renderClassicBody = ({ schoolName, className, totalMarks, logoUri, topic, questions = [] }: PdfThemeData): string => `
  <div class="header">
    ${logoUri ? `<img src="${logoUri}" class="logo" />` : ''}
    <h1>${schoolName || 'EXAMINATION PAPER'}</h1>
  </div>
  <div class="header-details">
    <span><b>Class:</b> ${className || 'N/A'}</span>
    <span><b>Subject:</b> ${topic || 'General'}</span>
    <span><b>Total Marks:</b> ${totalMarks || '100'}</span>
  </div>
  <div class="exam-body">
    ${questions.map((q: Question, i: number) => `
      <div class="question-block">
        <div class="question-text">${i + 1}. ${q.question || ''}</div>
        ${q.type === 'MCQ' ? `<ol type="A" class="options-list">${(q.options || []).map(opt => `<li>${opt}</li>`).join('')}</ol>` : ''}
        ${q.type === 'Structural' ? `<div class="sub-questions">${(q.subQuestions || []).map((sub, si) => `<div>(${String.fromCharCode(97 + si)}) ${sub}</div>`).join('')}</div>` : ''}
      </div>
    `).join('')}
  </div>
`;

const classicTheme: PdfTheme = {
  name: 'Classic',
  description: 'A traditional two-column layout, suitable for printing.',
  getStyles: () => classicStyles,
  renderBody: renderClassicBody,
};

export default classicTheme;
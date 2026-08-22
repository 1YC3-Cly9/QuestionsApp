import { Question } from '../../services/aiService';
import { PdfTheme, PdfThemeData } from '../../services/pdfThemes';

const classicStyles = `
  body { font-family: 'Times New Roman', Times, serif; padding: 25px; font-size: 12pt; }
  .header { text-align: center; margin-bottom: 20px; }
  .logo { max-height: 60px; max-width: 100px; object-fit: contain; margin-bottom: 10px; }
  .header h1 { margin: 0; font-size: 20pt; }
  .header-details { display: flex; justify-content: space-between; margin-top: 15px; border-top: 1px solid #000; border-bottom: 1px solid #000; padding: 8px 0; }
  .section-heading { margin: 22px 0 4px; font-weight: bold; }
  .section-rule { border: 0; border-top: 1px solid #000; }
  .upper-rule { margin: 0 !important; }
  .lower-rule { margin: 16px 0; }
  .section-rule-text { margin: 0 0 16px; }
  .question-rule-line { margin: 0 0 16px; }
  .section-instruction { font-size: 14px; font-weight: bold; font-style: italic; }
  .question-rule-text { font-style: italic; }
  .exam-body { column-count: 2; column-gap: 30px; column-rule: 1px solid #eee; }
  .question-block { break-inside: avoid; margin-bottom: 20px; }
  .question-text { font-weight: bold; margin-bottom: 8px; }
  .options-list { list-style-type: none; padding-left: 15px; margin: 0; }
  .sub-questions { margin-top: 8px; padding-left: 20px; }
`;

const renderClassicBody = ({ schoolName, className, totalMarks, logoUri, topic, date = '', sectionTitle = '', showSectionRule = true, sectionRule = '', sectionStart = '1', sectionEnd = '', sections = [], questions = [] }: PdfThemeData): string => `
  <div class="header">
    ${logoUri ? `<img src="${logoUri}" class="logo" />` : ''}
    <h1>${schoolName || 'EXAMINATION PAPER'}</h1>
  </div>
  <div class="header-details">
    <span><b>Class:</b> ${className || 'N/A'}</span>
    <span><b>Date:</b> ${date || 'N/A'}</span>
    <span><b>Subject:</b> ${topic || 'General'}</span>
    <span><b>Total Marks:</b> ${totalMarks || '100'}</span>
  </div>
  ${(sections.length ? sections : [{ title: sectionTitle, rule: sectionRule, start: sectionStart, end: sectionEnd, upperRule: false, lowerRule: showSectionRule }]).map((section) => {
    const start = Number(section.start || 1);
    const end = Number(section.end || questions.length);
    return `${section.title ? `<div class="section-heading">${section.title}</div>` : ''}${section.upperRule && section.title ? '<hr class="section-rule upper-rule" />' : ''}${section.rule ? `<div class="question-rule-line"><span class="section-instruction">Instruction :</span> <span class="question-rule-text">${section.rule}</span></div>` : ''}<div class="exam-body">${questions.slice(start - 1, end).map((q: Question, i: number) => `<div class="question-block"><div class="question-text">${start + i}. ${q.question || ''}</div>${q.type === 'MCQ' ? `<ol type="A" class="options-list">${(q.options || []).map(opt => `<li>${opt}</li>`).join('')}</ol>` : ''}${q.type === 'Structural' ? `<div class="sub-questions">${(q.subQuestions || []).map((sub, si) => `<div>(${String.fromCharCode(97 + si)}) ${sub}</div>`).join('')}</div>` : ''}</div>`).join('')}</div>${section.lowerRule && section.title ? '<hr class="section-rule lower-rule" />' : ''}`;
  }).join('')}
`;

const classicTheme: PdfTheme = {
  name: 'Classic',
  description: 'A traditional two-column layout, suitable for printing.',
  getStyles: () => classicStyles,
  renderBody: renderClassicBody,
};

export default classicTheme;
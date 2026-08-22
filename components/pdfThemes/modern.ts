import { Question } from '../../services/aiService';
import { PdfTheme, PdfThemeData } from '../../services/pdfThemes';

const modernStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
  body { font-family: 'Roboto', 'Helvetica Neue', sans-serif; padding: 20px; font-size: 11pt; background-color: #f9f9f9; }
  .header { display: flex; align-items: center; border-bottom: 2px solid #6c5ce7; padding-bottom: 15px; margin-bottom: 25px; }
  .logo { max-height: 50px; max-width: 50px; object-fit: contain; margin-right: 20px; border-radius: 8px; }
  .school-info h1 { margin: 0; font-size: 22pt; color: #6c5ce7; }
  .school-info p { margin: 0; color: #555; }
  .question-block { break-inside: avoid; margin-bottom: 15px; background-color: #fff; border: 1px solid #eee; border-radius: 8px; padding: 15px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
  .question-header { display: flex; align-items: baseline; }
  .q-number { font-weight: bold; font-size: 14pt; color: #6c5ce7; margin-right: 10px; }
  .question-text { flex: 1; font-size: 12pt; }
  .options-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 20px; margin-top: 10px; padding-left: 30px; }
  .sub-questions { margin-top: 10px; padding-left: 30px; }
  .section-heading { margin: 22px 0 4px; font-weight: bold; }
  .section-rule { border: 0; border-top: 2px solid #6c5ce7; }
  .upper-rule { margin: 0 !important; }
  .lower-rule { margin: 16px 0; }
  .section-rule-text { margin: 0 0 16px; }
  .question-rule-line { margin: 0 0 16px; }
  .section-instruction { font-size: 14px; font-weight: bold; font-style: italic; }
  .question-rule-text { font-style: italic; }
`;

const renderModernBody = ({ schoolName, className, totalMarks, logoUri, topic, date = '', sectionTitle = '', showSectionRule = true, sectionRule = '', sectionStart = '1', sectionEnd = '', sections = [], questions = [] }: PdfThemeData): string => `
  <div class="header">
    ${logoUri ? `<img src="${logoUri}" class="logo" />` : ''}
    <div class="school-info">
      <h1>${schoolName || 'Examination Paper'}</h1>
      <p>Class: ${className || 'N/A'} | Date: ${date || 'N/A'} | Subject: ${topic || 'General'} | Marks: ${totalMarks || '100'}</p>
    </div>
  </div>
  ${(sections.length ? sections : [{ title: sectionTitle, rule: sectionRule, start: sectionStart, end: sectionEnd, upperRule: false, lowerRule: showSectionRule }]).map((section) => {
    const start = Number(section.start || 1);
    const end = Number(section.end || questions.length);
    return `${section.title ? `<div class="section-heading">${section.title}</div>` : ''}${section.upperRule && section.title ? '<hr class="section-rule upper-rule" />' : ''}${section.rule ? `<div class="question-rule-line"><span class="section-instruction">Instruction :</span> <span class="question-rule-text">${section.rule}</span></div>` : ''}${questions.slice(start - 1, end).map((q: Question, i: number) => `<div class="question-block"><div class="question-header"><span class="q-number">${start + i}.</span><div class="question-text">${q.question || ''}</div></div>${q.type === 'MCQ' ? `<div class="options-grid">${(q.options || []).map((opt, oi) => `<div>${String.fromCharCode(65 + oi)}. ${opt}</div>`).join('')}</div>` : ''}${q.type === 'Structural' ? `<div class="sub-questions">${(q.subQuestions || []).map((sub, si) => `<div>(${String.fromCharCode(97 + si)}) ${sub}</div>`).join('')}</div>` : ''}</div>`).join('')}${section.lowerRule && section.title ? '<hr class="section-rule lower-rule" />' : ''}`;
  }).join('')}
`;

const modernTheme: PdfTheme = {
  name: 'Modern',
  description: 'A clean, single-column layout with shaded question boxes.',
  getStyles: () => modernStyles,
  renderBody: renderModernBody,
};

export default modernTheme;
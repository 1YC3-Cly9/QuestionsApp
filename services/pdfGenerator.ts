import { Question } from './aiService';
import { getTheme } from './pdfThemes';

export const getExamHtmlContent = (
  themeName: string,
  schoolName: string,
  className: string,
  date: string,
  totalMarks: string,
  logoUri: string | null,
  topic: string,
  sectionTitle: string,
  showSectionRule: boolean,
  sectionRule: string,
  sectionStart: string,
  sectionEnd: string,
  sections: import('./examContext').ExamSection[],
  questions: Question[]
): string => {
  // 1. Get the selected theme object
  const theme = getTheme(themeName);

  const data = { schoolName, className, date, totalMarks, logoUri, topic, sectionTitle, showSectionRule, sectionRule, sectionStart, sectionEnd, sections, questions };
  return theme.generateHtml
    ? theme.generateHtml(data)
    : `
      <html>
        <head><meta charset="utf-8"><style>${theme.getStyles()}</style></head>
        <body>${theme.renderBody(data)}</body>
      </html>
    `;
};


import { Question } from './aiService';
import { getTheme } from './pdfThemes';

export const getExamHtmlContent = (
  themeName: string,
  schoolName: string,
  className: string,
  totalMarks: string,
  logoUri: string | null,
  topic: string,
  questions: Question[]
): string => {
  // 1. Get the selected theme object
  const theme = getTheme(themeName);

  // 2. Use the theme's function to generate and return the HTML
  return theme.generateHtml?.({ schoolName, className, totalMarks, logoUri, topic, questions }) || '';
};


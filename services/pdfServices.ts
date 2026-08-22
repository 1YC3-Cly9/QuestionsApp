import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Question } from './aiService';
import { getExamHtmlContent } from './pdfGenerator';

export const generateExamPDF = async (
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
) => {
  const htmlContent = getExamHtmlContent(
    themeName,
    schoolName,
    className,
    date,
    totalMarks,
    logoUri,
    topic,
    sectionTitle,
    showSectionRule,
    sectionRule,
    sectionStart,
    sectionEnd,
    sections,
    questions
  );

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
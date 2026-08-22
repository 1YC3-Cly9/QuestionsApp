import { Question } from './aiService';
import { ExamSection } from './examContext';

export interface PdfThemeData {
  schoolName: string;
  className: string;
  totalMarks: string;
  logoUri: string | null;
  topic: string;
  date?: string;
  sectionTitle?: string;
  showSectionRule?: boolean;
  sectionRule?: string;
  sectionStart?: string;
  sectionEnd?: string;
  sections?: ExamSection[];
  questions: Question[];
}

export type ThemeSection = 'schoolName' | 'schoolLogo' | 'date' | 'class' | 'sectionTitle' | 'mcqQuestion' | 'mcqAnswers' | 'structuralAnswers';

export interface ThemeSectionStyle {
  fontFamily: string;
  fontSize: string;
  color: string;
  alignment: 'left' | 'center' | 'right' | 'justify';
  bold: boolean;
  italic: boolean;
  underline: boolean;
}

export type ThemeSectionStyles = Record<ThemeSection, ThemeSectionStyle>;

export const themeSections: { key: ThemeSection; label: string }[] = [
  { key: 'schoolName', label: 'School name' },
  { key: 'schoolLogo', label: 'School logo' },
  { key: 'date', label: 'Date' },
  { key: 'class', label: 'Class' },
  { key: 'sectionTitle', label: 'Section title' },
  { key: 'mcqQuestion', label: 'MCQ question' },
  { key: 'mcqAnswers', label: 'MCQ answers' },
  { key: 'structuralAnswers', label: 'Structural answers' },
];

export const defaultSectionStyle = (): ThemeSectionStyle => ({
  fontFamily: 'Georgia, serif',
  fontSize: '16',
  color: '#202124',
  alignment: 'left',
  bold: false,
  italic: false,
  underline: false,
});

export const createDefaultSectionStyles = (): ThemeSectionStyles =>
  Object.fromEntries(themeSections.map(({ key }) => [key, defaultSectionStyle()])) as ThemeSectionStyles;

export interface PdfTheme {
  name: string;
  description: string;
  editorConfig?: {
    accentColor?: string;
    paperColor?: string;
    fontFamily?: string;
    columns: 1 | 2;
    mcqAnswerColumns?: 1 | 2;
    showQuestionDivider?: boolean;
    questionDividerColor?: string;
    sectionRuleColor?: string;
    sections?: ThemeSectionStyles;
  };
  getStyles: () => string;
  renderBody: (data: PdfThemeData) => string;
  generateHtml?: (data: PdfThemeData) => string; // Will be added dynamically
}

export interface CustomThemeConfig {
  name: string;
  accentColor: string;
  paperColor: string;
  fontFamily: string;
  columns: 1 | 2;
  mcqAnswerColumns?: 1 | 2;
  showQuestionDivider?: boolean;
  questionDividerColor?: string;
  sectionRuleColor?: string;
  sections?: ThemeSectionStyles;
}

/**
 * A generic HTML document wrapper. This is the "master template" that injects
 * theme-specific styles and body content.
 */
const createHtmlDocument = (styles: string, bodyContent: string): string => `
  <html>
    <head>
      <meta charset="utf-8">
      <script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
      <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
      <style>${styles}</style>
    </head>
    <body>
      ${bodyContent}
    </body>
  </html>
`;

const validColor = (value: string, fallback: string): string =>
  /^#[0-9a-f]{3,8}$/i.test(value.trim()) ? value.trim() : fallback;

const validFont = (value: string): string => {
  const allowedFonts = ['Georgia', 'Arial', 'Times New Roman', 'Courier New'];
  const fontName = allowedFonts.find((font) => value.startsWith(font));
  return fontName ? `${fontName}, serif` : 'Georgia, serif';
};

const validSize = (value: string): string => {
  const size = Number.parseInt(value, 10);
  return Number.isFinite(size) && size >= 8 && size <= 72 ? `${size}px` : '16px';
};

const validAlignment = (value: string): ThemeSectionStyle['alignment'] =>
  ['left', 'center', 'right', 'justify'].includes(value)
    ? value as ThemeSectionStyle['alignment']
    : 'left';

const sectionCss = (sections: ThemeSectionStyles): string =>
  Object.entries(sections).map(([key, style]) => `
    ${key === 'schoolName' ? '.header h1.section-schoolName' : `.section-${key}`} {
      font-family: ${validFont(style.fontFamily)} !important;
      font-size: ${validSize(style.fontSize)} !important;
      color: ${validColor(style.color, '#202124')} !important;
      text-align: ${validAlignment(style.alignment)} !important;
      font-weight: ${style.bold ? '700' : '400'} !important;
      font-style: ${style.italic ? 'italic' : 'normal'} !important;
      text-decoration: ${style.underline ? 'underline' : 'none'} !important;
    }
  `).join('');

/**
 * Dynamically loads all theme modules from the specified directory.
 * This uses Metro's 'require.context' feature.
 */
function loadThemes(): { [key: string]: PdfTheme } {
  const themeModules = require.context('../components/pdfThemes', false, /\.tsx?$/);
  const loadedThemes: { [key: string]: PdfTheme } = {};

  themeModules.keys().forEach((key: string) => {
    const themeModule = themeModules(key).default as PdfTheme;
    if (themeModule && themeModule.name) {
      const themeKey = themeModule.name.toLowerCase();
      // Dynamically create the generateHtml function for each theme
      themeModule.generateHtml = (data: PdfThemeData) =>
        createHtmlDocument(themeModule.getStyles(), themeModule.renderBody(data));
      loadedThemes[themeKey] = themeModule;
    }
  });

  return loadedThemes;
}

export const themes = loadThemes();

export const themeNames = Object.keys(themes);

export const registerTheme = (theme: PdfTheme, replaceKey?: string): string => {
  const themeKey = theme.name.trim().toLowerCase().replace(/\s+/g, '-');
  if (replaceKey && replaceKey !== themeKey) {
    delete themes[replaceKey];
  }
  theme.generateHtml = (data: PdfThemeData) =>
    createHtmlDocument(theme.getStyles(), theme.renderBody(data));
  themes[themeKey] = theme;
  return themeKey;
};

export const createCustomTheme = (config: CustomThemeConfig): PdfTheme => ({
  name: config.name.trim(),
  description: 'A custom layout created for this exam paper.',
  editorConfig: {
    accentColor: config.accentColor,
    paperColor: config.paperColor,
    fontFamily: config.fontFamily,
    columns: config.columns,
    mcqAnswerColumns: config.mcqAnswerColumns || 1,
    showQuestionDivider: config.showQuestionDivider ?? false,
    questionDividerColor: config.questionDividerColor || '#eeeeee',
    sectionRuleColor: config.sectionRuleColor || '#202124',
    sections: config.sections || createDefaultSectionStyles(),
  },
  getStyles: () => `
    body { font-family: ${config.fontFamily}; padding: 25px; font-size: 12pt; background: ${config.paperColor}; color: #202124; }
    .header { border-bottom: 2px solid ${config.accentColor}; padding-bottom: 15px; margin-bottom: 20px; }
    .logo { max-height: 60px; max-width: 100px; object-fit: contain; margin-bottom: 10px; }
    .header h1 { margin: 0; font-size: 21pt; color: ${config.accentColor}; }
    .header h1.section-schoolName { margin: 0; }
    .header-details { display: flex; justify-content: space-between; gap: 12px; margin-top: 15px; padding: 8px 0; border-top: 1px solid ${config.accentColor}; }
    .section-heading { margin: 22px 0 4px; }
    .section-rule { border: 0; border-top: 1px solid ${config.sectionRuleColor || '#202124'}; }
    .upper-rule { margin: 0 !important; }
    .lower-rule { margin: 16px 0; }
    .section-rule-text { margin: 0 0 16px; }
    .mcq-body { column-count: ${config.columns}; column-gap: 30px; column-rule: ${config.showQuestionDivider ? `1px solid ${config.questionDividerColor || '#eeeeee'}` : 'none'}; }
    .structural-body { margin-top: 20px; }
    .question-block { break-inside: avoid; margin-bottom: 20px; }
    .question-text { font-weight: bold; margin-bottom: 8px; }
    .options-list { padding-left: 20px; margin: 0; }
    .sub-questions { margin-top: 8px; padding-left: 20px; }
    .section-mcqAnswers { column-count: ${config.mcqAnswerColumns || 1}; column-gap: 20px; }
    ${sectionCss(config.sections || createDefaultSectionStyles())}
    .question-rule-line { margin: 0 0 16px; }
    .section-instruction { font-size: 14px !important; font-weight: 700 !important; font-style: italic !important; }
    .question-rule-text { font-style: italic !important; }
  `,
  renderBody: ({ schoolName, className, totalMarks, logoUri, topic, date = new Date().toLocaleDateString(), sectionTitle = '', showSectionRule = true, sectionRule = '', sectionStart = '1', sectionEnd = '', sections = [], questions = [] }: PdfThemeData): string => `
    <div class="header">
      ${logoUri ? `<img src="${logoUri}" class="logo section-schoolLogo" />` : ''}
      <h1 class="section-schoolName">${schoolName || 'EXAMINATION PAPER'}</h1>
      <div class="header-details">
        <span class="section-class"><b>Class:</b> ${className || 'N/A'}</span>
        <span class="section-date"><b>Date:</b> ${date}</span>
        <span><b>Subject:</b> ${topic || 'General'} | <b>Total Marks:</b> ${totalMarks || '100'}</span>
      </div>
    </div>
    ${(sections.length ? sections : [{ id: 'legacy', title: sectionTitle, rule: sectionRule, start: sectionStart, end: sectionEnd, upperRule: false, lowerRule: showSectionRule }]).map((section) => {
      const start = Number(section.start || 1);
      const end = Number(section.end || questions.length);
      const selectedQuestions = questions.filter((question, index) => index + 1 >= start && index + 1 <= end);
      return `
        ${section.title ? `<div class="section-heading section-sectionTitle">${section.title}</div>` : ''}
        ${section.upperRule && section.title ? '<hr class="section-rule upper-rule" />' : ''}
        ${section.rule ? `<div class="question-rule-line"><span class="section-instruction">Instruction :</span> <span class="section-sectionTitle question-rule-text">${section.rule}</span></div>` : ''}
        <div class="mcq-body">
          ${selectedQuestions.filter((question) => question.type === 'MCQ').map((question) => {
            const originalIndex = questions.indexOf(question);
            return `<div class="question-block"><div class="question-text section-mcqQuestion">${originalIndex + 1}. ${question.question || ''}</div><ol type="A" class="options-list section-mcqAnswers">${(question.options || []).map((option) => `<li>${option}</li>`).join('')}</ol></div>`;
          }).join('')}
        </div>
        ${section.lowerRule && section.title ? '<hr class="section-rule lower-rule" />' : ''}
        <div class="structural-body">
          ${selectedQuestions.filter((question) => question.type === 'Structural').map((question) => {
            const originalIndex = questions.indexOf(question);
            return `<div class="question-block"><div class="question-text section-mcqQuestion">${originalIndex + 1}. ${question.question || ''}</div><div class="sub-questions section-structuralAnswers">${(question.subQuestions || []).map((subQuestion, subIndex) => `<div>(${String.fromCharCode(97 + subIndex)}) ${subQuestion}</div>`).join('')}</div></div>`;
          }).join('')}
        </div>
      `;
    }).join('')}
  `,
});

export const getTheme = (name: string): PdfTheme => {
  return themes[name] || themes.classic; // Default to classic if not found
};
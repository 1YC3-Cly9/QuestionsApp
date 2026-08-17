import { Question } from './aiService';

export interface PdfThemeData {
  schoolName: string;
  className: string;
  totalMarks: string;
  logoUri: string | null;
  topic: string;
  questions: Question[];
}

export interface PdfTheme {
  name: string;
  description: string;
  getStyles: () => string;
  renderBody: (data: PdfThemeData) => string;
  generateHtml?: (data: PdfThemeData) => string; // Will be added dynamically
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

export const getTheme = (name: string): PdfTheme => {
  return themes[name] || themes.classic; // Default to classic if not found
};
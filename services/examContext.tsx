import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { LayoutAnimation, Platform, UIManager } from 'react-native';
import { Question } from './aiService';

export interface ExamSection {
  id: string;
  title: string;
  rule: string;
  start: string;
  end: string;
  upperRule: boolean;
  lowerRule: boolean;
}
interface ExamContextType {
  schoolName: string;
  setSchoolName: (value: string) => void;
  className: string;
  setClassName: (value: string) => void;
  date: string;
  setDate: (value: string) => void;
  totalMarks: string;
  setTotalMarks: (value: string) => void;
  logoUri: string;
  setLogoUri: (value: string) => void;
  topic: string;
  setTopic: (value: string) => void;
  sectionTitle: string;
  setSectionTitle: (value: string) => void;
  showSectionRule: boolean;
  setShowSectionRule: (value: boolean) => void;
  sectionRule: string;
  setSectionRule: (value: string) => void;
  sectionStart: string;
  setSectionStart: (value: string) => void;
  sectionEnd: string;
  setSectionEnd: (value: string) => void;
  sections: ExamSection[];
  setSections: (value: ExamSection[]) => void;
  themeName: string;
  setThemeName: (value: string) => void;
  questions: Question[];
  setQuestions: (value: Question[]) => void;
  refreshVersion: number;
  moveQuestion: (id: string, direction: 'up' | 'down') => void;
  // New helper for the Scanner
  addQuestions: (newQs: Question[]) => void;
  clearAll: () => void;
}

// 2. Create the actual Context object
const ExamContext = createContext<ExamContextType | undefined>(undefined);

// 3. Create the Provider that wraps the app
export function ExamProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  const [schoolName, setSchoolName] = useState('');
  const [className, setClassName] = useState('');
  const [date, setDate] = useState('');
  const [totalMarks, setTotalMarks] = useState('');
  const [logoUri, setLogoUri] = useState('');
  const [topic, setTopic] = useState('');
  const [sectionTitle, setSectionTitle] = useState('');
  const [showSectionRule, setShowSectionRule] = useState(true);
  const [sectionRule, setSectionRule] = useState('');
  const [sectionStart, setSectionStart] = useState('1');
  const [sectionEnd, setSectionEnd] = useState('');
  const [sections, setSections] = useState<ExamSection[]>([
    { id: 'section-1', title: '', rule: '', start: '1', end: '', upperRule: false, lowerRule: true },
  ]);
  const [themeName, setThemeName] = useState('classic'); // Default theme
  const [questions, setQuestions] = useState<Question[]>([]);
  const [refreshVersion, setRefreshVersion] = useState(0);

  /**
   * Appends new questions to the existing list.
   * Crucial for multi-file scanning and math extraction.
   */
  const addQuestions = (newQs: Question[]) => {
    setQuestions((prev) => [...prev, ...newQs]);
  };

  /**
   * Moves a question up or down in the list.
   */
  const moveQuestion = (id: string, direction: 'up' | 'down') => {
    // Methodology: LayoutAnimation forces the UI thread to re-sync layout positions
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    
    setQuestions((prev) => {
      const index = prev.findIndex((q) => q.id === id);
      if (index === -1) return prev;

      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= prev.length) return prev;

      const updatedList = [...prev];
      const [movedItem] = updatedList.splice(index, 1);
      updatedList.splice(newIndex, 0, movedItem);
      return updatedList;
    });
  };

  // A handy helper to reset the app
  const clearAll = () => {
    setSchoolName('');
    setClassName('');
    setDate('');
    setTotalMarks('');
    setLogoUri('');
    setTopic('');
    setSectionTitle('');
    setShowSectionRule(true);
    setSectionRule('');
    setSectionStart('1');
    setSectionEnd('');
    setSections([{ id: 'section-1', title: '', rule: '', start: '1', end: '', upperRule: false, lowerRule: true }]);
    setThemeName('classic');
    setQuestions([]);
  };

  return (
    <ExamContext.Provider value={{
      schoolName, setSchoolName,
      className, setClassName,
      date, setDate,
      totalMarks, setTotalMarks,
      logoUri, setLogoUri,
      topic, setTopic,
      sectionTitle, setSectionTitle,
      showSectionRule, setShowSectionRule,
      sectionRule, setSectionRule,
      sectionStart, setSectionStart,
      sectionEnd, setSectionEnd,
      sections, setSections,
      themeName, setThemeName,
      questions, setQuestions,
      refreshVersion,
      moveQuestion,
      addQuestions, // Added to provider
      clearAll
    }}>
      {children}
    </ExamContext.Provider>
  );
}

// 4. Create the custom hook
export const useExam = () => {
  const context = useContext(ExamContext);
  if (context === undefined) {
    throw new Error('useExam must be used within an ExamProvider');
  }
  return context;
};
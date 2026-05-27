import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { LayoutAnimation, Platform, UIManager } from 'react-native';
import { Question } from './aiService';

// 1. Define the "shape" of our global data
interface ExamContextType {
  schoolName: string;
  setSchoolName: (value: string) => void;
  className: string;
  setClassName: (value: string) => void;
  totalMarks: string;
  setTotalMarks: (value: string) => void;
  logoUri: string;
  setLogoUri: (value: string) => void;
  topic: string;
  setTopic: (value: string) => void;
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
  const [totalMarks, setTotalMarks] = useState('');
  const [logoUri, setLogoUri] = useState('');
  const [topic, setTopic] = useState('');
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
    setTotalMarks('');
    setLogoUri('');
    setTopic('');
    setQuestions([]);
  };

  return (
    <ExamContext.Provider value={{
      schoolName, setSchoolName,
      className, setClassName,
      totalMarks, setTotalMarks,
      logoUri, setLogoUri,
      topic, setTopic,
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
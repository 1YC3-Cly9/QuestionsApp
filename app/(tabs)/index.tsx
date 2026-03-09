import React, { useState } from 'react';
import { ScrollView, Alert, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

// 1. SERVICES & CONTEXT
import { useExam } from '../../services/examContext';
import { fetchQuestionsFromAI, Question } from '../../services/aiService';

// 2. EXTERNAL STYLES
import { screenStyles as styles } from '../../styles/screenStyles';

// 3. COMPONENTS
import SchoolDetails from '../../components/schoolDetails';
import ExamForm from '../../components/examForm';
import QuestionCard_MCQs from '../../components/questionCard_MCQs';
import QuestionCard_Structural from '../../components/questionCard_Structural';

export default function QuickAiTab() {
  const { 
    schoolName, setSchoolName, 
    className, setClassName, 
    totalMarks, setTotalMarks, 
    logoUri, setLogoUri, 
    topic, setTopic, 
    questions, setQuestions 
  } = useExam();

  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(5);
  const [type, setType] = useState<'MCQ' | 'Structural'>('MCQ');
  const [difficulty, setDifficulty] = useState('Medium');

  // UPDATE LOGIC
  const handleUpdateQuestion = (updatedQ: Question) => {
    const updatedList = questions.map((q: Question) => 
      q.id === updatedQ.id ? updatedQ : q
    );
    setQuestions(updatedList);
  };

  // DELETE LOGIC
  const handleDelete = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  // AI GENERATION LOGIC
  const handleGenerate = async () => {
    setLoading(true);
    try {
      const newQs = await fetchQuestionsFromAI(topic, count, difficulty, type);
      setQuestions([...questions, ...newQs]);
    } catch (e) { 
      Alert.alert("Error", "Failed to generate."); 
    } finally { 
      setLoading(false); 
    }
  };

  // LOGO PICKER LOGIC
  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      base64: true, 
    });
  
    if (!result.canceled) {
      const base64Data = `data:image/jpeg;base64,${result.assets[0].base64}`;
      setLogoUri(base64Data); 
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      
      {/* HEADER & FORM SECTION */}
      <SchoolDetails 
        data={{ schoolName, className, totalMarks, logoUri }} 
        setters={{ setSchoolName, setClassName, setTotalMarks }} 
        onPickImage={handlePickImage}
      />
      
      <ExamForm 
        data={{ topic, count, type, difficulty }} 
        setters={{ setTopic, setCount, setType, setDifficulty }} 
        onGenerate={handleGenerate} 
        isLoading={loading} 
      />

      {/* QUESTIONS LIST SECTION */}
      <View style={styles.listSection}>
        {questions.map((q, index) => {
          if (!q || !q.id) return null;

          return q.type === 'MCQ' ? (
            <QuestionCard_MCQs 
              key={q.id} 
              item={q} 
              displayIndex={index + 1} 
              onDelete={handleDelete}
              onUpdate={handleUpdateQuestion} 
            />
          ) : (
            <QuestionCard_Structural 
              key={q.id} 
              item={q} 
              displayIndex={index + 1} 
              onDelete={handleDelete}
              onUpdate={handleUpdateQuestion} 
            />
          );
        })}
      </View>
    </ScrollView>
  );
}
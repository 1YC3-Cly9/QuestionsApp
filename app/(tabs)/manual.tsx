import React from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { useExam } from '../../services/examContext';
import { Question } from '../../services/aiService';
import ManualEntry from '../../components/manualEntry';
import QuestionCard_MCQs from '../../components/questionCard_MCQs';
import QuestionCard_Structural from '../../components/questionCard_Structural';

export default function ManualTab() {
  const { questions, setQuestions } = useExam();

  // 1. Function to delete questions
  const handleDelete = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  // FIX: Explicitly type the updated questions array
    const handleUpdateQuestion = (updatedQ: Question) => {
        const newQuestions = questions.map((q: Question) => 
        q.id === updatedQ.id ? updatedQ : q
        );
        setQuestions(newQuestions);
    };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>Manual Entry</Text>
      
      {/* Component to add new questions */}
      <ManualEntry onAddQuestion={(newQ) => setQuestions([...questions, newQ])} />

      <View style={styles.listContainer}>
        {questions.map((q, index) => {
          if (!q || !q.id) return null;

          // 3. FIX: Pass onUpdate prop to the card components
          if (q.type === 'MCQ') {
            return (
              <QuestionCard_MCQs 
                key={q.id} 
                item={q} 
                displayIndex={index + 1} 
                onDelete={handleDelete}
                onUpdate={handleUpdateQuestion} 
              />
            );
          } else {
            return (
              <QuestionCard_Structural 
                key={q.id} 
                item={q} 
                displayIndex={index + 1} 
                onDelete={handleDelete}
                onUpdate={handleUpdateQuestion} 
              />
            );
          }
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f4f7f6' 
  },
  scrollContent: { 
    padding: 15 
  },
  title: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginBottom: 20,
    color: '#2c3e50'
  },
  listContainer: {
    marginTop: 20,
    paddingBottom: 40
  }
});
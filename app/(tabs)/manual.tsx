import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import ManualEntry from '../../components/manualEntry';
import QuestionCard_MCQs from '../../components/questionCard_MCQs';
import QuestionCard_Structural from '../../components/questionCard_Structural';
import { Question } from '../../services/aiService';
import { useExam } from '../../services/examContext';

export default function ManualTab() {
  const { questions, setQuestions, moveQuestion, refreshVersion } = useExam();

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
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      keyboardVerticalOffset={Platform.OS === "ios" ? 130 : 80} 
    >
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
      >
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
                  key={`${q.id}-${refreshVersion}`} 
                  item={q} 
                  displayIndex={index} 
                  totalQuestions={questions.length}
                  onMoveUp={(id) => moveQuestion(id, 'up')}
                  onMoveDown={(id) => moveQuestion(id, 'down')}
                  onDelete={handleDelete}
                  onUpdate={handleUpdateQuestion} 
                />
              );
            } else {
              return (
                <QuestionCard_Structural 
                  key={`${q.id}-${refreshVersion}`} 
                  item={q} 
                  displayIndex={index} 
                  totalQuestions={questions.length}
                  onMoveUp={(id) => moveQuestion(id, 'up')}
                  onMoveDown={(id) => moveQuestion(id, 'down')}
                  onDelete={handleDelete}
                  onUpdate={handleUpdateQuestion} 
                />
              );
            }
          })}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
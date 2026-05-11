import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

// 1. TYPES & STYLES
import { Question } from '../services/aiService';
import { componentStyles as styles } from '../styles/componentStyles';

export default function ManualEntry({ onAddQuestion }: { onAddQuestion: (q: Question) => void }) {
  const [type, setType] = useState<'MCQ' | 'Structural'>('MCQ');
  const [question, setQuestion] = useState('');
  const [opts, setOpts] = useState(['', '', '', '']); 
  const [subs, setSubs] = useState(['']); 

  const addSub = () => setSubs([...subs, '']);
  const removeSub = (index: number) => {
    if (subs.length > 1) setSubs(subs.filter((_, i) => i !== index));
    else setSubs(['']);
  };

  const handleAdd = () => {
    if (!question.trim()) return;
    const newQ: Question = {
      id: Math.random().toString(36).substring(2, 11) + Date.now().toString(),
      type: type,
      question: question.trim(),
      ...(type === 'MCQ' 
        ? { options: opts.filter(o => o.trim() !== '') } 
        : { subQuestions: subs.filter(s => s.trim() !== '') }
      )
    };
    onAddQuestion(newQ);
    setQuestion('');
    setOpts(['', '', '', '']);
    setSubs(['']);
  };

  return (
    <View style={styles.card}>
      {/* Question Type Switcher */}
      <View style={styles.row}>
        <TouchableOpacity 
          style={[styles.typeBtn, type === 'MCQ' && styles.activeBtn, { borderTopLeftRadius: 12, borderBottomLeftRadius: 12 }]} 
          onPress={() => setType('MCQ')}
        >
          <Text style={type === 'MCQ' ? styles.activeText : styles.btnText}>MCQ</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.typeBtn, type === 'Structural' && styles.activeBtn, { borderTopRightRadius: 12, borderBottomRightRadius: 12 }]} 
          onPress={() => setType('Structural')}
        >
          <Text style={type === 'Structural' ? styles.activeText : styles.btnText}>Structural</Text>
        </TouchableOpacity>
      </View>

      {/* Main Question Input */}
      <TextInput 
        style={styles.input} 
        placeholder="Enter main question..." 
        value={question} 
        onChangeText={setQuestion} 
        multiline
      />

      {/* Conditional Inputs based on Type */}
      {type === 'MCQ' ? (
        opts.map((opt, i) => (
          <TextInput 
            key={i} 
            style={styles.subInput} 
            placeholder={`Option ${String.fromCharCode(65+i)}`} 
            value={opt} 
            onChangeText={(t) => {
              const newOpts = [...opts];
              newOpts[i] = t;
              setOpts(newOpts);
            }} 
          />
        ))
      ) : (
        <View style={{ marginTop: 10 }}>
          {subs.map((sub, i) => (
            <View key={i} style={styles.dynamicRow}>
              <Text style={styles.romanLabel}>{['i','ii','iii','iv','v','vi'][i] || i+1}.</Text>
              <TextInput 
                style={[styles.subInput, { flex: 1, marginLeft: 5 }]} 
                placeholder="Sub-question text..." 
                value={sub} 
                onChangeText={(t) => {
                  const newSubs = [...subs];
                  newSubs[i] = t;
                  setSubs(newSubs);
                }} 
              />
              <TouchableOpacity onPress={() => removeSub(i)}>
                <Ionicons name="remove-circle" size={24} color="#e74c3c" />
              </TouchableOpacity>
            </View>
          ))}
          
          <TouchableOpacity style={styles.addBtn} onPress={addSub}>
            <Ionicons name="add-circle" size={20} color="#27ae60" />
            <Text style={styles.addBtnText}>Add Sub-question</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Final Add Button */}
      <TouchableOpacity style={styles.submitBtn} onPress={handleAdd}>
        <Text style={styles.submitBtnText}>Add to Paper</Text>
      </TouchableOpacity>
    </View>
  );
}
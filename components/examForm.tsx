import React from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';

interface ExamFormProps {
  data: {
    topic: string;
    count: number;
    type: 'MCQ' | 'Structural';
    difficulty: string;
  };
  setters: {
    setTopic: (t: string) => void;
    setCount: (n: number) => void;
    setType: (t: 'MCQ' | 'Structural') => void;
    setDifficulty: (d: string) => void;
  };
  onGenerate: () => void;
  isLoading: boolean;
}

export default function examForm({ data, setters, onGenerate, isLoading }: ExamFormProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Generation Mode</Text>
      <View style={styles.toggleRow}>
        <TouchableOpacity 
          style={[styles.typeBtn, data.type === 'MCQ' && styles.activeBtn]} 
          onPress={() => setters.setType('MCQ')}
        >
          <Text style={data.type === 'MCQ' ? styles.activeText : styles.btnText}>Auto MCQs</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.typeBtn, data.type === 'Structural' && styles.activeBtn]} 
          onPress={() => setters.setType('Structural')}
        >
          <Text style={data.type === 'Structural' ? styles.activeText : styles.btnText}>Auto Structural</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Topic</Text>
      <TextInput 
        style={styles.input} 
        placeholder="e.g. Photosynthesis" 
        value={data.topic} 
        onChangeText={setters.setTopic} 
      />

      <View style={styles.row}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <Text style={styles.label}>Quantity</Text>
          <TextInput 
            style={styles.input} 
            keyboardType="numeric" 
            value={data.count.toString()} 
            onChangeText={(txt) => setters.setCount(parseInt(txt) || 0)} 
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Difficulty</Text>
          <TouchableOpacity 
            style={styles.input} 
            onPress={() => setters.setDifficulty(data.difficulty === 'Easy' ? 'Hard' : 'Easy')}
          >
            <Text>{data.difficulty}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 10 }} />
      ) : (
        <TouchableOpacity style={styles.genBtn} onPress={onGenerate}>
          <Text style={styles.genBtnText}>Generate {data.count} {data.type}s</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 20 },
  label: { fontSize: 12, fontWeight: 'bold', color: '#666', marginBottom: 5 },
  toggleRow: { flexDirection: 'row', backgroundColor: '#f0f0f0', borderRadius: 8, padding: 4, marginBottom: 15 },
  typeBtn: { flex: 1, padding: 10, alignItems: 'center', borderRadius: 6 },
  activeBtn: { backgroundColor: '#007bff' },
  btnText: { color: '#666', fontWeight: '600' },
  activeText: { color: '#fff', fontWeight: 'bold' },
  input: { backgroundColor: '#f9f9f9', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#eee', marginBottom: 10 },
  row: { flexDirection: 'row' },
  genBtn: { backgroundColor: '#007bff', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  genBtnText: { color: '#fff', fontWeight: 'bold' }
});
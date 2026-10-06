import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { examFormStyles as styles } from '../styles/appStyles';

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
        <View style={{ flex: 1.5 }}>
          <Text style={styles.label}>Difficulty</Text>
          <View style={styles.difficultyRow}>
            {(['Easy', 'Medium', 'Hard'] as const).map((level) => (
              <TouchableOpacity
                key={level}
                style={[styles.difficultyBtn, data.difficulty === level && styles.difficultyBtnActive]}
                onPress={() => setters.setDifficulty(level)}
              >
                <Text style={data.difficulty === level ? styles.activeText : styles.btnText}>{level}</Text>
              </TouchableOpacity>
            ))}
          </View>
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


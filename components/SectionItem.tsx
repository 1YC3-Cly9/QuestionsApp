import { Ionicons } from '@expo/vector-icons';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ExamSection } from '../services/examContext';
import { sectionItemStyles as styles } from '../styles/sectionStyles';

interface SectionItemProps {
  section: ExamSection;
  index: number;
  canRemove: boolean;
  onChange: (update: Partial<ExamSection>) => void;
  onRemove: () => void;
}

export default function SectionItem({ section, index, canRemove, onChange, onRemove }: SectionItemProps) {
  return (
    <View style={styles.sectionBlock}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionNumber}>Section {index + 1}</Text>
        <TouchableOpacity
          onPress={onRemove}
          disabled={!canRemove}
          accessibilityLabel={`Remove section ${index + 1}`}
        >
          <Ionicons name="remove-circle" size={26} color={canRemove ? '#e74c3c' : '#dfe6e9'} />
        </TouchableOpacity>
      </View>
      <TextInput style={styles.input} placeholder="Section title" value={section.title} onChangeText={(value) => onChange({ title: value })} />
      <TextInput style={styles.input} placeholder="Section rule" value={section.rule} onChangeText={(value) => onChange({ rule: value })} />
      <View style={styles.rangeRow}>
        <TextInput style={[styles.input, styles.rangeInput]} placeholder="From" value={section.start} onChangeText={(value) => onChange({ start: value })} keyboardType="numeric" />
        <TextInput style={[styles.input, styles.rangeInput]} placeholder="To" value={section.end} onChangeText={(value) => onChange({ end: value })} keyboardType="numeric" />
      </View>
      <View style={styles.ruleRow}>
        <Text style={styles.ruleText}>Rules</Text>
        <TouchableOpacity style={[styles.ruleButton, section.upperRule && styles.ruleButtonActive]} onPress={() => onChange({ upperRule: !section.upperRule })} accessibilityLabel={`Toggle upper rule for section ${index + 1}`}>
          <Text style={[styles.ruleButtonText, section.upperRule && styles.ruleButtonTextActive]}>-</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.ruleButton, section.lowerRule && styles.ruleButtonActive]} onPress={() => onChange({ lowerRule: !section.lowerRule })} accessibilityLabel={`Toggle lower rule for section ${index + 1}`}>
          <Text style={[styles.ruleButtonText, section.lowerRule && styles.ruleButtonTextActive]}>_</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


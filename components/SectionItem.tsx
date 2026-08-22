import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ExamSection } from '../services/examContext';

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

const styles = StyleSheet.create({
  sectionBlock: { borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 10, marginTop: 4 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionNumber: { color: '#636e72', fontWeight: '600', marginBottom: 8 },
  input: { backgroundColor: '#f9f9f9', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#eee', marginBottom: 10 },
  rangeRow: { flexDirection: 'row', gap: 10 },
  rangeInput: { flex: 1 },
  ruleRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4 },
  ruleButton: { width: 36, height: 32, borderWidth: 1, borderColor: '#b2bec3', borderRadius: 6, marginLeft: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f2f6' },
  ruleButtonActive: { backgroundColor: '#007bff', borderColor: '#007bff' },
  ruleButtonText: { color: '#636e72', fontSize: 20, lineHeight: 20 },
  ruleButtonTextActive: { color: '#fff' },
  ruleText: { color: '#636e72', flex: 1 },
});

import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ExamSection } from '../services/examContext';
import SectionItem from './SectionItem';

interface SectionManagerProps {
  sections: ExamSection[];
  setSections: (sections: ExamSection[]) => void;
  questionCount: number;
}

export default function SectionManager({ sections, setSections, questionCount }: SectionManagerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const normalizeSections = (nextSections: ExamSection[]) => {
    let previousEnd = 0;
    const normalized = nextSections.map((section) => {
      const start = Math.max(previousEnd + 1, 1);
      const requestedEnd = Number(section.end);
      const end = Number.isFinite(requestedEnd) && requestedEnd > 0
        ? Math.min(Math.max(requestedEnd, start), questionCount || requestedEnd)
        : '';
      if (end !== '') previousEnd = end;
      return { ...section, start: String(start), end: end === '' ? '' : String(end) };
    });
    setSections(normalized);
  };

  const updateSection = (id: string, update: Partial<ExamSection>) => {
    normalizeSections(sections.map((section) => section.id === id ? { ...section, ...update } : section));
  };

  const addSection = () => {
    const lastEnd = Number(sections[sections.length - 1]?.end || 0);
    if (sections.length >= 5 || (questionCount > 0 && (!lastEnd || lastEnd >= questionCount))) return;
    const previousEnd = Number(sections[sections.length - 1]?.end || 0);
    const nextStart = Math.min(previousEnd + 1, questionCount || previousEnd + 1);
    setSections([...sections, { id: `section-${Date.now()}`, title: '', rule: '', start: String(nextStart), end: '', upperRule: true, lowerRule: true }]);
  };

  const removeSection = (id: string) => {
    if (sections.length <= 1) return;
    normalizeSections(sections.filter((section) => section.id !== id));
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.menuButton} onPress={() => setIsOpen(!isOpen)} accessibilityLabel="Manage sections">
        <View style={styles.headingRow}>
          <View>
            <Text style={styles.sectionLabel}>Sections</Text>
            <Text style={styles.summaryText}>{sections.length} section{sections.length === 1 ? '' : 's'} set</Text>
          </View>
          <Ionicons name={isOpen ? 'chevron-up' : 'chevron-down'} size={22} color="#2c3e50" />
        </View>
      </TouchableOpacity>
      {isOpen && (
        <View>
          <View style={styles.addRow}>
            <Text style={styles.manageText}>Manage paper sections</Text>
            <TouchableOpacity onPress={addSection} disabled={sections.length >= 5 || (questionCount > 0 && (!Number(sections[sections.length - 1]?.end || 0) || Number(sections[sections.length - 1]?.end || 0) >= questionCount))} accessibilityLabel="Add section">
              <Ionicons name="add-circle" size={28} color={sections.length >= 5 || (questionCount > 0 && (!Number(sections[sections.length - 1]?.end || 0) || Number(sections[sections.length - 1]?.end || 0) >= questionCount)) ? '#b2bec3' : '#2ecc71'} />
            </TouchableOpacity>
          </View>
          {sections.map((section, index) => (
            <SectionItem
              key={section.id}
              section={section}
              index={index}
              canRemove={sections.length > 1}
              onChange={(update) => updateSection(section.id, update)}
              onRemove={() => removeSection(section.id)}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 20, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 },
  menuButton: { paddingVertical: 2 },
  sectionLabel: { fontSize: 14, fontWeight: 'bold', color: '#007bff' },
  headingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryText: { color: '#636e72', fontSize: 12, marginTop: 3 },
  addRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 12, marginTop: 12 },
  manageText: { color: '#636e72', fontSize: 13 },
});

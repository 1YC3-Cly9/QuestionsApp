import { StyleSheet } from 'react-native';

export const sectionManagerStyles = StyleSheet.create({
  container: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 20, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 },
  menuButton: { paddingVertical: 2 },
  sectionLabel: { fontSize: 14, fontWeight: 'bold', color: '#007bff' },
  headingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryText: { color: '#636e72', fontSize: 12, marginTop: 3 },
  addRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 12, marginTop: 12 },
  manageText: { color: '#636e72', fontSize: 13 },
});

export const sectionItemStyles = StyleSheet.create({
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

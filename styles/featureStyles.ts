import { StyleSheet } from 'react-native';
import { RADIUS } from './theme';

export const scannerStyles = StyleSheet.create({
  sectionHeaderLabel: { fontSize: 13, fontWeight: 'bold', color: '#2c3e50', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8, marginTop: 10, marginLeft: 4 },
  notesUploadBtn: { backgroundColor: '#6c5ce7', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: RADIUS.md, marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 2 },
  badge: { fontSize: 11, fontWeight: 'bold' },
  badgeQuestion: { color: '#007bff' },
  badgeNotes: { color: '#6c5ce7' },
  settingsLabel: { fontSize: 12, fontWeight: 'bold', color: '#666', marginBottom: 6 },
  difficultyRow: { flexDirection: 'row', backgroundColor: '#f0f0f0', borderRadius: 8, padding: 3, marginBottom: 12 },
  difficultyBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 6 },
  difficultyBtnActive: { backgroundColor: '#6c5ce7' },
  difficultyTextActive: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  difficultyTextInactive: { color: '#666', fontWeight: '600', fontSize: 13 },
  quantityRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  quantityInput: { backgroundColor: '#f9f9f9', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#eee', width: 60, textAlign: 'center', fontSize: 16, fontWeight: 'bold', color: '#2c3e50' },
  notesDivider: { height: 1, backgroundColor: '#eee', marginBottom: 14, marginTop: 2 },
});

export const schoolDetailsStyles = StyleSheet.create({
  container: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 20, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 },
  sectionLabel: { fontSize: 14, fontWeight: 'bold', color: '#007bff', marginBottom: 10 },
  input: { backgroundColor: '#f9f9f9', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#eee', marginBottom: 10 },
  dateInput: { justifyContent: 'center' },
  dateText: { color: '#222' },
  placeholderText: { color: '#999' },
  row: { flexDirection: 'row' },
  logoBtn: { backgroundColor: '#f0f0f0', padding: 10, borderRadius: 8, alignItems: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: '#ccc' },
  logoBtnText: { color: '#666', fontSize: 13 },
  preview: { width: 50, height: 50, alignSelf: 'center', marginTop: 10, borderRadius: 5 },
});

export const imageRendererStyles = StyleSheet.create({
  imageContainer: { alignItems: 'center', marginVertical: 10 },
  questionImage: { width: '100%', height: 200, borderRadius: 8, backgroundColor: '#fff', borderWidth: 1, borderColor: '#eee' },
});

export const undoButtonStyles = StyleSheet.create({
  button: { alignItems: 'center' },
});

import { StyleSheet } from 'react-native';

const sharedQuestionCardStyles = {
  header: { flexDirection: 'row' as const, justifyContent: 'space-between' as const, alignItems: 'center' as const, marginBottom: 10 },
  actionButtons: { flexDirection: 'row' as const, alignItems: 'center' as const },
  qType: { fontSize: 10, fontWeight: 'bold' as const, textTransform: 'uppercase' as const },
  label: { fontSize: 10, color: '#999', marginBottom: 5, marginTop: 10, fontWeight: 'bold' as const },
  input: { borderBottomWidth: 1, paddingVertical: 5, fontSize: 16, color: '#2c3e50' },
  optInput: { flex: 1, borderBottomWidth: 1, borderBottomColor: '#eee', paddingVertical: 3, fontSize: 14, marginBottom: 8 },
  mathWrapper: { flex: 1, minHeight: 24, alignSelf: 'stretch' as const },
  editForm: { paddingBottom: 10 },
  moveButton: { marginRight: 10, padding: 2 },
  moveButtonDisabled: { opacity: 0.5 },
  undoButtonWrapper: { marginRight: 10 },
  editSaveButton: { marginRight: 10 },
  dynamicRow: { flexDirection: 'row' as const, alignItems: 'center' as const, marginBottom: 8 },
  addBtn: { flexDirection: 'row' as const, alignItems: 'center' as const, marginTop: 10, alignSelf: 'flex-start' as const },
  addBtnText: { color: '#27ae60', fontWeight: 'bold' as const, marginLeft: 5 },
  viewContainer: { paddingVertical: 5, flexDirection: 'column' as const },
  subRow: { flexDirection: 'row' as const, alignItems: 'flex-start' as const, marginBottom: 8 },
  subRoman: { marginRight: 5, fontSize: 14, color: '#555' },
};

export const mcqQuestionCardStyles = StyleSheet.create({
  ...sharedQuestionCardStyles,
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 15, borderLeftWidth: 5, borderLeftColor: '#007bff', elevation: 2 },
  qType: { ...sharedQuestionCardStyles.qType, color: '#007bff' },
  input: { ...sharedQuestionCardStyles.input, borderBottomColor: '#3498db' },
  optionEditRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  optionLabel: { fontWeight: 'bold', marginRight: 10, color: '#3498db' },
  optionsList: { marginTop: 5 },
  optionRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  boldLabel: { fontWeight: 'bold', color: '#333' },
  questionText: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 12 },
  displayImage: { width: '100%', height: 200, marginVertical: 10, borderRadius: 8 },
  imageEditWrapper: { marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 10 },
  previewImage: { width: '100%', height: 120, borderRadius: 4 },
  imageControls: { marginTop: 5 },
  scaleRow: { flexDirection: 'row', alignItems: 'center' },
  scaleBtn: { padding: 5, borderWidth: 1, borderColor: '#ccc', borderRadius: 4, marginRight: 5 },
  scaleBtnActive: { backgroundColor: '#007bff', borderColor: '#007bff' },
  scaleBtnText: { fontSize: 10 },
  cropBtn: { flexDirection: 'row', alignItems: 'center', marginLeft: 10 },
  cropBtnText: { fontSize: 10, color: '#007bff', marginLeft: 3 },
});

export const structuralQuestionCardStyles = StyleSheet.create({
  ...sharedQuestionCardStyles,
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 15, borderLeftWidth: 5, borderLeftColor: '#f39c12', elevation: 2 },
  qType: { ...sharedQuestionCardStyles.qType, color: '#e67e22' },
  input: { ...sharedQuestionCardStyles.input, borderBottomColor: '#f39c12', marginBottom: 10 },
  dynamicRow: { ...sharedQuestionCardStyles.dynamicRow },
  subRoman: { ...sharedQuestionCardStyles.subRoman },
});

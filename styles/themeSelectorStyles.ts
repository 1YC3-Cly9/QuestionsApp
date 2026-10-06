import { StyleSheet } from 'react-native';

export const themeSelectorStyles = StyleSheet.create({
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContainer: { backgroundColor: '#f8f9fa', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, height: '60%' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 15, marginBottom: 15 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#2c3e50' },
  themeList: { flex: 1 },
  themeCard: { backgroundColor: '#fff', padding: 20, borderRadius: 12, marginBottom: 15, borderWidth: 2, borderColor: '#eee' },
  activeCard: { borderColor: '#6c5ce7', shadowColor: '#6c5ce7', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 5 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  themeName: { fontSize: 18, fontWeight: 'bold', color: '#2c3e50' },
  themeDescription: { fontSize: 14, color: '#555' },
});

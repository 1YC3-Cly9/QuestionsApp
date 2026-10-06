import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

export const rootStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f7f6' },
});

export const manualScreenStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f7f6' },
  scrollContent: { padding: 15 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#2c3e50' },
  listContainer: { marginTop: 20, paddingBottom: 40 },
});

export const tabLayoutInlineStyles = StyleSheet.create({
  rootSafeArea: { flex: 1, backgroundColor: '#fff' },
  headerBrandRow: { flexDirection: 'row', alignItems: 'center' },
  previewSafeArea: { flex: 1 },
  tabScreen: { flex: 1 },
});

export const examFormStyles = StyleSheet.create({
  container: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 20 },
  label: { fontSize: 12, fontWeight: 'bold', color: '#666', marginBottom: 5 },
  toggleRow: { flexDirection: 'row', backgroundColor: '#f0f0f0', borderRadius: 8, padding: 4, marginBottom: 15 },
  typeBtn: { flex: 1, padding: 10, alignItems: 'center', borderRadius: 6 },
  activeBtn: { backgroundColor: '#007bff' },
  btnText: { color: '#666', fontWeight: '600' },
  activeText: { color: '#fff', fontWeight: 'bold' },
  input: { backgroundColor: '#f9f9f9', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#eee', marginBottom: 10 },
  row: { flexDirection: 'row' },
  difficultyRow: { flexDirection: 'row', backgroundColor: '#f0f0f0', borderRadius: 8, padding: 3, marginBottom: 10 },
  difficultyBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 6 },
  difficultyBtnActive: { backgroundColor: '#007bff' },
  genBtn: { backgroundColor: '#007bff', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  genBtnText: { color: '#fff', fontWeight: 'bold' },
});

export const actionButtonStyles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'flex-end' },
  btn: { padding: 10, borderRadius: 12, elevation: 2 },
  exportBtn: { marginLeft: 10 },
});

export const sideDrawerStyles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 99 },
  drawer: { position: 'absolute', left: 0, top: 0, bottom: 0, width: width * 0.75, backgroundColor: '#fff', zIndex: 100, padding: 25, paddingTop: 60, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10, elevation: 10 },
  profileSection: { alignItems: 'center', marginBottom: 30, borderBottomWidth: 1, borderColor: '#f0f0f0', paddingBottom: 25 },
  avatarCircle: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#e8f4fd', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  userName: { fontSize: 18, fontWeight: 'bold', color: '#2c3e50' },
  userRole: { fontSize: 13, color: '#95a5a6' },
  menu: { flex: 1 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15 },
  menuText: { fontSize: 16, marginLeft: 15, color: '#2c3e50', fontWeight: '500' },
  logoutItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, marginTop: 'auto', borderTopWidth: 1, borderColor: '#eee' },
  logoutText: { fontSize: 16, marginLeft: 15, color: '#e74c3c', fontWeight: 'bold' },
  version: { textAlign: 'center', color: '#bdc3c7', fontSize: 10, marginTop: 10 },
});

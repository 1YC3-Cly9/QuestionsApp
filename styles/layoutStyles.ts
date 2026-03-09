import { StyleSheet, Dimensions } from 'react-native';
import { COLORS, RADIUS, SPACING } from './theme';

const { width } = Dimensions.get('window');

export const layoutStyles = StyleSheet.create({
  // The Static Top Bar
  staticBar: {
    height: 100,
    backgroundColor: COLORS.background,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    elevation: 4,
    zIndex: 10,
  },
  barLeft: { justifyContent: 'flex-end' },
  barRight: { flexDirection: 'row', alignItems: 'flex-end' },
  appName: { fontSize: 20, fontWeight: 'bold', color: COLORS.textMain },
  stats: { fontSize: 11, color: COLORS.textMuted, marginLeft: 34, fontWeight: '500' },
  menuTrigger: { padding: 4 },
  
  // The Animated Drawer
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: width * 0.75,
    backgroundColor: COLORS.background,
    zIndex: 100,
    padding: 25,
    paddingTop: 60,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 99,
  },
  
  // Drawer Content Styles
  profileSection: { alignItems: 'center', marginBottom: 30, borderBottomWidth: 1, borderColor: '#f0f0f0', paddingBottom: 25 },
  avatarCircle: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#e8f4fd', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  userName: { fontSize: 18, fontWeight: 'bold', color: COLORS.textMain },
  userRole: { fontSize: 13, color: COLORS.textMuted },
  drawerMenu: { flex: 1 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15 },
  menuText: { fontSize: 16, marginLeft: 15, color: COLORS.textMain, fontWeight: '500' },
  logoutItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, marginTop: 'auto', borderTopWidth: 1, borderColor: COLORS.border },
  logoutText: { fontSize: 16, marginLeft: 15, color: COLORS.danger, fontWeight: 'bold' },
  versionText: { textAlign: 'center', color: '#bdc3c7', fontSize: 10, marginTop: 10 },

  // Preview Modal Styles
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderColor: COLORS.border },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.textMain }
});
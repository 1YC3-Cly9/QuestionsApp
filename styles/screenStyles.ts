import { StyleSheet } from 'react-native';
import { COLORS, RADIUS, SPACING } from './theme';

export const screenStyles = StyleSheet.create({
  // Main background container
  container: { 
    flex: 1, 
    backgroundColor: '#f4f7f6' 
  }, 
  // Content padding for ScrollViews
  scrollContent: { 
    padding: SPACING.md 
  }, 
  // Screen Headers
  screenTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.textMain,
    marginBottom: SPACING.xs,
  },
  screenSub: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginBottom: SPACING.lg,
  },

  // Button Text Style
  generateBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },

  // Unified Upload Button (Primary Blue)
  uploadBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: RADIUS.md,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  // Selection Lists (PDFs and Images)
  fileList: {
    marginTop: SPACING.md,
    backgroundColor: '#fff',
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionLabel: { 
    fontWeight: 'bold', 
    marginBottom: 8, 
    color: COLORS.textMain, 
    fontSize: 14 
  },
  fileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  fileName: {
    fontSize: 14,
    color: COLORS.textMain,
    flex: 1,
    marginRight: 10,
  },

  // Image Preview Grid
  imageGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 10 
  },
  imageWrapper: { 
    width: 75, 
    height: 75, 
    position: 'relative' 
  },
  thumbnail: { 
    width: '100%', 
    height: '100%', 
    borderRadius: 10, 
    backgroundColor: '#eee' 
  },
  removeBadge: { 
    position: 'absolute', 
    top: -8, 
    right: -8, 
    backgroundColor: '#fff', 
    borderRadius: 12, 
    elevation: 3 
  },

  // Action/Generate Buttons (Secondary Green)
  btn: { 
    backgroundColor: COLORS.secondary, 
    padding: 15, 
    borderRadius: 10, 
    marginTop: 20, 
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  }, 
  btnText: { 
    color: '#fff', 
    fontWeight: 'bold',
    marginLeft: 8
  },

  // Specifically for the "Process All" button
  processBtn: { 
    backgroundColor: COLORS.secondary, 
    padding: 18, 
    borderRadius: RADIUS.md, 
    marginTop: 25, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center',
    elevation: 4
  },

  listSection: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 10,
    backgroundColor: '#f8f9fa', // Light grey background to make cards pop
  },
});
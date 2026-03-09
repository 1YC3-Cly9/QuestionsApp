import { StyleSheet } from 'react-native';
import { COLORS, RADIUS, SPACING } from './theme';

export const componentStyles = StyleSheet.create({
  // Main Container for forms/cards
  card: {
    backgroundColor: COLORS.background,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  
  // Selection Row (MCQ vs Structural)
  row: { 
    flexDirection: 'row', 
    marginBottom: SPACING.md 
  },
  typeBtn: { 
    flex: 1, 
    padding: 12, 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#ddd',
    backgroundColor: '#f8f9fa'
  },
  activeBtn: { 
    backgroundColor: COLORS.primary, 
    borderColor: COLORS.primary 
  },
  btnText: { 
    color: COLORS.textMuted, 
    fontWeight: '500' 
  },
  activeText: { 
    color: '#fff', 
    fontWeight: 'bold' 
  },
  
  // Input Fields
  input: { 
    borderBottomWidth: 1, 
    borderColor: COLORS.border, 
    padding: 10, 
    fontSize: 16, 
    marginBottom: 10, 
    color: COLORS.textMain 
  },
  subInput: { 
    borderBottomWidth: 1, 
    borderColor: '#f0f0f0', 
    padding: 8, 
    fontSize: 14, 
    marginBottom: 5,
    color: COLORS.textMain
  },
  
  // Structural/Dynamic Question Rows
  dynamicRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 8 
  },
  romanLabel: { 
    width: 30, 
    fontWeight: 'bold', 
    color: COLORS.textMuted 
  },
  
  // Action Buttons inside Tabs
  addBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 10, 
    padding: 5 
  },
  addBtnText: { 
    color: COLORS.secondary, 
    marginLeft: 5, 
    fontWeight: 'bold' 
  },
  submitBtn: { 
    backgroundColor: COLORS.secondary, 
    padding: 15, 
    borderRadius: 10, 
    marginTop: 20, 
    alignItems: 'center' 
  },
  submitBtnText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 16 
  },

  // Header specific action buttons (Mirroring layout logic for consistency)
  actionBtn: { 
    padding: 10, 
    borderRadius: RADIUS.md, 
    elevation: 2 
  },
});
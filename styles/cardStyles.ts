import { StyleSheet } from 'react-native';

export const cardStyles = StyleSheet.create({
  card: { 
    backgroundColor: '#fff', 
    padding: 16, 
    borderRadius: 12, 
    marginBottom: 16, 
    borderLeftWidth: 5, 
    borderLeftColor: '#f39c12',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignSelf: 'stretch',
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 12 
  },
  qType: { 
    fontSize: 11, 
    fontWeight: 'bold', 
    color: '#f39c12', 
    textTransform: 'uppercase' 
  },
  label: { 
    fontSize: 10, 
    color: '#aaa', 
    marginBottom: 4, 
    marginTop: 10, 
    fontWeight: 'bold' 
  },
  viewContainer: {
    width: '100%',
  },
  mainQuestionText: {
    fontSize: 16,
    color: '#2c3e50',
    lineHeight: 22,
    fontWeight: '600',
    marginBottom: 10
  },
  subListContainer: {
    marginTop: 5,
  },
  subRow: { 
    flexDirection: 'row', 
    marginBottom: 8, 
    width: '100%',
    alignItems: 'flex-start' 
  },
  subRoman: { 
    fontWeight: 'bold', 
    color: '#34495e', 
    width: 35, 
    fontSize: 14 
  },
  textWrapper: { 
    flex: 1, // Forces the text to wrap instead of pushing the UI
  },
  subQuestionText: {
    fontSize: 15,
    color: '#34495e',
    lineHeight: 20
  },
  input: { 
    borderBottomWidth: 1, 
    borderBottomColor: '#eee', 
    marginBottom: 15, 
    fontSize: 16, 
    paddingVertical: 5, 
    color: '#2c3e50' 
  },
  editRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 10 
  },
  romanLabel: { 
    width: 25, 
    fontWeight: 'bold', 
    color: '#f39c12' 
  },
  optInput: { 
    flex: 1, 
    borderBottomWidth: 1, 
    borderBottomColor: '#eee', 
    marginRight: 10, 
    paddingVertical: 4 
  },
  addBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 10 
  },
  addText: { 
    color: '#27ae60', 
    marginLeft: 8, 
    fontWeight: 'bold' 
  }
});
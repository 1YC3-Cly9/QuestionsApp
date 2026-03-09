import { StyleSheet } from 'react-native';

export const cardStyles = StyleSheet.create({
  card: { 
    backgroundColor: '#fff', 
    padding: 15, 
    borderRadius: 12, 
    marginBottom: 15, 
    borderLeftWidth: 5, 
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 10 
  },
  qType: { 
    fontSize: 10, 
    fontWeight: 'bold', 
    color: '#f39c12', 
    textTransform: 'uppercase' 
  },
  label: { 
    fontSize: 9, 
    color: '#aaa', 
    marginBottom: 5, 
    fontWeight: 'bold',
    marginTop: 10
  },
  
  // View Mode
  mathWrapper: { 
    marginBottom: 10,
    minHeight: 40 
  },
  subContainer: { 
    marginTop: 5, 
    paddingLeft: 5 
  },
  subRow: { 
    flexDirection: 'row', 
    marginBottom: 12, 
    alignItems: 'flex-start' 
  },
  subRoman: { 
    fontWeight: 'bold', 
    color: '#34495e', 
    marginRight: 10, 
    width: 30, 
    fontSize: 14,
    textAlign: 'right'
  },
  subMathWrapper: { 
    flex: 1,
    minHeight: 35
  },

  // Edit Mode
  input: { 
    borderBottomWidth: 1, 
    borderBottomColor: '#ddd', 
    marginBottom: 15, 
    fontSize: 16, 
    padding: 5, 
    color: '#2c3e50' 
  },
  editRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 10 
  },
  romanLabel: { 
    width: 30, 
    fontWeight: 'bold', 
    color: '#f39c12' 
  },
  optInput: { 
    flex: 1, 
    borderBottomWidth: 1, 
    borderBottomColor: '#eee', 
    marginRight: 10, 
    padding: 5 
  },
  addBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 15,
    padding: 5
  },
  addText: { 
    color: '#27ae60', 
    marginLeft: 8, 
    fontWeight: 'bold', 
    fontSize: 13 
  }
});
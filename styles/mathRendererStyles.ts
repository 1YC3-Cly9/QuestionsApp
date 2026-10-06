import { StyleSheet } from 'react-native';

export const mathRendererStyles = StyleSheet.create({
  container: { marginVertical: 8 },
  label: { fontSize: 12, fontWeight: 'bold', color: '#666', marginBottom: 6 },
  verticalScroll: { maxHeight: 250 },
  tableContent: { paddingBottom: 10 },
  row: { flexDirection: 'row' },
  cell: { width: 120, minHeight: 44, borderWidth: 1, borderColor: '#bbb', padding: 8, backgroundColor: '#fff' },
  noLeftBorder: { borderLeftWidth: 0 },
  noTopBorder: { borderTopWidth: 0 },
  slider: { height: 8, marginTop: 4, borderRadius: 4, backgroundColor: '#3498db' },
  content: { backgroundColor: 'transparent' },
});

export const mathRendererHtmlStyles = `
  body { font-family: sans-serif; font-size: 15px; margin: 0; padding: 5px; color: #333; background-color: transparent; }
  .scroll-wrapper { width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch; padding-bottom: 15px; display: block; }
  table { min-width: 100%; width: auto; border-collapse: collapse; margin: 10px 0; background: #fff; }
  th, td { border: 1px solid #ccc; padding: 8px; text-align: center; min-width: 50px; }
  th { background-color: #f2f2f2; font-weight: bold; }
  #content { word-wrap: break-word; }
  .scroll-wrapper::-webkit-scrollbar { height: 10px; display: block; }
  .scroll-wrapper::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 4px; }
  .scroll-wrapper::-webkit-scrollbar-thumb { background: #bbb; border-radius: 5px; }
`;

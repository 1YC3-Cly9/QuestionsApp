// components/mathRenderer.tsx
import React, { useMemo, useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { mathRendererHtmlStyles, mathRendererStyles as styles } from '../styles/mathRendererStyles';

const TABLE_REGEX = /<table[^>]*>[\s\S]*?<\/table>/gi;
const TR_BLOCK_REGEX = /<tr[^>]*>[\s\S]*?<\/tr>/gi;

const normalizeMathMarkup = (value: string): string => {
  const decoded = value
    .replace(/```(?:html)?/gi, '')
    .replace(/```/g, '')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&amp;/gi, '&')
    .trim();

  const tables: string[] = [];
  const withPlaceholders = decoded.replace(TABLE_REGEX, (table) => {
    const index = tables.push(table) - 1;
    return `__TABLE_PLACEHOLDER_${index}__`;
  });

  return withPlaceholders
    .replace(/\n/g, '<br/>')
    .replace(/__TABLE_PLACEHOLDER_(\d+)__/g, (_, index) => tables[Number(index)] || '');
};

export const extractTableAndText = (fullText: string): { plainText: string; tableHtml: string | null } => {
  if (!fullText) return { plainText: '', tableHtml: null };

  const tableMatches = fullText.match(TABLE_REGEX);
  if (tableMatches?.length) {
    return { plainText: fullText.replace(TABLE_REGEX, '').trim(), tableHtml: tableMatches.join('\n') };
  }

  const trMatches = fullText.match(TR_BLOCK_REGEX);
  if (trMatches?.length) {
    return {
      plainText: fullText.replace(TR_BLOCK_REGEX, '').trim(),
      tableHtml: `<table>\n${trMatches.join('\n')}\n</table>`,
    };
  }

  return { plainText: fullText.trim(), tableHtml: null };
};

export const parseHTMLTableToGrid = (html: string): string[][] => {
  if (!html) return [];
  const rows: string[][] = [];
  const trRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  const tdRegex = /<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi;
  let trMatch: RegExpExecArray | null;

  while ((trMatch = trRegex.exec(html)) !== null) {
    const cells: string[] = [];
    let tdMatch: RegExpExecArray | null;
    while ((tdMatch = tdRegex.exec(trMatch[1])) !== null) {
      cells.push(tdMatch[1].replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '').trim());
    }
    if (cells.length) rows.push(cells);
  }
  return rows;
};

export const gridToHTMLTable = (grid: string[][]): string => {
  if (!grid.length) return '';
  const rows = grid.map((row) => `  <tr>${row.map((cell) => `<td>${cell || ''}</td>`).join('')}</tr>`).join('\n');
  return `<table>\n${rows}\n</table>`;
};

interface TableEditorProps {
  grid: string[][];
  onChange: (grid: string[][]) => void;
}

export function TableEditor({ grid, onChange }: TableEditorProps) {
  if (!grid.length) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Edit Table (Swipe slider below to scroll):</Text>
      <ScrollView style={styles.verticalScroll}>
        <ScrollView horizontal showsHorizontalScrollIndicator persistentScrollbar keyboardShouldPersistTaps="always">
          <View style={styles.tableContent}>
            {grid.map((row, rowIndex) => (
              <View key={`row-${rowIndex}`} style={styles.row}>
                {row.map((cell, colIndex) => (
                  <TextInput
                    key={`cell-${rowIndex}-${colIndex}`}
                    style={[styles.cell, colIndex > 0 && styles.noLeftBorder, rowIndex > 0 && styles.noTopBorder]}
                    value={cell}
                    onChangeText={(text) => {
                      const nextGrid = grid.map((currentRow) => [...currentRow]);
                      nextGrid[rowIndex][colIndex] = text;
                      onChange(nextGrid);
                    }}
                  />
                ))}
              </View>
            ))}
            <View style={styles.slider} />
          </View>
        </ScrollView>
      </ScrollView>
    </View>
  );
}

interface MathRendererProps {
  content: any; // Flexible type to prevent crashing on unexpected data
}

const MathRendererComponent: React.FC<MathRendererProps> = ({ content }) => {
  const [height, setHeight] = useState(60);

  // Safety: Force content to be a string
  const displayContent = useMemo(() => {
    if (!content) return "";
    return normalizeMathMarkup(String(content)).replace(/\$(.*?)\$/g, '\\($1\\)');
  }, [content]); 

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
      <script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
      <style>${mathRendererHtmlStyles}</style>
    </head>
    <body>
      <div class="scroll-wrapper">
        <div id="content" style="display: inline-block; width: 100%;">${displayContent}</div>
      </div>
      <script>
        function updateHeight() {
          // scrollHeight is more accurate than offsetHeight for dynamic content
          const height = document.body.scrollHeight;
          if (height > 0) {
            window.ReactNativeWebView.postMessage(height.toString());
          }
        }
        window.addEventListener('load', () => {
          updateHeight();
          // Observe any changes to the DOM (like MathJax finishing a render)
          const observer = new MutationObserver(updateHeight);
          observer.observe(document.body, { attributes: true, childList: true, subtree: true });
          // Also watch for window resizing
          window.addEventListener('resize', updateHeight);
        });
        // Fallback for slower renders
        setTimeout(updateHeight, 500);
        setTimeout(updateHeight, 1500);
      </script>
    </body>
    </html>
  `;

  if (!displayContent) return null;

  return (
    <View style={{ height: height + 15, width: '100%', overflow: 'hidden' }}> 
      <WebView
        scrollEnabled={false}
        onMessage={(event) => {
          const newHeight = Number(event.nativeEvent.data);
          if (newHeight > 0) setHeight(newHeight);
        }}
        source={{ html }}
        javaScriptEnabled={true}
        style={styles.content}
      />
    </View>
  );
};

export const MathRenderer = React.memo(MathRendererComponent);
MathRenderer.displayName = 'MathRenderer';
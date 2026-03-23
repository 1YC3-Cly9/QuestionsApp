// components/mathRenderer.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

export const MathRenderer = ({ content }: { content: string }) => {
  // FIX: If content is missing, return nothing or a placeholder
  if (!content) {
    return <Text style={styles.plainText}>...</Text>;
  }

  // Regex to find math wrapped in $...$ or [MATH]...[/MATH]
  const parts = content.split(/(\$.*?\$|\[MATH\].*?\[\/MATH\])/g);

  return (
    <View style={styles.container}>
      {parts.map((part, index) => {
        // Detect if the part is math (starts/ends with $ or [MATH])
        const isMath = (part.startsWith('$') && part.endsWith('$')) || 
                       (part.startsWith('[MATH]') && part.endsWith('[/MATH]'));

        if (isMath) {
          // Clean the tags for LaTeX rendering
          const latex = part.replace(/\$|\[MATH\]|\[\/MATH\]/g, '');
          
          return (
            <View key={index} style={styles.mathWrapper}>
              <WebView
                originWhitelist={['*']}
                scalesPageToFit={false}
                scrollEnabled={false}
                source={{ html: `
                  <html>
                    <head>
                      <meta name="viewport" content="width=device-width, initial-scale=1.0">
                      <script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.9/MathJax.js?config=TeX-MML-AM_CHTML"></script>
                    </head>
                    <body style="margin:0; padding:0; background-color:transparent; display:flex; align-items:center;">
                      <div style="font-size: 16px; color: #2c3e50; font-family: sans-serif;">
                        \\(${latex}\\)
                      </div>
                    </body>
                  </html>
                `}}
                style={styles.webview}
              />
            </View>
          );
        }

        // Render plain text parts normally
        return (
          <Text key={index} style={styles.plainText}>
            {part}
          </Text>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    alignItems: 'center',
    width: '100%' 
  },
  plainText: { 
    fontSize: 16, 
    color: '#2c3e50', 
    lineHeight: 24 
  },
  mathWrapper: { 
    height: 35, 
    minWidth: 40, 
    marginHorizontal: 2,
    justifyContent: 'center' 
  },
  webview: { 
    backgroundColor: 'transparent', 
    width: 100, // Use a fixed or dynamic width logic if needed
    height: 35 
  }
});
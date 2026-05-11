// components/mathRenderer.tsx
import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';

interface MathRendererProps {
  content: any; // Flexible type to prevent crashing on unexpected data
}

export const MathRenderer: React.FC<MathRendererProps> = React.memo(({ content }) => {
  const [height, setHeight] = useState(60);
  const [loading, setLoading] = useState(true);

  // Safety: Force content to be a string
  const displayContent = useMemo(() => {
    if (!content) return "";
    return String(content).replace(/\$(.*?)\$/g, '\\($1\\)');
  }, [content]);

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
      <script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
      <style>
        body { font-family: sans-serif; font-size: 16px; margin: 0; padding: 10px; color: #333; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        td { border: 1px solid #999; padding: 8px; text-align: center; }
      </style>
    </head>
    <body>
      <div id="content">${displayContent.replace(/\n/g, '<br/>')}</div>
      <script>
        function updateHeight() {
          window.ReactNativeWebView.postMessage(document.getElementById('content').offsetHeight);
        }
        window.addEventListener('load', updateHeight);
        new ResizeObserver(updateHeight).observe(document.getElementById('content'));
      </script>
    </body>
    </html>
  `;

  if (!displayContent) return null;

  return (
    <View style={{ height: height + 20, width: '100%' }}>
      <WebView
        scrollEnabled={false}
        onMessage={(event) => {
          setHeight(Number(event.nativeEvent.data));
          setLoading(false);
        }}
        source={{ html }}
        javaScriptEnabled={true}
        style={{ backgroundColor: 'transparent' }}
      />
    </View>
  );
});
import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';

const LiquidMathRendererComponent = ({ content }: { content: string }) => {
  const [height, setHeight] = useState(60);

  const displayContent = useMemo(() => {
    return String(content).replace(/\$(.*?)\$/g, '\\($1\\)');
  }, [content]);

  if (!content) return null;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
      <script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
      <style>
        body { 
          font-family: -apple-system, sans-serif; 
          font-size: 16px; 
          margin: 0; 
          padding: 10px; 
          color: #2c3e50; 
          background-color: transparent;
        }
        #content { width: 100%; display: inline-block; word-wrap: break-word; }
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

  return (
    <View style={{ height: height + 10, width: '100%' }}>
      <WebView
        scrollEnabled={false}
        onMessage={(event) => {
          const detectedHeight = Number(event.nativeEvent.data);
          if (detectedHeight > 0) setHeight(detectedHeight + 5);
        }}
        source={{ html }}
        style={{ backgroundColor: 'transparent' }}
      />
    </View>
  );
};

export const LiquidMathRenderer = React.memo(LiquidMathRendererComponent);
LiquidMathRenderer.displayName = 'LiquidMathRenderer';

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
        body { font-family: sans-serif; font-size: 15px; margin: 0; padding: 5px; color: #333; background-color: transparent; }
        .scroll-wrapper { 
          width: 100%; 
          overflow-x: auto; 
          -webkit-overflow-scrolling: touch; 
          padding-bottom: 15px; 
          display: block;
        }
        table { min-width: 100%; width: auto; border-collapse: collapse; margin: 10px 0; background: #fff; }
        th, td { border: 1px solid #ccc; padding: 8px; text-align: center; min-width: 50px; }
        th { background-color: #f2f2f2; font-weight: bold; }
        #content { word-wrap: break-word; }
        /* Force a visible horizontal scroller */
        .scroll-wrapper::-webkit-scrollbar { height: 10px; display: block; }
        .scroll-wrapper::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 4px; }
        .scroll-wrapper::-webkit-scrollbar-thumb { background: #bbb; border-radius: 5px; }
      </style>
    </head>
    <body>
      <div class="scroll-wrapper">
        <div id="content" style="display: inline-block; width: 100%;">${displayContent.replace(/\n/g, '<br/>')}</div>
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
          setLoading(false);
        }}
        source={{ html }}
        javaScriptEnabled={true}
        style={{ backgroundColor: 'transparent' }}
      />
    </View>
  );
});
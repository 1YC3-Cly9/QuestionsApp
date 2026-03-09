import React from 'react';
import { WebView } from 'react-native-webview';
import { View, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const MathText = ({ content }: { content: string }) => {
  // Simple HTML wrapper to use MathJax (the industry standard for math on the web)
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
      <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
      <style>
        body { 
          font-family: sans-serif; 
          font-size: 16px; 
          background-color: transparent; 
          margin: 0; padding: 0; 
        }
        .math-container { color: #333; }
      </style>
    </head>
    <body>
      <div class="math-container">
        ${content}
      </div>
    </body>
    </html>
  `;

  return (
    <View style={{ height: 40, width: width - 80, marginVertical: 5 }}>
      <WebView
        originWhitelist={['*']}
        source={{ html }}
        style={{ backgroundColor: 'transparent' }}
        scrollEnabled={false}
      />
    </View>
  );
};
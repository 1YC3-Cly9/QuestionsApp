import React, { useState } from 'react';
import { WebView } from 'react-native-webview';
import { View } from 'react-native';

export const MathText = ({ content }: { content: string }) => {

  const [height, setHeight] = useState(40);

  const html = `
  <!DOCTYPE html>
  <html>
  <head>

  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>

  <script id="MathJax-script" async
  src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>

  <style>

  body{
    margin:0;
    padding:0;
    font-family:sans-serif;
    font-size:16px;
    background:transparent;
    overflow-wrap:break-word;
    word-break:break-word;
  }

  #container{
    width:100%;
    line-height:1.4;
    color:#333;
  }

  </style>

  </head>

  <body>

  <div id="container">
  ${content}
  </div>

  <script>

  function sendHeight(){
      const height = document.getElementById('container').scrollHeight;
      window.ReactNativeWebView.postMessage(height);
  }

  const observer = new ResizeObserver(sendHeight);
  observer.observe(document.body);

  window.onload = () => {
      sendHeight();
  };

  </script>

  </body>
  </html>
  `;

  return (
    <View style={{ width: '100%' }}>

      <WebView
        originWhitelist={['*']}
        source={{ html }}
        scrollEnabled={false}

        style={{
          height: height,
          width: '100%',
          backgroundColor: 'transparent'
        }}

        onMessage={(event) => {
          const newHeight = Number(event.nativeEvent.data);
          if (newHeight && newHeight !== height) {
            setHeight(newHeight);
          }
        }}
      />

    </View>
  );
};
// import React from 'react';
// import { View, StyleSheet } from 'react-native';
// import { WebView } from 'react-native-webview';
// import { hp } from '../utils/constant';

// const TradingViewChart = () => {
//   return (
//     <View style={styles.container}>
//       <WebView
//         source={{
//           uri: 'https://www.tradingview.com/widgetembed/?frameElementId=tradingview_xxx&symbol=AAPL&interval=D&theme=dark&header_screenshot=false'
//         }}
//         style={styles.webview}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, paddingTop: hp(6), paddingBottom:hp(2) },
//   webview: { flex: 1 }
// });

// export default TradingViewChart;


import React from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';

const TradingViewChart = () => {
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
        <style>
          body, html { margin: 0; padding: 0; width: 100%; height: 100%; background-color: black; }
          #chart { width: 100%; height: 100%; }
        </style>
      </head>
      <body>
        <div id="chart"></div>

        <script>
          // Function to create chart after script loads
          function createChart() {
            console.log("LightweightCharts loaded, initializing chart...");

            const chart = LightweightCharts.createChart(document.getElementById('chart'), {
              width: window.innerWidth,
              height: window.innerHeight,
              layout: {
                background: { color: '#000000' },
                textColor: '#FFFFFF'
              },
              grid: {
                vertLines: { color: 'rgba(255,255,255,0.1)' },
                horzLines: { color: 'rgba(255,255,255,0.1)' }
              }
            });

            const candleSeries = chart.addCandlestickSeries();
            candleSeries.setData([
              { time: '2024-01-01', open: 100, high: 110, low: 95, close: 105 },
              { time: '2024-01-02', open: 106, high: 115, low: 100, close: 110 },
              { time: '2024-01-03', open: 110, high: 120, low: 105, close: 115 }
            ]);
          }

          // Dynamically load script
          const script = document.createElement('script');
          script.src = "https://unpkg.com/lightweight-charts/dist/lightweight-charts.standalone.production.js";
          script.onload = createChart;
          document.head.appendChild(script);
        </script>
      </body>
    </html>
  `;

  return (
    <View style={{ flex: 1, backgroundColor: 'black' }}>
      <WebView 
        originWhitelist={['*']} 
        source={{ html: htmlContent }} 
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowFileAccess={true}
        injectedJavaScriptBeforeContentLoaded={`
          console.log("WebView Loaded");
        `}
      />
    </View>
  );
};

export default TradingViewChart;

import React from 'react';
import { View, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const Chart = ({quotes, color = '#E20029'}: any) => {
  const data = quotes?.length > 0 ? quotes?.map((quote: any) => quote?.close || 0) : [];
    
// Set chart dimensions
const chartWidth = Dimensions.get("window").width / 4;
const chartHeight = 30; // Set chart height to 50px

// Function to scale data points to fit within chart dimensions
const scaleData = (data: any, width: any, height: any) => {
  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);

  return data.map((value: any, index: any) => {
    // Calculate x position
    const x = (index / (data.length - 1)) * width;
    // Calculate y position, invert so high values are at the top
    const y = height - ((value - minValue) / (maxValue - minValue)) * height;
    return { x: isNaN(x) ? 0 : x, y: isNaN(y) ? 0 : y };
  });
};
  const scaledData = scaleData(data, chartWidth, chartHeight);

  const pathData = scaledData
    .map((point: any, index: any) =>
      index === 0 ? `M ${point.x} ${point.y}` : `L ${point.x} ${point.y}`
    )
    .join(" ");

  return (
    <View style={{ marginVertical: 16 }}>
      <Svg width={chartWidth} height={chartHeight} style={{ backgroundColor: "transparent" }}>
        <Path
          d={pathData}
          fill="none"
          stroke={color}
          strokeWidth="2"
        />
      </Svg>
    </View>
  );
};

export default Chart;

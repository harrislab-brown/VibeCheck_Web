// src/components/ChartComponent.tsx

import React, { useMemo,useState, useRef, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  // Tooltip,
  Legend,
  ChartOptions,
  ChartData
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useAppSelector } from '../redux/hooks';

import '../styles/Chart.css'
import { RootState } from '../redux/store';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  // Tooltip,
  Legend
);

interface ChartComponentProps {
  sensorNumbers?: number[];  // For multi-sensor mode
  sensorNumber?: number;     // For single sensor mode (keep for backward compatibility)
  channelNumber?: number;    // For single sensor mode
  title: string;
  updateInterval: number;
}

const ChartComponent: React.FC<ChartComponentProps> = ({
  sensorNumbers,
  sensorNumber,
  title,
  updateInterval

}) => {

  const [chartData, setChartData] = useState<ChartData<'line'>>({
    labels: [],
    datasets: []
  });
  const [xAxisLimits, setXAxisLimits] = useState<{min: number, max: number} | null>(null);
  const isPaused = useAppSelector(state => state.plot.isPaused);
  const allData = useAppSelector((state: RootState) => state.data.data);

  // Determine which sensors to plot
  const sensorsToPlot = sensorNumbers || (sensorNumber !== undefined ? [sensorNumber] : []);

  const plotSettings = useAppSelector(state => state.plot);
  const chartRef = useRef<ChartJS<"line"> | null>(null);
  const lineTension = 0.0;




  // Color scheme by axis (consistent across all sensors)
  const axisColors = {
    x: 'rgb(255, 99, 132)',  // Red for X-axis
    y: 'rgb(75, 192, 75)',   // Green for Y-axis
    z: 'rgb(54, 162, 235)'   // Blue for Z-axis
  };

  // Point styles for different sensors
  const sensorPointStyles = [
    'circle',    // Sensor 0
    'rect',     // Sensor 1
    'triangle'   // Sensor 2
  ];

  useEffect(() => {
    const updateChart = () => {
      if(isPaused) return;

      const datasets: any[] = [];

      sensorsToPlot.forEach((sensor) => {
        const channelNum = sensor * 2; // Convert sensor number to channel number
        const sensorData = allData.find((d) => d.channel === channelNum);

        if (sensorData && sensorData.dataPoints.length > 0) {
          const latestTimestamp = Math.max(...sensorData.dataPoints.map(p => p.timestamp));
          const timeThreshold = latestTimestamp - (plotSettings.timeWindowMs * 1000); // Convert ms to microseconds
          const recentData = sensorData.dataPoints.filter(point =>
            point.timestamp >= timeThreshold
          );
          const pointStyle = sensorPointStyles[sensor] || sensorPointStyles[0];

          // Add X, Y, Z datasets for this sensor
          datasets.push(
            {
              label: `Sensor ${sensor} X`,
              data: recentData.map((point) => ({
                x: point.timestamp / 1000, // Convert microseconds to milliseconds
                y: point.x
              })),
              borderColor: axisColors.x,
              backgroundColor: axisColors.x.replace('rgb', 'rgba').replace(')', ', 0.5)'),
              pointStyle: pointStyle,
              borderWidth: 2, // Thinner line
              pointRadius: 4, // Bigger points
              tension: lineTension,
            },
            {
              label: `Sensor ${sensor} Y`,
              data: recentData.map((point) => ({
                x: point.timestamp / 1000, // Convert microseconds to milliseconds
                y: point.y
              })),
              borderColor: axisColors.y,
              backgroundColor: axisColors.y.replace('rgb', 'rgba').replace(')', ', 0.5)'),
              pointStyle: pointStyle,
              borderWidth: 2, // Thinner line
              pointRadius: 4, // Bigger points
              tension: lineTension,
            },
            {
              label: `Sensor ${sensor} Z`,
              data: recentData.map((point) => ({
                x: point.timestamp / 1000, // Convert microseconds to milliseconds
                y: point.z
              })),
              borderColor: axisColors.z,
              backgroundColor: axisColors.z.replace('rgb', 'rgba').replace(')', ', 0.5)'),
              pointStyle: pointStyle,
              borderWidth: 2, // Thinner line
              pointRadius: 4, // Bigger points
              tension: lineTension,
            }
          );
        }
      });

      // Calculate x-axis limits based on time window
      let latestTimestamp = 0;
      sensorsToPlot.forEach((sensor) => {
        const channelNum = sensor * 2;
        const sensorData = allData.find((d) => d.channel === channelNum);
        if (sensorData && sensorData.dataPoints.length > 0) {
          const sensorLatest = Math.max(...sensorData.dataPoints.map(p => p.timestamp));
          latestTimestamp = Math.max(latestTimestamp, sensorLatest);
        }
      });

      if (latestTimestamp > 0) {
        const timeWindowMicroseconds = plotSettings.timeWindowMs * 1000;
        setXAxisLimits({
          min: (latestTimestamp - timeWindowMicroseconds) / 1000, // Convert to milliseconds
          max: latestTimestamp / 1000 // Convert to milliseconds
        });
      }

      const newChartData: ChartData<'line'> = { datasets };
      setChartData(newChartData);
    };

    const intervalId = setInterval(updateChart, updateInterval);

    return () => clearInterval(intervalId);
  }, [sensorsToPlot, plotSettings.timeWindowMs, allData, updateInterval, isPaused]);

  const options: ChartOptions<'line'> = useMemo(() => ({
    
    responsive: true,
    maintainAspectRatio: false,
    spanGaps: true,
    scales: {
      
      y: {
        beginAtZero: false,
        min: plotSettings.autoRange ? undefined : plotSettings.yMin,
        max: plotSettings.autoRange ? undefined : plotSettings.yMax,
        title: {
          text: "Acceleration (g)",
          display: true,
          color: "white",
          font: {
            size: 20
          }
        }
      },
      x: {
        type: 'linear',
        min: xAxisLimits?.min,
        max: xAxisLimits?.max,
        title:{
          text: "Time (ms)",
          display:true,
          color: "white",
          font: {
            size:20
          }
        }
      }
      
    },
    plugins:{
      decimation:{
  enabled: false,
  },
      title:{
        display: true,
        text: title,
      },
      legend: {
        display: true,
        labels: {
          usePointStyle: true, // Use point styles in legend instead of rectangles
        }
      },

    },

    animation: false,
  }), [plotSettings.autoRange, plotSettings.yMin, plotSettings.yMax, xAxisLimits, title]);
  useEffect(() => {
    const chart = chartRef.current;
    if (chart) {
      const resizeObserver = new ResizeObserver(() => {
        chart.resize();
      });
      resizeObserver.observe(chart.canvas);
      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [chartRef]);

 
  return (
    <div className="chart-div" style={{ height: '100%' }}>
      { <Line ref={chartRef} data={chartData} options={options} /> }
      {/* console.log(chartData) */}
    </div>
  );
};

export default ChartComponent;
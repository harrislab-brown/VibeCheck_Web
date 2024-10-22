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
  channel: number;
  title: string;
  updateInterval: number;
}

const ChartComponent: React.FC<ChartComponentProps> = ({  
  channel,
  title,
  updateInterval

}) => {

  const [chartData, setChartData] = useState<ChartData<'line'>>({
    labels: [],
    datasets: []
  });
  const isPaused = useAppSelector(state => state.plot.isPaused);
  const allData = useAppSelector((state: RootState) => state.data.data);
  const plotSettings = useAppSelector(state => state.plot);
  const enabledSensorsCount = useAppSelector(state=> Object.values(state.sensor).filter(s=>s.isEnabled).length);
  const chartRef = useRef<ChartJS<"line"> | null>(null);
  const lineTension = 0.2;


  useEffect(() => {
    const updateChart = () => {
      if(isPaused) return;

      const data = allData.find((d) => d.channel === channel);
      if (data) {
        const newChartData: ChartData<'line'> = {
          labels: data.dataPoints.slice(-plotSettings.windowWidth).map((_, index) => index.toString()),
          datasets: [
            {
              label: 'X Axis',
              data: data.dataPoints.slice(-plotSettings.windowWidth).map((point) => point.x),
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
              tension: lineTension,
            },
            {
              label: 'Y Axis',
              data: data.dataPoints.slice(-plotSettings.windowWidth).map((point) => point.y),
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.5)',
              tension: lineTension,
            },
            {
              label: 'Z Axis',
              data: data.dataPoints.slice(-plotSettings.windowWidth).map((point) => point.z),
              borderColor: 'rgb(53, 162, 235)',
              backgroundColor: 'rgba(53, 162, 235, 0.5)',
              tension: lineTension,
            },
          ],
        };
        setChartData(newChartData);
      }
    };

    const intervalId = setInterval(updateChart, updateInterval);

    return () => clearInterval(intervalId);
  }, [channel, plotSettings.windowWidth, allData, updateInterval]);

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: false,
        min: plotSettings.autoRange ? undefined : plotSettings.yMin,
        max: plotSettings.autoRange ? undefined : plotSettings.yMax,
      },
    },
    plugins:{
      title:{
        display: true,
        text: title,
      }
    },
    animation: {
      duration: 0,  // Set animation duration in milliseconds
    },
  };
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
    <div className="chart-div" style={{ height: `${100 / enabledSensorsCount}%` }}>
      <Line ref={chartRef} data={chartData} options={options} />
    </div>
  );
};

export default ChartComponent;
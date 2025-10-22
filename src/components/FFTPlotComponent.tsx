import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Legend,
  ChartOptions,
  ChartData
} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import { Line } from 'react-chartjs-2';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { RootState } from '../redux/store';
import { updateMaxFrequencyFromSampleRate, updateWindowSizeFromSampleRate } from '../features/fftSlice';
import { computeFFT, applyAveraging, convertToLogScale, findPeaks, FFTResult, Peak } from '../utils/fftUtils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Legend,
  annotationPlugin
);

interface FFTPlotComponentProps {
  title: string;
  updateInterval: number;
}

interface FFTData {
  [sensorAxis: string]: {
    frequencies: number[];
    magnitudes: number[];
    previousMagnitudes: number[] | null;
    peaks: Peak[];
  };
}

const FFTPlotComponent: React.FC<FFTPlotComponentProps> = ({
  title,
  updateInterval
}) => {
  const [chartData, setChartData] = useState<ChartData<'line'>>({
    labels: [],
    datasets: []
  });

  const [fftData, setFFTData] = useState<FFTData>({});
  const [lastSampleRate, setLastSampleRate] = useState<number | null>(null);
  const [allPeaks, setAllPeaks] = useState<Peak[]>([]);
  const chartRef = useRef<ChartJS<"line"> | null>(null);
  const dispatch = useAppDispatch();

  const fftSettings = useAppSelector((state: RootState) => state.fft);
  const allData = useAppSelector((state: RootState) => state.data.data);
  const isPaused = useAppSelector((state: RootState) => state.plot.isPaused);

  // Initialize window size on first load if adaptive mode and data is available
  useEffect(() => {
    if (fftSettings.enabled && fftSettings.adaptiveWindow && isNaN(fftSettings.windowSize) && allData.length > 0) {
      console.log('FFT Debug: Initializing adaptive window size...');
      // Find a sensor with data to estimate sample rate
      const sensorWithData = allData.find(d => d.dataPoints.length >= 2);
      if (sensorWithData) {
        const timeDiff = sensorWithData.dataPoints[sensorWithData.dataPoints.length - 1].timestamp -
                        sensorWithData.dataPoints[sensorWithData.dataPoints.length - 2].timestamp;
        const estimatedSampleRate = 1000000 / timeDiff;
        console.log(`FFT Debug: Initial sample rate estimate: ${estimatedSampleRate.toFixed(1)} Hz`);
        dispatch(updateWindowSizeFromSampleRate(estimatedSampleRate));
      }
    }
  }, [fftSettings.enabled, fftSettings.adaptiveWindow, fftSettings.windowSize, allData, dispatch]);

  // Color schemes
  const axisColors = {
    x: 'rgb(255, 99, 132)',  // Red for X-axis
    y: 'rgb(75, 192, 75)',   // Green for Y-axis
    z: 'rgb(54, 162, 235)'   // Blue for Z-axis
  };

  const sensorLineStyles = [
    'solid',    // Sensor 0
    'dashed',   // Sensor 1
    'dotted'    // Sensor 2
  ];

  useEffect(() => {
    if (!fftSettings.enabled || isPaused) {
      setChartData({ labels: [], datasets: [] });
      setFFTData({}); // Clear FFT data when disabled
      return;
    }

    const updateFFT = () => {
      try {
        const datasets: any[] = [];
        const newFFTData: FFTData = {};

        console.log('FFT Update: Starting FFT computation...');
        console.log('FFT Settings:', fftSettings);
        console.log('All Data:', allData.map(d => ({ channel: d.channel, points: d.dataPoints.length })));

      fftSettings.selectedSensors.forEach((sensorNum) => {
        const channelNum = sensorNum * 2; // Convert sensor number to channel number
        const sensorData = allData.find((d) => d.channel === channelNum);

        // Safety check for window size
        const safeWindowSize = isNaN(fftSettings.windowSize) || fftSettings.windowSize <= 0 ? 512 : fftSettings.windowSize;

        console.log(`FFT Debug: Sensor ${sensorNum}, Channel ${channelNum}`);
        console.log(`FFT Debug: SensorData found:`, !!sensorData);
        if (sensorData) {
          console.log(`FFT Debug: Data points: ${sensorData.dataPoints.length}, Window size needed: ${safeWindowSize}`);
          if (sensorData.dataPoints.length >= 2) {
            const timeDiff = sensorData.dataPoints[sensorData.dataPoints.length - 1].timestamp - sensorData.dataPoints[sensorData.dataPoints.length - 2].timestamp;
            const estimatedSampleRate = 1000000 / timeDiff; // Convert from microseconds
            console.log(`FFT Debug: Estimated sample rate: ${estimatedSampleRate.toFixed(1)} Hz, Time window: ${(safeWindowSize / estimatedSampleRate).toFixed(3)} seconds`);
          }
        }

        // Calculate minimum required data points (window size + small buffer)
        const minRequiredData = Math.max(safeWindowSize, Math.round(safeWindowSize * 1.1));

        if (sensorData && sensorData.dataPoints.length >= minRequiredData) {
          const axes = ['x', 'y', 'z']; // Always show all axes

          axes.forEach((axis) => {
            const axisKey = axis as 'x' | 'y' | 'z';
            const sensorAxisKey = `sensor${sensorNum}_${axis}`;

            // Compute FFT for this sensor/axis combination
            const fftResult = computeFFT(
              sensorData.dataPoints,
              axisKey,
              safeWindowSize,
              fftSettings.windowFunction || 'hanning', // Fallback to hanning if undefined
              fftSettings.overlap
            );

            if (fftResult) {
              // Check for sample rate changes and reset if needed
              if (lastSampleRate !== null && Math.abs(fftResult.sampleRate - lastSampleRate) > 10) {
                console.log(`FFT Debug: Sample rate changed from ${lastSampleRate} to ${fftResult.sampleRate} Hz, resetting FFT data`);
                setFFTData({}); // Clear previous FFT data
              }
              setLastSampleRate(fftResult.sampleRate);

              // Update window size based on sample rate (if adaptive)
              if (fftSettings.adaptiveWindow) {
                dispatch(updateWindowSizeFromSampleRate(fftResult.sampleRate));
                console.log(`FFT Debug: Adaptive window size updated for ${fftResult.sampleRate} Hz sample rate`);
              }

              // Update max frequency based on sample rate (only once per update)
              if (fftSettings.autoFrequencyRange) {
                const nyquistFreq = Math.floor(fftResult.sampleRate / 2);
                console.log(`FFT Debug: Updating max frequency to ${nyquistFreq} Hz from sample rate ${fftResult.sampleRate} Hz`);
                dispatch(updateMaxFrequencyFromSampleRate(fftResult.sampleRate));
              }

              // Apply frequency range filtering
              let { frequencies, magnitudes } = fftResult;

              if (!fftSettings.autoFrequencyRange) {
                const filteredIndices = frequencies
                  .map((freq, index) => freq >= fftSettings.minFrequency && freq <= fftSettings.maxFrequency ? index : -1)
                  .filter(index => index !== -1);

                frequencies = filteredIndices.map(i => frequencies[i]);
                magnitudes = filteredIndices.map(i => magnitudes[i]);
              }

              // Apply averaging
              const previousMagnitudes = fftData[sensorAxisKey]?.previousMagnitudes || null;
              const averagedMagnitudes = applyAveraging(
                magnitudes,
                previousMagnitudes,
                fftSettings.averaging,
                fftSettings.averagingFactor
              );

              // Apply scale conversion
              const displayMagnitudes = fftSettings.scaleType === 'logarithmic'
                ? convertToLogScale(averagedMagnitudes)
                : averagedMagnitudes;

              // Detect peaks if enabled
              const peaks = fftSettings.peakDetection
                ? findPeaks(
                    frequencies,
                    displayMagnitudes, // Use display magnitudes for peak detection
                    fftSettings.peakThreshold,
                    fftSettings.peakMinDistance,
                    fftSettings.peakMaxCount
                  )
                : [];

              // Store for next iteration
              newFFTData[sensorAxisKey] = {
                frequencies,
                magnitudes: averagedMagnitudes,
                previousMagnitudes: averagedMagnitudes,
                peaks
              };

              // Create dataset for chart
              const color = axisColors[axisKey];
              const lineStyle = sensorLineStyles[sensorNum] || sensorLineStyles[0];

              datasets.push({
                label: `Sensor ${sensorNum} ${axis.toUpperCase()}`,
                data: frequencies.map((freq, index) => ({
                  x: freq,
                  y: displayMagnitudes[index]
                })),
                borderColor: color,
                backgroundColor: color.replace('rgb', 'rgba').replace(')', ', 0.1)'),
                borderWidth: 2,
                pointRadius: 0, // No points for cleaner FFT display
                fill: false,
                borderDash: lineStyle === 'dashed' ? [5, 5] : lineStyle === 'dotted' ? [2, 2] : [],
                tension: 0.1,
              });
            }
          });
        } else if (sensorData) {
          console.log(`FFT Debug: Insufficient data for Sensor ${sensorNum}. Have: ${sensorData.dataPoints.length}, Need: ${minRequiredData}`);
          if (sensorData.dataPoints.length >= 2) {
            const timeDiff = sensorData.dataPoints[sensorData.dataPoints.length - 1].timestamp - sensorData.dataPoints[sensorData.dataPoints.length - 2].timestamp;
            const estimatedSampleRate = 1000000 / timeDiff;
            const timeToWait = (minRequiredData - sensorData.dataPoints.length) / estimatedSampleRate;
            console.log(`FFT Debug: Estimated ${timeToWait.toFixed(1)} seconds until sufficient data available`);
          }
        }
      });

      console.log('FFT Update: Final datasets count:', datasets.length);
      if (datasets.length > 0) {
        console.log('FFT Update: First dataset sample:', {
          label: datasets[0].label,
          dataLength: datasets[0].data.length,
          firstPoint: datasets[0].data[0],
          lastPoint: datasets[0].data[datasets[0].data.length - 1]
        });
      }

        // Collect all peaks for annotations
        const collectedPeaks: Peak[] = [];
        Object.values(newFFTData).forEach(data => {
          collectedPeaks.push(...data.peaks);
        });
        setAllPeaks(collectedPeaks);

        const newChartData: ChartData<'line'> = { datasets };
        setChartData(newChartData);
        setFFTData(newFFTData);
      } catch (error) {
        console.error('FFT Update Error:', error);
        // Reset on error to prevent getting stuck
        setChartData({ labels: [], datasets: [] });
        setFFTData({});
      }
    };

    const intervalId = setInterval(updateFFT, updateInterval);
    return () => clearInterval(intervalId);
  }, [
    fftSettings,
    allData,
    updateInterval,
    isPaused,
    fftData
  ]);

  const options: ChartOptions<'line'> = useMemo(() => {
    console.log(`FFT Chart Options: Min freq: ${fftSettings.minFrequency}, Max freq: ${fftSettings.maxFrequency}`);
    return {
    responsive: true,
    maintainAspectRatio: false,
    spanGaps: true,
    scales: {
      y: {
        beginAtZero: false,
        title: {
          text: fftSettings.scaleType === 'logarithmic' ? "Magnitude (dB)" : "Magnitude",
          display: true,
          color: "white",
          font: {
            size: 16
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'white'
        }
      },
      x: {
        type: 'linear',
        min: fftSettings.minFrequency,
        max: fftSettings.maxFrequency,
        title: {
          text: "Frequency (Hz)",
          display: true,
          color: "white",
          font: {
            size: 16
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'white'
        }
      }
    },
    plugins: {
      title: {
        display: true,
        text: title,
        color: 'white',
        font: {
          size: 18
        }
      },
      legend: {
        display: true,
        labels: {
          color: 'white',
          usePointStyle: false
        }
      },
      annotation: {
        annotations: fftSettings.peakDetection
          ? allPeaks.reduce((acc, peak, index) => {
              // Add vertical line for peak
              acc[`peakLine${index}`] = {
                type: 'line',
                xMin: peak.frequency,
                xMax: peak.frequency,
                borderColor: 'rgba(255, 255, 0, 0.8)',
                borderWidth: 2,
                borderDash: [5, 5],
              };
              // Add label for peak
              acc[`peakLabel${index}`] = {
                type: 'label',
                xValue: peak.frequency,
                yValue: peak.magnitude,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderColor: 'rgba(255, 255, 0, 1)',
                borderWidth: 1,
                borderRadius: 4,
                color: 'white',
                content: `${peak.frequency.toFixed(1)} Hz`,
                font: {
                  size: 10
                },
                padding: 4,
                position: 'end'
              };
              return acc;
            }, {} as any)
          : {}
      }
    },
    animation: false,
    elements: {
      line: {
        tension: 0.1
      }
    }
  };
  }, [fftSettings.scaleType, fftSettings.autoFrequencyRange, fftSettings.minFrequency, fftSettings.maxFrequency, fftSettings.peakDetection, allPeaks, title]);

  // Resize observer for responsive charts
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

  if (!fftSettings.enabled) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>FFT Analysis is disabled. Enable it in the FFT Settings.</p>
      </div>
    );
  }

  return (
    <div className="chart-div" style={{ height: '100%' }}>
      <Line ref={chartRef} data={chartData} options={options} />
    </div>
  );
};

export default FFTPlotComponent;
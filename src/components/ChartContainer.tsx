// src/components/ChartContainer.tsx

import React from 'react';
import { useAppSelector } from '../redux/hooks';
import ChartComponent from './ChartComponent';
import FFTPlotComponent from './FFTPlotComponent';
import InfoComponent from './InfoComponent';
import '../styles/ChartContainer.css';

const ChartContainer: React.FC = () => {
  const sensors = useAppSelector(state => state.sensor);
  const fftSettings = useAppSelector(state => state.fft);

  // Filter enabled sensors
  const enabledSensors = Object.entries(sensors)
    .filter(([_, sensorState]) => sensorState.isEnabled)
    .map(([key]) => parseInt(key));

  if(enabledSensors.length == 0){
    return(
      <div>
        <InfoComponent/>
      </div>
    );
  }
  else{
      return (
        <div className="chart-container">
          <div
            className="chart-div"
            style={{
              height: fftSettings.enabled ? '50%' : '100%',
              minHeight: '200px'
            }}
          >
            <ChartComponent
              sensorNumbers={enabledSensors}
              title={`All Sensors (${enabledSensors.join(', ')})`}
              updateInterval={1}
            />
          </div>
          {fftSettings.enabled && (
            <div
              className="chart-div"
              style={{
                height: '50%',
                minHeight: '200px'
              }}
            >
              <FFTPlotComponent
                title="FFT Analysis"
                updateInterval={100}
              />
            </div>
          )}
        </div>
      );
    };
  }
  

export default ChartContainer;
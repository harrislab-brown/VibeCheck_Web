// src/components/ChartContainer.tsx

import React from 'react';
import { useAppSelector } from '../redux/hooks';
import ChartComponent from './ChartComponent';
import InfoComponent from './InfoComponent';
import '../styles/ChartContainer.css';

const ChartContainer: React.FC = () => {
  const sensors = useAppSelector(state => state.sensor);

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
          {enabledSensors.map((channel) => (
            <ChartComponent 
              key={channel} 
              channel={channel*2} 
              title={`Sensor ${channel}`} 
              updateInterval={10}
            />
          ))}
        </div>
      );
    };
  }
  

export default ChartContainer;
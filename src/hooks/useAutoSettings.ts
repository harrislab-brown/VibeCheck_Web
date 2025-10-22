import { useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { sendSerialData } from '../features/serialOutputSlice';
import { RootState } from '../redux/rootReducer';

export const useAutoSettings = () => {
  const dispatch = useAppDispatch();
  const isConnected = useAppSelector((state: RootState) => state.serial.isConnected);
  const sensorState = useAppSelector((state: RootState) => state.sensor);
  const wavegenState = useAppSelector((state: RootState) => state.wavegen);
  const strobeState = useAppSelector((state: RootState) => state.strobe);

  // Track previous connection state to detect new connections
  const prevConnectedRef = useRef<boolean>(false);

  useEffect(() => {
    // Only send settings when transitioning from disconnected to connected
    if (isConnected && !prevConnectedRef.current) {
      console.log('Serial connection established - sending all current settings...');

      // Send sensor settings for all 3 sensors
      Object.entries(sensorState).forEach(([sensorNumStr, sensor]) => {
        const sensorNum = parseInt(sensorNumStr);

        // Send enable/disable command
        if (sensor.isEnabled !== undefined) {
          const command = `sensor ${sensorNum} ${sensor.isEnabled ? 'start' : 'stop'} accel\n`;
          dispatch(sendSerialData(command));
          console.log(`Auto-sending sensor ${sensorNum} enable: ${command.trim()}`);
        }

        // Send acceleration range
        if (sensor.accelerationRange) {
          const command = `sensor ${sensorNum} set accel range ${sensor.accelerationRange}\n`;
          dispatch(sendSerialData(command));
          console.log(`Auto-sending sensor ${sensorNum} range: ${command.trim()}`);
        }

        // Send sample rate
        if (sensor.sampleRate) {
          const command = `sensor ${sensorNum} set accel odr ${sensor.sampleRate}\n`;
          dispatch(sendSerialData(command));
          console.log(`Auto-sending sensor ${sensorNum} sample rate: ${command.trim()}`);
        }
      });

      // Send wavegen settings
      if (wavegenState.isEnabled !== undefined) {
        const enableCommand = wavegenState.isEnabled ? 'wavegen start' : 'wavegen stop';
        dispatch(sendSerialData(enableCommand));
        console.log(`Auto-sending wavegen enable: ${enableCommand}`);
      }

      if (wavegenState.waveform) {
        const command = `wavegen set waveform ${wavegenState.waveform}`;
        dispatch(sendSerialData(command));
        console.log(`Auto-sending wavegen waveform: ${command}`);
      }

      if (wavegenState.frequency !== undefined) {
        const command = `wavegen set frequency ${wavegenState.frequency}`;
        dispatch(sendSerialData(command));
        console.log(`Auto-sending wavegen frequency: ${command}`);
      }

      if (wavegenState.amplitude !== undefined) {
        const command = `wavegen set amplitude ${wavegenState.amplitude}`;
        dispatch(sendSerialData(command));
        console.log(`Auto-sending wavegen amplitude: ${command}`);
      }

      // Send strobe settings
      if (strobeState.isEnabled !== undefined) {
        const enableCommand = strobeState.isEnabled ? 'strobe start' : 'strobe stop';
        dispatch(sendSerialData(enableCommand));
        console.log(`Auto-sending strobe enable: ${enableCommand}`);
      }

      if (strobeState.frequency !== undefined) {
        const command = `strobe set frequency ${strobeState.frequency}`;
        dispatch(sendSerialData(command));
        console.log(`Auto-sending strobe frequency: ${command}`);
      }

      if (strobeState.exposure !== undefined && strobeState.frequency !== undefined) {
        const calculatedExposure = (1 / strobeState.frequency) * (strobeState.exposure / 100) * 1000;
        const command = `strobe set exposure ${calculatedExposure}`;
        dispatch(sendSerialData(command));
        console.log(`Auto-sending strobe exposure: ${command}`);
      }

      if (strobeState.phase !== undefined) {
        const command = `strobe set phase ${strobeState.phase}`;
        dispatch(sendSerialData(command));
        console.log(`Auto-sending strobe phase: ${command}`);
      }

      console.log('Auto-settings transmission complete.');
    }

    // Update previous connection state
    prevConnectedRef.current = isConnected;
  }, [isConnected, dispatch, sensorState, wavegenState, strobeState]);

  return {
    isConnected,
    autoSettingsEnabled: true // Can be used to show status in UI if needed
  };
};
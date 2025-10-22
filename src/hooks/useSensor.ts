import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { sendSerialData } from '../features/serialOutputSlice';
import { toggleSensor, setAccelerationRange, setSampleRate } from '../features/sensorSlice';
import { RootState } from '../redux/rootReducer';

export const useSensorSerial = (accelNumber: number) => {
  const dispatch = useAppDispatch();
  const sensorState = useAppSelector((state: RootState) =>
    state.sensor ? state.sensor[accelNumber] : undefined
  );
  const isSerialConnected = useAppSelector((state: RootState) => state.serial.isConnected);

  // Functions that update state and send commands immediately
  const handleToggleSensor = () => {
    dispatch(toggleSensor(accelNumber));
    // Send the enable/disable command immediately after toggling
    if (isSerialConnected && sensorState) {
      const newEnabledState = !sensorState.isEnabled;
      const command = `sensor ${accelNumber} ${newEnabledState ? 'start' : 'stop'} accel\n`;
      dispatch(sendSerialData(command));
    }
  };

  const handleAccelerationRangeChange = (range: string) => {
    dispatch(setAccelerationRange({ accelNumber, range }));
    // Send the range command immediately if connected and enabled
    if (isSerialConnected && sensorState?.isEnabled) {
      const command = `sensor ${accelNumber} set accel range ${range}\n`;
      dispatch(sendSerialData(command));
    }
  };

  const handleSampleRateChange = (rate: string) => {
    dispatch(setSampleRate({ accelNumber, rate }));
    // Send the sample rate command immediately if connected and enabled
    if (isSerialConnected && sensorState?.isEnabled) {
      const command = `sensor ${accelNumber} set accel odr ${rate}\n`;
      dispatch(sendSerialData(command));
    }
  };

  // Manual send functions for when accordion items are clicked
  const sendSensorSettings = () => {
    if (!sensorState) return;
    const { isEnabled, accelerationRange, sampleRate } = sensorState;

    if (isEnabled !== undefined) {
      const command = `sensor ${accelNumber} ${isEnabled ? 'start' : 'stop'} accel\n`;
      dispatch(sendSerialData(command));
    }

    if (accelerationRange) {
      const command = `sensor ${accelNumber} set accel range ${accelerationRange}\n`;
      dispatch(sendSerialData(command));
    }

    if (sampleRate) {
      const command = `sensor ${accelNumber} set accel odr ${sampleRate}\n`;
      dispatch(sendSerialData(command));
    }
  };

  return {
    sensorState,
    isSerialConnected,
    handleToggleSensor,
    handleAccelerationRangeChange,
    handleSampleRateChange,
    sendSensorSettings
  };
};
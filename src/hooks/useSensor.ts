import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { sendSerialData } from '../features/serialOutputSlice';
import { RootState } from '../redux/rootReducer';

export const useSensorSerial = (accelNumber: number) => {
  const dispatch = useAppDispatch();
  const sensorState = useAppSelector((state: RootState) => 
    state.sensor ? state.sensor[accelNumber] : undefined
  );

  useEffect(() => {
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
  }, [dispatch, accelNumber, sensorState]);
};
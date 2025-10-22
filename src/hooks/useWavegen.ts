import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { RootState } from '../redux/store'; // Adjust this import path as needed
import { wavegenSlice } from '../features/wavegenSlice';
import { sendSerialData } from '../features/serialOutputSlice'; // Adjust this import path as needed
import { useAppDispatch } from '../redux/hooks';

export const useWavegen = () => {
  const dispatch = useAppDispatch();
  const wavegenState = useSelector((state: RootState) => state.wavegen);
  const isSerialConnected = useSelector((state: RootState) => state.serial.isConnected);

  const toggleWavegen = () => {
    dispatch(wavegenSlice.actions.toggleWavegen());
    // Send the enable/disable command immediately after toggling
    if (isSerialConnected) {
      const newEnabledState = !wavegenState.isEnabled;
      const command = newEnabledState ? 'wavegen start' : 'wavegen stop';
      dispatch(sendSerialData(command));
    }
  };
  const setWaveform = (waveform: string) => {
    dispatch(wavegenSlice.actions.setWaveform({ waveform }));
    // Send the waveform command immediately if enabled and connected
    if (isSerialConnected && wavegenState.isEnabled) {
      dispatch(sendSerialData(`wavegen set waveform ${waveform}`));
    }
  };

  const setFrequency = (frequency: number) => {
    dispatch(wavegenSlice.actions.setFrequency({ frequency }));
    // Send the frequency command immediately if enabled and connected
    if (isSerialConnected && wavegenState.isEnabled) {
      dispatch(sendSerialData(`wavegen set frequency ${frequency}`));
    }
  };

  const setAmplitude = (amplitude: number) => {
    dispatch(wavegenSlice.actions.setAmplitude({ amplitude }));
    // Send the amplitude command immediately if enabled and connected
    if (isSerialConnected && wavegenState.isEnabled) {
      dispatch(sendSerialData(`wavegen set amplitude ${amplitude}`));
    }
  };

  // Manual send function for when accordion items are clicked
  const sendWavegenSettings = () => {
    if (isSerialConnected) {
      if (wavegenState.isEnabled) {
        dispatch(sendSerialData('wavegen start'));
      } else {
        dispatch(sendSerialData('wavegen stop'));
      }

      if (wavegenState.isEnabled) {
        dispatch(sendSerialData(`wavegen set waveform ${wavegenState.waveform}`));
        dispatch(sendSerialData(`wavegen set frequency ${wavegenState.frequency}`));
        dispatch(sendSerialData(`wavegen set amplitude ${wavegenState.amplitude}`));
      }
    }
  };

  return {
    ...wavegenState,
    isSerialConnected,
    toggleWavegen,
    setWaveform,
    setFrequency,
    setAmplitude,
    sendWavegenSettings,
  };
};
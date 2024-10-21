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
  };
  const setWaveform = (waveform: string) => {
    dispatch(wavegenSlice.actions.setWaveform({ waveform }));
  };

  const setFrequency = (frequency: number) => {
    dispatch(wavegenSlice.actions.setFrequency({ frequency }));
  };

  const setAmplitude = (amplitude: number) => {
    dispatch(wavegenSlice.actions.setAmplitude({ amplitude }));
  };

  useEffect(() => {
    if (isSerialConnected) {
      if (wavegenState.isEnabled) {
        dispatch(sendSerialData('wavegen start'));
      } else {
        dispatch(sendSerialData('wavegen stop'));
      }
    }
  }, [wavegenState.isEnabled, isSerialConnected]);

  useEffect(() => {
    if (isSerialConnected && wavegenState.isEnabled) {
      dispatch(sendSerialData(`wavegen set waveform ${wavegenState.waveform}`));
    }
  }, [wavegenState.waveform, wavegenState.isEnabled, isSerialConnected]);

  useEffect(() => {
    if (isSerialConnected && wavegenState.isEnabled) {
      dispatch(sendSerialData(`wavegen set frequency ${wavegenState.frequency}`));
    }
  }, [wavegenState.frequency, wavegenState.isEnabled, isSerialConnected]);

  useEffect(() => {
    if (isSerialConnected && wavegenState.isEnabled) {
      dispatch(sendSerialData(`wavegen set amplitude ${wavegenState.amplitude}`));
    }
  }, [wavegenState.amplitude, wavegenState.isEnabled, isSerialConnected]);

  return {
    ...wavegenState,
    isSerialConnected,
    toggleWavegen,
    setWaveform,
    setFrequency,
    setAmplitude,
  };
};
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { RootState } from '../redux/store';
import { strobeSlice } from '../features/strobeSlice';
import { sendSerialData } from '../features/serialOutputSlice';
import { useAppDispatch } from '../redux/hooks';

export const useStrobe = () => {
  const dispatch = useAppDispatch();
  const strobeState = useSelector((state: RootState) => state.strobe);
  const isSerialConnected = useSelector((state: RootState) => state.serial.isConnected);

  const toggleStrobe = () => {
    dispatch(strobeSlice.actions.toggleStrobe());
  };

  const setFrequency = (frequency: number) => {
    dispatch(strobeSlice.actions.setFrequency(frequency));
  };

  const setExposure = (exposure: number) => {
    dispatch(strobeSlice.actions.setExposure(exposure));
  };

  const setPhase = (phase: number) => {
    dispatch(strobeSlice.actions.setPhase(phase));
  };

  useEffect(() => {
    if (isSerialConnected) {
      if (strobeState.isEnabled) {
        dispatch(sendSerialData('strobe start'));
      } else {
        dispatch(sendSerialData('strobe stop'));
      }
    }
  }, [strobeState.isEnabled, isSerialConnected]);

  useEffect(() => {
    if (isSerialConnected && strobeState.isEnabled) {
      dispatch(sendSerialData(`strobe set frequency ${strobeState.frequency}`));
    }
  }, [strobeState.frequency, strobeState.isEnabled, isSerialConnected]);

  useEffect(() => {
    if (isSerialConnected && strobeState.isEnabled) {
      const calculatedExposure = (1 / strobeState.frequency) * (strobeState.exposure / 100) * 1000;
      dispatch(sendSerialData(`strobe set exposure ${calculatedExposure}`));
    }
  }, [strobeState.exposure, strobeState.frequency, strobeState.isEnabled, isSerialConnected]);

  useEffect(() => {
    if (isSerialConnected && strobeState.isEnabled) {
      dispatch(sendSerialData(`strobe set phase ${strobeState.phase}`));
    }
  }, [strobeState.phase, strobeState.isEnabled, isSerialConnected]);

  return {
    ...strobeState,
    isSerialConnected,
    toggleStrobe,
    setFrequency,
    setExposure,
    setPhase,
  };
};
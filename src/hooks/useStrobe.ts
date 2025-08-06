import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { RootState } from '../redux/store';
import { strobeSlice } from '../features/strobeSlice';
import { sendSerialData } from '../features/serialOutputSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { wavegenSlice } from '../features/wavegenSlice';

export const useStrobe = () => {
  const dispatch = useAppDispatch();
  const strobeState = useSelector((state: RootState) => state.strobe);
  const isSerialConnected = useSelector((state: RootState) => state.serial.isConnected);

  const toggleStrobe = () => {
        dispatch(strobeSlice.actions.toggleStrobe());
    const detuning = useAppSelector((state: RootState) => state.strobe.detuning);
    if (!detuning) {
    const wavegenFrequency = useAppSelector((state: RootState) => state.wavegen.frequency);
    const detune = useAppSelector((state: RootState) => state.strobe.detune);
    dispatch(strobeSlice.actions.setStrobeFrequency(wavegenFrequency + detune));
    }

    
  };

  const toggleStrobeType = () => {
    dispatch(strobeSlice.actions.toggleStrobeType())
    const detuning = useAppSelector((state: RootState) => state.strobe.detuning);
    if (detuning){
      const wavegenFrequency = useAppSelector((state: RootState) => state.wavegen.frequency);
      const detune = useAppSelector((state: RootState) => state.strobe.detune);
      dispatch(strobeSlice.actions.setStrobeFrequency(wavegenFrequency + detune));
    }

  }

  const setDetune = (detune:number) => {
    dispatch(strobeSlice.actions.setDetune(detune))
   
  }

  const setFrequency = (frequency: number) => {
    dispatch(strobeSlice.actions.setStrobeFrequency(frequency));
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
    toggleStrobeType,
    setDetune,
    setFrequency,
    setExposure,
    setPhase,

  };
};
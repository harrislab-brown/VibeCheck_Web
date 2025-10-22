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
  const wavegenState = useSelector((state: RootState) => state.wavegen);

  const toggleStrobe = () => { //toggles strobe on/off
    dispatch(strobeSlice.actions.toggleStrobe());
    if (strobeState.detuning) { // also sets the proper strobe based on detune if neccesary
      dispatch(strobeSlice.actions.setStrobeFrequency(wavegenState.frequency + strobeState.detune));
    }
    // Send the enable/disable command immediately after toggling
    if (isSerialConnected) {
      const newEnabledState = !strobeState.isEnabled;
      const command = newEnabledState ? 'strobe start' : 'strobe stop';
      dispatch(sendSerialData(command));
    }
  };

  const toggleStrobeType = () => { //togles from manual strobe control to detune
    dispatch(strobeSlice.actions.toggleStrobeType())
    if (strobeState.detuning){ // also sets the proper strobe based on detune if neccesary
      dispatch(strobeSlice.actions.setStrobeFrequency(wavegenState.frequency + strobeState.detune));
    }
  }

  const setDetune = (detune:number) => {
    dispatch(strobeSlice.actions.setDetune(detune))
    // Send updated frequency based on detune if enabled and connected
    if (isSerialConnected && strobeState.isEnabled && strobeState.detuning) {
      const newFrequency = wavegenState.frequency + detune;
      dispatch(strobeSlice.actions.setStrobeFrequency(newFrequency));
      dispatch(sendSerialData(`strobe set frequency ${newFrequency}`));
    }
  }

  const setFrequency = (frequency: number) => {
    dispatch(strobeSlice.actions.setStrobeFrequency(frequency));
    // Send the frequency command immediately if enabled and connected
    if (isSerialConnected && strobeState.isEnabled) {
      dispatch(sendSerialData(`strobe set frequency ${frequency}`));
    }
  };

  const setExposure = (exposure: number) => {
    dispatch(strobeSlice.actions.setExposure(exposure));
    // Send the exposure command immediately if enabled and connected
    if (isSerialConnected && strobeState.isEnabled) {
      const calculatedExposure = (1 / strobeState.frequency) * (exposure / 100) * 1000;
      dispatch(sendSerialData(`strobe set exposure ${calculatedExposure}`));
    }
  };

  const setPhase = (phase: number) => {
    dispatch(strobeSlice.actions.setPhase(phase));
    // Send the phase command immediately if enabled and connected
    if (isSerialConnected && strobeState.isEnabled) {
      dispatch(sendSerialData(`strobe set phase ${phase}`));
    }
  };

  // Manual send function for when accordion items are clicked
  const sendStrobeSettings = () => {
    if (isSerialConnected) {
      if (strobeState.isEnabled) {
        dispatch(sendSerialData('strobe start'));
      } else {
        dispatch(sendSerialData('strobe stop'));
      }

      if (strobeState.isEnabled) {
        dispatch(sendSerialData(`strobe set frequency ${strobeState.frequency}`));

        const calculatedExposure = (1 / strobeState.frequency) * (strobeState.exposure / 100) * 1000;
        dispatch(sendSerialData(`strobe set exposure ${calculatedExposure}`));

        dispatch(sendSerialData(`strobe set phase ${strobeState.phase}`));
      }
    }
  };

  return {
    ...strobeState,
    isSerialConnected,
    toggleStrobe,
    toggleStrobeType,
    setDetune,
    setFrequency,
    setExposure,
    setPhase,
    sendStrobeSettings,
  };
};
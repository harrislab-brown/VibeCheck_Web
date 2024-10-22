// src/features/sensorSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SensorState {
  isEnabled: boolean;
  accelerationRange: string;
  sampleRate: string;
  channel_num: number;
}

export interface SensorStateMap {
  [key: number]: SensorState;
}

const initialState: SensorStateMap = {
  0: { isEnabled: false, accelerationRange: '4', sampleRate: '52', channel_num: 0 },
  1: { isEnabled: false, accelerationRange: '4', sampleRate: '52', channel_num: 2 },
  2: { isEnabled: false, accelerationRange: '4', sampleRate: '52', channel_num: 4 },
};

export const sensorSlice = createSlice({
  name: 'sensor',
  initialState,
  reducers: {
    toggleSensor: (state, action: PayloadAction<number>) => {
      const accelNumber = action.payload;
      state[accelNumber].isEnabled = !state[accelNumber].isEnabled;
    },
    setAccelerationRange: (state, action: PayloadAction<{ accelNumber: number; range: string }>) => {
      const { accelNumber, range } = action.payload;
      state[accelNumber].accelerationRange = range;
    },
    setSampleRate: (state, action: PayloadAction<{ accelNumber: number; rate: string }>) => {
      const { accelNumber, rate } = action.payload;
      state[accelNumber].sampleRate = rate;
    },
  },
});

export const { toggleSensor, setAccelerationRange, setSampleRate } = sensorSlice.actions;

export default sensorSlice.reducer;
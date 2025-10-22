import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PlotSettings {
  timeWindowMs: number; // Time window in milliseconds for data display
  autoRange: boolean;
  yMin: number;
  yMax: number;
  triggerChannel: number;
  triggerAxis: 'x' | 'y' | 'z';
  triggerLevel: number;
  useTrigger: boolean;
  isPaused: boolean;
}

const initialState: PlotSettings = {
  timeWindowMs: 500, // Default 0.5 seconds
  autoRange: false,
  yMin: -4,
  yMax: 4,
  triggerChannel: 1,
  triggerAxis: 'z',
  triggerLevel: 1.5,
  useTrigger: false,
  isPaused: false,
};

const plotSlice = createSlice({
  name: 'plot',
  initialState,
  reducers: {
    updatePlotSettings: (state, action: PayloadAction<Partial<PlotSettings>>) => {
      return { ...state, ...action.payload };
    },
    togglePause: (state) => {
      state.isPaused = !state.isPaused;
    }
  },
});

export const { updatePlotSettings, togglePause } = plotSlice.actions;
export default plotSlice.reducer;
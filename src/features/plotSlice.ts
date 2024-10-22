import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PlotSettings {
  windowWidth: number;
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
  windowWidth: 100,
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
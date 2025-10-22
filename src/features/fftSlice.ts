import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type WindowFunction = 'hanning' | 'hamming' | 'blackman' | 'rectangle';
export type AveragingType = 'none' | 'linear' | 'exponential';
export type ScaleType = 'linear' | 'logarithmic';

interface FFTSettings {
  enabled: boolean;
  windowSize: number; // Calculated window size in samples
  targetTimeWindow: number; // Target time window in seconds
  adaptiveWindow: boolean; // Auto-adjust window size based on sample rate
  windowFunction: WindowFunction;
  overlap: number; // 0, 25, 50, 75 (percentage)
  autoFrequencyRange: boolean;
  minFrequency: number;
  maxFrequency: number;
  averaging: AveragingType;
  averagingFactor: number; // 0.1 to 1.0
  scaleType: ScaleType;
  selectedSensors: number[]; // Which sensors to show FFT for
  peakDetection: boolean;
  peakThreshold: number; // Minimum peak height (relative to max)
  peakMinDistance: number; // Minimum frequency separation between peaks (Hz)
  peakMaxCount: number; // Maximum number of peaks to show
}

const initialState: FFTSettings = {
  enabled: false,
  windowSize: 512,  // Will be calculated adaptively
  targetTimeWindow: 1.5, // 1.5 seconds target time window
  adaptiveWindow: true, // Enable adaptive window sizing
  windowFunction: 'hanning',
  overlap: 50,
  autoFrequencyRange: true,
  minFrequency: 0,
  maxFrequency: 25, // Will be dynamically updated to floor(sampleRate/2)
  averaging: 'exponential',
  averagingFactor: 0.2,
  scaleType: 'logarithmic',
  selectedSensors: [0],
  peakDetection: false,
  peakThreshold: 0.30, // 30% of max magnitude
  peakMinDistance: 5, // 5 Hz minimum separation
  peakMaxCount: 3, // Show up to 3 peaks
};

const fftSlice = createSlice({
  name: 'fft',
  initialState,
  reducers: {
    setEnabled: (state, action: PayloadAction<boolean>) => {
      state.enabled = action.payload;
    },
    setWindowSize: (state, action: PayloadAction<number>) => {
      state.windowSize = action.payload;
    },
    setTargetTimeWindow: (state, action: PayloadAction<number>) => {
      state.targetTimeWindow = action.payload;
    },
    setAdaptiveWindow: (state, action: PayloadAction<boolean>) => {
      state.adaptiveWindow = action.payload;
    },
    updateWindowSizeFromSampleRate: (state, action: PayloadAction<number>) => {
      if (state.adaptiveWindow && action.payload > 0 && state.targetTimeWindow > 0) {
        // Calculate window size to achieve target time window
        const targetSamples = Math.round(action.payload * state.targetTimeWindow);
        console.log(`FFT Debug: Target samples: ${targetSamples} (${action.payload} Hz × ${state.targetTimeWindow}s)`);

        if (targetSamples > 0) {
          // Round to nearest power of 2 for FFT efficiency
          const log2Value = Math.log2(targetSamples);
          const windowSize = Math.pow(2, Math.round(log2Value));

          // Constrain to reasonable bounds
          const constrainedSize = Math.min(Math.max(windowSize, 256), 8192);
          console.log(`FFT Debug: Calculated window size: ${constrainedSize} samples`);

          state.windowSize = constrainedSize;
        } else {
          console.warn('FFT Debug: Invalid target samples, keeping current window size');
        }
      }
    },
    setWindowFunction: (state, action: PayloadAction<WindowFunction>) => {
      state.windowFunction = action.payload;
    },
    setOverlap: (state, action: PayloadAction<number>) => {
      state.overlap = action.payload;
    },
    setAutoFrequencyRange: (state, action: PayloadAction<boolean>) => {
      state.autoFrequencyRange = action.payload;
    },
    setMinFrequency: (state, action: PayloadAction<number>) => {
      state.minFrequency = action.payload;
    },
    setMaxFrequency: (state, action: PayloadAction<number>) => {
      state.maxFrequency = action.payload;
    },
    setAveraging: (state, action: PayloadAction<AveragingType>) => {
      state.averaging = action.payload;
    },
    setAveragingFactor: (state, action: PayloadAction<number>) => {
      state.averagingFactor = action.payload;
    },
    setScaleType: (state, action: PayloadAction<ScaleType>) => {
      state.scaleType = action.payload;
    },
    setSelectedSensors: (state, action: PayloadAction<number[]>) => {
      state.selectedSensors = action.payload;
    },
    updateMaxFrequencyFromSampleRate: (state, action: PayloadAction<number>) => {
      const nyquistFreq = Math.floor(action.payload / 2);
      state.maxFrequency = nyquistFreq;
    },
    setPeakDetection: (state, action: PayloadAction<boolean>) => {
      state.peakDetection = action.payload;
    },
    setPeakThreshold: (state, action: PayloadAction<number>) => {
      state.peakThreshold = action.payload;
    },
    setPeakMinDistance: (state, action: PayloadAction<number>) => {
      state.peakMinDistance = action.payload;
    },
    setPeakMaxCount: (state, action: PayloadAction<number>) => {
      state.peakMaxCount = action.payload;
    },
  },
});

export const {
  setEnabled,
  setWindowSize,
  setTargetTimeWindow,
  setAdaptiveWindow,
  updateWindowSizeFromSampleRate,
  setWindowFunction,
  setOverlap,
  setAutoFrequencyRange,
  setMinFrequency,
  setMaxFrequency,
  setAveraging,
  setAveragingFactor,
  setScaleType,
  setSelectedSensors,
  updateMaxFrequencyFromSampleRate,
  setPeakDetection,
  setPeakThreshold,
  setPeakMinDistance,
  setPeakMaxCount,
} = fftSlice.actions;

export default fftSlice.reducer;
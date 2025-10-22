import { fft } from 'fft-js';
import { WindowFunction } from '../features/fftSlice';
import { DataPoint } from './dataParser';

export interface Peak {
  frequency: number;
  magnitude: number;
  index: number;
}

export interface FFTResult {
  frequencies: number[];
  magnitudes: number[];
  phases: number[];
  sampleRate: number;
  peaks?: Peak[];
}

// Window functions
function applyWindow(data: number[], windowFunction: WindowFunction): number[] {
  const N = data.length;
  const windowed = new Array(N);

  switch (windowFunction) {
    case 'hanning':
      for (let i = 0; i < N; i++) {
        windowed[i] = data[i] * (0.5 - 0.5 * Math.cos(2 * Math.PI * i / (N - 1)));
      }
      break;
    case 'hamming':
      for (let i = 0; i < N; i++) {
        windowed[i] = data[i] * (0.54 - 0.46 * Math.cos(2 * Math.PI * i / (N - 1)));
      }
      break;
    case 'blackman':
      for (let i = 0; i < N; i++) {
        const term = 2 * Math.PI * i / (N - 1);
        windowed[i] = data[i] * (0.42 - 0.5 * Math.cos(term) + 0.08 * Math.cos(2 * term));
      }
      break;
    case 'rectangle':
    default:
      return data.slice(); // No windowing
  }

  return windowed;
}

// Convert complex FFT result to magnitude and phase
function processFFTResult(fftResult: any[], sampleRate: number): FFTResult {
  const N = fftResult.length;
  const nyquistIndex = Math.floor(N / 2);
  const frequencies = new Array(nyquistIndex);
  const magnitudes = new Array(nyquistIndex);
  const phases = new Array(nyquistIndex);

  for (let i = 0; i < nyquistIndex; i++) {
    frequencies[i] = (i * sampleRate) / N;

    const real = fftResult[i][0];
    const imag = fftResult[i][1];

    magnitudes[i] = Math.sqrt(real * real + imag * imag);
    phases[i] = Math.atan2(imag, real);
  }

  return { frequencies, magnitudes, phases, sampleRate };
}

// Calculate sample rate from timestamps (in microseconds)
function calculateSampleRate(timestamps: number[]): number {
  if (timestamps.length < 2) return 1000; // Default fallback

  const intervals = [];
  for (let i = 1; i < Math.min(timestamps.length, 100); i++) {
    intervals.push(timestamps[i] - timestamps[i - 1]);
  }

  // Convert from microseconds to Hz
  const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
  const sampleRate = 1000000 / avgInterval; // Convert microseconds to Hz

  console.log(`FFT Debug: Avg interval: ${avgInterval} µs, Sample rate: ${sampleRate} Hz`);
  return sampleRate;
}

// Main FFT processing function
export function computeFFT(
  dataPoints: DataPoint[],
  axis: 'x' | 'y' | 'z',
  windowSize: number,
  windowFunction: WindowFunction,
  _overlap: number = 50 // TODO: Implement overlap functionality
): FFTResult | null {
  if (dataPoints.length < windowSize) {
    console.log(`FFT Debug: Not enough data points. Have: ${dataPoints.length}, Need: ${windowSize}`);
    return null;
  }

  // Extract the specified axis data
  const axisData = dataPoints.map(point => point[axis]);
  const timestamps = dataPoints.map(point => point.timestamp);

  console.log(`FFT Debug: Processing ${axis} axis, ${axisData.length} data points`);
  console.log(`FFT Debug: Sample data range: ${Math.min(...axisData).toFixed(3)} to ${Math.max(...axisData).toFixed(3)}`);

  // Calculate sample rate
  const sampleRate = calculateSampleRate(timestamps);

  // Apply windowing to the most recent data
  const startIndex = Math.max(0, axisData.length - windowSize);
  const windowedData = applyWindow(
    axisData.slice(startIndex, startIndex + windowSize),
    windowFunction
  );

  // Ensure we have exactly windowSize samples
  if (windowedData.length !== windowSize) {
    console.log(`FFT Debug: Window size mismatch. Expected: ${windowSize}, Got: ${windowedData.length}`);
    return null;
  }

  try {
    // Compute FFT
    const fftResult = fft(windowedData);

    // Process result
    const result = processFFTResult(fftResult, sampleRate);
    console.log(`FFT Debug: Frequency range: ${result.frequencies[0].toFixed(2)} to ${result.frequencies[result.frequencies.length-1].toFixed(2)} Hz`);
    console.log(`FFT Debug: Max magnitude: ${Math.max(...result.magnitudes).toFixed(3)}`);

    return result;
  } catch (error) {
    console.error('FFT computation error:', error);
    return null;
  }
}

// Apply averaging to FFT results
export function applyAveraging(
  currentMagnitudes: number[],
  previousMagnitudes: number[] | null,
  averagingType: 'none' | 'linear' | 'exponential',
  factor: number = 0.8
): number[] {
  if (averagingType === 'none' || !previousMagnitudes) {
    return currentMagnitudes;
  }

  const averaged = new Array(currentMagnitudes.length);

  for (let i = 0; i < currentMagnitudes.length; i++) {
    if (averagingType === 'linear') {
      averaged[i] = (currentMagnitudes[i] + (previousMagnitudes[i] || 0)) / 2;
    } else if (averagingType === 'exponential') {
      averaged[i] = factor * (previousMagnitudes[i] || 0) + (1 - factor) * currentMagnitudes[i];
    }
  }

  return averaged;
}

// Convert magnitude to dB scale
export function convertToLogScale(magnitudes: number[]): number[] {
  return magnitudes.map(mag => {
    const db = 20 * Math.log10(Math.max(mag, 1e-10)); // Avoid log(0)
    return isFinite(db) ? db : -200; // Cap minimum at -200 dB
  });
}

// Peak detection algorithm
export function findPeaks(
  frequencies: number[],
  magnitudes: number[],
  threshold: number = 0.1,
  minDistance: number = 5,
  maxCount: number = 5
): Peak[] {
  if (frequencies.length !== magnitudes.length || frequencies.length < 3) {
    return [];
  }

  const peaks: Peak[] = [];
  const maxMagnitude = Math.max(...magnitudes);
  const minPeakHeight = maxMagnitude * threshold;

  // Find local maxima
  for (let i = 1; i < magnitudes.length - 1; i++) {
    const current = magnitudes[i];
    const prev = magnitudes[i - 1];
    const next = magnitudes[i + 1];

    // Check if it's a local maximum and above threshold
    if (current > prev && current > next && current >= minPeakHeight) {
      peaks.push({
        frequency: frequencies[i],
        magnitude: current,
        index: i
      });
    }
  }

  // Sort by magnitude (descending)
  peaks.sort((a, b) => b.magnitude - a.magnitude);

  // Apply minimum distance constraint
  const filteredPeaks: Peak[] = [];
  for (const peak of peaks) {
    let tooClose = false;
    for (const existingPeak of filteredPeaks) {
      if (Math.abs(peak.frequency - existingPeak.frequency) < minDistance) {
        tooClose = true;
        break;
      }
    }
    if (!tooClose) {
      filteredPeaks.push(peak);
    }

    // Limit to maxCount peaks
    if (filteredPeaks.length >= maxCount) {
      break;
    }
  }

  // Sort by frequency for consistent display
  return filteredPeaks.sort((a, b) => a.frequency - b.frequency);
}
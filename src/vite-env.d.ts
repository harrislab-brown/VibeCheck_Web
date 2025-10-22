/// <reference types="vite/client" />

declare module 'fft-js' {
  export function fft(input: number[]): number[][];
  export function ifft(input: number[][]): number[][];
  export const util: {
    fftMag(fftBins: number[][]): number[];
    fftPhase(fftBins: number[][]): number[];
  };
}

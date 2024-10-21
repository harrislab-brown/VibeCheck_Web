// src/features/wavegenSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface WavegenState {
    isEnabled: boolean;
    amplitude: number;
    frequency: number;
    waveform: string;
}

const initialState: WavegenState = {
    isEnabled: false,
    amplitude: 0.5,
    frequency: 60,
    waveform: 'sine',
}

const validWaveforms = ['sine', 'square', 'triangle', 'sawtooth'];

export const wavegenSlice = createSlice({
    name: 'wavegen',
    initialState,
    reducers: {
        toggleWavegen: (state) => {
            state.isEnabled = !state.isEnabled;
        },
        setFrequency: (state, action: PayloadAction<{frequency: number}>) => {
            const {frequency} = action.payload;
            state.frequency = frequency;
        },
        setAmplitude: (state, action: PayloadAction<{amplitude: number}>) => {
            const {amplitude} = action.payload;
            state.amplitude = amplitude;
        },
        setWaveform: (state, action: PayloadAction<{waveform: string}>) => {
            const {waveform} = action.payload;
            if(validWaveforms.includes(waveform)){
                state.waveform = waveform;
            }
        }
    }
});

export const { toggleWavegen, setFrequency, setAmplitude, setWaveform } = wavegenSlice.actions;

export default wavegenSlice.reducer;
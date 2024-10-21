import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface StrobeState {
    isEnabled: boolean;
    frequency: number;
    exposure: number;
    phase: number;
}

const initialState: StrobeState = {
    isEnabled: false,
    frequency: 1,  // Default frequency of 1 Hz
    exposure: 50,  // Default exposure of 50%
    phase: 0,      // Default phase of 0 degrees
}

export const strobeSlice = createSlice({
    name: 'strobe',
    initialState,
    reducers: {
        toggleStrobe: (state) => {
            state.isEnabled = !state.isEnabled;
        },
        setFrequency: (state, action: PayloadAction<number>) => {
            state.frequency = action.payload;
        },
        setExposure: (state, action: PayloadAction<number>) => {
            state.exposure = action.payload;
        },
        setPhase: (state, action: PayloadAction<number>) => {
            state.phase = action.payload;
        }
    }
});

export const { toggleStrobe, setFrequency, setExposure, setPhase } = strobeSlice.actions;

export default strobeSlice.reducer;
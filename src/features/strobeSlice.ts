import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface StrobeState {
    isEnabled: boolean;
    frequency: number;
    exposure: number;
    phase: number;
    detune: number;
    detuning: boolean;
}

const initialState: StrobeState = {
    isEnabled: false,
    frequency: 60,  // Default frequency of 1 Hz
    exposure: 5,  // Default exposure of 50%
    phase: 0,      // Default phase of 0 degrees
    detune: 0,
    detuning: false,
}

export const strobeSlice = createSlice({
    name: 'strobe',
    initialState,
    reducers: {
        toggleStrobe: (state) => {
            state.isEnabled = !state.isEnabled;
        },
        toggleStrobeType: (state) => {
            state.detuning = !state.detuning
        },
        setDetune:(state, action: PayloadAction<number>) => {
            //instead of getting wavegen frequency every time just change by the difference
            const dif  =  action.payload - state.detune 
            state.frequency = state.frequency + dif
            state.detune = action.payload;
            
        },
        setStrobeFrequency: (state, action: PayloadAction<number>) => {
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

export const { toggleStrobe, toggleStrobeType, setDetune, setStrobeFrequency, setExposure, setPhase } = strobeSlice.actions;

export default strobeSlice.reducer;
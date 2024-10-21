// src/features/fileSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FileState {
  saveLocation: string | null;
  isRecording: boolean;
}

const initialState: FileState = {
  saveLocation: null,
  isRecording: false,
};

const fileSlice = createSlice({
  name: 'file',
  initialState,
  reducers: {
    setSaveLocation: (state, action: PayloadAction<string>) => {
      state.saveLocation = action.payload;
    },
    setRecording: (state, action: PayloadAction<boolean>) => {
      state.isRecording = action.payload;
    },
  },
});

export const { setSaveLocation, setRecording } = fileSlice.actions;
export default fileSlice.reducer;
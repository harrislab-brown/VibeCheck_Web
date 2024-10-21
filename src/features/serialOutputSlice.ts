// src/features/serialOutputSlice.ts

import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { SerialService } from '../services/SerialService';

export interface SerialOutputState {
  lastSentMessage: string | null;
  error: string | null;
}

const initialState: SerialOutputState = {
  lastSentMessage: null,
  error: null,
};

export const sendSerialData = createAsyncThunk(
  'serialOutput/sendData',
  async (message: string, { extra }) => {
    const { serialService } = extra as { serialService: SerialService };
    await serialService.sendData(message);
    console.log(message);
    return message;
  }
);

const serialOutputSlice = createSlice({
  name: 'serialOutput',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sendSerialData.fulfilled, (state, action) => {
        state.lastSentMessage = action.payload;
        state.error = null;
      })
      .addCase(sendSerialData.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to send data';
      });
  },
});

export const serialOutputReducer = serialOutputSlice.reducer;
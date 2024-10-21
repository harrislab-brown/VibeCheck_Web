// src/features/systemStatus/systemStatusSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SystemStatusState {
  message: string;
}

const initialState: SystemStatusState = {
  message: 'System ready.',
};

const systemStatusSlice = createSlice({
  name: 'systemStatus',
  initialState,
  reducers: {
    setStatusMessage: (state, action: PayloadAction<string>) => {
      state.message = action.payload;
    },
    appendStatusMessage: (state, action: PayloadAction<string>) => {
      state.message += '\n' + action.payload;
    },
  },
});

export const { setStatusMessage, appendStatusMessage } = systemStatusSlice.actions;
export default systemStatusSlice.reducer;
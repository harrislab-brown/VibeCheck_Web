// src/features/serial/serialSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ChannelData } from '../utils/dataParser';
import { SerialService } from '../services/SerialService';
import { setStatusMessage, appendStatusMessage } from './systemStatusSlice';
import { DataProcessingService } from '../services/DataProcessingService';

export interface SerialState {
  isConnected: boolean;
  error: string | null;
  isBrowserCompatible: boolean;
}

const initialState: SerialState = {
  isConnected: false,
  error: null,
  isBrowserCompatible: false,
};

export const checkBrowserCompatibility = createAsyncThunk(
  'serial/checkBrowserCompatibility',
  async (_, {dispatch}) => {
    const compatibility = ('serial' in navigator ) ? true : false;
    if (!compatibility){
        dispatch(setStatusMessage('Browser not compatible with WebSerial API. Please use Chrome.'))
    }else{
        dispatch(setStatusMessage('Browser is compatible with WebSerial.'))
    }
    return compatibility;  }
);

export const connectSerial = createAsyncThunk(
  'serial/connect',
  async (baudRate: number, { getState, dispatch, extra }) => {
    const state = getState() as { serial: SerialState };
    const { serialService } = extra as { serialService: SerialService };
    
    if (!state.serial.isBrowserCompatible) {
        dispatch(setStatusMessage('Error: Browser is not compatible with WebSerial'));
        throw new Error('Browser is not compatible with WebSerial');
      }

    try {
      await serialService.connect(baudRate);
      dispatch(setStatusMessage(`Serial port connected at ${baudRate} baud`));

      return true;
    } catch (error) {
      throw error;
    }
  }
);

export const disconnectSerial = createAsyncThunk(
  'serial/disconnect',
  async (_, { dispatch, extra }) => {
    const { serialService } = extra as { serialService: SerialService };

    try {
      await serialService.disconnect();
      dispatch(setStatusMessage('Serial port disconnected'))
      return true;
    } catch (error) {
      // Type guard to check if error is an Error object
      if (error instanceof Error) {
        dispatch(appendStatusMessage(`Error disconnecting from serial port: ${error.message}`));
      } else {
        dispatch(appendStatusMessage(`Error disconnecting from serial port: Unknown error`));
      }
      throw error;
    }
  }
);


const serialSlice = createSlice({
  name: 'serial',
  initialState,
  reducers: {
    setConnected: (state) => {
      state.isConnected = true;
      state.error = null;
    },
    setDisconnected: (state) => {
      state.isConnected = false;
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    setBrowserCompatibility: (state, action: PayloadAction<boolean>) => {
      state.isBrowserCompatible = action.payload;
    },

  },
  extraReducers: (builder) => {
    builder
      .addCase(checkBrowserCompatibility.fulfilled, (state, action) => {
        state.isBrowserCompatible = action.payload;
      })
      .addCase(connectSerial.fulfilled, (state) => {
        state.isConnected = true;
        state.error = null;
      })
      .addCase(connectSerial.rejected, (state, action) => {
        state.isConnected = false;
        state.error = action.error.message || 'Failed to connect';
      })
      .addCase(disconnectSerial.fulfilled, (state) => {
        state.isConnected = false;
        state.error = null;
      })
      .addCase(disconnectSerial.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to disconnect';
      });
  },
});

export const { 
  setConnected, 
  setDisconnected, 
  setError, 
  setBrowserCompatibility, 
} = serialSlice.actions;

export default serialSlice.reducer;
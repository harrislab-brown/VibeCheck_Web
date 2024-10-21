// src/features/dataSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ChannelData } from '../utils/dataParser'
import { AppThunk } from '../redux/store';


export interface DataState{
    data: ChannelData[];
    dataRetentionLimit: number;
    error: string | null;
}

const initialState: DataState = {
    data: [],
    dataRetentionLimit: 200,
    error: null,
};


export const periodicDataCleanup = (): AppThunk => (dispatch) => {
    const cleanupInterval = setInterval(() => {
      dispatch(cleanupOldData());
    }, 60000); // Run every minute, adjust as needed
  
    // Return a function to clear the interval when needed
    return () => clearInterval(cleanupInterval);
  };


const dataSlice = createSlice({
    name: 'data',
    initialState,
    reducers: {
        receiveData: (state, action: PayloadAction<ChannelData[]>) => {
            action.payload.forEach(newChannelData => {
              const existingChannelIndex = state.data.findIndex(channel => channel.channel === newChannelData.channel);
              if (existingChannelIndex !== -1) {
                // Add new data points
                state.data[existingChannelIndex].dataPoints.push(...newChannelData.dataPoints);
                // Trim excess data points
                if (state.data[existingChannelIndex].dataPoints.length > state.dataRetentionLimit) {
                  state.data[existingChannelIndex].dataPoints = state.data[existingChannelIndex].dataPoints.slice(-state.dataRetentionLimit);
                }
              } else {
                state.data.push(newChannelData);
              }
            });
          },
          setDataRetentionLimit: (state, action: PayloadAction<number>) => {
            state.dataRetentionLimit = action.payload;
          },
          cleanupOldData: (state) => {
            state.data.forEach(channel => {
              if (channel.dataPoints.length > state.dataRetentionLimit) {
                channel.dataPoints = channel.dataPoints.slice(-state.dataRetentionLimit);
              }
            });
          },
    }

});

export const {
    receiveData,
    setDataRetentionLimit,
    cleanupOldData,

} = dataSlice.actions;

export default dataSlice.reducer;
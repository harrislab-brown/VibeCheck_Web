// src/features/dataSlice.ts


//this is where already somewhat processed data is taken from serial data middleware and given to the graph


import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ChannelData } from '../utils/dataParser'
import { AppThunk } from '../redux/store';


export interface DataState{
    data: ChannelData[];
    dataRetentionLimit: number;
    error: string | null;
    SmoothArray: number[]; // this should probably actually be a string stating what kind of filter to use since we probably wont actually use a moving average
    Filtering: Boolean;
    Decimating: Boolean;
    SamplingFactor:number;
}

const initialState: DataState = {
    data: [],
    dataRetentionLimit: 1000, // doesnt need to be this high
    error: null,
    SmoothArray: [.1 , .2, .4, .2, .1],  // this should probably actually be a string stating what kind of filter to use since we probably wont actually use a moving average
    Filtering: false,
    Decimating: false,
    SamplingFactor: 10,


};


export const periodicDataCleanup = (): AppThunk => (dispatch) => {
    const cleanupInterval = setInterval(() => {
      dispatch(cleanupOldData());
    }, 10000); // Run every minute, adjust as needed
  
    // Return a function to clear the interval when needed
    return () => clearInterval(cleanupInterval);
  };


const dataSlice = createSlice({
    name: 'data',
    initialState,
    reducers: {



        //this should just be in serial data middleware? Could instead make this more effecient
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
          }
          
          
          
          
          
          ,







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
          toggleFiltering: (state) => {
          state.Filtering = !state.Filtering;
          },
          setSamplingFactor: (state, action: PayloadAction<number>) =>{
          state.SamplingFactor = action.payload;
          },

}});

export const {
    receiveData,
    setDataRetentionLimit,
    cleanupOldData,
    toggleFiltering,
    setSamplingFactor,


} = dataSlice.actions;

export default dataSlice.reducer;
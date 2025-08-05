// src/features/dataSlice.ts


//this is where already somewhat processed data is taken from serial data middleware and given to the graph


import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ChannelData, DataPoint, XYZData, BufferData, convertToCSV } from '../utils/dataParser'
import { AppThunk } from '../redux/store';
import { RootState} from '../redux/store'
import { FileStreamService } from '../services/FileStreamService';
import { act } from 'react';

var fileStreamService = FileStreamService.getInstance();




export interface DataState{
    data: ChannelData[];
    dataRetentionLimit: number;
    error: string | null;
    Filtering: Boolean;
    Decimating: Boolean;
    SamplingFactor:number;
    DecimationCounter: number;
    cutoff: number;
    order: number;
    secondCutoff: number;
    Filter: number[][];
    Buffer: BufferData[];
    newData: Boolean;
    frequency: number[];
}

const initialState: DataState = {
    data: [],
    dataRetentionLimit: 1000, // doesnt need to be this high
    error: null,
    Filtering: false,
    Decimating: false,
    SamplingFactor: 10,
    DecimationCounter: 0,
    cutoff:100, //I don't know what a reasonable default is
    order: 30, 
    secondCutoff: 200, // might want this to start null
    newData: false,
    Filter: [[0.02863572, 0.14296245, 0.32840183, 0.32840183, 0.14296245, 0.02863572], [0.02863572, 0.14296245, 0.32840183, 0.32840183, 0.14296245, 0.02863572], [0.02863572, 0.14296245, 0.32840183, 0.32840183, 0.14296245, 0.02863572]],
    frequency: [52, 52, 52],
    


    Buffer: [{data:[{x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0}, //each buffer data is a different channel (sensor)
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
    ]} 
    
    , {data:[{x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},{x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},{x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},{x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},{x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},]}
    
    , {data:[{x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},]}],


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



        receiveData: (state, action: PayloadAction<ChannelData[]>) => {
          action.payload.forEach(newChannelData => {
             
              const existingChannelIndex = state.data.findIndex(channel => channel.channel === newChannelData.channel);

              if (existingChannelIndex !== -1) {
                for (let x = 0 ; x < newChannelData.dataPoints.length; x++){
                  var xyz: XYZData = {x:newChannelData.dataPoints[x]['x'], y:newChannelData.dataPoints[x]['y'],z:newChannelData.dataPoints[x]['z']}
                  state.Buffer[newChannelData.channel].data.push(xyz)
                  state.Buffer[newChannelData.channel].data = state.Buffer[newChannelData.channel].data.slice(-100)
                if(state.Decimating){
                    state.DecimationCounter = state.DecimationCounter + 1
                    if (state.DecimationCounter === state.SamplingFactor){
                      state.DecimationCounter = 0
                      var yx = 0
                      var yy = 0
                      var yz = 0
                      for (let h= 0; h < state.Filter[newChannelData.channel].length; h++){
                        console.log(newChannelData.channel)
                       yx = yx + (state.Filter[newChannelData.channel][h])*(state.Buffer[newChannelData.channel].data[state.Filter[newChannelData.channel].length-h].x) // I think these indeces are correct
                       yy = yy + (state.Filter[newChannelData.channel][h])*(state.Buffer[newChannelData.channel].data[state.Filter[newChannelData.channel].length-h].y)
                       yz = yz + (state.Filter[newChannelData.channel][h])*(state.Buffer[newChannelData.channel].data[state.Filter[newChannelData.channel].length-h].z)

                      }
                      var filteredDatapoint: DataPoint = {channel: newChannelData.dataPoints[x].channel, timestamp: newChannelData.dataPoints[x].timestamp, x:yx, y:yy, z:yz }
                      state.data[existingChannelIndex].dataPoints.push(filteredDatapoint);
                      
                      if (fileStreamService.getIsRecording()) {
                        console.log('recorded') 
                        const channelData:ChannelData = {channel:newChannelData.dataPoints[x].channel, dataPoints:[filteredDatapoint]}
                        const csvData = convertToCSV([channelData]);
                        fileStreamService.writeToFile(csvData).catch(error => {// writes to the csv file
                        console.error('Error writing to file:', error);
                        });
                      }
                    }
                  }
                else if (state.Filtering && !state.Decimating){
                  
                 //here goes a check for whether that sensor is being filtered atm  if()

                  var yx = 0
                  var yy = 0
                  var yz = 0
                   for (let h= 0; h < state.Filter[newChannelData.channel].length; h++){
                    
                       yx = yx + (state.Filter[newChannelData.channel][h])*(state.Buffer[newChannelData.channel].data[state.Filter[newChannelData.channel].length-h].x) // I think these indeces are correct
                       yy = yy + (state.Filter[newChannelData.channel][h])*(state.Buffer[newChannelData.channel].data[state.Filter[newChannelData.channel].length-h].y)
                       yz = yz + (state.Filter[newChannelData.channel][h])*(state.Buffer[newChannelData.channel].data[state.Filter[newChannelData.channel].length-h].z)

                   }
                  var filteredDatapoint: DataPoint = {channel: newChannelData.dataPoints[x].channel, timestamp: newChannelData.dataPoints[x].timestamp, x:yx, y:yy, z:yz }
                  state.data[existingChannelIndex].dataPoints.push(filteredDatapoint);
                  if (fileStreamService.getIsRecording()) { 
                    console.log('recorded')
                        const channelData:ChannelData = {channel:newChannelData.dataPoints[x].channel, dataPoints:[filteredDatapoint]}
                        const csvData = convertToCSV([channelData]);
                        fileStreamService.writeToFile(csvData).catch(error => {// writes to the csv file
                        console.error('Error writing to file:', error);
                        });
                      }
                  
                

                }

              


              }
              if (!state.Filtering && !state.Decimating){
                state.data[existingChannelIndex].dataPoints.push(...newChannelData.dataPoints);
                if (fileStreamService.getIsRecording()) { 
                        console.log('recorded')
                        const csvData = convertToCSV([newChannelData]);
                        fileStreamService.writeToFile(csvData).catch(error => {// writes to the csv file
                        console.error('Error writing to file:', error);
                        });
                      }
              }
                
                if (state.data[existingChannelIndex].dataPoints.length > state.dataRetentionLimit) {
                  state.data[existingChannelIndex].dataPoints = state.data[existingChannelIndex].dataPoints.slice(-state.dataRetentionLimit);
                }
              } else {
                state.data.push(newChannelData); //makes the new channel if it doesnt exist?
                
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
          state.DecimationCounter = 0
          if (action.payload != 0){
              state.SamplingFactor = action.payload;
              console.log("new sampling factor")
              console.log(state.SamplingFactor)
          }
        
          },

          setFilter:(state) => {


          },

          setCutoff: (state, action: PayloadAction<number>) =>{
          if (action.payload != 0){
          state.cutoff = action.payload;
          for (var h = 0; h < 3; h++){
          const sigma = state.frequency[h]/(2*Math.PI*state.cutoff)
          const f = new Array(state.order).fill(0);
          var sum = 0
          for (var i = 0; i<f.length; i++){
          
            const x = i - Math.floor((f.length-1)/2) 
            f[i] = Math.exp((-(x*x))/(2*sigma*sigma))
            sum = sum + f[i]
          }

          for (var j = 0; j<f.length; j++){
            f[j] = f[j]/sum


          }
          
          state.Filter[h] = f

          }}


          },
          setOrder: (state, action: PayloadAction<number>) =>{
          if ((action.payload != 0) && action.payload<100){
          for (var h = 0; h < 3; h++){
          const sigma = state.frequency[h]/(2*Math.PI*state.cutoff)
          const f = new Array(state.order).fill(0);
          var sum = 0
          for (var i = 0; i<f.length; i++){
          
            const x = i - Math.floor((f.length-1)/2) 
            f[i] = Math.exp((-(x*x))/(2*sigma*sigma))
            sum = sum + f[i]
          }

          for (var j = 0; j<f.length; j++){
            f[j] = f[j]/sum


          }
          
          state.Filter[h] = f

          }
          }

          },
          setSecondCutoff: (state, action: PayloadAction<number>) =>{
          state.secondCutoff = action.payload;
          },
          toggleDecimating: (state) => {
          state.Decimating = !state.Decimating;
          console.log("decimating toggled")
          console.log(state.Decimating)
          },
         
          setFilterFrequency: (state, action: PayloadAction<number[]>) =>{
            console.log(action.payload)
      
          state.frequency[action.payload[0]] = action.payload[1];
          }
         

}});

export const {
    receiveData,
    setDataRetentionLimit,
    cleanupOldData,
    toggleFiltering,
    setSamplingFactor,
    setCutoff,
    setOrder,
    toggleDecimating,
    setSecondCutoff,
    setFilter,
    setFilterFrequency


} = dataSlice.actions;

export default dataSlice.reducer;
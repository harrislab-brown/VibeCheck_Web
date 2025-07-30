// src/features/dataSlice.ts


//this is where already somewhat processed data is taken from serial data middleware and given to the graph


import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ChannelData, DataPoint, XYZData, BufferData } from '../utils/dataParser'
import { AppThunk } from '../redux/store';


export interface DataState{
    data: ChannelData[];
    dataRetentionLimit: number;
    error: string | null;
    Filtering: Boolean;
    Decimating: Boolean;
    SamplingFactor:number;
    cutoff: number;
    order: number;
    secondCutoff: number;
    Filter: number[];
    Buffer: BufferData[];
}

const initialState: DataState = {
    data: [],
    dataRetentionLimit: 1000, // doesnt need to be this high
    error: null,
    Filtering: false,
    Decimating: false,
    SamplingFactor: 10,
    cutoff:100, //I don't know what a reasonable default is
    order: 1, 
    secondCutoff: 200, // might want this to start null
    Filter: [0.02863572, 0.14296245, 0.32840183, 0.32840183, 0.14296245, 0.02863572],
    //[0.00645125, 0.00852199, 0.0143337,  0.02357083, 0.03548966, 0.04899215,
 //0.06274653, 0.07534035, 0.08544693, 0.0919841,  0.09424502, 0.0919841,
 //0.08544693, 0.07534035, 0.06274653, 0.04899215, 0.03548966, 0.02357083,
 //0.0143337,  0.00852199, 0.00645125],
    Buffer: [{data:[{x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0}, //each buffer data is a different channel (sensor)
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0}
    ]} 
    
    , {data:[{x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0}]}
    
    , {data:[{x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0},
      {x:0,y:0,z:0} , {x:0,y:0,z:0},{x:0,y:0,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:0}]}],


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



        receiveData: (state, action: PayloadAction<ChannelData[]>) => {//need to check that packets of data are all the same channel, otherwise channels are getting mixed up.
            action.payload.forEach(newChannelData => {
              const existingChannelIndex = state.data.findIndex(channel => channel.channel === newChannelData.channel);
         
              if (existingChannelIndex !== -1) {
                for (let x = 0 ; x < newChannelData.dataPoints.length; x++){
                  var xyz: XYZData = {x:newChannelData.dataPoints[x]['x'], y:newChannelData.dataPoints[x]['y'],z:newChannelData.dataPoints[x]['z']}
                  state.Buffer[newChannelData.channel].data.push(xyz)
                                  
                  state.Buffer[newChannelData.channel].data = state.Buffer[newChannelData.channel].data.slice(-30)
                if (state.Filtering){
                 //here goes a check for whether that sensor is being filtered atm  if()

                  var yx = 0
                  var yy = 0
                  var yz = 0
                   for (let h= 0; h < state.Filter.length; h++){
                    
                       yx = yx + (state.Filter[h])*(state.Buffer[newChannelData.channel].data[state.Filter.length-h].x) // I think these indeces are correct
                       yy = yy + (state.Filter[h])*(state.Buffer[newChannelData.channel].data[state.Filter.length-h].y)
                       yz = yz + (state.Filter[h])*(state.Buffer[newChannelData.channel].data[state.Filter.length-h].z)

                   }
                  var filteredDatapoint: DataPoint = {channel: newChannelData.dataPoints[x].channel, timestamp: newChannelData.dataPoints[x].timestamp, x:yx, y:yy, z:yz }
                  state.data[existingChannelIndex].dataPoints.push(filteredDatapoint);

                  
                

                }

              


              }
              if (!state.Filtering){
                state.data[existingChannelIndex].dataPoints.push(...newChannelData.dataPoints);

              }
                
                // Add new data points to the correct channel
                // here is where I want to add the filter and sample
                // filter first, and I neeed to calculate something for each datapoint because of how
                // a butterworth filter works
                //sampling is simple I just keep a universal counter and only add the data point 
                // if counter === decimation factor. 
              
                // Trim excess data points
                if (state.data[existingChannelIndex].dataPoints.length > state.dataRetentionLimit) {
                  state.data[existingChannelIndex].dataPoints = state.data[existingChannelIndex].dataPoints.slice(-state.dataRetentionLimit);
                }
              } else {
                state.data.push(newChannelData); //makes the new channel if it doesnt exist?
                
              }
            });
            console.log("end buffer")
            console.log(state.Buffer)
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
          setCutoff: (state, action: PayloadAction<number>) =>{
          state.cutoff = action.payload;
          },
          setOrder: (state, action: PayloadAction<number>) =>{
          state.order = action.payload;
          },
          setSecondCutoff: (state, action: PayloadAction<number>) =>{
          state.secondCutoff = action.payload;
          },
          toggleDecimating: (state) => {
          state.Decimating = !state.Decimating;
          },
          setFilter: (state, action: PayloadAction<number[]>) =>{
          state.Filter = action.payload;
          },

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


} = dataSlice.actions;

export default dataSlice.reducer;
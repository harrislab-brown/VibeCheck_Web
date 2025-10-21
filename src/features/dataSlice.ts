// src/features/dataSlice.ts


// all data comes through here, and is proccessed here if necessary


import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ChannelData, DataPoint, XYZData, BufferData, convertToCSV } from '../utils/dataParser'
import { AppThunk } from '../redux/store';
import { FileStreamService } from '../services/FileStreamService';

var fileStreamService = FileStreamService.getInstance();


const createInitialBuffer = (): { [channel: number]: BufferData } => {
  const zeroData = Array(100).fill({ x: 0, y: 0, z: 0 });
  return {
    0: { data: [...zeroData] },
    2: { data: [...zeroData] },
    4: { data: [...zeroData] }
  };
};
const setFilter = (frequency: { [channel: number]: number }, cutoff: number, order: number): { [channel: number]: number[] } => {
  const filters: { [channel: number]: number[] } = {};
  const channels = [0, 2, 4];

  for (const channel of channels) {
    const sigma = frequency[channel] / (2 * Math.PI * cutoff);
    const f = new Array(order).fill(0);
    var sum = 0;

    for (var i = 0; i < f.length; i++) {
      const x = i - Math.floor((f.length - 1) / 2);
      f[i] = Math.exp((-(x * x)) / (2 * sigma * sigma));
      sum = sum + f[i];
    }

    for (var j = 0; j < f.length; j++) {
      f[j] = f[j] / sum;
    }

    filters[channel] = f;
  }
  return filters;
}

const getFilteredDatapoint = (filter: { [channel: number]: number[] }, buffer: { [channel: number]: BufferData }, channel: number, timestamp: number): DataPoint => {
  var yx = 0
  var yy = 0
  var yz = 0
  for (let h = 0; h < filter[channel].length; h++) {
    yx = yx + (filter[channel][h]) * (buffer[channel].data[buffer[channel].data.length - h - 1].x)
    yy = yy + (filter[channel][h]) * (buffer[channel].data[buffer[channel].data.length - h - 1].y)
    yz = yz + (filter[channel][h]) * (buffer[channel].data[buffer[channel].data.length - h - 1].z)

  }
  const filteredDatapoint: DataPoint = { channel: channel, timestamp: timestamp, x: yx, y: yy, z: yz }
  return (filteredDatapoint)
}




export interface DataState {
  data: ChannelData[];
  dataRetentionLimit: number;
  error: string | null;
  Filtering: Boolean;
  Decimating: Boolean;
  SamplingFactor: number;
  DecimationCounter: number;
  cutoff: number;
  order: number;
  secondCutoff: number;
  Filter: { [channel: number]: number[] };
  Buffer: { [channel: number]: BufferData };
  newData: Boolean;
  frequency: { [channel: number]: number };
}

const initialState: DataState = {
  data: [],
  dataRetentionLimit: 1000, // doesnt need to be this high, but it does mean you could have 1000 
  // datapoints on the screen at the same time
  error: null,
  Filtering: false,
  Decimating: false,
  SamplingFactor: 10,
  DecimationCounter: 0,
  cutoff: 200,
  order: 99,
  secondCutoff: 200, // currently not used
  newData: false, //currently not used
  Filter: { 0: [], 2: [], 4: [] }, //gets set from default order and cutoff when filter is turned on.
  frequency: { 0: 52, 2: 52, 4: 52 },


  //Create buffer for each channel with 100 zero datapoints for filter initialization
  Buffer: createInitialBuffer()
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


    //serial service calls this function everytime it accumulates 60 datapoints
    receiveData: (state, action: PayloadAction<ChannelData[]>) => {
      action.payload.forEach(newChannelData => {//run a loop for each sensor data is coming in from

        const existingChannelIndex = state.data.findIndex(channel => channel.channel === newChannelData.channel);
        //gets the current sensor the data is from 

        if (existingChannelIndex !== -1) {
          for (let x = 0; x < newChannelData.dataPoints.length; x++) { //iterate through the actual datapoints
            //gets the current datapoint 
            var xyz: XYZData = { x: newChannelData.dataPoints[x]['x'], y: newChannelData.dataPoints[x]['y'], z: newChannelData.dataPoints[x]['z'] }

            //keeps buffer up-to-date. This is always running so the backlog is there when the filter is turned on, but could change for performance
            state.Buffer[newChannelData.channel].data.push(xyz)
            state.Buffer[newChannelData.channel].data = state.Buffer[newChannelData.channel].data.slice(-100)


            if (state.Decimating) {
              state.DecimationCounter = state.DecimationCounter + 1
              if (state.DecimationCounter === state.SamplingFactor) { //if decimating only do something every n datapoints
                state.DecimationCounter = 0
                const filteredDatapoint = getFilteredDatapoint(state.Filter, state.Buffer, newChannelData.channel, newChannelData.dataPoints[x].timestamp)
                state.data[existingChannelIndex].dataPoints.push(filteredDatapoint);
                if (fileStreamService.getIsRecording()) {
                  console.log('recorded')
                  const channelData: ChannelData = { channel: newChannelData.dataPoints[x].channel, dataPoints: [filteredDatapoint] }
                  const csvData = convertToCSV([channelData]);
                  fileStreamService.writeToFile(csvData).catch(error => {// writes to the csv file
                    console.error('Error writing to file:', error);
                  });
                }
              }
            }


            else if (state.Filtering && !state.Decimating) {

              //here goes a check for whether that sensor is being filtered atm  if()

              const filteredDatapoint = getFilteredDatapoint(state.Filter, state.Buffer, newChannelData.channel, newChannelData.dataPoints[x].timestamp)
              state.data[existingChannelIndex].dataPoints.push(filteredDatapoint);
              if (fileStreamService.getIsRecording()) {
                console.log('recorded')
                const channelData: ChannelData = { channel: newChannelData.dataPoints[x].channel, dataPoints: [filteredDatapoint] }
                const csvData = convertToCSV([channelData]);
                fileStreamService.writeToFile(csvData).catch(error => {// writes to the csv file
                  console.error('Error writing to file:', error);
                });
              }



            }




          }
          if (!state.Filtering && !state.Decimating) {
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
      if (state.Filtering) {
        state.Filter = setFilter(state.frequency, state.cutoff, state.order)
      }
    },
    setSamplingFactor: (state, action: PayloadAction<number>) => {
      state.DecimationCounter = 0
      if (action.payload != 0) {
        state.SamplingFactor = action.payload;
        console.log("new sampling factor")
        console.log(state.SamplingFactor)
      }

    },



    setCutoff: (state, action: PayloadAction<number>) => {
      if (action.payload != 0) {
        state.cutoff = action.payload;
        state.Filter = setFilter(state.frequency, state.cutoff, state.order)

      }


    },
    setOrder: (state, action: PayloadAction<number>) => {
      if ((action.payload != 0) && action.payload < 100) {
        state.Filter = setFilter(state.frequency, state.cutoff, state.order)

      }

    },
    setSecondCutoff: (state, action: PayloadAction<number>) => {
      state.secondCutoff = action.payload;
    },
    toggleDecimating: (state) => {
      state.Decimating = !state.Decimating;
      console.log("decimating toggled")
      console.log(state.Decimating)
    },

    setFilterFrequency: (state, action: PayloadAction<number[]>) => {
      console.log(action.payload)

      state.frequency[action.payload[0]] = action.payload[1];
    }


  }
});

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
  setFilterFrequency


} = dataSlice.actions;

export default dataSlice.reducer;
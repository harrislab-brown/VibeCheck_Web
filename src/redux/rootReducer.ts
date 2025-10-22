// src/redux/rootReducer.ts
import { combineReducers } from '@reduxjs/toolkit';
import serialReducer, {SerialState} from '../features/serialSlice';
import systemStatusReducer, {SystemStatusState} from '../features/systemStatusSlice'
import { serialOutputReducer, SerialOutputState } from '../features/serialOutputSlice';
import sensorReducer, {SensorStateMap} from '../features/sensorSlice';
import fileReducer, {FileState} from '../features/fileSlice'
import plotReducer from '../features/plotSlice'
import dataReducer, { DataState } from '../features/dataSlice'
import wavegenReducer, { WavegenState } from '../features/wavegenSlice'
import strobeReducer, { StrobeState } from '../features/strobeSlice'
import fftReducer from '../features/fftSlice'



const rootReducer = combineReducers({
  serial: serialReducer,
  systemStatus: systemStatusReducer,
  serialOutput: serialOutputReducer,
  sensor: sensorReducer,
  file: fileReducer,
  plot: plotReducer,
  data: dataReducer,
  wavegen: wavegenReducer,
  strobe: strobeReducer,
  fft: fftReducer,
});

export interface RootState {
  serial: SerialState;
  systemStatus: SystemStatusState;
  serialOutput: SerialOutputState;
  sensor: SensorStateMap;
  file: FileState;
  data: DataState;
  wavegen: WavegenState;
  strobe: StrobeState;
  fft: ReturnType<typeof fftReducer>;
}

export default rootReducer;
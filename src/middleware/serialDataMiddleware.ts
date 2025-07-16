import { Middleware } from '@reduxjs/toolkit';
import { parseSerialData, Message, ChannelData, convertToCSV } from '../utils/dataParser';
import { setStatusMessage } from '../features/systemStatusSlice';
import { receiveData } from '../features/dataSlice';
import { FileStreamService } from '../services/FileStreamService';
import { RootState } from '../redux/rootReducer';

type SerialDataReceivedAction = {
  type: 'SERIAL_DATA_RECEIVED';
  payload: string;
};

function isSerialDataReceivedAction(action: any): action is SerialDataReceivedAction {
  return action.type === 'SERIAL_DATA_RECEIVED' && typeof action.payload === 'string';
}

const createSerialDataMiddleware = (fileStreamService: FileStreamService): Middleware<{}, RootState> => {
  const middleware: Middleware<{}, RootState> = (store) => (next) => (action) => { //right here the data is taken from the RootState which is what the redux store provides
    if (isSerialDataReceivedAction(action)) {// make sure the action we are recieving is actually a data packet
      // the .payload here is the data attached to a change in state of the system to "allow necessary change"
      const serialData: string = action.payload; // change what is after the = here and we should be good. 
      const parsedMessage: Message = parseSerialData(serialData); //here is where the raw data is started 
      // to be processed, from here on it should already be clear of the redux store.... except we continue to
      //  give things to the redux store to be usen by other programs

      switch (parsedMessage.type) {
        case 'data':
          if (Array.isArray(parsedMessage.data)) {
            const channelData = parsedMessage.data as ChannelData[];
            // store.dispatch(receiveData(channelData));
            //console.log(channelData)

            // here data is given to the redux store (*BAD*) 
            // BTW, the data for the graphs is what is dispatched here, so we will still want to send this 
            // out but not through the redux store
            
            if (fileStreamService.getIsRecording()) { //File containter changes isRecording 
            // which is returned by getIsRecording to true so that this triggers 
            // when the record button is pressed
              const csvData = convertToCSV(channelData);
              fileStreamService.writeToFile(csvData).catch(error => {// writes to the csv file
                console.error('Error writing to file:', error);
                store.dispatch(setStatusMessage(`Error writing to file: ${error.message}`));
              });
            }
          }
          break;
        case 'event':
          console.log('Event message:', parsedMessage.data);
          if (typeof parsedMessage.data === 'string') {
            store.dispatch(setStatusMessage(`Event: ${parsedMessage.data}`));
          }
          break;
        case 'ack':
          console.log('Acknowledgement:', parsedMessage.data);
          // Handle acknowledgements if needed
          break;
        case 'error':
          console.error('Error message:', parsedMessage.data);
          if (typeof parsedMessage.data === 'string') {
            store.dispatch(setStatusMessage(`Error: ${parsedMessage.data}`));
          }
          break;
      }
    }

    return next(action);
  };

  return middleware;
};

export default createSerialDataMiddleware;
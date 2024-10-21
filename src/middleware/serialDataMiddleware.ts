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
  const middleware: Middleware<{}, RootState> = (store) => (next) => (action) => {
    if (isSerialDataReceivedAction(action)) {
      const serialData: string = action.payload;
      const parsedMessage: Message = parseSerialData(serialData);

      switch (parsedMessage.type) {
        case 'data':
          if (Array.isArray(parsedMessage.data)) {
            const channelData = parsedMessage.data as ChannelData[];
            store.dispatch(receiveData(channelData));
            
            if (fileStreamService.getIsRecording()) {
              const csvData = convertToCSV(channelData);
              fileStreamService.writeToFile(csvData).catch(error => {
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
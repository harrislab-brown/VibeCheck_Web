// src/services/SerialService.ts
import store, { AppDispatch, } from '../redux/store';
import { setConnected, setDisconnected, setError } from '../features/serialSlice';
import { UnknownAction } from 'redux';
import { parseSerialData, Message, ChannelData, convertToCSV } from '../utils/dataParser';
import { setStatusMessage } from '../features/systemStatusSlice';
import { receiveData } from '../features/dataSlice';
import { FileStreamService } from '../services/FileStreamService';
import { RootState } from '../redux/rootReducer';
import { dataBuffer } from '../utils/dataBuffer';
import { useAppSelector } from '../redux/hooks';

// Define the action type
type SerialDataReceivedAction = {
    type: 'SERIAL_DATA_RECEIVED';
    payload: string;
  };

export class SerialService { //this class interacts directly with vibecheck through the serial port
    private port: SerialPort | null = null;
    private reader: ReadableStreamDefaultReader<Uint8Array> | null = null;
    private isReading: boolean = false;
    private dispatch: AppDispatch | null = null;
    private writeQueue: string[] = [];
    private isWriting: boolean = false;
    private dataBuffer = '';
    private dataBuffer1 = ''
    private fileStreamService = FileStreamService.getInstance();
    private allData = 'data 60'
    
  
    setDispatch(dispatch: AppDispatch) {
      this.dispatch = dispatch;
    }

    private dispatchAction(action: UnknownAction | SerialDataReceivedAction | ((dispatch: AppDispatch) => void)) {
        if (this.dispatch) {
            if (typeof action === 'function') {
                this.dispatch(action);
            } else {
                this.dispatch(action); // ?? this is the same text but one is blue?
            }
        } else {
            console.error('Dispatch function not set in SerialService');
        }
    }

    async connect(baudRate: number): Promise<void> { //this function reads data from the connection
        try {
            const selectedPort = await navigator.serial.requestPort();
            await selectedPort.open({ baudRate });
            this.port = selectedPort;
            this.dispatchAction(setConnected());
            console.log('Connected to serial port');
            this.readData(); // Start reading data after successful connection
            //need to learn how to use this function so that I can use it outside of the store
            this.sendData('Connect');

        } catch (error) {
            console.error('Error connecting to serial port:', error);
            this.dispatchAction(setError((error as Error).message));
            throw error;
        }
    }

    async disconnect(): Promise<void> {
        this.isReading = false;
        
        if (this.reader) {
            try {
              this.sendData('Disconnect');
                await this.reader.cancel();
            } catch (error) {
                console.error('Error cancelling reader:', error);
            } finally {
                this.reader.releaseLock();
                this.reader = null;
            }
        }
        
        if (this.port) {
            try {
                await this.port.close();
            } catch (error) {
                console.error('Error closing port:', error);
                this.dispatchAction(setError((error as Error).message));
            } finally {
                this.port = null;
                this.dispatchAction(setDisconnected());
                console.log('Disconnected from serial port');
            }
        }
    }

    private async readData(): Promise<void> { //where the data originally gets to the program!
        if (!this.port) {
          throw new Error('Not connected to a serial port');
        }
    
        this.isReading = true;
    
        while (this.port.readable && this.isReading) {
          this.reader = this.port.readable.getReader();
          try {
            while (this.isReading) {
              const { value, done } = await this.reader.read();
              if (done) {
                break;
              }
              const decodedValue = new TextDecoder().decode(value);
              this.processIncomingData(decodedValue); // here is where the data 
              // is sent to the store as a dispatch
            }
          } catch (error) {
            console.error('Error reading data:', error);
            if (this.dispatch) {
              this.dispatch(setError((error as Error).message));
            }
          } finally {
            this.reader.releaseLock();
          }
        }
      }
    
      private processIncomingData(data: string): void {
        this.dataBuffer += data;
        let newlineIndex: number;
        this.dataBuffer1 = this.dataBuffer
        
  


        while ((newlineIndex = this.dataBuffer.indexOf('\n')) !== -1) {
          const completeMessage = this.dataBuffer.slice(0, newlineIndex);
          this.dataBuffer = this.dataBuffer.slice(newlineIndex + 1);
          if (completeMessage.startsWith("data") ){

          
          const concatMessage = completeMessage.replace("data 10", '');
          if (this.allData.length<2*929){
            this.allData = this.allData.concat(concatMessage);
          }
          else{
            const parsedMessage: Message = parseSerialData(this.allData); 
            this.allData = 'data 60';
            this.allData = this.allData.concat(concatMessage);

          
          
          switch (parsedMessage.type) {
            case 'data':
              if (Array.isArray(parsedMessage.data)) {
                const channelData = parsedMessage.data as ChannelData[];

                store.dispatch(receiveData(channelData));
                    if (this.fileStreamService.getIsRecording()) { 
                    const csvData = convertToCSV(channelData);
                    this.fileStreamService.writeToFile(csvData).catch(error => {// writes to the csv file
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

          
        }
      }
      }
    
      private dispatchCompleteMessage(message: string): void {
        if (this.dispatch) {
          const action: SerialDataReceivedAction = {
            type: 'SERIAL_DATA_RECEIVED',
            payload: message.trim()
          };
          this.dispatch(action);
        }
      }
    
    async sendData(message: string): Promise<void> {
        this.writeQueue.push(message);
        if (!this.isWriting) {
          this.processWriteQueue();
        }
      }
    
      private async processWriteQueue() {
        if (this.isWriting || this.writeQueue.length === 0) {
          return;
        }
    
        this.isWriting = true;
    
        while (this.writeQueue.length > 0) {
          const message = this.writeQueue.shift();
          if (!message) continue;
    
          if (!this.port || !this.port.writable) {
            console.error('Not connected to a serial port');
            this.isWriting = false;
            return;
          }
    
          let writer: WritableStreamDefaultWriter<Uint8Array> | null = null;
          try {
            writer = this.port.writable.getWriter();
            const data = new TextEncoder().encode(message + '\n');
            await writer.write(data);
          } catch (error) {
            console.error('Error writing to serial port:', error);
            if (this.dispatch) {
              this.dispatch(setError((error as Error).message));
            }
          } finally {
            if (writer) {
              writer.releaseLock();
            }
          }
        }
    
        this.isWriting = false;
      }
    

    isConnected(): boolean {
        return this.port !== null;
    }
}

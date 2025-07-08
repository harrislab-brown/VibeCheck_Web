import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, CardHeader, Divider } from "@nextui-org/react";
import { FileStreamService } from '../services/FileStreamService';
import { RootState } from '../redux/store';
import { setSaveLocation, setRecording } from '../features/fileSlice';
import { setStatusMessage } from '../features/systemStatusSlice';
import {Switch} from  "@nextui-org/react";


const FileContainer: React.FC = () => {
  const dispatch = useDispatch(); //this is redux stuff (including the next two lines) 
  // that we want to leave as is
  const saveLocation = useSelector((state: RootState) => state.file.saveLocation);
  const isRecording = useSelector((state: RootState) => state.file.isRecording);
  const fileStreamService = FileStreamService.getInstance();

  const handleSelectLocation = async () => {
    try {
      const directory = await window.showDirectoryPicker();
      dispatch(setSaveLocation(directory.name));
      fileStreamService.setOutputDirectory(directory);
      setStatusMessage('Save folder selected');
    } catch (error) {
      console.error('Error selecting directory:', error);
      setStatusMessage('Failed to select file save location')
    }
  };

  const handleToggleRecording = async () => {
    console.log('toggle record')
    if (isRecording) {
      console.log('Stop Recording')
      dispatch(setStatusMessage('Recording stopped'));
      await fileStreamService.stopRecording();
      dispatch(setRecording(false));
    } else {
      console.log('Start Recording')
      const now = new Date().toLocaleString('en-US', {
        timeZone: 'America/New_York',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });

      const [date, time] = now.split(', ');
      const [month, day, year] = date.split('/');
      const timestamp = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}_${time.replace(/:/g, '-')}`;
      dispatch(setStatusMessage(`Recording Started at ${timestamp}`));
      const filename = `data_${timestamp}.csv`;
      await fileStreamService.startRecording(filename); 
      // follow this to get the data out of redux store
      //Conclusion: this changes isRecording to true inside of a filestreamservice instance
      // which triggers serial data middleware to start writing
      dispatch(setRecording(true)); // here is where the data is accesed, 
    }
  };

  return (
    <div className="file-container w-full" style ={{  position: 'relative', bottom:0, right:0}}>
      <Card
      fullWidth={true}
      className='pl-5 pr-5'
      >
        
        <div className='p-5 flex w-full h-full'>
          <Button onClick={handleSelectLocation}>
            Select Save Location
            {/* {saveLocation ? `Save Location: ${saveLocation}` : 'Select Save Location'} */}
          </Button>
          <Button
            onClick={handleToggleRecording}
            disabled={!saveLocation}
            color={isRecording ? "danger" : "primary"}
            >
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </Button>

        </div>
        { saveLocation && <p> Save Location: {saveLocation} </p>}

      </Card>
    </div>
  );
};

export default FileContainer;
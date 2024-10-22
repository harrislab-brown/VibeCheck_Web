import React from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { updatePlotSettings, togglePause } from '../features/plotSlice';
import { Input, Checkbox, Button, Card, CardHeader, Divider } from '@nextui-org/react';
import { RootState } from '../redux/store';
import '../styles/PlotControls.css'

const PlotControlsComponent: React.FC = () => {
  const dispatch = useAppDispatch();
  const isPaused = useAppSelector((state: RootState) => state.plot.isPaused);
  const plotSettings = useAppSelector(state => state.plot);

  const handleChange = (setting: string, value: number | boolean | string) => {
    dispatch(updatePlotSettings({ [setting]: value }));
  };

  const handleTogglePause = () => {
    dispatch(togglePause());
  }

  return (
    <Card className='w-full h-full pl-5 pr-5'>
      <CardHeader>
        Plot Settings
      </CardHeader>
      <Divider/>
        <div className='plotControlsParent'>
      <div className='container1'>
        <Input 
          label = "Window Width"
          type="number" 
          value={plotSettings.windowWidth.toString()} 
          onChange={(e) => handleChange('windowWidth', Number(e.target.value))} 
        />
      </div>
      <div className='container2'>
        <Checkbox 
          type="checkbox" 
          size = 'lg'
          checked={plotSettings.autoRange} 
          onChange={(e) => handleChange('autoRange', e.target.checked)} 
        >Auto Range</Checkbox>
        </div>
        <div className='container3'>
        <Input 
        label = 'Y Min (g)'
          type="number" 
          value={plotSettings.yMin.toString()} 
          onChange={(e) => handleChange('yMin', Number(e.target.value))} 
          className="pb-2"
        />
        <Input 
          label = 'Y Max (g)'
          type="number" 
          value={plotSettings.yMax.toString()} 
          onChange={(e) => handleChange('yMax', Number(e.target.value))} 
        />
      </div>
      <div className='container4'>
        <Button
        color = {plotSettings.isPaused ? "primary" : "default"}
        onClick={handleTogglePause}>
          {plotSettings.isPaused ? "Resume" : "Pause" }
        </Button>
      </div>
    </div>
      </Card>

  );
};

export default PlotControlsComponent;
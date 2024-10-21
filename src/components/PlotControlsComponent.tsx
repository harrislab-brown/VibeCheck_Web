import React from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { updatePlotSettings } from '../features/plotSlice';

const PlotControlsComponent: React.FC = () => {
  const dispatch = useAppDispatch();
  const plotSettings = useAppSelector(state => state.plot);

  const handleChange = (setting: string, value: number | boolean | string) => {
    dispatch(updatePlotSettings({ [setting]: value }));
  };

  return (
    <div>
      <h2>Plot Controls</h2>
      <div>
        <label>
          Window Width:
          <input 
            type="number" 
            value={plotSettings.windowWidth} 
            onChange={(e) => handleChange('windowWidth', Number(e.target.value))} 
          />
        </label>
      </div>
      <div>
        <label>
          Auto Range:
          <input 
            type="checkbox" 
            checked={plotSettings.autoRange} 
            onChange={(e) => handleChange('autoRange', e.target.checked)} 
          />
        </label>
      </div>
      {!plotSettings.autoRange && (
        <>
          <div>
            <label>
              Y Min:
              <input 
                type="number" 
                value={plotSettings.yMin} 
                onChange={(e) => handleChange('yMin', Number(e.target.value))} 
              />
            </label>
          </div>
          <div>
            <label>
              Y Max:
              <input 
                type="number" 
                value={plotSettings.yMax} 
                onChange={(e) => handleChange('yMax', Number(e.target.value))} 
              />
            </label>
          </div>
        </>
      )}
      <div>
        <label>
          Use Trigger:
          <input 
            type="checkbox" 
            checked={plotSettings.useTrigger} 
            onChange={(e) => handleChange('useTrigger', e.target.checked)} 
          />
        </label>
      </div>
      {plotSettings.useTrigger && (
        <>
          <div>
            <label>
              Trigger Channel:
              <input 
                type="number" 
                value={plotSettings.triggerChannel} 
                onChange={(e) => handleChange('triggerChannel', Number(e.target.value))} 
              />
            </label>
          </div>
          <div>
            <label>
              Trigger Axis:
              <select 
                value={plotSettings.triggerAxis} 
                onChange={(e) => handleChange('triggerAxis', e.target.value as 'x' | 'y' | 'z')}
              >
                <option value="x">X</option>
                <option value="y">Y</option>
                <option value="z">Z</option>
              </select>
            </label>
          </div>
          <div>
            <label>
              Trigger Level:
              <input 
                type="number" 
                value={plotSettings.triggerLevel} 
                onChange={(e) => handleChange('triggerLevel', Number(e.target.value))} 
              />
            </label>
          </div>
        </>
      )}
    </div>
  );
};

export default PlotControlsComponent;
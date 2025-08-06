import React, { useEffect }from 'react';
import { Switch, Select, SelectItem } from "@nextui-org/react";
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { useSensorSerial } from '../hooks/useSensor';
import {
  toggleSensor,
  setAccelerationRange,
  setSampleRate,
  SensorState
} from '../features/sensorSlice';
import { RootState } from '../redux/rootReducer';
import { setFilterFrequency } from '../features/dataSlice';

interface SensorSettingsProps {
  accelNumber: number;
}

const SensorSettings: React.FC<SensorSettingsProps> = ({ accelNumber }) => {
  const dispatch = useAppDispatch();
  const sensorState = useAppSelector((state: RootState) => 
    state.sensor ? state.sensor[accelNumber] : undefined
  );

  useEffect(() => {
    // This effect will run whenever sensorState changes
    // You can add any necessary logic here
  }, [sensorState]);

  // check if serial port is connected:
  const isSerialConnected = useAppSelector((state: RootState) => state.serial.isConnected);

  // Use the custom hook for accel state change
  useSensorSerial(accelNumber);

  // Acceleration range in g: 2,4,8,16
  const accelRanges = [
    { label: "±2 g", value: "2" },
    { label: "±4 g", value: "4" },
    { label: "±8 g", value: "8" },
    { label: "±16 g", value: "16" },
  ];

  // Sample rates in Hz: 13, 26, 52, 104, 208, 416, 833, 1660, 3330, 6660
  const sampleRates = [
    { label: "13 Hz", value: "13" },
    { label: "26 Hz", value: "26" },
    { label: "52 Hz", value: "52" },
    { label: "104 Hz", value: "104" },
    { label: "208 Hz", value: "208" },
    { label: "416 Hz", value: "416" },
    { label: "833 Hz", value: "833" },
    { label: "1660 Hz", value: "1660" },
    { label: "3330 Hz", value: "3330" },
    { label: "6660 Hz", value: "6660" },
  ];

  if (!sensorState) {
    return <div>Loading...</div>;
  }

  const { isEnabled, accelerationRange, sampleRate } = sensorState;

  const handleToggle = () => {
    dispatch(toggleSensor(accelNumber));
  };

  const handleAccelerationRangeChange = (value: string) => {
    dispatch(setAccelerationRange({ accelNumber, range: value }));
  };

  const handleSampleRateChange = (value: string) => {
    dispatch(setSampleRate({ accelNumber, rate: value }));
    dispatch(setFilterFrequency([accelNumber , Number(value)])) //send the sampling rate to dataslice to calculate the filter
  };



  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Sensor {accelNumber} (Accel {accelNumber + 1})</h3>
      <div className="mb-4 flex items-center">
        <Switch 
          isSelected={isEnabled}
          onChange={() => dispatch(handleToggle)}
          isDisabled = {!isSerialConnected}
        />
        <span className="ml-2">
          {isEnabled ? 'Enabled' : 'Disabled'}
        </span>
      </div>

      <div className="mb-4">
        <Select
          label="Acceleration Range"
          placeholder="Select a range"
          selectedKeys={accelerationRange ? [accelerationRange] : []}
          onSelectionChange={(keys) => handleAccelerationRangeChange(Array.from(keys)[0] as string)}
          //isDisabled={!isEnabled}
        >
          {accelRanges.map((range) => (
            <SelectItem key={range.value} value={range.value}>
              {range.label}
            </SelectItem>
          ))}
        </Select>
      </div>




      <div className="mb-4">
        <Select
          label="Sample Rate"
          placeholder="Select a sample rate"
          selectedKeys={sampleRate ? [sampleRate] : []}
          onSelectionChange={(keys) => handleSampleRateChange(Array.from(keys)[0] as string)}
        >
          {sampleRates.map((rate) => (
            <SelectItem key={rate.value} value={rate.value}>
              {rate.label}
            </SelectItem>
          ))}
        </Select>
      </div>




      {isEnabled && accelerationRange && sampleRate && (
        <p className="text-sm">
          Current settings: Enabled, Range: {accelRanges.find(r => r.value === accelerationRange)?.label}, 
          Sample Rate: {sampleRates.find(r => r.value === sampleRate)?.label}
        </p>
      )}
    </div>
  );
};

export default SensorSettings;
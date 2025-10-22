import React from 'react';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import {
  Button,
  Switch,
  Select,
  SelectItem,
  Slider,
  Input,
  Card,
  CardBody,
  Divider,
  CheckboxGroup,
  Checkbox
} from "@nextui-org/react";
import {
  setEnabled,
  setWindowSize,
  setTargetTimeWindow,
  setAdaptiveWindow,
  setWindowFunction,
  setOverlap,
  setAutoFrequencyRange,
  setMinFrequency,
  setMaxFrequency,
  setAveraging,
  setAveragingFactor,
  setScaleType,
  setSelectedSensors,
  setPeakDetection,
  setPeakThreshold,
  setPeakMinDistance,
  setPeakMaxCount,
  WindowFunction,
  AveragingType,
  ScaleType
} from '../features/fftSlice';

const FFTSettingsComponent: React.FC = () => {
  const dispatch = useAppDispatch();
  const fftSettings = useAppSelector((state) => state.fft);

  const windowSizeOptions = [
    { value: 512, label: "512" },
    { value: 1024, label: "1024" },
    { value: 2048, label: "2048" },
    { value: 4096, label: "4096" }
  ];

  const windowFunctionOptions: { value: WindowFunction; label: string }[] = [
    { value: 'hanning', label: 'Hanning' },
    { value: 'hamming', label: 'Hamming' },
    { value: 'blackman', label: 'Blackman' },
    { value: 'rectangle', label: 'Rectangle' }
  ];

  const averagingOptions: { value: AveragingType; label: string }[] = [
    { value: 'none', label: 'None' },
    { value: 'linear', label: 'Linear' },
    { value: 'exponential', label: 'Exponential' }
  ];

  const scaleOptions: { value: ScaleType; label: string }[] = [
    { value: 'linear', label: 'Linear' },
    { value: 'logarithmic', label: 'Logarithmic (dB)' }
  ];

  const sensorOptions = [
    { value: "0", label: "Sensor 0" },
    { value: "1", label: "Sensor 1" },
    { value: "2", label: "Sensor 2" }
  ];

  return (
    <div className="space-y-4">
      {/* Enable/Disable FFT */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Enable FFT Analysis</span>
        <Switch
          isSelected={fftSettings.enabled}
          onValueChange={(value) => dispatch(setEnabled(value))}
          color="primary"
          aria-label="Enable FFT Analysis"
        />
      </div>

      {fftSettings.enabled && (
        <>
          <Divider />

          {/* Window Settings */}
          <Card>
            <CardBody className="space-y-3">
              <h4 className="text-sm font-semibold">Window Settings</h4>

              <div className="flex items-center justify-between">
                <span className="text-sm">Adaptive Window Size</span>
                <Switch
                  isSelected={fftSettings.adaptiveWindow}
                  onValueChange={(value) => dispatch(setAdaptiveWindow(value))}
                  size="sm"
                  aria-label="Adaptive window size"
                />
              </div>

              {fftSettings.adaptiveWindow ? (
                <div>
                  <label className="text-sm font-medium">
                    Time Window: {fftSettings.targetTimeWindow.toFixed(1)}s
                  </label>
                  <Slider
                    size="sm"
                    step={0.1}
                    maxValue={5.0}
                    minValue={0.5}
                    value={fftSettings.targetTimeWindow}
                    onChange={(value) => dispatch(setTargetTimeWindow(value as number))}
                    className="mt-2"
                    aria-label="Target time window"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    Current window size: {fftSettings.windowSize} samples
                  </div>
                </div>
              ) : (
                <Select
                  label="Window Size"
                  selectedKeys={[fftSettings.windowSize.toString()]}
                  onSelectionChange={(keys) => {
                    const value = Array.from(keys)[0] as string;
                    dispatch(setWindowSize(parseInt(value)));
                  }}
                  size="sm"
                >
                  {windowSizeOptions.map((option) => (
                    <SelectItem key={option.value.toString()} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </Select>
              )}

              <Select
                label="Window Function"
                selectedKeys={[fftSettings.windowFunction]}
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0] as WindowFunction;
                  dispatch(setWindowFunction(value));
                }}
                size="sm"
              >
                {windowFunctionOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </Select>

              <div>
                <label className="text-sm font-medium">Overlap: {fftSettings.overlap}%</label>
                <Slider
                  size="sm"
                  step={25}
                  marks={[
                    { value: 0, label: "0%" },
                    { value: 25, label: "25%" },
                    { value: 50, label: "50%" },
                    { value: 75, label: "75%" }
                  ]}
                  maxValue={75}
                  minValue={0}
                  value={fftSettings.overlap}
                  onChange={(value) => dispatch(setOverlap(value as number))}
                  className="mt-2"
                  aria-label="Overlap percentage"
                />
              </div>
            </CardBody>
          </Card>

          {/* Frequency Range */}
          <Card>
            <CardBody className="space-y-3">
              <h4 className="text-sm font-semibold">Frequency Range</h4>

              <div className="flex items-center justify-between">
                <span className="text-sm">Auto Range</span>
                <Switch
                  isSelected={fftSettings.autoFrequencyRange}
                  onValueChange={(value) => dispatch(setAutoFrequencyRange(value))}
                  size="sm"
                  aria-label="Auto frequency range"
                />
              </div>

              {!fftSettings.autoFrequencyRange && (
                <div className="flex gap-2">
                  <Input
                    label="Min Freq (Hz)"
                    type="number"
                    value={fftSettings.minFrequency.toString()}
                    onChange={(e) => dispatch(setMinFrequency(parseFloat(e.target.value) || 0))}
                    size="sm"
                  />
                  <Input
                    label="Max Freq (Hz)"
                    type="number"
                    value={fftSettings.maxFrequency.toString()}
                    onChange={(e) => dispatch(setMaxFrequency(parseFloat(e.target.value) || 1000))}
                    size="sm"
                  />
                </div>
              )}
            </CardBody>
          </Card>

          {/* Averaging and Display */}
          <Card>
            <CardBody className="space-y-3">
              <h4 className="text-sm font-semibold">Display Settings</h4>

              <Select
                label="Averaging"
                selectedKeys={[fftSettings.averaging]}
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0] as AveragingType;
                  dispatch(setAveraging(value));
                }}
                size="sm"
              >
                {averagingOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </Select>

              {fftSettings.averaging !== 'none' && (
                <div>
                  <label className="text-sm font-medium">
                    Averaging Factor: {fftSettings.averagingFactor.toFixed(2)}
                  </label>
                  <Slider
                    size="sm"
                    step={0.1}
                    maxValue={1.0}
                    minValue={0.1}
                    value={fftSettings.averagingFactor}
                    onChange={(value) => dispatch(setAveragingFactor(value as number))}
                    className="mt-2"
                    aria-label="Averaging factor"
                  />
                </div>
              )}

              <Select
                label="Scale Type"
                selectedKeys={[fftSettings.scaleType]}
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0] as ScaleType;
                  dispatch(setScaleType(value));
                }}
                size="sm"
              >
                {scaleOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </Select>

            </CardBody>
          </Card>

          {/* Sensor Selection */}
          <Card>
            <CardBody>
              <h4 className="text-sm font-semibold mb-3">Sensor Selection</h4>
              <CheckboxGroup
                value={fftSettings.selectedSensors.map(String)}
                onValueChange={(values) => {
                  dispatch(setSelectedSensors(values.map(Number)));
                }}
                orientation="horizontal"
              >
                {sensorOptions.map((option) => (
                  <Checkbox key={option.value} value={option.value}>
                    {option.label}
                  </Checkbox>
                ))}
              </CheckboxGroup>
            </CardBody>
          </Card>

          {/* Peak Detection */}
          <Card>
            <CardBody className="space-y-3">
              <h4 className="text-sm font-semibold">Peak Detection</h4>

              <div className="flex items-center justify-between">
                <span className="text-sm">Enable Peak Detection</span>
                <Switch
                  isSelected={fftSettings.peakDetection}
                  onValueChange={(value) => dispatch(setPeakDetection(value))}
                  size="sm"
                  aria-label="Enable peak detection"
                />
              </div>

              {fftSettings.peakDetection && (
                <>
                  <div>
                    <label className="text-sm font-medium">
                      Peak Threshold: {(fftSettings.peakThreshold * 100).toFixed(0)}%
                    </label>
                    <Slider
                      size="sm"
                      step={0.05}
                      maxValue={1.0}
                      minValue={0.05}
                      value={fftSettings.peakThreshold}
                      onChange={(value) => dispatch(setPeakThreshold(value as number))}
                      className="mt-2"
                      aria-label="Peak threshold"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Min Distance: {fftSettings.peakMinDistance} Hz
                    </label>
                    <Slider
                      size="sm"
                      step={1}
                      maxValue={50}
                      minValue={1}
                      value={fftSettings.peakMinDistance}
                      onChange={(value) => dispatch(setPeakMinDistance(value as number))}
                      className="mt-2"
                      aria-label="Minimum peak distance"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Max Peaks: {fftSettings.peakMaxCount}
                    </label>
                    <Slider
                      size="sm"
                      step={1}
                      maxValue={10}
                      minValue={1}
                      value={fftSettings.peakMaxCount}
                      onChange={(value) => dispatch(setPeakMaxCount(value as number))}
                      className="mt-2"
                      aria-label="Maximum peak count"
                    />
                  </div>
                </>
              )}
            </CardBody>
          </Card>
        </>
      )}
    </div>
  );
};

export default FFTSettingsComponent;
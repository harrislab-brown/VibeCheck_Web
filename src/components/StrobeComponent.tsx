import React, { useState } from 'react';
import { Switch, Input, Button, Slider } from '@nextui-org/react';
import { useStrobe } from '../hooks/useStrobe';

const StrobeComponent: React.FC = () => {
    const { isEnabled, frequency, exposure, phase, isSerialConnected, toggleStrobe, setFrequency, setExposure, setPhase } = useStrobe();

    const [frequencyInput, setFrequencyInput] = useState(frequency.toString());
    const [exposureInput, setExposureInput] = useState(exposure.toString());

    const handleFrequencySubmit = () => {
        const value = parseFloat(frequencyInput);
        if (!isNaN(value) && value > 0) {
            setFrequency(value);
        } else {
            alert('Please enter a positive number for frequency.');
        }
    };

    const handleExposureSubmit = () => {
        const value = parseFloat(exposureInput);
        if (!isNaN(value) && value >= 0 && value <= 100) {
            setExposure(value);
        } else {
            alert('Please enter a number between 0 and 100 for exposure.');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, submitFunction: () => void) => {
        if (e.key === 'Enter') {
            submitFunction();
        }
    };

    return (
        <div className="p-4 bg-">
            <h2 className="text-xl font-bold mb-4">Strobe Controls</h2>
            <div className="mb-4 flex items-center">
                <Switch 
                    isSelected={isEnabled}
                    onValueChange={toggleStrobe}
                    isDisabled={!isSerialConnected}
                />
                <span className="ml-2">
                    {isEnabled ? 'Enabled' : 'Disabled'}
                </span>
            </div>

            <div className="mb-4 flex items-center">
                <Input
                    label="Frequency (Hz)"
                    type="number"
                    value={frequencyInput}
                    onChange={(e) => setFrequencyInput(e.target.value)}
                    onKeyUp={(e) => handleKeyPress(e, handleFrequencySubmit)}
                    className="max-w-xs mr-2"
                />
                <Button onClick={handleFrequencySubmit} disabled={!isEnabled || !isSerialConnected}>
                    Send
                </Button>
            </div>

            <div className="mb-4 flex items-center">
                <Input
                    label="Exposure (0% - 100%)"
                    type="number"
                    value={exposureInput}
                    onChange={(e) => setExposureInput(e.target.value)}
                    onKeyUp={(e) => handleKeyPress(e, handleExposureSubmit)}
                    className="max-w-xs mr-2"
                />
                <Button onClick={handleExposureSubmit} disabled={!isEnabled || !isSerialConnected}>
                    Send
                </Button>
            </div>

            <div className="mb-4">
                <label className="block mb-2">Phase (-180° to 180°)</label>
                <Slider
                    aria-label="Strobe Phase"
                    step={1}
                    minValue={-180}
                    maxValue={180}
                    value={phase}
                    onChange={(value) => setPhase(value as number)}
                    className="max-w-md"
                />
                <span className="text-lg font-semibold">{phase}°</span> 
            </div>
        </div>
    );
};

export default StrobeComponent;
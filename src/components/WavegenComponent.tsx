import React, { useState } from 'react';
import { Switch, Input, Button,Tabs, Tab } from '@nextui-org/react';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { RootState } from '../redux/rootReducer';
import { useWavegen } from '../hooks/useWavegen';
import { setWaveform } from '../features/wavegenSlice';

const Wavegen: React.FC = () => {
    const dispatch = useAppDispatch();
    const isSerialConnected = useAppSelector((state: RootState) => state.serial.isConnected);
    const { isEnabled, frequency, amplitude, toggleWavegen, setFrequency, setAmplitude } = useWavegen();

    const [frequencyInput, setFrequencyInput] = useState(frequency.toString());
    const [amplitudeInput, setAmplitudeInput] = useState((amplitude * 100).toString());
    
    const handleFrequencySubmit = () => {
        const value = parseFloat(frequencyInput);
        if (!isNaN(value) && value > 0) {
            setFrequency(value);
        } else {
            alert('Please enter a positive number for frequency.');
        }
    };

    const handleAmplitudeSubmit = () => {
        const value = parseFloat(amplitudeInput);
        if (!isNaN(value) && value >= 0 && value <= 100) {
            setAmplitude(value/100 * 0.6); // map value from 0-100 user input to 0-0.6 Max output is 60% of full range
        } else {
            alert('Please enter a number between 0 and 100 for amplitude.');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, submitFunction: () => void) => {
        if (e.key === 'Enter') {
            submitFunction();
        }
    };
    
    const handleWaveformChange = (key: React.Key) => {
        dispatch(setWaveform({ waveform: key as string }));    };


    return (
        <div className="p-4 ">
            <h2 className="text-xl font-bold mb-4">Waveform Generator Controls</h2>
            <div className="mb-4 flex items-center">
                <Switch 
                    isSelected={isEnabled}
                    onValueChange={toggleWavegen}
                    isDisabled={!isSerialConnected}
                />
                <span className="ml-2">
                    {isEnabled ? 'Enabled' : 'Disabled'}
                </span>
            </div>

            <div>
                <Tabs key='waveformTab'
                 className="mb-4 flex items-center"
                 onSelectionChange={handleWaveformChange}>
                    <Tab key='sine' title='Sine' />
                    <Tab key='square' title='Square' />
                    <Tab key='triangle' title='Triangle' />
                    <Tab key='sawtooth' title='Sawtooth' />
                </Tabs>
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
                    label="Amplitude (0.00 - 100.00)"
                    type="number"
                    value={amplitudeInput}
                    onChange={(e) => setAmplitudeInput(e.target.value)}
                    onKeyUp={(e) => handleKeyPress(e, handleAmplitudeSubmit)}
                    className="max-w-xs mr-2"
                />
                <Button onClick={handleAmplitudeSubmit} disabled={!isEnabled || !isSerialConnected}>
                    Send
                </Button>
            </div>
        </div>
    );
};

export default Wavegen;
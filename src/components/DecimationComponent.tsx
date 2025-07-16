import React, { useState } from 'react';
import { Switch, Input, Button, Slider,  ButtonGroup,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
 } from '@nextui-org/react';
import { useAppSelector, useAppDispatch } from '../redux/hooks'
import { toggleFiltering } from '../features/dataSlice';
import { RootState } from '../redux/store';
import { setSamplingFactor } from '../features/dataSlice';

const DecimationComponent: React.FC = () => {
const [samplingFactor, setValue] = useState("");

const dispatch = useAppDispatch();
const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, submitFunction: () => void) => {
        if (e.key === 'Enter') {
            submitFunction();
        }
    };
 const handleFrequencySubmit = () => {
        dispatch(setSamplingFactor(Number(samplingFactor)))
    };

    const handleChange = () => {
        dispatch(setSamplingFactor(Number(samplingFactor)))
    }




    return(

  <Input 
    errorMessage="Please enter a number"
    value={samplingFactor}
    onValueChange={setValue}
    onChange={(e) => handleChange()}
    onKeyUp={(e) => handleKeyPress(e, handleFrequencySubmit)}
    isInvalid={isNaN(Number(samplingFactor)) }
    label="Sampling Factor" placeholder='Enter a number' /> 



    )
}

export default DecimationComponent

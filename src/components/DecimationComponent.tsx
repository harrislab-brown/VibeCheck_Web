import React, { useState } from 'react';
import { Switch, Input, Button, Slider,  ButtonGroup,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
 } from '@nextui-org/react';
import { useAppSelector, useAppDispatch } from '../redux/hooks'
import { toggleDecimating, toggleFiltering } from '../features/dataSlice';
import { RootState } from '../redux/store';
import { setSamplingFactor } from '../features/dataSlice';

const DecimationComponent: React.FC = () => {

const isDecimating = useAppSelector((state: RootState) => state.data.Decimating);

  const handleClick = () => {
        (!isDecimating && dispatch(toggleFiltering()))
        dispatch(toggleDecimating())

    };


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
<div style={{display:'flex' , justifyContent:"space-around", alignItems:"flex-start"} }>
  <Input 
    errorMessage="Please enter a number"
    value={samplingFactor}
    onValueChange={setValue}
    onChange={(e) => handleChange()}
    onKeyUp={(e) => handleKeyPress(e, handleFrequencySubmit)}
    isInvalid={isNaN(Number(samplingFactor)) }
    label="Sampling Factor" placeholder='Enter a number' 
    /> 

    <Button onClick={handleClick}             
        color={isDecimating ? "danger" : "primary"} style={{width: 150, marginLeft:20, marginTop:8}}>
        {isDecimating? "Stop Decimating": "Start Decimating"}
    </Button>
</div>
    )
}

export default DecimationComponent

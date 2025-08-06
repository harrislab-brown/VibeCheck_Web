import React, { useState } from 'react';
import { Switch, Input, Button, Slider,  ButtonGroup,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Card,
  Select,
  SelectItem
 } from '@nextui-org/react';
import { useAppSelector, useAppDispatch } from '../redux/hooks'
import { toggleFiltering, setCutoff, setOrder, setSecondCutoff } from '../features/dataSlice';
import { RootState } from '../redux/store';


export const ChevronDownIcon = () => {
  return (
    <svg fill="none" height="14" viewBox="0 0 24 24" width="14" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M17.9188 8.17969H11.6888H6.07877C5.11877 8.17969 4.63877 9.33969 5.31877 10.0197L10.4988 15.1997C11.3288 16.0297 12.6788 16.0297 13.5088 15.1997L15.4788 13.2297L18.6888 10.0197C19.3588 9.33969 18.8788 8.17969 17.9188 8.17969Z"
        fill="currentColor"
      />
    </svg>
  );
};






const FilterComponent: React.FC = () => {
 
  const orders = [
    { label: "5", value: "5" },
    { label: "10", value: "10" },
    { label: "15", value: "15" },
    { label: "20", value: "20" },
    { label: "25", value: "25" },
    { label: "30", value: "30" },
    { label: "35", value: "35" },
    { label: "40", value: "40" },
    { label: "45", value: "45" },
    { label: "50", value: "50" },
    { label: "55", value: "55" },
    { label: "60", value: "60" },
  ];
    
    const [selectedOption, setSelectedOption] = React.useState(new Set(["lowPass"]));
    const [cutoff, setCutOffValue] = useState("");
    


    const handleChange = () => {
        dispatch(setCutoff(Number(cutoff)))
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, submitFunction: () => void) => {
        if (e.key === 'Enter') {
            submitFunction();
        }
    };
    const handleCutoffSubmit = () => {
        dispatch(setCutoff(Number(cutoff)))
    };




    const [filterOrder, setFilterOrder] = useState("");
    

    const handleChange2 = () => {
        dispatch(setOrder(Math.floor(Number(filterOrder))))
    }

    const handleKeyPress2 = (e: React.KeyboardEvent<HTMLInputElement>, submitFunction: () => void) => {
        if (e.key === 'Enter') {
            submitFunction();
        }
    };
    const handleOrderSubmit2 = () => {
        dispatch(setOrder(Math.floor(Number(filterOrder))))
    };






    const descriptionsMap = {
    lowPass:
      " Standard low-pass Butterworth Filter",
    highPass:
      "Standard high-pass Butterworth Filter",
    band: "Standard band-pass Butterworth Filter",
    cut: "Standard cut-pass Butterworth Filter",
  };

const labelsMap = {
    lowPass: "Low-Pass",
    highPass: "High-Pass",
    band: "Band-Pass",
    cut: "Cut-Pass"
  };

const selectedOptionValue = Array.from(selectedOption)[0];
const dispatch = useAppDispatch();
const isFiltering = useAppSelector((state: RootState) => state.data.Filtering);
    

    const handleClick = () => {
        
        dispatch(toggleFiltering())

    };


return(
    <div>   
      <div style={{display:'flex' , justifyContent:"space-around", alignItems:"center"} }>
      <Button onClick={handleClick}             
      color={isFiltering ? "danger" : "primary"} 
      style={{width: 200}} >
      low pass filter
      </Button>


</div>
      <div> 
            <p> &nbsp; </p>

        <div style={{display:'flex' , justifyContent:"space-around", alignItems:"flex-start" , width:"100"} }>
  <Input 
    errorMessage="Please enter a number"
    value={cutoff}
    onValueChange={setCutOffValue}
    onChange={(e) => handleChange()}
    onKeyUp={(e) => handleKeyPress(e, handleCutoffSubmit)}
    isInvalid={isNaN(Number(cutoff)) }
    label="Cutoff" placeholder='Enter a number' 
    style={{width:100 , marginRight:20}}/> 

    <p> &nbsp; </p>

  <Input 
    errorMessage="Please enter an integer less than 100"
    value={filterOrder}
    onValueChange={setFilterOrder}
    onChange={(e) => handleChange2()}
    onKeyUp={(e) => handleKeyPress2(e, handleOrderSubmit2)}
    isInvalid={   isNaN(Number(filterOrder)) || (Number(filterOrder)>100) }
    label="Order" placeholder='Enter an Integer' 
    style={{width:100 , marginLeft:10}}/> 

        </div>

      </div>





    <p>
        {isFiltering? "Filtering": "Not Filtering " }
    </p>




    </div>



);
}

export default FilterComponent;
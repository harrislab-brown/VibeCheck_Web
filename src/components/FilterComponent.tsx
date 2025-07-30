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
import { toggleFiltering, setCutoff, setOrder, setSecondCutoff, setFilter } from '../features/dataSlice';
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
    { label: "1", value: "1" },
    { label: "2", value: "2" },
    { label: "3", value: "3" },
    { label: "4", value: "4" },
  ];

    const [order, setOrderLabel] = React.useState("");

    const handleOrderChange = (e) => {
    setOrderLabel(e.target.value);
    };
    

    const  setOrderValue = (orderDispatch: string) =>{
      dispatch(setOrder(Number(orderDispatch)))
    }




    const [selectedOption, setSelectedOption] = React.useState(new Set(["lowPass"]));
    const [cutoff, setCutOffValue] = useState("");

    const setFilterValue = (filterDispatch:string) =>{
        dispatch(setFilter([]))    }
    


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




    const [cutoff2, setCutOffValue2] = useState("");
    

    const handleChange2 = () => {
        dispatch(setSecondCutoff(Number(cutoff2)))
    }

    const handleKeyPress2 = (e: React.KeyboardEvent<HTMLInputElement>, submitFunction: () => void) => {
        if (e.key === 'Enter') {
            submitFunction();
        }
    };
    const handleCutoffSubmit2 = () => {
        dispatch(setSecondCutoff(Number(cutoff2)))
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
        dispatch
        dispatch(toggleFiltering())

    };


return(
    <div>   
      <div>
 <ButtonGroup variant="flat" style={{margin: 20}}>
      <Button onClick={handleClick}             
color={isFiltering ? "danger" : "primary"} style={{width: 200}} >{labelsMap[selectedOptionValue]} </Button>
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <Button>
            <ChevronDownIcon />
            Choose Filter
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          disallowEmptySelection
          aria-label="Merge options"
          className="max-w-[300px]"
          selectedKeys={selectedOption}
          selectionMode="single"
          onSelectionChange={setSelectedOption}
          onAction={(keys) => setFilterValue(Array.from(keys)[0] as string)}
        >
          <DropdownItem key="lowPass" description={descriptionsMap["lowPass"]}>
            {labelsMap["lowPass"]}
          </DropdownItem>
          <DropdownItem key="highPass" description={descriptionsMap["highPass"]}>
            {labelsMap["highPass"]}
          </DropdownItem>
          <DropdownItem key="cut" description={descriptionsMap["cut"]}>
            {labelsMap["cut"]} 
          </DropdownItem>
          <DropdownItem key="band" description={descriptionsMap["band"]}>
            {labelsMap["band"]} 
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </ButtonGroup>
    <p>{""}</p>
</div>
      <div> 
        <div style={{display:'flex' , justifyContent:"space-around", alignItems:"flex-start"} }>
  <Input 
    errorMessage="Please enter a number"
    value={cutoff}
    onValueChange={setCutOffValue}
    onChange={(e) => handleChange()}
    onKeyUp={(e) => handleKeyPress(e, handleCutoffSubmit)}
    isInvalid={isNaN(Number(cutoff)) }
    label="Enter Cutoff" placeholder='Enter a number' 
    style={{width:100 , marginRight:20}}/> 

    <p> &nbsp; </p>

  <Input 
    errorMessage="Please enter a number"
    value={cutoff2}
    onValueChange={setCutOffValue2}
    onChange={(e) => handleChange2()}
    onKeyUp={(e) => handleKeyPress2(e, handleCutoffSubmit2)}
    isInvalid={isNaN(Number(cutoff2)) }
    label="Second Cutoff" placeholder='For Cut/Band' 
    style={{width:100 , marginLeft:10}}/> 

        </div>


        <div
        style={{justifyContent:"center", display:'flex', alignItems:'center'}}
        >
    <Select
        className="max-w-xs"
        style={{margin: 10 , width:200,}}
        label="Order"
        placeholder="Choose an Order"
        selectedKeys={order}
        variant="bordered"
        onSelectionChange={(keys) => setOrderValue(Array.from(keys)[0] as string)}
        onChange={handleOrderChange}
      >
        {orders.map((currentorder) => (
          <SelectItem key={currentorder.label}>{currentorder.value}</SelectItem>
        ))}
    </Select>
    </div>
      </div>





    <p>
        {isFiltering? "Filtering": "Not Filtering " }
    </p>




    </div>



);
}

export default FilterComponent;
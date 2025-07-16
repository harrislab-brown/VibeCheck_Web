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
    const [selectedOption, setSelectedOption] = React.useState(new Set(["Smooth"]));

    const descriptionsMap = {
    Smooth:
      " smooth the data, potentially in anticipation of decimation",
    Filter2:
      "description of some other filter",
    Filter3: "description of a third filter",
  };

const labelsMap = {
    Smooth: "Smooth the data",
    Filter2: "Filter 2",
  
    Filter3: "Filter 3"
  };

const selectedOptionValue = Array.from(selectedOption)[0];
const dispatch = useAppDispatch();
const isFiltering = useAppSelector((state: RootState) => state.data.Filtering);
    

    const handleClick = () => {
        
        dispatch(toggleFiltering())

    };


return(
    <div>   
 <ButtonGroup variant="flat">
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
        >
          <DropdownItem key="Smooth" description={descriptionsMap["Smooth"]}>
            {labelsMap["Smooth"]}
          </DropdownItem>
          <DropdownItem key="Filter2" description={descriptionsMap["Filter2"]}>
            {labelsMap["Filter2"]}
          </DropdownItem>
          <DropdownItem key="Filter3" description={descriptionsMap["Filter3"]}>
            {labelsMap["Filter3"]} 
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </ButtonGroup>



    <p>
        {isFiltering? "Filtering": "Not Filtering " }
    </p>
 {/* <Input label="Moving Average Array" placeholder='Enter Array' /> */}
     </div>




);
}

export default FilterComponent;
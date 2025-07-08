import React from 'react';
import { Accordion, AccordionItem, Card, CardHeader, Divider } from "@nextui-org/react";
import SensorSettings from './SensorSettingsComponent';
import SerialInput from './SerialInput';
import Wavegen from './WavegenComponent';
import StrobeComponent from './StrobeComponent';
import SystemStatus from './SystemStatus';
import PlotControlsComponent from './PlotControlsComponent';
import SerialConnect from './SerialConnect';
import FileContainer from './FileContainer';
import Sensors from "./SensorsComponent"

const SettingsAccordion: React.FC = () => {
  return (
    <div >
      <Card
      className='p-5'>
        
      <Accordion 
        selectionMode="multiple" defaultExpandedKeys={["connect"]}
        >
           <AccordionItem key="connect" aria-label="Connect" title={"Serial Connection"}>
          <SerialConnect/>
        </AccordionItem>
        <AccordionItem key="save" aria-label="Save" title={"File management"}>
          <FileContainer />
        </AccordionItem>
        <AccordionItem key="plot" aria-label="Plot" title={"Plot Settings"}>
          <PlotControlsComponent />
        </AccordionItem>
         <AccordionItem key="status" aria-label="Status" title={"System Status"}>
          <SystemStatus />
        </AccordionItem>
         <AccordionItem key="sensors" aria-label="Sensors" title={"Sensors "}>
          <Sensors />
        </AccordionItem>
        <AccordionItem key="wavegen" aria-label="Wavegen" title={"Wavegen"}>
          <Wavegen/>
        </AccordionItem>
        <AccordionItem key="strobe" aria-label="Strobe" title={"Strobe"}>
          <div>
            <StrobeComponent/>
          </div>
        </AccordionItem>
        <AccordionItem key="serial" aria-label="Serial" title={"Serial Input"}>
          <SerialInput />
        </AccordionItem>
        <AccordionItem key="calibration" aria-label="Calibration" title={"Calibration Controls"}>
        </AccordionItem>
          <AccordionItem key="filter" aria-label="Filter" title={"Digital Filter"}>
        </AccordionItem>  
          <AccordionItem key="decimation" aria-label="Decimation" title={"Decimation Controls"}>
        </AccordionItem>  
          <AccordionItem key="triggering" aria-label="Triggering" title={"Triggering Controls"}>
        </AccordionItem>
       
       
        

      </Accordion>
      </Card>
    </div>
  );
};
export default SettingsAccordion;
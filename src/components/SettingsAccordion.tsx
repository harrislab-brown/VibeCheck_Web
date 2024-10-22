import React from 'react';
import { Accordion, AccordionItem, Card, CardHeader, Divider } from "@nextui-org/react";
import SensorSettings from './SensorSettingsComponent';
import SerialInput from './SerialInput';
import Wavegen from './WavegenComponent';
import StrobeComponent from './StrobeComponent';

const SettingsAccordion: React.FC = () => {
  return (
    <div className="max-h-full overflow-auto w-full p-4 padding-20">
      <Card
      className='p-5'>
        <CardHeader>
          <h2>Hardware Settings</h2>
        </CardHeader>
        <Divider/>
      <Accordion 
        selectionMode="multiple"
        >
        <AccordionItem key="sensor0" aria-label="Sensor 0" 
        title={"Sensor 0"} 
        >
          <SensorSettings accelNumber={0} />
        </AccordionItem>
        <AccordionItem key="sensor1" aria-label="Sensor 1" 
          title={"Sensor 1"}>
          <SensorSettings accelNumber={1} />
        </AccordionItem>
        <AccordionItem key="sensor2" aria-label="Sensor 2" 
          title={"Sensor 2"}>
          <SensorSettings accelNumber={2} />
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
      </Accordion>
      </Card>
    </div>
  );
};

export default SettingsAccordion;
// src/components/Layout.tsx
import React from 'react';
import '../styles/Layout.css';
import Logo from './Logo'
import SerialConnect from './SerialConnect';
import SystemStatus from './SystemStatus';
import SettingsAccordion from './SettingsAccordion';
import FileContainer from './FileContainer';
import ChartContainer from './ChartContainer';
import PlotControlsComponent from './PlotControlsComponent';
import { Divider, Switch } from '@nextui-org/react';
import {Card, CardHeader, Button, Spacer,  Accordion, AccordionItem} from "@nextui-org/react";
import Settings from './SettingsCard';
import { useState } from 'react';
import SerialInput from './SerialInput';
import Wavegen from './WavegenComponent';
import StrobeComponent from './StrobeComponent';
import Sensors from "./SensorsComponent";
import FilterComponent from './FilterComponent';
import DecimationComponent from './DecimationComponent';
import ChartComponent from './ChartComponent';




const Layout: React.FC = () => {
    const [selectedKeys, setSelectedKeys] = React.useState(new Set([""]));
    const [selectedKeys2, setSelectedKeys2] = React.useState(new Set([""]));


  return (

    <div className = "layout">
      <div className = "settingsContainer" >
            <div className = "status-settings-files container">
            
                <div className = " max-h-screen overflow-y-auto">
                    <div>
                      <Accordion selectedKey={selectedKeys} onSelectionChange={setSelectedKeys} defaultExpandedKeys={["titleButton"]}>  
                      {/* there is a weird red highlight here that has something to do with typescipt vs javascipt differences. idk apparently its fine */}
                        <AccordionItem key="titleButton" aria-label="Title" title="Settings" classNames={{
                              title: "text-xl font-bold", // Change font size and weight
                                }}>
                        </AccordionItem>
                      </Accordion>

                    </div>
                    <Divider/>  
                   {selectedKeys.size != 0 && <div >
                              <Card
                              className='p-5'>
                                
                              <Accordion selectedKey={selectedKeys2} onSelectionChange={setSelectedKeys2} selectionMode="multiple" defaultExpandedKeys={selectedKeys2}
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
                               
                                  <AccordionItem key="filter" aria-label="Filter" title={"Digital Filters"}>
                                    <FilterComponent/>
                                </AccordionItem>  
                                  <AccordionItem key="decimation" aria-label="Decimation" title={"Decimation"}>
                                    <DecimationComponent/>
                                </AccordionItem>  
                                
                              
                                

                              </Accordion>
                              </Card>
                            </div> }    
                   
                </div>
    
            </div>
      </div>


        {selectedKeys.size != 0 ? <div className = "smallContainter">
            
            
            <div className="plot scrollable container">

              <ChartContainer/>
            </div>
           
        </div>: <div className = "bigContainter">
            
            
            <div className="plot scrollable container">

              <ChartContainer/>
            </div>
           
        </div>}
        
        
        
      
  
    </div>
    
  );
};

export default Layout;

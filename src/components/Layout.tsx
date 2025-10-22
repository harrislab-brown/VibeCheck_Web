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
import SerialInput from './SerialInput';
import Wavegen from './WavegenComponent';
import StrobeComponent from './StrobeComponent';
import Sensors from "./SensorsComponent";
import FFTSettingsComponent from './FFTSettingsComponent';
import { useAutoSettings } from '../hooks/useAutoSettings';

const Layout: React.FC = () => {
    // Auto-send all settings when serial connection is established
    useAutoSettings();

    // Fix 1: Use string arrays instead of Set for NextUI Accordion
    const [selectedKeys, setSelectedKeys] = React.useState<string[]>(["titleButton"]);
    const [selectedKeys2, setSelectedKeys2] = React.useState<string[]>(["connect"]);

    // Fix 2: Proper event handlers for NextUI Accordion
    const handleSelectionChange = (keys: "all" | Set<React.Key>) => {
        if (keys === "all") {
            setSelectedKeys(["titleButton"]);
        } else {
            setSelectedKeys(Array.from(keys) as string[]);
        }
    };

    const handleSelectionChange2 = (keys: "all" | Set<React.Key>) => {
        if (keys === "all") {
            // Handle "all" case if needed
            setSelectedKeys2(["connect", "save", "plot", "status", "sensors", "wavegen", "strobe", "serial", "fft"]);
        } else {
            setSelectedKeys2(Array.from(keys) as string[]);
        }
    };

    return (
        <div className="layout">
            <div className="settingsContainer">
                <div className="status-settings-files container">
                    <div className="max-h-screen overflow-y-auto">
                        <div>
                            {/* Settings title accordion */}
                            <Accordion 
                                selectedKeys={selectedKeys} 
                                onSelectionChange={handleSelectionChange}
                                defaultExpandedKeys={["titleButton"]}
                            >  
                                <AccordionItem 
                                    key="titleButton" 
                                    aria-label="Title" 
                                    title="Settings" 
                                    classNames={{
                                        title: "text-xl font-bold",
                                    }}
                                >
                                </AccordionItem>
                            </Accordion>
                        </div>
                        
                        <Divider/>  
                        
                        {/* Render the settings accordion if the settings accordion is open */}
                        {selectedKeys.length > 0 && selectedKeys.includes("titleButton") && (
                            <div>  
                                <Card className="p-5">
                                    <Accordion 
                                        selectedKeys={selectedKeys2} 
                                        onSelectionChange={handleSelectionChange2}
                                        selectionMode="multiple"
                                        defaultExpandedKeys={selectedKeys2}
                                    >
                                        <AccordionItem key="connect" aria-label="Connect" title="Serial Connection">
                                            <SerialConnect/>
                                        </AccordionItem>
                                        <AccordionItem key="save" aria-label="Save" title="File management">
                                            <FileContainer />
                                        </AccordionItem>
                                        <AccordionItem key="plot" aria-label="Plot" title="Plot Settings">
                                            <PlotControlsComponent />
                                        </AccordionItem>
                                        <AccordionItem key="status" aria-label="Status" title="System Status">
                                            <SystemStatus />
                                        </AccordionItem>
                                        <AccordionItem key="sensors" aria-label="Sensors" title="Sensors">
                                            <Sensors />
                                        </AccordionItem>
                                        <AccordionItem key="wavegen" aria-label="Wavegen" title="Wavegen">
                                            <Wavegen/>
                                        </AccordionItem>
                                        <AccordionItem key="strobe" aria-label="Strobe" title="Strobe">
                                            <div>
                                                <StrobeComponent/>
                                            </div>
                                        </AccordionItem>
                                        <AccordionItem key="serial" aria-label="Serial" title="Serial Input">
                                            <SerialInput />
                                        </AccordionItem>
                                        <AccordionItem key="fft" aria-label="FFT" title="(Experimental) FFT Analysis">
                                            <FFTSettingsComponent />
                                        </AccordionItem>
  
                                    </Accordion>
                                </Card>
                            </div> 
                        )}    
                    </div>
                </div>
            </div>

            {/* Fix 4: Better condition checking (check if title settings accordion is open) */}
            {selectedKeys.length > 0 && selectedKeys.includes("titleButton") ? (
                <div className="smallContainter">
                    <div className="plot scrollable container">
                        <ChartContainer/>
                    </div>
                </div>
            ) : (
                <div className="bigContainter">
                    <div className="plot scrollable container">
                        <ChartContainer/>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Layout;
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
import { Divider } from '@nextui-org/react';

const Layout: React.FC = () => {
  return (
    <div className = "layout">
        <div className = "logo-serial-plot-controls container">
            
            <div className = "logo-serial container">
                <div className="pr-5 pl-5">
                    <Logo />
                </div>
            
                
                <SerialConnect/>

            </div>
            <Divider/>
            <div className="plot scrollable container">
              <ChartContainer/>
            </div>
            <Divider/>
            <div className = 'plot-controls container'>
                <PlotControlsComponent/>
            </div>
        </div>
        <div className = "status-settings-files container">
            <div className = "status container">
                <SystemStatus/>
            </div>
            <Divider/>

            <div className = "settings scrollable container">
            <SettingsAccordion />
            </div>
            <Divider/>

            <div className = "file container">
            
                <FileContainer />

            </div>
        </div>
    </div>
  );
};

export default Layout;

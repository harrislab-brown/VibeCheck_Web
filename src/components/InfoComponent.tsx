// src/components/InfoComponent.tsx

import React from 'react';

const InfoComponent: React.FC = () => {
    return(
        <div style={{padding: "10px"}}>
            <h1>Welcome to VibeCheck_Web!</h1>
            <br/>
            <h2 >To use: </h2>
            <ul>
                <li>  - Connect your VibeCheck to our computer with a USB-C cable</li>
                <li>  - Use the <b>Connect</b> button to open a serial port</li>
                <li>  - Attach a sensor board to your VibeCheck with a JST cable</li>
                <li>  - Enable a sensor from the <b>Sensor #</b> settings dropdown</li>
                <li>  - Set the desired measurement range and sample rate</li>
                <li>  - Select a folder to save data using the <b>Select Save Location</b> button</li>
                <li>  - Begin saving data using the <b>Start Recording</b> button</li>
            </ul>
            <br/>
            <h3>VibeCheck hardware: <a href="https://github.com/harrislab-brown/VibeCheck">VibeCheck GitHub</a></h3>
            <br/>
            <h3>Vibecheck_Web: <a href="https://github.com/eli-silver/vibecheck_web">VibeCheck_Web GitHub</a> </h3>
            
        </div>
    );
};

export default InfoComponent;

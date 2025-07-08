import React, { useState } from 'react';
import {Card, CardHeader, Button, Spacer, Switch, Divider} from "@nextui-org/react";
import SettingsAccordion from './SettingsAccordion';


function OnOffSwitch() {
  const [isSelected, setIsSelected] = React.useState(true);

  return (
    <div className="flex flex-col gap-2">
      <Switch isSelected={isSelected} onValueChange={setIsSelected}>
        
      </Switch>

    </div>
  );
}    


function Settings() {
      const [isSelected, setIsSelected] = React.useState(true);
    return(
    <div className = "status-settings-files container">
            
                <div className = " max-h-screen overflow-y-auto">
                  <Card>     
                    <div>
                        <div className="flex items-center gap-4">
                        <h1 className="text-xxl font-bold ml-6">      Settings  &nbsp;   </h1>
                        <Switch isSelected={isSelected} onValueChange={setIsSelected}/>
                        {/* <p className="text-small text-default-500"> {isSelected ? "click to collapse settings" : "settings collapsed........"}</p> */}
                        {/* <span className="ml-6">
                        {isSelected ? 'Enabled' : 'Disabled'}
                        </span> */}
                        </div>
                    </div>
                    <p>    &nbsp; </p>
                    <Divider/>  

                   {isSelected && <SettingsAccordion /> }    
                   
                  </Card>
                </div>
    
              
                
               
                {/* <div className = "logo-serial container">
                    <div className="pr-5 pl-5"    >
                        <Logo />
                    </div>
    
               </div> */}
            </div>
    )
}

export default Settings;
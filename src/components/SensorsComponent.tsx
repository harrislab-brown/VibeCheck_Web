import {Tabs, Tab, Card, CardBody} from "@nextui-org/react";
import SensorSettings from './SensorSettingsComponent';

export default function Sensors() {
  return (
    <div className="flex w-full flex-col">
      <Tabs aria-label="Sensors">
        <Tab key="sensor0" title="Sensor 0">
          <SensorSettings accelNumber={0} />
        </Tab>
        <Tab key="sensor1" title="Sensor 1">
          <SensorSettings accelNumber={1} />
        </Tab>
        <Tab key="sensor2" title="Sensor 2">
          <SensorSettings accelNumber={2} />
        </Tab>
      </Tabs>
    </div>
  );
}

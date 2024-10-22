// src/components/SystemStatus.tsx
import React, { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Card, CardBody, CardHeader, Divider } from '@nextui-org/react';
import '../styles/SystemStatus.css'

const SystemStatus: React.FC = () => {
  const statusMessage = useSelector((state: RootState) => state.systemStatus.message);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (statusRef.current) {
      statusRef.current.scrollTop = statusRef.current.scrollHeight;
    }
  }, [statusMessage]);

  return (
    <div ref={statusRef} className='systemStatusCardContainer' >
      <Card
      radius = 'sm'
      fullWidth = {true}
      className='pl-5 pr-5'
      >
        <CardHeader className='pb-0 pt-2 px-4 flex-col items-start'>
          System Status
        </CardHeader>
        <Divider/>
        <CardBody className='flex items-center justify-center h-full mt-2 '>
           {statusMessage}

        </CardBody>
      </Card>
    </div>
  );
};

export default SystemStatus;
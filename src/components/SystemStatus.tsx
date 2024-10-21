// src/components/SystemStatus.tsx
import React, { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const SystemStatus: React.FC = () => {
  const statusMessage = useSelector((state: RootState) => state.systemStatus.message);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (statusRef.current) {
      statusRef.current.scrollTop = statusRef.current.scrollHeight;
    }
  }, [statusMessage]);

  return (
    <div ref={statusRef} >
      {statusMessage}
    </div>
  );
};

export default SystemStatus;
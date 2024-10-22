// /src/components/SerialInput.tsx

import React, { useState } from 'react';
import { useAppDispatch } from '../redux/hooks';
import { sendSerialData } from '../features/serialOutputSlice';
import { Input } from '@nextui-org/react'; 

const SerialInput: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const dispatch = useAppDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      dispatch(sendSerialData(inputValue.trim()));
      setInputValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Enter serial data to send..."
        className='pb-5'
      />
    </form>
  );
};

export default SerialInput;
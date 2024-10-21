// src/middleware/serialOutputMiddleware.ts
import { Middleware } from '@reduxjs/toolkit';
import { sendSerialData } from '../features/serialOutputSlice';

const serialOutputMiddleware: Middleware = (store) => (next) => (action) => {
  if (sendSerialData.fulfilled.match(action)) {
    console.log('Serial data sent:', action.payload);
  } else if (sendSerialData.rejected.match(action)) {
    console.error('Failed to send serial data:', action.error);
  }

  return next(action);
};

export default serialOutputMiddleware;
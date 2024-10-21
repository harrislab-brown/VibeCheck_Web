// src/redux/store.ts

import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';
import { SerialService } from '../services/SerialService';
import serialOutputMiddleware from '../middleware/serialOutputMiddleware';
import { FileStreamService } from '../services/FileStreamService';
import createSerialDataMiddleware from '../middleware/serialDataMiddleware';

const serialService = new SerialService();
const fileStreamService = FileStreamService.getInstance();

const serialDataMiddleware = createSerialDataMiddleware(fileStreamService);

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: { serialService, fileStreamService },
      },
    }).concat(serialDataMiddleware, serialOutputMiddleware),
    devTools: {
      trace: true, // Enable trace feature
      traceLimit: 25, // Limit number of stack frames (optional)
    },
});

// Set the dispatch function on the SerialService after store creation
serialService.setDispatch(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export default store;
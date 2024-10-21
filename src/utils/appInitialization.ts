// src/utils/appInitialization.ts
import { AppDispatch } from '../redux/store';
import { checkBrowserCompatibility } from '../features/serialSlice';
import { FileStreamService } from '../services/FileStreamService';

export const initializeApp = (dispatch: AppDispatch) => {
  // Check browser compatibility
  console.log('check broser compatibility');
  dispatch(checkBrowserCompatibility());

  // Initialize FileStreamService
  FileStreamService.getInstance();
};
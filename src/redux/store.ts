import { configureStore } from '@reduxjs/toolkit';
import exampleSlice from './slice/exampleSlice';
import authSlice from './slice/authSlice';

export const store = configureStore({
  reducer: {
    exampleState: exampleSlice,
    auth: authSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { configureStore } from '@reduxjs/toolkit';
import exampleSlice from './slice/exampleSlice';

export const store = configureStore({
  reducer: {
    exampleState: exampleSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

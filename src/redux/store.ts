import { configureStore } from '@reduxjs/toolkit';
import exampleSlice from './slice/exampleSlice';
import authSlice from './slice/authSlice';
import userSlice from './slice/userSlice';

export const store = configureStore({
  reducer: {
    exampleState: exampleSlice,
    auth: authSlice,
    user: userSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

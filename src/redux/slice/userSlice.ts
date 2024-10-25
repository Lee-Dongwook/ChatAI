import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { UserPreference, UserRole } from '@/types';

interface UserState {
  preference: UserPreference;
  role: UserRole | null;
}

const initialState: UserState = {
  preference: { theme: 'light', language: 'ko' },
  role: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserPreference: (state, action: PayloadAction<UserPreference>) => {
      state.preference = action.payload;
    },
    setUserRole: (state, action: PayloadAction<UserRole | null>) => {
      state.role = action.payload;
    },
    clearUserRole: (state) => {
      state.role = null;
    },
  },
});

export const { setUserPreference, setUserRole, clearUserRole } =
  userSlice.actions;

export default userSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, AuthState } from './types';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true, 
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    },
    checkAuthStatus: (state) => {
      state.isLoading = true;
    },
    setAuthStatus: (state, action: PayloadAction<{ isAuthenticated: boolean; user: User | null }>) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.user = action.payload.user;
      state.isLoading = false;
    },
  },
});

export const { login, logout, checkAuthStatus, setAuthStatus } = authSlice.actions;
export default authSlice.reducer;
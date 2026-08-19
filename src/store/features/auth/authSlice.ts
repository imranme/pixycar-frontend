import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { AuthUser } from './authApi.types';

export type { AuthUser };

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
}

const getLocalStorageItem = (key: string): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key);
  }
  return null;
};

const getInitialUser = (): AuthUser | null => {
  const userStr = getLocalStorageItem('pixycar_user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
  return null;
};

const initialState: AuthState = {
  accessToken: getLocalStorageItem('pixycar_access_token'),
  refreshToken: getLocalStorageItem('pixycar_refresh_token'),
  user: getInitialUser(),
  isAuthenticated: !!getLocalStorageItem('pixycar_access_token'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
        user: AuthUser;
      }>
    ) => {
      const { accessToken, refreshToken, user } = action.payload;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.user = user;
      state.isAuthenticated = true;

      if (typeof window !== 'undefined') {
        localStorage.setItem('pixycar_access_token', accessToken);
        localStorage.setItem('pixycar_refresh_token', refreshToken);
        localStorage.setItem('pixycar_user', JSON.stringify(user));
      }
    },
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      state.isAuthenticated = false;

      if (typeof window !== 'undefined') {
        localStorage.removeItem('pixycar_access_token');
        localStorage.removeItem('pixycar_refresh_token');
        localStorage.removeItem('pixycar_user');
      }
    },
    updateUser: (state, action: PayloadAction<Partial<AuthUser>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        if (typeof window !== 'undefined') {
          localStorage.setItem('pixycar_user', JSON.stringify(state.user));
        }
      }
    },
  },
});

export const { setCredentials, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;

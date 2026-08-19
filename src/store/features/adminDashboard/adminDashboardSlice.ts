import { createSlice } from '@reduxjs/toolkit';

interface DashboardState {
  stats: any | null;
  loading: boolean;
}

const initialState: DashboardState = {
  stats: null,
  loading: false,
};

const adminDashboardSlice = createSlice({
  name: 'adminDashboard',
  initialState,
  reducers: {
    setStats: (state, action) => {
      state.stats = action.payload;
    },
  },
});

export const { setStats } = adminDashboardSlice.actions;
export default adminDashboardSlice.reducer;

// slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: localStorage.getItem('token') || null,
  id: localStorage.getItem('id') || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthData: (state, action) => {
      const { token, id } = action.payload;
      state.token = token;
      state.id = id;
      localStorage.setItem('token', token);
      localStorage.setItem('id', id);
    },
    removeAuthData: (state) => {
      state.token = null;
      state.id = null;
      localStorage.removeItem('token');
      localStorage.removeItem('id');
    },
  },
});

export const { setAuthData, removeAuthData } = authSlice.actions;
export default authSlice.reducer;

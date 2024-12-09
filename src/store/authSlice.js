// slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { setCookie, deleteCookie } from '../utils/cookieUtils';


const initialState = {
  token: sessionStorage.getItem('token') || null,
  id: sessionStorage.getItem('id') || null,
  authInitialized: false,
};


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthData: (state, action) => {
      const { token, id } = action.payload;
      state.token = token;
      state.id = id;
      state.authInitialized = true;

      sessionStorage.setItem('token', token);
      sessionStorage.setItem('id', id);
      
      setCookie('authToken', token);
      setCookie('userId', id);
      
    },
    removeAuthData: (state) => {
      state.token = null;
      state.id = null;
      state.authInitialized = true;

      sessionStorage.removeItem('token');
      sessionStorage.removeItem('id');
      
      deleteCookie('authToken');
      deleteCookie('userId');
    },
    setAuthInitialized: (state, action) => {
      state.authInitialized = action.payload;
    },
  },
});
export const { setAuthData, removeAuthData,setAuthInitialized } = authSlice.actions;
export default authSlice.reducer;

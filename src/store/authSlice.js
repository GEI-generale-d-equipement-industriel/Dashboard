// slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { setCookie, deleteCookie } from '../utils/cookieUtils';


const initialState = {
  token: sessionStorage.getItem('token') || null,
  id: sessionStorage.getItem('id') || null,
  role: sessionStorage.getItem('role') || 'user', // Default role
  authInitialized: false,
};


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthData: (state, action) => {
      const { token, id,role } = action.payload;
   


      state.token = token;
      state.id = id;
      if (role) {
        state.role = role;
      } else {
        console.warn('Role is undefined; existing role retained:', state.role);
      }
      state.authInitialized = true;

      sessionStorage.setItem('token', token);
      sessionStorage.setItem('id', id);
      sessionStorage.setItem('role', role || state.role);
      
      setCookie('authToken', token);
      setCookie('userId', id);
      setCookie('userRole', role || state.role);
    },
    removeAuthData: (state) => {
      state.token = null;
      state.id = null;
      state.role = null;
      state.authInitialized = true;

      // Remove from sessionStorage
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('id');
      sessionStorage.removeItem('role');

      // Remove cookies
      deleteCookie('authToken');
      deleteCookie('userId');
      deleteCookie('userRole');
    },
    setAuthInitialized: (state, action) => {
      state.authInitialized = action.payload;
    },
  },
});
export const { setAuthData, removeAuthData,setAuthInitialized } = authSlice.actions;
export default authSlice.reducer;

// src/context/UserSessionContext.js
import React, { createContext, useEffect, useContext, useState } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchFavorites } from '../store/favoritesSlice';
import useBroadcastChannel from './useBroadcastChannel';
import { setAuthData,setAuthInitialized } from '../store/authSlice';
import { getCookie } from '../utils/cookieUtils';
import AuthInterceptor from '../services/auth/AuthInterceptor';
import { Skeleton } from 'antd';

const UserSessionContext = createContext(null);

export const UserSessionProvider = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.token); // Assuming token is stored here
  const authInitialized = useSelector((state) => state.auth.authInitialized);
  const userId = useSelector((state) => state.auth.id);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();


useBroadcastChannel()

useEffect(() => {
  const initializeAuth = async () => {
    const token = getCookie('authToken'); // Get token from cookie
    const id = getCookie('userId');       // Get ID from cookie
    
    // If cookies are present, set Redux state and sessionStorage
    if (token && id) {
      sessionStorage.setItem('token', token); // Store token in sessionStorage
      sessionStorage.setItem('id', id);
      
      // Dispatch to Redux to keep state consistent
      dispatch(setAuthData({ token, id }));
      
      // Ensure Axios has the correct token for subsequent requests
      AuthInterceptor.updateToken(token);
    }

    // Mark authentication as initialized
    dispatch(setAuthInitialized(true));
  };

  initializeAuth();
}, [dispatch]);

useEffect(() => {
  if (authInitialized) {
    if (isAuthenticated) {  
      setIsLoggedIn(true);
      dispatch(fetchFavorites(userId));
      if (location.pathname === '/home') {
        const from = location.state?.from?.pathname || '/candidates';
          navigate(from, { replace: true });
      }
    } else {
      if (location.pathname !== '/home') {
        setIsLoggedIn(false);
        navigate('/home', { replace: true });
      }
    }
  }
}, [isAuthenticated, authInitialized, dispatch, navigate, location.pathname,location.state, userId]);


if (!authInitialized) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      {/* Replace with your preferred loading indicator */}
      <Skeleton size="large" />
    </div>
  );
}

  return (
    <UserSessionContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </UserSessionContext.Provider>
  );
};

export const useUserSession = () => {
  const context = useContext(UserSessionContext);
  if (!context) {
    throw new Error("useUserSession must be used within a UserSessionProvider");
  }
  return context;
};

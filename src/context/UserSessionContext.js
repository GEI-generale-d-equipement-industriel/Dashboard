// src/context/UserSessionContext.js
import React, { createContext, useEffect, useContext, useState } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchFavorites } from '../store/favoritesSlice';
const UserSessionContext = createContext(null);

export const UserSessionProvider = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.token); // Assuming token is stored here
  const userId = useSelector((state) => state.auth.id);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  useEffect(() => {
    if (isAuthenticated) {  
      setIsLoggedIn(true);
      dispatch(fetchFavorites(userId));
      if (location.pathname === '/login') {
        navigate('/');
      }
    } else {
      if (location.pathname !== '/login') {
        setIsLoggedIn(false);
        navigate('/login');
      }
    }
  }, [isAuthenticated]);

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

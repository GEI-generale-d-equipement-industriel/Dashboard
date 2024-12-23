// src/context/UserSessionContext.js
import React, { createContext, useEffect, useContext, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchFavorites } from "../store/favoritesSlice";
import useBroadcastChannel from "./useBroadcastChannel";
import { setAuthData, setAuthInitialized } from "../store/authSlice";
import { getCookie } from "../utils/cookieUtils";
import AuthInterceptor from "../services/auth/AuthInterceptor";
import { Skeleton } from "antd";
import { decodeJWT } from "../utils/jwtUtils";
const UserSessionContext = createContext(null);

export const UserSessionProvider = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.token); // Assuming token is stored here
  const authInitialized = useSelector((state) => state.auth.authInitialized);
  const userId = useSelector((state) => state.auth.id);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useBroadcastChannel();

  useEffect(() => {
    const initializeAuth = async () => {
      const token = getCookie('authToken');
      
    
      if (token ) {
        const decodedToken = decodeJWT(token);
        const role = decodedToken?.role;
        const id = decodedToken?.sub;
    
       
    
        if (role) {
          sessionStorage.setItem('token', token);
          sessionStorage.setItem('id', id);
          sessionStorage.setItem('role', role);
    
          // Ensure `role` is included in the dispatch
          dispatch(setAuthData({ token, id, role }));
          AuthInterceptor.updateToken(token);
        } else {
          console.error('Role is missing in the decoded JWT');
        }
      }
    
      dispatch(setAuthInitialized(true)); // Mark initialization as complete
    };

    initializeAuth();
  }, [dispatch]);

  useEffect(() => {
    if (authInitialized) {
      if (isAuthenticated) {
        setIsLoggedIn(true);
        dispatch(fetchFavorites(userId));
        if (location.pathname === "/home") {
          const from = location.state?.from?.pathname || "/candidates";
          navigate(from, { replace: true });
        }
      } else {
        if (location.pathname !== "/home") {
          setIsLoggedIn(false);
          navigate("/home", { replace: true });
        }
      }
    }
  }, [
    isAuthenticated,
    authInitialized,
    dispatch,
    navigate,
    location.pathname,
    location.state,
    userId,
  ]);

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

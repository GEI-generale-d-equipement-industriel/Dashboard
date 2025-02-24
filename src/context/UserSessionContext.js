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
  const role = useSelector((state) => state.auth.role);
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
      const publicRoutes = ["/", "/brandform"]; // Add any other public paths if needed
  
      if (isAuthenticated) {
        setIsLoggedIn(true);
        dispatch(fetchFavorites(userId));
        if (location.pathname === "/") {
          // If the user is a candidate, redirect to /profile, otherwise default to /candidates
          const defaultRoute = role === "candidate" ? `/profile/${userId}` : "/candidates";
          const from = location.state?.from?.pathname || defaultRoute;
          navigate(from, { replace: true });
        }
      } else {
        // Only redirect to "/" if the current route is not public
        if (!publicRoutes.includes(location.pathname)) {
          setIsLoggedIn(false);
          navigate("/", { replace: true });
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
    role  
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

// components/PrivateRoute.jsx
import React from 'react';
import { Navigate,useLocation } from 'react-router-dom';
import useAuth from '../Hooks/useAuth';
import { Skeleton } from 'antd';


const PrivateRoute = ({ element: Element }) => {
    const { isAuthenticated, authInitialized } = useAuth();
    const location = useLocation();

    
    if (!authInitialized) {
      // Render a loading spinner while authentication is initializing
      return (
        <div className="flex items-center justify-center min-h-screen">
          <Skeleton size="large" />
        </div>
      );
    }
  return isAuthenticated ? (
    <Element />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default PrivateRoute;

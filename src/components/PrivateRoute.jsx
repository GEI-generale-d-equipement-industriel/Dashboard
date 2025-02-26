import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../Hooks/useAuth';
import { Skeleton } from 'antd';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, role, authInitialized } = useAuth();
  const location = useLocation();


  if (!authInitialized) {
    // Show a loading indicator while authentication is being initialized
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Skeleton size="large" />
      </div>
    );
  }



  if (!isAuthenticated) {
    // Redirect unauthenticated users to the login page
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Check role-based access only if allowedRoles is provided
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Allow access to authenticated users (role-based or all roles if not specified)
  return children;
};

export default PrivateRoute;

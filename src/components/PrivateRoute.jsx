// components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../Hooks/useAuth';

const PrivateRoute = ({ element: Element }) => {
    const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Element /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;

import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { hasRouteAccess } from '../constants/permissions.js';

export const RoleGuard = ({ allowedRoles, path, children, fallback = null, isRoute = false }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return isRoute ? <Navigate to="/login" state={{ from: location }} replace /> : fallback;
  }

  // If path is specified, check against centralized path permissions
  if (path) {
    if (!hasRouteAccess(user.role, path)) {
      return isRoute ? <Navigate to="/forbidden" replace /> : fallback;
    }
  }

  // If allowedRoles is specified, check specific roles
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return isRoute ? <Navigate to="/forbidden" replace /> : fallback;
  }

  return children ? children : <Outlet />;
};

export default RoleGuard;

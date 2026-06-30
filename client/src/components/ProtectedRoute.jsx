import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Logo from '../design-system/Logo.jsx';

export const ProtectedRoute = ({ allowedRoles, children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light">
        <div className="placeholder-shimmer rounded-circle p-2 mb-3" style={{ width: '64px', height: '64px' }}>
          <Logo size={48} iconOnly />
        </div>
        <p className="font-heading fw-semibold text-muted fs-7">Verifying credentials...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If user lacks role, redirect them to forbidden access page
    return <Navigate to="/forbidden" replace />;
  }

  return children ? children : <Outlet />;
};

export const GuestRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light">
        <div className="placeholder-shimmer rounded-circle p-2 mb-3" style={{ width: '64px', height: '64px' }}>
          <Logo size={48} iconOnly />
        </div>
        <p className="font-heading fw-semibold text-muted fs-7">Verifying credentials...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
};

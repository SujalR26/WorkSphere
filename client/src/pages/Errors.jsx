import React from 'react';
import { Link } from 'react-router-dom';
import Typography from '../design-system/Typography.jsx';
import Button from '../design-system/Button.jsx';
import Icons from '../design-system/Icons.jsx';
import { ROUTES } from '../constants/routes.js';

export const NotFound = () => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light p-4 text-center">
      <div className="bg-ws-danger-light rounded-circle p-4 mb-4 d-flex align-items-center justify-content-center" style={{ width: '96px', height: '96px' }}>
        <Icons.Alert size={48} className="text-ws-danger" />
      </div>
      <Typography variant="h1" className="mb-2">Page Not Found</Typography>
      <Typography variant="body1" className="mb-4 max-w-sm">
        The page you are looking for doesn't exist, has been deleted, or has been moved to a different url.
      </Typography>
      <Link to={ROUTES.DASHBOARD} className="text-decoration-none">
        <Button icon={<Icons.Dashboard size={16} />}>
          Back to Dashboard
        </Button>
      </Link>
    </div>
  );
};

export const ServerError = () => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light p-4 text-center">
      <div className="bg-ws-danger-light rounded-circle p-4 mb-4 d-flex align-items-center justify-content-center" style={{ width: '96px', height: '96px' }}>
        <Icons.Alert size={48} className="text-ws-danger" />
      </div>
      <Typography variant="h1" className="mb-2">Internal Server Error</Typography>
      <Typography variant="body1" className="mb-4 max-w-sm">
        The server encountered an internal error or misconfiguration and was unable to complete your request.
      </Typography>
      <Button onClick={() => window.location.reload()} icon={<Icons.ActivityLogs size={16} />}>
        Reload Page
      </Button>
    </div>
  );
};

export const NetworkError = () => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light p-4 text-center">
      <div className="bg-ws-accent-light rounded-circle p-4 mb-4 d-flex align-items-center justify-content-center" style={{ width: '96px', height: '96px' }}>
        <Icons.Clock size={48} className="text-ws-accent-dark" />
      </div>
      <Typography variant="h1" className="mb-2">Network Error</Typography>
      <Typography variant="body1" className="mb-4 max-w-sm">
        Unable to connect to the backend server. Please verify that the Express app is running locally.
      </Typography>
      <Button onClick={() => window.location.reload()} icon={<Icons.ActivityLogs size={16} />}>
        Retry Connection
      </Button>
    </div>
  );
};

export const Unauthorized = () => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light p-4 text-center animate-fadeIn">
      <div className="bg-ws-danger-light rounded-circle p-4 mb-4 d-flex align-items-center justify-content-center" style={{ width: '96px', height: '96px' }}>
        <Icons.Alert size={48} className="text-ws-danger" />
      </div>
      <Typography variant="h1" className="mb-2">Unauthorized Access</Typography>
      <Typography variant="body1" className="mb-4 max-w-sm">
        You are not signed in or your session has expired. Please sign in to access this page.
      </Typography>
      <Link to="/login" className="text-decoration-none">
        <Button icon={<Icons.User size={16} />}>
          Go to Sign In
        </Button>
      </Link>
    </div>
  );
};

export const Forbidden = () => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light p-4 text-center animate-fadeIn">
      <div className="bg-ws-danger-light rounded-circle p-4 mb-4 d-flex align-items-center justify-content-center" style={{ width: '96px', height: '96px' }}>
        <Icons.Alert size={48} className="text-ws-danger" />
      </div>
      <Typography variant="h1" className="mb-2">Forbidden Access</Typography>
      <Typography variant="body1" className="mb-4 max-w-sm">
        You do not have the required permissions to view this resource. Contact your system administrator if you believe this is an error.
      </Typography>
      <Link to={ROUTES.DASHBOARD} className="text-decoration-none">
        <Button icon={<Icons.Dashboard size={16} />}>
          Back to Dashboard
        </Button>
      </Link>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useUI } from '../context/UIContext.jsx';
import { redirectToPing } from '../services/auth/pingAuth.js';
import AuthLeftPane from '../components/AuthLeftPane.jsx';
import Button from '../design-system/Button.jsx';
import Input from '../design-system/Input.jsx';
import Icons from '../design-system/Icons.jsx';

export const Login = () => {
  const { login } = useAuth();
  const { showToast } = useUI();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLocalLoading, setIsLocalLoading] = useState(false);

  // Remember Me state
  const [rememberMe, setRememberMe] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: { email: '', password: '' }
  });

  // Check for saved email on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('ws_remembered_email');
    if (savedEmail) {
      setValue('email', savedEmail);
      setRememberMe(true);
    }
  }, [setValue]);

  const handlePingSignIn = async () => {
    setIsLoading(true);
    setApiError('');
    try {
      await redirectToPing();
    } catch (err) {
      const errorMsg = err.message || 'Failed to redirect to Ping AIC authorization server.';
      setApiError(errorMsg);
      showToast(errorMsg, 'danger');
      setIsLoading(false);
    }
  };

  const onSubmitLocal = async (data) => {
    setIsLocalLoading(true);
    setIsLoading(true);
    setApiError('');
    try {
      await login(data.email, data.password);
      
      // Save/clear email for Remember Me
      if (rememberMe) {
        localStorage.setItem('ws_remembered_email', data.email);
      } else {
        localStorage.removeItem('ws_remembered_email');
      }

      showToast('Successfully logged in! Welcome back.', 'success');
      navigate('/');
    } catch (err) {
      const errorMsg = err.message || 'Invalid email or password';
      setApiError(errorMsg);
      showToast(errorMsg, 'danger');
    } finally {
      setIsLocalLoading(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="container-fluid p-0 min-vh-100 d-flex flex-column flex-md-row bg-light overflow-hidden animate-fadeIn">
      {/* Loading Overlay */}
      {isLoading && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center bg-white bg-opacity-75 z-3"
          style={{ backdropFilter: 'blur(4px)' }}
        >
          <div className="spinner-border text-ws-primary" role="status" style={{ width: '40px', height: '40px' }}>
            <span className="visually-hidden">Authenticating...</span>
          </div>
          <p className="font-heading fw-semibold text-ws-primary mt-3 fs-7 animate-pulse">
            {isLocalLoading ? 'Verifying local credentials...' : 'Redirecting to Ping Identity...'}
          </p>
        </div>
      )}

      {/* Left Pane - Premium Branding & Illustrations */}
      <AuthLeftPane subtitle="Connect teams, streamline project execution, handle leaves, and visualize analytics dashboards in one workspace." />

      {/* Right Pane - Form Card */}
      <div className="col-12 col-md-7 col-lg-6 d-flex align-items-center justify-content-center p-4 p-md-5 bg-white">
        <div className="w-100 max-w-sm my-auto animate-slideUp">
          <div className="mb-4">
            <h2 className="font-heading fw-bold text-dark mb-1" style={{ letterSpacing: '-0.5px' }}>Welcome Back</h2>
            <p className="text-muted fs-8">Access your dashboard via Ping Identity SSO or enter your local credentials.</p>
          </div>

          {apiError && (
            <div className="alert alert-danger py-2.5 px-3 fs-8 rounded-3 mb-4 d-flex align-items-center gap-2 border-0 bg-danger-light text-danger">
              <Icons.Alert size={16} />
              <span>{apiError}</span>
            </div>
          )}

          {/* OIDC Login Trigger */}
          <div className="d-flex flex-column gap-3">
            <Button
              onClick={handlePingSignIn}
              loading={isLoading && !isLocalLoading}
              className="w-100 py-3 fs-7 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2.5 rounded-3 bg-ws-primary text-white border-0"
              style={{ minHeight: '48px' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'translateY(-1px)' }}>
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              Sign In with Ping AIC
            </Button>
          </div>

          {/* Visual Divider */}
          <div className="d-flex align-items-center my-4">
            <div className="border-bottom w-100" style={{ borderColor: 'var(--ws-border)' }}></div>
            <span className="px-3 fs-9 text-muted fw-semibold text-uppercase text-nowrap">Or use local credentials</span>
            <div className="border-bottom w-100" style={{ borderColor: 'var(--ws-border)' }}></div>
          </div>

          {/* Local Login Form */}
          <form onSubmit={handleSubmit(onSubmitLocal)} className="d-flex flex-column gap-3.5">
            <Input
              label="Enterprise Email"
              name="email"
              type="email"
              placeholder="name@worksphere.com"
              required
              aria-label="Enterprise Email Address"
              error={errors.email?.message}
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^\S+@\S+$/i, message: 'Invalid email format' }
              })}
            />

            <div className="position-relative">
              <Input
                label="Secure Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                required
                aria-label="Secure Password"
                error={errors.password?.message}
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' }
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="btn btn-link p-0 text-muted position-absolute border-0 bg-transparent"
                style={{
                  top: '36px',
                  right: '14px',
                  zIndex: 10,
                  textDecoration: 'none'
                }}
                title={showPassword ? "Hide password" : "Show password"}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <Icons.Close size={16} /> : <Icons.Menu size={16} style={{ opacity: 0.5 }} />}
              </button>
            </div>

            <div className="d-flex align-items-center justify-content-between my-1">
              <div className="form-check d-flex align-items-center gap-1.5 p-0">
                <input
                  type="checkbox"
                  id="rememberMe"
                  className="form-check-input ms-0 cursor-pointer"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ width: '15px', height: '15px' }}
                />
                <label htmlFor="rememberMe" className="form-check-label fs-8 text-muted cursor-pointer user-select-none">
                  Remember email
                </label>
              </div>
              <Link to="/forgot-password" className="fs-8 text-ws-primary text-decoration-none fw-semibold hover-underline">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" loading={isLocalLoading} className="w-100 py-2.5 fs-7 fw-bold shadow-sm mt-1">
              Sign In
            </Button>
          </form>

          <div className="text-center mt-4.5 border-top border-light pt-3.5">
            <span className="fs-8 text-muted">New to the platform? </span>
            <Link to="/register" className="fs-8 text-ws-primary text-decoration-none fw-bold hover-underline">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { handlePingCallback } from '../services/auth/pingAuth.js';
import Card from '../design-system/Card.jsx';
import Typography from '../design-system/Typography.jsx';

export const Callback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [error, setError] = useState(null);
  const [showMockSelector, setShowMockSelector] = useState(false);
  const [authParams, setAuthParams] = useState(null);
  const [loadingEmail, setLoadingEmail] = useState(null);
  const callbackTriggered = useRef(false);

  const mockAccounts = [
    {
      name: 'System Admin',
      email: 'admin@worksphere.com',
      role: 'Admin',
      desc: 'Full administrator access to manage employees, departments, and audit logs.',
      badgeClass: 'bg-ws-danger text-white'
    },
    {
      name: 'David Chen',
      email: 'david.chen@worksphere.com',
      role: 'Manager',
      desc: 'Manager dashboard access showing department tasks, leaves, and managed employees.',
      badgeClass: 'bg-ws-success text-white'
    },
    {
      name: 'Alex Mercer',
      email: 'alex.mercer@worksphere.com',
      role: 'Team Lead',
      desc: 'Team leader console to view project tasks, schedules, and leave requests.',
      badgeClass: 'bg-ws-secondary text-white'
    },
    {
      name: 'Devon Lane',
      email: 'devon.lane@worksphere.com',
      role: 'Employee',
      desc: 'Standard workspace portal mapping personal task progress and leave balances.',
      badgeClass: 'bg-ws-primary text-white'
    }
  ];

  useEffect(() => {
    // Avoid double invocation in React StrictMode
    if (callbackTriggered.current) return;
    callbackTriggered.current = true;

    const processCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const errorParam = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');

      if (errorParam) {
        setError(errorDescription || `OAuth Error: ${errorParam}`);
        return;
      }

      if (!code || !state) {
        setError('Missing required authorization parameters (code/state).');
        return;
      }

      if (code === 'mock_development_code') {
        // Halt automatic exchange and show selection cards to developer
        setAuthParams({ code, state });
        setShowMockSelector(true);
        return;
      }

      try {
        const res = await handlePingCallback(code, state);
        if (res.success) {
          await refreshUser();
          navigate('/dashboard', { replace: true });
        } else {
          setError(res.message || 'Verification failed. Please try again.');
        }
      } catch (err) {
        console.error('Callback parsing error:', err);
        setError(err.response?.data?.message || err.message || 'An unexpected authentication error occurred.');
      }
    };

    processCallback();
  }, [searchParams, navigate, refreshUser]);

  const handleMockLogin = async (email) => {
    if (!authParams) return;
    setLoadingEmail(email);
    setError(null);
    try {
      const res = await handlePingCallback(authParams.code, authParams.state, email);
      if (res.success) {
        await refreshUser();
        navigate('/dashboard', { replace: true });
      } else {
        setError(res.message || 'Mock login verification failed.');
        setLoadingEmail(null);
      }
    } catch (err) {
      console.error('Mock login callback error:', err);
      setError(err.response?.data?.message || err.message || 'OIDC callback token mapping failed.');
      setLoadingEmail(null);
    }
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light p-4">
      {showMockSelector && !error ? (
        <Card className="p-4 shadow-lg border border-light animate-fadeIn" style={{ maxWidth: '640px', width: '100%', borderRadius: '16px' }}>
          <div className="text-center mb-4">
            <span className="badge bg-ws-primary-light text-ws-primary fw-bold px-3 py-1.5 fs-8 rounded-pill mb-2 border border-ws-primary">
              SSO Local Dev Bypass
            </span>
            <Typography variant="h3" className="mb-2 text-dark fw-bold" style={{ letterSpacing: '-0.5px' }}>
              Select Development Identity
            </Typography>
            <Typography variant="body" className="text-muted fs-8">
              WorkSphere detected standard placeholder OIDC credentials. Select a local role profile below to instantly simulate the SSO login mapping:
            </Typography>
          </div>

          <div className="row g-3">
            {mockAccounts.map((acc) => {
              const isCurrentLoading = loadingEmail === acc.email;
              return (
                <div key={acc.email} className="col-12 col-sm-6">
                  <div
                    onClick={() => !loadingEmail && handleMockLogin(acc.email)}
                    className={`p-3 border rounded-3 h-100 transition-all text-start d-flex flex-column gap-2 ${
                      loadingEmail ? 'opacity-50' : 'hover-bg-light cursor-pointer hover-shadow-sm border-ws-border'
                    }`}
                    style={!loadingEmail ? { borderColor: 'var(--ws-border)', transition: '0.15s ease-in-out' } : {}}
                  >
                    <div className="d-flex align-items-center justify-content-between">
                      <Typography variant="h4" className="mb-0 text-dark fw-bold fs-7">
                        {acc.name}
                      </Typography>
                      <span className={`badge ${acc.badgeClass} fs-9 py-1 px-2.5 rounded-pill`}>
                        {acc.role}
                      </span>
                    </div>
                    <code className="text-ws-primary fs-8 fw-semibold m-0">{acc.email}</code>
                    <p className="text-muted fs-9 mb-0 leading-sm">{acc.desc}</p>
                    {isCurrentLoading && (
                      <div className="d-flex align-items-center gap-2 text-ws-primary fw-bold fs-8 mt-1">
                        <span className="spinner-border spinner-border-sm" role="status"></span>
                        <span>Logging in...</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      ) : (
        <Card className="p-5 text-center shadow-lg border border-light" style={{ maxWidth: '440px', width: '100%', borderRadius: '16px' }}>
          {!error ? (
            <div className="d-flex flex-column align-items-center gap-3">
              <div className="placeholder-shimmer rounded-circle p-2 mb-2" style={{ width: '72px', height: '72px' }}>
                <div className="spinner-border text-ws-primary" role="status" style={{ width: '40px', height: '40px', borderWidth: '4px' }}>
                  <span className="visually-hidden">Verifying credentials...</span>
                </div>
              </div>
              <Typography variant="h3" className="mb-1 text-dark fw-bold">
                Verifying Session
              </Typography>
              <Typography variant="body" className="text-muted fs-7">
                Exchanging Ping AIC secure credentials. Please wait...
              </Typography>
            </div>
          ) : (
            <div className="d-flex flex-column align-items-center gap-3">
              <div className="bg-ws-danger-light text-ws-danger rounded-circle p-3 mb-2 d-flex align-items-center justify-content-center" style={{ width: '72px', height: '72px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
              </div>
              <Typography variant="h3" className="mb-1 text-ws-danger fw-bold">
                Authentication Failed
              </Typography>
              <Typography variant="body" className="text-muted fs-8 mb-3">
                {error}
              </Typography>
              <button
                onClick={() => navigate('/login', { replace: true })}
                className="btn btn-ws-primary w-100 py-2.5 rounded-2 font-heading fw-bold fs-7"
              >
                Return to Login
              </button>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default Callback;
